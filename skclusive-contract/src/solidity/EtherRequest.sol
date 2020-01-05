pragma solidity >0.5.1 <0.6.0;
pragma experimental ABIEncoderV2;

import "./Ownable.sol";

import './Registration.sol';

contract EtherRequest is Ownable {
    
    Registration private _registration;
    
    struct User {
        address addrezz;
        string uuid;
        string name;
        string phone;
    }
    
    User[] private users;
    
    constructor(Registration registration) public payable onlyAdmin {
        _registration = registration;
    }
    
    function checkRequestPending(address addrezz) public view returns (bool) {
        for(uint i = 0; i < users.length; i++) {
            if(users[i].addrezz == addrezz) {
                return true;
            }
        }
        return false;
    }
    
    function requestEther(string memory uuid) public onlyAdmin  {
       (address _addrezz, string memory _uuid, string memory _phone, string memory _name) = _registration.getUserByUUID(uuid);
       bool isRequestPending = checkRequestPending(_addrezz);
       if(!isRequestPending) {
           User memory user = User({
            addrezz: _addrezz,
            uuid: _uuid,
            phone: _phone,
            name: _name
            });
            users.push(user);
       }
    }

    function getUsers() external view onlyAdmin returns  
    (
        address[] memory addrezzes,
        string[] memory names,
        string[] memory uuids,
        string[] memory phones
    ) {

        uint length = users.length;

        address[] memory _addrezzes = new address[](length);
        string[] memory _names = new string[](length);
        string[] memory _uuids = new string[](length);
        string[] memory _phones = new string[](length);

        for (uint i = 0; i < length; i++) {
            User memory user = users[i];
             _addrezzes[i] = user.addrezz;
            _names[i] = user.name;
            _uuids[i] = user.uuid;
            _phones[i] = user.phone;
        }
        return 
        (
            _addrezzes,
            _names,
            _uuids,
            _phones
        );
    }
    
    function acceptRequest(address payable _addrezz, string memory uuid) public onlyAdmin returns (bool) {
        if(!_registration.checkInitialCredit(uuid)) {
            _registration.creditEther(uuid);
            deleteUser(_addrezz);
            return true;
        }
        return false;
    }
    
    function deleteUser(address _addrezz) private {
        for(uint i = 0; i < users.length; i++) {
            if(users[i].addrezz == _addrezz) {
                delete users[i];
                break;
            }
        }
    }
}