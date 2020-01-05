pragma solidity >0.5.1 <0.6.0;
pragma experimental ABIEncoderV2;

import "./Ownable.sol";

import "./Notifiable.sol";

import "./Auction.sol";

contract Auctions is Ownable, Notifiable {

    address[] private _auctions;

    event AuctionCreated(address addrezz, string name, string description, string image, uint biddingEnd);

    event AuctionEnded(address addrezz, string name, address highestBidder, uint highestBid);

    constructor() public onlyAdmin {}

    function addAuction(address addrezz) public onlyAdmin {
        _auctions.push(addrezz);

        (
            string memory _name,
            string memory _description,
            string memory _image,
            ,
            uint biddingEnd,
        ) = Auction(addrezz).getMainState();

        emit AuctionCreated(addrezz, _name, _description, _image, biddingEnd);

        notify("Auction", address(0), "New Auction '", _name, "' ", " has been created");
    }

    function endAuction(address addrezz) public onlyAdmin {
        (
            ,
            string memory name,
            bool hasEnded,
            address highestBidder,
            uint highestBid
        ) = Auction(addrezz).getEndState();

        if (hasEnded) {
            emit AuctionEnded(addrezz, name, highestBidder, highestBid);

            notify("Auction", address(0), "Auction '", name, "' ", "has been ended");
        }
    }

    function getAuctions() external view returns (address [] memory auctions) {
        auctions = _auctions;
    }

    function getAuctionState(address _addrezz) external view returns 
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
        Auction auction = Auction(_addrezz);
        return auction.getState();
    }

    function getAuctionStates() external view returns (
        address[] memory addrezzes,
        string[] memory names,
        string[] memory descriptions,
        string[] memory images,
        bool[] memory hasEndeds,
        uint[] memory biddingEnds,
        uint[] memory highestBids) {

        uint length = _auctions.length;

        address[] memory _addrezzes = new address[](length);
        string[] memory _names = new string[](length);
        string[] memory _descriptions = new string[](length);
        string[] memory _images = new string[](length);
        bool[] memory _hasEndeds = new bool[](length);
        uint[] memory _biddingEnds = new uint[](length);
        uint[] memory _highestBids = new uint[](length);

        for (uint i = 0; i < length; i++) {
            Auction auction = Auction(_auctions[i]);
            (
                string memory _name,
                string memory _description,
                string memory _image,
                bool _hasEnded,
                uint _biddingEnd,
                uint _highestBid
            ) = auction.getMainState();
             _addrezzes[i] = _auctions[i];
            _names[i] = _name;
            _descriptions[i] = _description;
            _images[i] = _image;
            _hasEndeds[i] = _hasEnded;
            _biddingEnds[i] = _biddingEnd;
            _highestBids[i] = _highestBid;
        }
        return 
        (
            _addrezzes,
            _names,
            _descriptions,
            _images,
            _hasEndeds,
            _biddingEnds,
            _highestBids
        );
    }
}
