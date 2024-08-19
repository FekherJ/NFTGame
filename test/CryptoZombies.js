const CryptoZombies = artifacts.require("CryptoZombies");  // Import the CryptoZombies contract artifact (CryptoZombies.sol) which inherits from ZombieOwnership
const utils = require("./helpers/utils");
const time = require("./helpers/time");
const { expect } = require('chai'); // you can also use should/assert
// In NodeJS: import is only available in ES modules, not in commonJS modules 
// in ES modules: import { assert } from 'chai';


const zombieNames = ["Zombie 1", "Zombie 2"];	// Define an array of zombieNames for testing



//Define a test suite for the CryptoZombies contract
contract("CryptoZombies", (accounts) => {
    let [alice, bob] = accounts;  // Use Let instead of var when we want the variable to be limited in scope to the block in which it's defined
	let contractInstance;

    beforeEach(async () => {    //Truffle will run it automatically before every test
		//Deploy a new instance of the CryptoZombies contrat
		//deploying a new contract is an Asynchronous operation,so it returns a promise
		//By using await, the code waits fo the contract deployment to complete
        contractInstance = await CryptoZombies.new();
    });
	
//	afterEach(async () => {     //Truffle will call this function after the execution of each test
//        await contractInstance.kill();
//    });
	
	
	//Define a test case for creating a new zombie
    it("should be able to create a new zombie", async () => {
		
		//Call the createRandomZombie using the contract Instance
		//Passing in the first zombie name and specifying that the transaction is sent from the alice account
        const result = await contractInstance.createRandomZombie(zombieNames[0], {from: alice});
        
		//Check that the Tx receipt status is true, indicating success
		assert.equal(result.receipt.status, true); //check 1
		
		// Check that the bale of the zombie created matches the expected name
        assert.equal(result.logs[0].args.name, zombieNames[0]);
    })
	
	
	it("should not allow two zombies", async () => {		
			//try to create the second zombie
			await contractInstance.createRandomZombie(zombieNames[0], {from: alice});
            await utils.shouldThrow(contractInstance.createRandomZombie(zombieNames[1], {from: alice}));
    })
	
	
	context("with the single-step transfer scenario", async () => {
		it("should transfer a zombie", async () => {
			const result = await contractInstance.createRandomZombie(zombieNames[0], {from: alice});	// Creating a random Zombie and making sure it's from Alice
			const zombieId = result.logs[0].args.zombieId.toNumber();	
			await contractInstance.transferFrom(alice,bob,zombieId,{from : alice});	// Transfering the created ERC721 token from alice to bob 
			const newOwner = await contractInstance.ownerOf(zombieId);	
			expect(newOwner).to.equal(bob);
        })
    })
	
    
	context("with the two-step transfer scenario", async () => {
		 it("should approve and then transfer a zombie when the approved address calls transferFrom", async () => {
            const result = await contractInstance.createRandomZombie(zombieNames[0], {from: alice});
            const zombieId = result.logs[0].args.zombieId.toNumber();
            await contractInstance.approve(bob,zombieId, {from : alice});
            await contractInstance.transferFrom(alice, bob, zombieId, {from: bob});
            const newOwner = await contractInstance.ownerOf(zombieId);
            expect(newOwner).to.equal(bob);		// or assert.equal(newOwner,bob);
        })

        it("should approve and then transfer a zombie when the owner calls transferFrom", async () => {
            const result = await contractInstance.createRandomZombie(zombieNames[0], {from: alice});
            const zombieId = result.logs[0].args.zombieId.toNumber();
            await contractInstance.approve(bob, zombieId, {from: alice});
            await contractInstance.transferFrom(alice, bob, zombieId, {from: alice});
            const newOwner = await contractInstance.ownerOf(zombieId);
            expect(newOwner).to.equal(bob);
        })
    })
	
		xit("zombies should be able to attack another zombie", async () => {
			let result;
			result = await contractInstance.createRandomZombie(zombieNames[0], {from: alice});
			const firstZombieId = result.logs[0].args.zombieId.toNumber();
			result = await contractInstance.createRandomZombie(zombieNames[1], {from: bob});
			const secondZombieId = result.logs[0].args.zombieId.toNumber();
			await time.increase(time.duration.days(2));  // Increase the time by 1 day
			await contractInstance.attack(firstZombieId, secondZombieId, {from: alice});
			expect(result.receipt.status, true).to.equal(true);
	
		})
})