pragma solidity >0.5.1 <0.6.0;

import "./Ownable.sol";

import "./Notifiable.sol";

import "./Registration.sol";

contract Auction is Ownable, Notifiable {
    struct Bid {
        address bidder;
        bytes32 blindedBid;
        uint deposit;
        uint time;
    }

    struct State {
        string name;
        string description;
        string image;
        uint biddingEnd;
        uint revealEnd;
        bool hasEnded;
        address highestBidder;
        uint highestBid;
        address payable beneficiary;
    }

	uint private points = 10;

    State private state;

    mapping(address => Bid[]) private bids;

    Bid[] private _bids;

	Registration private registration;

    // Allowed withdrawals of previous bids
    mapping(address => uint) private pendingReturns;

    event AuctionEnded(address highestBidder, uint highestBid);

    event BidAdded(address bidder, bytes32 blindedBid, uint time);

    event HighestBidding(address highestBidder, uint highestBid);

    /// Modifiers are a convenient way to validate inputs to
    /// functions. `onlyBefore` is applied to `bid` below:
    /// The new function body is the modifier's body where
    /// `_` is replaced by the old function body.
    modifier onlyBefore(uint _time) { require(now < _time); _; }
    modifier onlyAfter(uint _time) { require(now > _time); _; }

    constructor(
        string memory _name,
        string memory _description,
        string memory _image,
        uint _biddingTime,
        uint _revealTime,
        address payable _beneficiary,
        Registration _registration
    ) public payable onlyAdmin {
        uint _biddingEnd = now + _biddingTime;
        uint _revealEnd = _biddingEnd + _revealTime;
        
        state = State({
            name: _name,
            description: _description,
            image: _image,
            biddingEnd: _biddingEnd,
            revealEnd: _revealEnd,
            hasEnded: false,
            highestBidder: address(0),
            highestBid: 0,
            beneficiary: _beneficiary
        });

        registration = _registration;
    }

    /// Place a blinded bid with `_blindedBid` =
    /// keccak256(abi.encodePacked(value, fake, secret)).
    /// The sent ether is only refunded if the bid is correctly
    /// revealed in the revealing phase. The bid is valid if the
    /// ether sent together with the bid is at least "value" and
    /// "fake" is not true. Setting "fake" to true and sending
    /// not the exact amount are ways to hide the real bid but
    /// still make the required deposit. The same address can
    /// place multiple bids.
    function bid(bytes32 _blindedBid)
        public
        payable
        onlyBefore(state.biddingEnd)
    {
        Bid memory _bid = Bid({
            blindedBid: _blindedBid,
            bidder: msg.sender,
            deposit: msg.value,
            time: now
        });
        bids[_bid.bidder].push(_bid);
        _bids.push(_bid);

        emit BidAdded(_bid.bidder, _bid.blindedBid, _bid.time);

        notifyBidders("New Bid submitted for the auction: ");
    }

    function notifyBidders(string memory message) private {
        notify("Auction", getAllBidders(), message, state.name);
    }

    /// Reveal your blinded bids. You will get a refund for all
    /// correctly blinded invalid bids and for all bids except for
    /// the totally highest.
    function reveal(
        uint[] memory _values,
        bool[] memory _fake,
        bytes32[] memory _secret
    )
        public
        onlyAfter(state.biddingEnd)
        onlyBefore(state.revealEnd)
    {
        uint length = bids[msg.sender].length;
        require(_values.length == length);
        require(_fake.length == length);
        require(_secret.length == length);

        uint highest = state.highestBid;

        uint refund;
        for (uint i = 0; i < length; i++) {
            Bid storage bidToCheck = bids[msg.sender][i];
            (uint value, bool fake, bytes32 secret) =
                    (_values[i], _fake[i], _secret[i]);
            if (bidToCheck.blindedBid != keccak256(abi.encodePacked(value, fake, secret))) {
                // Do not refund deposit.
                continue;
            }
            refund += bidToCheck.deposit;
            if (!fake && bidToCheck.deposit >= value) {
                if (placeBid(msg.sender, value))
                    refund -= value;
            }
            // Make it impossible for the sender to re-claim
            // the same deposit.
            bidToCheck.blindedBid = bytes32(0);
        }
        msg.sender.transfer(refund);

        if(highest != state.highestBid) {
            emit HighestBidding(state.highestBidder, state.highestBid);

            notify("Auction", state.highestBidder, "You are the current highest bidder");
        }

        notifyBidders("New Bid revealed for the auction: ");
    }

    // This is an "internal" function which means that it
    // can only be called from the contract itself (or from
    // derived contracts).
    function placeBid(address bidder, uint value) internal
            returns (bool success)
    {
        if (value <= state.highestBid) {
            return false;
        }
        if (state.highestBidder != address(0)) {
            // Refund the previously highest bidder.
            pendingReturns[state.highestBidder] += state.highestBid;
        }
        state.highestBid = value;
        state.highestBidder = bidder;

        return true;
    }

    /// Withdraw a bid that was overbid.
    function withdraw() public {
        uint amount = pendingReturns[msg.sender];
        if (amount > 0) {
            // It is important to set this to zero because the recipient
            // can call this function again as part of the receiving call
            // before `transfer` returns (see the remark above about
            // conditions -> effects -> interaction).
            pendingReturns[msg.sender] = 0;
 
            msg.sender.transfer(amount);
        }
    }

    /// End the auction and send the highest bid
    /// to the beneficiary.
    function auctionEnd()
        public
        onlyOwner
        onlyAfter(state.revealEnd) {
        require(!state.hasEnded);
        emit AuctionEnded(state.highestBidder, state.highestBid);
        state.hasEnded = true;
        state.beneficiary.transfer(state.highestBid);
        registration.updateScore(state.highestBidder, points);

        notify("Auction", state.highestBidder, "You won the auction");

        winner("Auction", state.highestBidder, "has won the auction");
    }

    function getAllBidders() public view returns 
    (
        address[] memory bidders
    ) {
        address[] memory _bidders = new address[](_bids.length);
        for (uint i = 0; i < _bids.length; i++) {
            _bidders[i] = _bids[i].bidder;
        }
        return (_bidders);
    }

    function getAllBids() public view returns 
    (
        address[] memory bidders, 
        bytes32[] memory blindedBids, 
        uint[] memory times
    ) {
        address[] memory _bidders = new address[](_bids.length);
        bytes32[] memory _blindedBids = new bytes32[](_bids.length);
        uint[] memory _times = new uint[](_bids.length);
        
        for (uint i = 0; i < _bids.length; i++) {
            _bidders[i] = _bids[i].bidder;
            _blindedBids[i] = _bids[i].blindedBid;
            _times[i] = _bids[i].time * 1000;
        }
        
        return (_bidders, _blindedBids, _times);
    }

    function getEndState() public view returns 
    (
        address addrezz,
        string memory name,
        bool hasEnded,
        address highestBidder,
        uint highestBid
    ) {
        return 
        (
            address(this),
            state.name,
            state.hasEnded,
            state.highestBidder, 
            state.highestBid
        );
    }

    function getState() public view returns 
    (
        address addrezz, 
        string memory name,
        string memory description, 
        string memory image,
        uint biddingEnd,
        uint revealEnd,
        bool hasEnded,
        address highestBidder,
        uint highestBid,
        address payable beneficiary,
        bool hasReturns
    ) {
        return 
        (
            address(this), 
            state.name, 
            state.description, 
            state.image, 
            state.biddingEnd * 1000,
            state.revealEnd * 1000, 
            state.hasEnded,
            state.highestBidder, 
            state.highestBid, 
            state.beneficiary,
            pendingReturns[msg.sender] > 0
        );
    }

    function getMainState() public view returns 
    (
        string memory name,
        string memory description, 
        string memory image,
        bool hasEnded,
        uint biddingEnd,
        uint highestBid
    ) {
        return 
        (
            state.name, 
            state.description, 
            state.image,
            state.hasEnded,
            state.biddingEnd * 1000, 
            state.highestBid
        );
    }

    function getStateWithBids() public view returns (
        string memory name,
        uint biddingEnd,
        uint revealEnd,
        bool hasEnded,
        address highestBidder,
        uint highestBid,
        address[] memory bidders, 
        bytes32[] memory blindedBids,
        uint[] memory times) {
        (address[] memory _bidders, bytes32[] memory _blindedBids, uint[] memory _times) = getAllBids();
        return (
            state.name, 
            state.biddingEnd * 1000,
            state.revealEnd * 1000, 
            state.hasEnded,
            state.highestBidder, 
            state.highestBid,
            _bidders, 
            _blindedBids,
            _times);
    }
}
