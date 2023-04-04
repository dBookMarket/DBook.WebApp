import Web3Modal from 'web3modal';
import web3 from 'web3';
import { ethers } from 'ethers';

// contract config
const contractAddress = {
  polygon: {
    platform: '0xE344D7e81d04e77014f9e31423c59c8deb7f5Ff4',
    nft: '0x7C850235538410e46045873c6F7e86458F942136',
    usdc: '0x93d633d2E5c2312A4d53f03C517C86563C9FC8fb'
  },
  bnb: {
    platform: '0xc3a3cD2c77CE4a7c3aBee9f2eA9E37F058C5fbe8',
    nft: '0xcf0b52b899Ac7ec7cfBdB022C2382bBb050C6Fc3',
    usdc: '0x425F41d0F330021E72Ff70CB218fbD26559C509a'
  }
}

const contractAbi = {
  platform: [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "nftId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "publisherAddress",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "publisherRatio",
          "type": "uint256"
        }
      ],
      "name": "Issue",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "seller",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "receiver",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "nftId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "nftAmount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "tradeValue",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "fee",
          "type": "uint256"
        }
      ],
      "name": "Trade",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token1155",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "token20",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "version",
          "type": "string"
        }
      ],
      "name": "__DBookPlatform_init",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "minter",
          "type": "address"
        }
      ],
      "name": "addAuth",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "nftId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "burn",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "minter",
          "type": "address"
        }
      ],
      "name": "delAuth",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getFee",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getFirstTradeFee",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getFrozen",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getIssueList",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "nftId",
          "type": "uint256"
        }
      ],
      "name": "getNftPrice",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getPlatformAddress",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getPlatformRatio",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "nftId",
          "type": "uint256"
        }
      ],
      "name": "getPublisherAddress",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "nftId",
          "type": "uint256"
        }
      ],
      "name": "getPublisherRatio",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getVersion",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "nftId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        },
        {
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "publisherAddress",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "publisherRatio",
          "type": "uint256"
        }
      ],
      "name": "issue",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "payValue",
          "type": "uint256"
        }
      ],
      "name": "payFirstTrade",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "seller",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "payValue",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "mintAmont",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "buyer",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "nftId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "metaData",
          "type": "bytes"
        }
      ],
      "name": "runFirstTrade",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "fee",
          "type": "uint256"
        }
      ],
      "name": "setFee",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "firstTradeFee",
          "type": "uint256"
        }
      ],
      "name": "setFirstTradeFee",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bool",
          "name": "isFrozen",
          "type": "bool"
        }
      ],
      "name": "setFrozen",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "nftId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        }
      ],
      "name": "setNftPrice",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "platformAddress",
          "type": "address"
        }
      ],
      "name": "setPlatformAddress",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "platformRatio",
          "type": "uint256"
        }
      ],
      "name": "setPlatformRatio",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "nftId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "publishAddress",
          "type": "address"
        }
      ],
      "name": "setPublisherAddress",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "nftId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "publishRatio",
          "type": "uint256"
        }
      ],
      "name": "setPublisherRatio",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "version",
          "type": "string"
        }
      ],
      "name": "setVersion",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "seller",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "receiver",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "nftId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "nftAmount",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        },
        {
          "internalType": "uint256",
          "name": "tradeValue",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "fee",
          "type": "uint256"
        }
      ],
      "name": "trade",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address payable",
          "name": "_to",
          "type": "address"
        }
      ],
      "name": "withdrawMoneyTo",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ],
  nft: [
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "symbol",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "uri",
          "type": "string"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "ApprovalForAll",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256[]",
          "name": "ids",
          "type": "uint256[]"
        },
        {
          "indexed": false,
          "internalType": "uint256[]",
          "name": "values",
          "type": "uint256[]"
        }
      ],
      "name": "TransferBatch",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "TransferSingle",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "value",
          "type": "string"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        }
      ],
      "name": "URI",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address[]",
          "name": "accounts",
          "type": "address[]"
        },
        {
          "internalType": "uint256[]",
          "name": "ids",
          "type": "uint256[]"
        }
      ],
      "name": "balanceOfBatch",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "burn",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        }
      ],
      "name": "isApprovedForAll",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "mint",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256[]",
          "name": "ids",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256[]",
          "name": "amounts",
          "type": "uint256[]"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "safeBatchTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "setApprovalForAll",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "platformAddress",
          "type": "address"
        }
      ],
      "name": "setPlatformAddress",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes4",
          "name": "interfaceId",
          "type": "bytes4"
        }
      ],
      "name": "supportsInterface",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "uri",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ],
  usdc: [
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_symbol",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "uint8",
          "name": "decimals",
          "type": "uint8"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        }
      ],
      "name": "allowance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "subtractedValue",
          "type": "uint256"
        }
      ],
      "name": "decreaseAllowance",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "addedValue",
          "type": "uint256"
        }
      ],
      "name": "increaseAllowance",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
}

