**To build Blockchain Application**

## To install ethereum

    $ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

    $ brew tap ethereum/ethereum

    $ brew install ethereum

## To Start the geth private network (got to dtcc-geth)

    [To create your own private ethereum](https://medium.com/mercuryprotocol/how-to-create-your-own-private-ethereum-blockchain-dad6af82fc9f)


    1. geth --datadir skblkchain1 init genesis.json

    2. geth  --rpc --rpcport 8545 --rpcaddr 0.0.0.0 --rpccorsdomain "*" --datadir skblkchain1 --port "30303" --nodiscover --rpcapi "eth,net,web3,personal,miner" console --networkid 1234 --ws --wsport 8546 --wsorigins "*"

    3. miner.setEtherbase("0x6c15C74e58f10b3710201c3dfa259F37CddC545d"); // use same address.

    4. miner.start()

## Initial Setup for client and server apps

    1. npm install

    2. npm run app-install

## To compile, deploy contract and share code between projects

    1. npm run contract-deploy

## To start game client and server 

### In production mode

    1. npm run skclusive-production

### In Dev mode

    1. npm run skclusive-server

    2. npm run skclusive-client

## To start mining only if new transaction happens. Execute below code on geth console

    var mining_threads = 1

    function checkWork() {
        if (eth.getBlock("pending").transactions.length > 0) {
            if (eth.mining) return;
            console.log("== Pending transactions! Mining...");
            miner.start(mining_threads);
        } else {
            miner.stop();
            console.log("== No transactions! Mining stopped.");
        }
    }

    eth.filter("latest", function(err, block) { checkWork(); });
    eth.filter("pending", function(err, block) { checkWork(); });

    checkWork();