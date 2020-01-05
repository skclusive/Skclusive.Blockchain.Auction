pragma solidity >0.5.1 <0.6.0;
pragma experimental ABIEncoderV2;

import "./Ownable.sol";

import "./Notifiable.sol";

contract Registration is Ownable, Notifiable {
    struct User {
        string mobileNumber;
        address publicKey;
        string deviceId;
        bool initialCredit;
        uint claimCount;
        uint count;
        string name;
        string email;
        string college;
    }
    
    struct Score {
        address publicKey;
        uint points;
        string name;
        string mobileNumber;
        string uuid;
    }
    
    mapping (string => User) private usersMobileMap;
    mapping (string => User) private userDeviceMap;
    mapping (address => User) private userAddressMap;
    
    Score[] public scores;
    
    uint public day;
    
    mapping (uint => Score) public winners;
    
    event UserRegistred(address publicKey, bool created, string message, string uuid, string mobileNumber, string name, string college, string email);

    constructor() public {
        day = 0;
    }

    function getUserByMobileNumber(string memory mobileNumber) public view returns (address, string memory, string memory) {
        return (usersMobileMap[mobileNumber].publicKey, usersMobileMap[mobileNumber].deviceId, usersMobileMap[mobileNumber].name);
    }
    
    function getUserByUUID(string memory uuid) public view returns (address, string memory, string memory, string memory) {
        return (userDeviceMap[uuid].publicKey, userDeviceMap[uuid].deviceId, userDeviceMap[uuid].mobileNumber, userDeviceMap[uuid].name);
    }
    
    function checkInitialCredit(string memory uuid) public view returns(bool) {
        User memory user = userDeviceMap[uuid];
        if(user.publicKey != address(0) && user.claimCount < 2) {
            return false;
        }
        return true;
    }
    
    function creditEther(string memory uuid) public returns (bool) {
        User memory localUser = userDeviceMap[uuid];
        localUser.claimCount = localUser.claimCount + 1;
        usersMobileMap[localUser.mobileNumber]=localUser;
        userDeviceMap[uuid]=localUser;
        userAddressMap[localUser.publicKey] = localUser;

        notify("Registration", localUser.publicKey, "100 ethers credited to your account");

        return true;
    } 
    
    function registerUser(string memory mobileNumber, address publicKey, string memory deviceId, string memory name, string memory email, string memory college)  public onlyAdmin returns (bool) {
        User memory localUser = userDeviceMap[deviceId];
        if (!checkUserExists(localUser)) {
            User memory user =  User({
                mobileNumber: mobileNumber, 
                publicKey: publicKey, 
                deviceId: deviceId, 
                initialCredit: false, 
                claimCount: 0,
                count: 0,
                name: name,
                email: email,
                college: college
            });
            usersMobileMap[mobileNumber] = user;
            userDeviceMap[deviceId] = user;
            userAddressMap[publicKey] = user;
            Score memory score = Score({
                publicKey: publicKey,
                points: 0,
                name: name,
                mobileNumber: mobileNumber,
                uuid: deviceId
            });
            scores.push(score);
            emit UserRegistred(publicKey, true, 'User created successfully!', deviceId, mobileNumber, name, college, email);
            return true;
        } else if(localUser.count < 2) {
            localUser.count = localUser.count + 1;
            localUser.publicKey = publicKey;
            localUser.mobileNumber = mobileNumber;
            localUser.name = name;
            localUser.email = email;
            localUser.college = college;
            localUser.initialCredit = false;
            localUser.claimCount = localUser.claimCount;
            usersMobileMap[mobileNumber] = localUser;
            userDeviceMap[deviceId] = localUser;
            userAddressMap[publicKey] = localUser;
            Score memory score = Score({
                publicKey: publicKey,
                points: 0,
                name: name,
                mobileNumber: mobileNumber,
                uuid: deviceId
            });
            scores.push(score);
            emit UserRegistred(publicKey, true, 'User created successfully!', deviceId, mobileNumber, name, college, email);
            return true;
        }
        emit UserRegistred(publicKey, false, 'Registration chances finished!', deviceId, mobileNumber, name, college, email);
        return false;
    }
    
    function updateScore(address publicKey, uint points) public returns (uint) {
        for(uint i = 0; i < scores.length; i++) {
            if(publicKey == scores[i].publicKey) {
                scores[i].points = scores[i].points + points;
                return scores[i].points;
            }
        }
        return 0;
    }
    
    function getUserPoints(address publicKey) public view returns (uint poinnts, string memory name, string memory mobileNumber, string memory uuid) {
        for(uint i = 0; i < scores.length; i++) {
            if(publicKey == scores[i].publicKey) {
                return (scores[i].points, scores[i].name, scores[i].mobileNumber, scores[i].uuid);
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
        if(score.publicKey != address(0)) {
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

    function checkUserByMobile(string memory mobileNumber) public view returns(bool) {
        User memory _localUser = usersMobileMap[mobileNumber];
        if(_localUser.publicKey != address(0)) {
            return true;
        }
        return false;
    }
    
    function checkUserByDevice(string memory uuid) public view returns(bool) {
        User memory _localUser = userDeviceMap[uuid];
        if(_localUser.publicKey != address(0)) {
            return true;
        }
        return false;
    }
    
    
    function checkUserExists(User memory localUser) private pure  returns (bool) {
        if(localUser.publicKey == address(0)) {
            return false;
        }
        return true;
    }

    function getTokens(address[] memory addrezzes) public view onlyAdmin returns (string[] memory tokens) {
        uint length = addrezzes.length;
        string[] memory _tokens = new string[](length);
        for (uint i = 0; i < length; i++) {
            _tokens[i] = userAddressMap[addrezzes[i]].deviceId;
        }
        return (_tokens);
    }
}