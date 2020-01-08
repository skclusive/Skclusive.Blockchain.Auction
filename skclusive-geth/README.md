**To build Blockchain Application**

## To install ethereum

    $ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

    $ brew tap ethereum/ethereum

    $ brew install ethereum

## To Start the geth private network

    [To create your own private ethereum](https://medium.com/mercuryprotocol/how-to-create-your-own-private-ethereum-blockchain-dad6af82fc9f)


    1. geth --datadir skblkchain1 init genesis.json

    2. geth  --rpc --rpcport 8545 --rpcaddr 0.0.0.0 --rpccorsdomain "*" --datadir skblkchain1 --port "30303" --nodiscover --rpcapi "eth,net,web3,personal,miner" console --networkid 1234 --ws  --wsaddr 0.0.0.0 --wsport 8546 --wsorigins "*"

    3. miner.setEtherbase("0x6c15C74e58f10b3710201c3dfa259F37CddC545d"); // use same address.

    4. miner.start()

## Initial Setup

    1. npm install

## To compile and deploy contract 

    1. npm run deploy
