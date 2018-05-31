export const WEB3_PROVIDER = 'http://localhost:7545';
export const DEPLOYED_ADDRESS = '0x345ca3e014aaf5dca488057592ee47305d9b3e10';
export const ABI = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "_id",
				"type": "uint32"
			}
		],
		"name": "reclaimTransaction",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_receiver",
				"type": "address"
			},
			{
				"name": "_amt",
				"type": "uint256"
			}
		],
		"name": "createTransaction",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_id",
				"type": "uint32"
			}
		],
		"name": "getTransaction",
		"outputs": [
			{
				"name": "_creator",
				"type": "address"
			},
			{
				"name": "_receiver",
				"type": "address"
			},
			{
				"name": "_amt",
				"type": "uint256"
			},
			{
				"name": "_isActive",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_addy",
				"type": "address"
			}
		],
		"name": "getReceiverTransactions",
		"outputs": [
			{
				"name": "",
				"type": "uint32[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_addy",
				"type": "address"
			}
		],
		"name": "getCreatorTransactions",
		"outputs": [
			{
				"name": "",
				"type": "uint32[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_id",
				"type": "uint32"
			}
		],
		"name": "claimTransaction",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"payable": true,
		"stateMutability": "payable",
		"type": "fallback"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "TransactionCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "TransactionClaimed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "TransactionReclaimed",
		"type": "event"
	}
];