const web3Config = {
  polygon: {
    name: 'mumbai',
    network: 'mumbai',
    chainId: 80001,
    rpc: 'https://rpc-mumbai.maticvigil.com'
  },
  bnb: {
    name: 'bsc testnet',
    network: 'testnet', //不确定名字
    chainId: 97,
    rpc: 'https://bsc-testnet.public.blastapi.io'
  }
}

// 钱包
class Wallet {
  constructor(blockChain) {
    this.web3Modal = Web3Modal({
      cacheProvider: true,
      network: web3Config[blockChain]['network']
    });
    this.chainId = web3.utils.numberToHex(web3Config[blockChain]['chainId']);
    this.rpc = web3Config[blockChain]['rpc'];
    this.chainName = web3Config[blockChain]['name'];
    // Chosen wallet provider given by the dialog window
    this.connection = null;
  }

  async _connect() {
    /**
     * connect to metamask wallet
     * 
     * return:
     *      provider
     */
    try {
      this.connection = await this.web3Modal.connect();
      let provider = new ethers.providers.Web3Provider(this.connection);
      return provider;
    } catch (e) {
      console.log('Exception when calling connect ->', e);
      return null;
    }
  }

  async disconnect() {
    console.log("Killing the wallet connection", this.connection);

    // TODO: Which providers have close method?
    if (this.connection && this.connection.close) {
      await this.connection.close();

      // If the cached provider is not cleared,
      // WalletConnect will default to the existing session
      // and does not allow to re-scan the QR code with a new wallet.
      // Depending on your use case you may want or want not his behavir.
      await this.web3Modal.clearCachedProvider();
      this.connection = null;
    }
  }

  async isConnect(provider) {
    // check if the wallet is connected or not
    try {
      const accounts = await provider.listAccounts();
      return typeof accounts !== 'undefined' && accounts.length > 0;
    } catch (e) {
      console.log('Exception when calling isConnect ->', e);
      return false;
    }
  }

  //一旦用户的小狐狸钱包现在的链不一致，就询问切换网络，没有就创建网络，网络切换成功后，收到监听，重新连接一下web3,就是重新调用一些connectWeb3这个方法
  async connect() {
    // check if metamask
    if (typeof window.ethereum === 'undefined' || !window.ethereum.isMetaMask) {
      alert('MetaMask not found!');
      return null;
    }
    // 判断链对不，链不对就请求切换网络，或者添加网络，
    if (window.ethereum) {
      // 返回16进制形式的chainID，如0x1, 0x4等
      let _chainId = await ethereum.request({ method: 'eth_chainId' })
      console.log(_chainId);
      if (this.chainId === _chainId) {
        return this._connect();
      }
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{
            chainId: this.chainId // 目标链ID 主链 Polygon Mainnet： 0x89  测试链： 0x13881
          }]
        });
        return this._connect();
      } catch (e) {
        //是4902，说明请求的链没有被 MetaMask 添加，需要通过 请求添加wallet_addEthereumChain
        // This error code indicates that the chain has not been added to MetaMask.
        // 主链 Polygon Mainnet： 0x89  测试链： 0x13881 80001
        if (e.code === 4902 || e.code === -32603) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  // "chainId":'0x89',
                  // "chainName":'Polygon Mainnet',
                  // "rpcUrls":['https://rpc-mainnet.maticvigil.com']
                  //https://matic-mumbai.chainstacklabs.com
                  "chainId": this.chainId,
                  "chainName": this.chainName,
                  "rpcUrls": [this.network]
                }]
            });
            return this._connect();
          } catch (ee) {
            //
            return null;
          }
        } else if (e.code === 4001) return null;
      }
      this.chainChanged();
    }
    if (window.ethereum) {
      // 监听链id变化
      window.ethereum.on("chainChanged", (chainId1) => {
        this.chainId = chainId1;
        console.log('链切换')
        window.location.reload();
      });
    }
  }

  accountsChanged() {
    //监听钱包切换
    ethereum.on("accountsChanged", function (accounts) {
      console.log('钱包切换')
      window.location.reload();
    });
  }

  chainChanged() {
    //监听链网络改变
    ethereum.on("chainChanged", () => {
      console.log('链切换')
      window.location.reload();
    });
  }

  getSigner(provider) {
    /**
     * return:
     *      signer
     */
    try {
      const signer = provider.getSigner();
      return signer;
    } catch (e) {
      console.log('Exception when calling getSigner ->', e);
      return null;
    }
  }

  async getSignature(signer, nonce) {
    try {
      const signature = await signer.signMessage(nonce);
      return signature;
    } catch (e) {
      console.log('Exception when calling getSignature ->', e);
      return '';
    }
  }

  async getAddress(signer) {
    try {
      const address = await signer.getAddress();
      return address;
    } catch (e) {
      console.log('Exception when calling getAddress ->', e);
      return '';
    }
  }
}

// 合约的接口
class Contract {
  constructor(blockChain, signer) {
    this.platformContract = new ethers.Contract(contractAddress[blockChain]['platform'], contractAbi.platform, signer);
    this.nftContract = new ethers.Contract(contractAddress[blockChain]['nft'], contractAbi.nft, signer);
    this.usdcContract = new ethers.Contract(contractAddress[blockChain]['usdc'], contractAbi.usdc, signer);
  }

