pragma solidity >0.5.1 <0.6.0;
pragma experimental ABIEncoderV2;

import "./Ownable.sol";

import "./Notifiable.sol";

contract Registration is Ownable, Notifiable {
    struct User {
        string phone;
        address addrezz;
        string uuid;
        bool credited;
        uint claims;
        uint count;
        string name;
        string email;
        string college;
    }

    struct Score {
        address addrezz;
        uint points;
        string name;
        string phone;
        string uuid;
    }

    mapping (string => User) private usersByPhone;
    mapping (string => User) private usersById;
    mapping (address => User) private usersByAddress;

    Score[] public scores;

    uint public day;

    mapping (uint => Score) public winners;

    event UserRegistred(address addrezz, bool created, string message, string uuid, string phone, string name, string college, string email);

    constructor() public {
        day = 0;
    }

    function getUserByPhone(string memory phone) public view returns (address, string memory, string memory) {
        return (usersByPhone[phone].addrezz, usersByPhone[phone].uuid, usersByPhone[phone].name);
    }

    function getUserById(string memory uuid) public view returns (address, string memory, string memory, string memory) {
        return (usersById[uuid].addrezz, usersById[uuid].uuid, usersById[uuid].phone, usersById[uuid].name);
    }

    function checkInitialCredit(string memory uuid) public view returns(bool) {
        User memory user = usersById[uuid];
        if(user.addrezz != address(0) && user.claims < 2) {
            return false;
        }
        return true;
    }

    function creditEther(string memory uuid) public returns (bool) {
        User memory user = usersById[uuid];
        user.claims = user.claims + 1;

        usersByPhone[user.phone] = user;
        usersById[uuid] = user;
        usersByAddress[user.addrezz] = user;

        notify("Registration", user.addrezz, "100 ethers credited to your account");

        return true;
    }

    function registerUser(string memory phone, address addrezz,
        string memory uuid, string memory name,
        string memory email, string memory college)
        public onlyAdmin returns (bool) {
        if (checkUserExists(usersById[uuid])) {
            emit UserRegistred(addrezz, false, 'User already registered!', uuid, phone, name, college, email);
            return false;
        }
        User memory user = User({
            phone: phone,
            addrezz: addrezz,
            uuid: uuid,
            credited: false,
            claims: 0,
            count: 0,
            name: name,
            email: email,
            college: college
        });
        usersByPhone[phone] = user;
        usersById[uuid] = user;
        usersByAddress[addrezz] = user;
        Score memory score = Score({
            addrezz: addrezz,
            points: 0,
            name: name,
            phone: phone,
            uuid: uuid
        });
        scores.push(score);
        emit UserRegistred(addrezz, true, 'User created successfully!',
        uuid, phone, name, college, email);
        return true;
    }

    function updateScore(address addrezz, uint points) public returns (uint) {
        for(uint i = 0; i < scores.length; i++) {
            if(addrezz == scores[i].addrezz) {
                scores[i].points = scores[i].points + points;
                return scores[i].points;
            }
        }
        return 0;
    }

    function getUserPoints(address addrezz) public view
    returns (uint poinnts, string memory name, string memory phone, string memory uuid) {
        for(uint i = 0; i < scores.length; i++) {
            if(addrezz == scores[i].addrezz) {
                return (scores[i].points, scores[i].name, scores[i].phone, scores[i].uuid);
            }
        }
        return (0, '', '', '');
    }

    function resetScores() public onlyAdmin returns (bool) {
        Score memory score;
        for(uint i = 0; i < scores.length; i++) {
            if(score.points < scores[i].points) {
                score = scores[i];
            }
            scores[i].points = 0;
        }
        if(score.addrezz != address(0)) {
           registerWinner(score);
           notify("Registration", owner, "Winner finalized!!");
        } else {
            notify("Registration", owner, "Winner not finalized!!");
        }
        return true;
    }

    function registerWinner(Score memory user) private returns (bool) {
        winners[day] = user;
        day = day + 1;
        return true;
    }

    function getScoresCount() public view returns (uint) {
        return scores.length;
    }

    function checkUserByPhone(string memory phone) public view returns(bool) {
        User memory _localUser = usersByPhone[phone];
        if(_localUser.addrezz != address(0)) {
            return true;
        }
        return false;
    }

    function checkUserByUUID(string memory uuid) public view returns(bool) {
        User memory _localUser = usersById[uuid];
        if(_localUser.addrezz != address(0)) {
            return true;
        }
        return false;
    }

    function checkUserExists(User memory user) private pure  returns (bool) {
        if(user.addrezz == address(0)) {
            return false;
        }
        return true;
    }

    function getTokens(address[] memory addrezzes) public view onlyAdmin returns (string[] memory tokens) {
        uint length = addrezzes.length;
        string[] memory _tokens = new string[](length);
        for (uint i = 0; i < length; i++) {
            _tokens[i] = usersByAddress[addrezzes[i]].uuid;
        }
        return (_tokens);
    }
}