
// Initialize `truffle-hdwallet-provider`
const HDWalletProvider = require("truffle-hdwallet-provider");
const LoomTruffleProvider = require('loom-truffle-provider');

//Import this ? make it so that Truffle reads the private key from the file containing the private key.
const { readFileSync } = require('fs')
const path = require('path')
const { join } = require('path')

// Set your own mnemonic here
const mnemonic = "spin sunset pact nature enhance include fatigue occur blind wire inner foot";

// set directory
const _dirname = "./"


/*
//Define a function that reads the private key from a file and initializes a new LoomTruffleProvider:
function getLoomProviderWithPrivateKey (privateKeyPath, chainId, writeUrl, readUrl) {
	const privateKey = readFileSync(path.resolve(_dirname,"private_key.txt"), 'utf-8').trim();
	
	console.log("Private key length: (should be 64) ",privateKey.length);
	console.log("Private Buffer Hex : (should be 32)",Buffer.from(privateKey,'hex').length);  //should be 32 long
	
	//return new LoomTruffleProvider(chainId, writeUrl, readUrl, privateKey); 
	//The above was replaced by the following to make Truffle talk to Loom : we replaced the default HDWalletProvider with our own Truffle Provider for the loom testnet
	const loomTruffleProvider = new LoomTruffleProvider(chainId, writeUrl, readUrl, privateKey);
	loomTruffleProvider.createExtraAccountsFromMnemonic(mnemonic, 10);
	return loomTruffleProvider; 
}
*/



// Module exports to make this configuration available to Truffle itself
module.exports = {
  // Object with configuration for each network
  networks: {
	    //development
     /*   development: {
            host: "127.0.0.1",
            port: 7545,
            network_id: "*",
            gas: 9500000
        },*/	  
    // Configuration for the Ethereum Mainnet
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
	
	sepolia: {
		provider: () => new HDWalletProvider({
			mnemonic: {
			phrase: "spin sunset pact nature enhance include fatigue occur blind wire inner foot"
			},
			providerOrUrl: "https://sepolia.infura.io/v3/<YOUR-INFURA-PROJECT-ID>"
		}),
 
		network_id: 11155111, // Sepolia's network ID
		gas: 4000000, // Adjust the gas limit as per your requirements
		gasPrice: 10000000000, // Set the gas price to an appropriate value
		confirmations: 2, // Set the number of confirmations needed for a transaction
		timeoutBlocks: 200, // Set the timeout for transactions
		skipDryRun: true // Skip the dry run option
	}
	
	
	
	// Configuration for loom_testnet
/*	loom_testnet: {
		provider: function() {
			const privateKey = 'YOUR_PRIVATE_KEY'
			const chainId = 'extdev-plasma-us1';
			const writeUrl = 'http://extdev-plasma-us1.dappchains.com:80/rpc';
			const readUrl = 'http://extdev-plasma-us1.dappchains.com:80/query';
			return new LoomTruffleProvider(chainId, writeUrl, readUrl, privateKey);
		},
		network_id: '9545242630824'
	},	
//     return new LoomTruffleProvider(chainId, writeUrl, readUrl, privateKey);   Replaced with the below

	//	const loomTruffleProvider = new LoomTruffleProvider(chainId, writeUrl, readUrl,privateKeyBuffer);
	//	loomTruffleProvider.createExtraAccountsFromMnemonic(mnemonic, 10);
	//	return loomTruffleProvider;
      },
      network_id: '9545242630824'
	  //network_id: 'extdev'
    },
*/	
	
	
/*	
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
    }
*/
  },
  compilers: {
     solc: {
       version: "0.8.21" 
     }
  }
}