  getNFTContractAddress() {
    return this.nftContract.address;
  }

  toWei(amount) {
    // 1 usdc = 1000000 wei
    return parseFloat(amount) * 10 ** 6;
  }

  async getFee() {
    try {
      // const platformContract = new ethers.Contract(platformContractAddress, platformContractAbi, signer);
      let fee = await this.platformContract.getFee();
      return fee.toNumber();
    } catch (e) {
      console.log('Exception when calling getFee ->', e);
      return null;
    }
  }

  async approveIssue(approved = true) {
    /**
     * approve platform for accessing the signer's nft
     * if res.status == 1, that means the transaction is successful, otherwise, failed.
 * 
 * args:
 *
 * 	approved
 * 		bool, which means grant or revoke permission to the operator to transfer the caller's tokens 
     */
    try {
      // const nftContract = new ethers.Contract(nftContractAddress, nftContractAbi, signer);
      let txn = await this.nftContract.setApprovalForAll(platformContractAddress, approved);
      let res = await txn.wait();
      return res;
    } catch (e) {
      console.log('Exception when calling approveIssue ->', e);
      return null;
    }
  }

  async approveTrade(amount, price) {
    /**
     * approve platform for accessing the signer's usdc
     * if res.status == 1, that means the transaction is successful, otherwise, failed.
     * 
     * args:
     * 
     * amount
     *      int, the number of books bought.
 * 
 * price
 * 		float, the price per book, unit USDC
     */
    try {
      let fee = await this.getFee(signer); // wei
      if (fee == null) fee = 1000000; // wei
      console.log('fee', fee);
      let tokenAmount = this.toWei(parseInt(amount) * parseFloat(price)) + fee;
      // const usdcContract = new ethers.Contract(usdcContractAddress, usdcContractAbi, signer);
      let txn = await this.usdcContract.approve(platformContractAddress, tokenAmount);
      let res = await txn.wait();
      return res;
    } catch (e) {
      console.log('Exception when calling approveTrade ->', e);
      return null;
    }
  }

  async issue(nftId, amount, metadata, price, ratio) {
    /**
     * For the second-class market.
     * if res.status == 1, that means the transaction is successful, otherwise, failed.
     * 
     * args:
     * 
     * nftId
     *      int, issue id from server
     * amount
     *      int, the number of issued book
     * metadata
     *      hex, meta information
     * price
     *      float, the unit price per book, unit USDC
     * ratio(%)
     *      int, it decides the benefit that the publisher will obtain per transaction. eg, ratio=20 means 20% 
     */
    try {
      // const platformContract = new ethers.Contract(platformContractAddress, platformContractAbi, signer);
      const seller = await this.getAddress(signer);
      let _price = this.toWei(parseFloat(price));
      let txn = await this.platformContract.issue(seller, nftId, amount, metadata, _price, seller, parseFloat(ratio) * 100);
      let res = await txn.wait();
      return res;
    } catch (e) {
      console.log('Exception when calling issue ->', e);
      return null;
    }
  }

  async trade(seller, nftId, amount, metadata, price, fee = 0) {
    /**
     * For the second-class market.
     * if res.status == 1, that means the transaction is successful, otherwise, failed.
     * 
     * args:
     * 
     * seller
     *      str, the seller address
     * nftId
     *      int, the issue id
     * amount
     *      int, the number of bought
     * metadata
     *      hex, meta info
     * price
     *      float, the unit price per book, unit USDC
     * fee
     *      int, the fee for platform, unit USDC
     */
    try {
      // get platform fee from contract
      let _fee = await this.getFee(signer); // wei
      if (_fee != null && _fee > fee) fee = _fee;
      else fee = this.toWei(parseFloat(fee));
      let tradeValue = this.toWei(parseInt(amount) * parseFloat(price)) + fee;
      // const platformContract = new ethers.Contract(platformContractAddress, platformContractAbi, signer);
      const buyer = await this.getAddress(signer);
      let txn = await this.platformContract.trade(seller, buyer, nftId, amount, metadata, tradeValue, fee);
      let res = await txn.wait();
      return res;
    } catch (e) {
      console.log('Exception when calling trade ->', e);
      return null;
    }
  }

  async payFirstTrade(amount, price) {
    /**
     * For the first-class market.
     * When an user want to buy a book from the first-class market, which means the book is published by its author, 
     * he/she should transfer the price to platform firstly.
     * 
     * args:
     * 
     * amount
     *      int, the number of books
     * price
     *      float, the unit price of a book, unit USDC
     */
    try {
      let tradeValue = this.toWei(parseInt(amount) * parseFloat(price));
      // const platformContract = new ethers.Contract(platformContractAddress, platformContractAbi, signer);
      let txn = await this.platformContract.payFirstTrade(tradeValue);
      let res = await txn.wait();
      return res;
    } catch (e) {
      console.log('Exception when calling payFirstTrade ->', e);
      return null;
    }
  }
}

export {
  Wallet,
  Contract
}