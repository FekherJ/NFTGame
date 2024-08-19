
// Initialize `truffle-hdwallet-provider`
const HDWalletProvider = require("truffle-hdwallet-provider");

//Import this ? make it so that Truffle reads the private key from the file containi ng the private key.
const { readFileSync } = require('fs')
const path = require('path')
const { join } = require('path')

// set directory
const _dirname = "./"

// Set your own mnemonic here
const mnemonic = "ghost lemon scope fish paper small strain global";


//Define a function that reads the private key from a file and initializes a new LoomTruffleProvider:
function getLoomProviderWithPrivateKey (privateKeyPath, chainId, writeUrl, readUrl) {
  //const privateKey = readFileSync(privateKeyPath, 'utf-8');	//Replaced by the following
	privateKey = readFileSync(path.resolve(_dirname,"private_key.txt"), 'utf-8').trim();
	return new LoomTruffleProvider(chainId, writeUrl, readUrl, privateKey);
}


// Module exports to make this configuration available to Truffle itself
module.exports = {
  // Object with configuration for each network
  networks: {
	  
	// COnfig of development network
	development: {
      		host: "127.0.0.1",
      		port: 7545,
      		network_id: 5777
	//network_id: "*" // Match any network id
    	},
	  
    // Configuration for mainnet
   	 mainnet: {
		provider: function () {
			// Setting the provider with the Infura Mainnet address and Token
			return new HDWalletProvider(mnemonic, "https://mainnet.infura.io/v3/YOUR_TOKEN")
		},
		network_id: "1"
	},
		
    // Configuration for rinkeby network
    	rinkeby: {
		// Special function to setup the provider
		provider: function () {
			// Setting the provider with the Infura Rinkeby address and Token
			return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/YOUR_TOKEN")
		},
		network_id: 4//Fill in the `network_id` for the Rinkeby network.
    	},
	
	// Configuration for loom_testnet
	loom_testnet: {
		provider: function() {
			const privateKey = readFileSync(path.resolve(_dirname,"testnet_private_key.txt"), 'utf-8').trim();
			const chainId = 'extdev-plasma-us1';
			const writeUrl = 'http://extdev-plasma-us1.dappchains.com:80/rpc';
			const readUrl = 'http://extdev-plasma-us1.dappchains.com:80/query';
			return new LoomTruffleProvider(chainId, writeUrl, readUrl, privateKey);
		},
		network_id: '9545242630824'
	},
	
	basechain: {
		provider: function() {
			const chainId = 'default';
			const writeUrl = 'http://basechain.dappchains.com/rpc';
			const readUrl = 'http://basechain.dappchains.com/query';
			const privateKeyPath = path.join(__dirname, 'mainnet_private_key');
			const loomTruffleProvider = getLoomProviderWithPrivateKey(privateKeyPath, chainId, writeUrl, readUrl);
			return loomTruffleProvider;
        },
		network_id: '*'
    }
  },
  compilers: {
     solc: {
       version: "0.8.21" 
     }
  }
};
