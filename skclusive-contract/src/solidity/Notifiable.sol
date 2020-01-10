pragma solidity >0.5.1 <0.6.0;

contract Notifiable {

    event Notify(address[] addrezzes, string game, string message);

    event Winner(address addrezz, string game, string message);

    function notify(string memory game, address[] memory addrezzes,
        string memory message) internal {
        emit Notify(addrezzes, game, message);
    }

    function notify(string memory game, address[] memory addrezzes,
        string memory message1, string memory message2) internal {
        notify(game, addrezzes, concat(message1, message2));
    }

    function notify(string memory game, address[] memory addrezzes,
        string memory message1, string memory message2, string memory message3) internal {
        notify(game, addrezzes, concat(message1, message2), message3);
    }

    function notify(string memory game, address[] memory addrezzes,
        string memory message1, string memory message2, string memory message3,
        string memory message4) internal {
        notify(game, addrezzes, concat(message1, message2), message3, message4);
    }

    function notify(string memory game, address[] memory addrezzes,
        string memory message1, string memory message2, string memory message3,
        string memory message4, string memory message5) internal {
        notify(game, addrezzes, concat(message1, message2), message3, message4, message5);
    }

    function notify(string memory game, address[] memory addrezzes,
        string memory message1, string memory message2, string memory message3,
        string memory message4, string memory message5, string memory message6) internal {
        notify(game, addrezzes, concat(message1, message2), message3, message4, message5, message6);
    }

    function notify(string memory game, address addrezz, string memory message) internal {
        address[] memory addrezzes = new address[](1);
        addrezzes[0] = addrezz;
        notify(game, addrezzes, message);
    }

    function notify(string memory game, address addrezz,
        string memory message1, string memory message2) internal {
        notify(game, addrezz, concat(message1, message2));
    }

    function notify(string memory game, address addrezz,
        string memory message1, string memory message2, string memory message3) internal {
        notify(game, addrezz, concat(message1, message2), message3);
    }

    function notify(string memory game, address addrezz,
        string memory message1, string memory message2, string memory message3,
        string memory message4) internal {
        notify(game, addrezz, concat(message1, message2), message3, message4);
    }

    function notify(string memory game, address addrezz,
        string memory message1, string memory message2, string memory message3,
        string memory message4, string memory message5) internal {
        notify(game, addrezz, concat(message1, message2), message3, message4, message5);
    }

    function notify(string memory game, address addrezz,
        string memory message1, string memory message2, string memory message3,
        string memory message4, string memory message5, string memory message6) internal {
        notify(game, addrezz, concat(message1, message2), message3, message4, message5, message6);
    }

    function winner(string memory game, address addrezz, string memory message) internal {
        emit Winner(addrezz, game, message);
    }

    function concat(string memory _base, string memory _value) internal pure returns (string memory) {
        bytes memory _baseBytes = bytes(_base);
        bytes memory _valueBytes = bytes(_value);

        string memory _tmpValue = new string(_baseBytes.length + _valueBytes.length);
        bytes memory _newValue = bytes(_tmpValue);

        uint i = 0;
        uint j = 0;

        for (i = 0; i < _baseBytes.length; i++) {
            _newValue[j++] = _baseBytes[i];
        }

        for (i = 0; i < _valueBytes.length; i++) {
            _newValue[j++] = _valueBytes[i];
        }

        return string(_newValue);
    }

    function toString(address x) internal pure returns (string memory) {
        bytes memory _bytes = new bytes(20);
        for (uint i = 0; i < 20; i++) {
            _bytes[i] = byte(uint8(uint(x) / (2**(8*(19 - i)))));
        }
        return string(_bytes);
    }
}