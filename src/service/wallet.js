import Web3Modal from 'web3modal';
import web3 from "web3"
import * as buffer from "buffer";
window.Buffer = window.Buffer || buffer.Buffer;
import {
    ethers
} from 'ethers';
import message from "../assets/lib/resetMessage"

const MAX_INT =
    "115792089237316195423570985008687907853269984665640564039457584007913129639935";
const web3Config = {
    filecoin: {
        name: 'Hyperspace testnet',
        network: 'testnet', //不确定名字
        chainId: 3141,
        rpc: 'https://api.hyperspace.node.glif.io/rpc/v1'
    },
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
// 合约地址
const contractAddress = {
    filecoin: {
        "usdc": "0x3cF2C8f435f243d965037672182A982B2b006fc9",
        "nft": "0xf55f35F0e2848cefc71724d99930c3495144e9f3",
        "platform": "0xbF6c659e7a917807d2FdAcBC68329088686c4A6B"
    },
    polygon: {
        // platform: '0x5f63EB592F6Bc1b2305E6dc06D55f5F7a35C15F3',
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
    platform: [{
            "anonymous": false,
            "inputs": [{
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
            "inputs": [{
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
            "inputs": [{
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
            "inputs": [{
                "internalType": "address",
                "name": "minter",
                "type": "address"
            }],
            "name": "addAuth",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [{
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
            "inputs": [{
                "internalType": "address",
                "name": "minter",
                "type": "address"
            }],
            "name": "delAuth",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getFee",
            "outputs": [{
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getFirstTradeFee",
            "outputs": [{
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getFrozen",
            "outputs": [{
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getIssueList",
            "outputs": [{
                "internalType": "address[]",
                "name": "",
                "type": "address[]"
            }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [{
                "internalType": "uint256",
                "name": "nftId",
                "type": "uint256"
            }],
            "name": "getNftPrice",
            "outputs": [{
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getPlatformAddress",
            "outputs": [{
                "internalType": "address",
                "name": "",
                "type": "address"
            }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getPlatformRatio",
            "outputs": [{
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [{
                "internalType": "uint256",
                "name": "nftId",
                "type": "uint256"
            }],
            "name": "getPublisherAddress",
            "outputs": [{
                "internalType": "address",
                "name": "",
                "type": "address"
            }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [{
                "internalType": "uint256",
                "name": "nftId",
                "type": "uint256"
            }],
            "name": "getPublisherRatio",
            "outputs": [{
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getVersion",
            "outputs": [{
                "internalType": "string",
                "name": "",
                "type": "string"
            }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [{
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
            "inputs": [{
                "internalType": "uint256",
                "name": "payValue",
                "type": "uint256"
            }],
            "name": "payFirstTrade",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [{
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
            "inputs": [{
                "internalType": "uint256",
                "name": "fee",
                "type": "uint256"
            }],
            "name": "setFee",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [{
                "internalType": "uint256",
                "name": "firstTradeFee",
                "type": "uint256"
            }],
            "name": "setFirstTradeFee",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [{
                "internalType": "bool",
                "name": "isFrozen",
                "type": "bool"
            }],
            "name": "setFrozen",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [{
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
            "inputs": [{
                "internalType": "address",
                "name": "platformAddress",
                "type": "address"
            }],
            "name": "setPlatformAddress",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [{
                "internalType": "uint256",
                "name": "platformRatio",
                "type": "uint256"
            }],
            "name": "setPlatformRatio",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [{
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
            "inputs": [{
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
            "inputs": [{
                "internalType": "string",
                "name": "version",
                "type": "string"
            }],
            "name": "setVersion",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [{
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
            "inputs": [{
                "internalType": "address payable",
                "name": "_to",
                "type": "address"
            }],
            "name": "withdrawMoneyTo",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ],
    nft: [{
            "inputs": [{
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
            "inputs": [{
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
            "inputs": [{
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
            "inputs": [{
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
            "inputs": [{
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
            "inputs": [{
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
            "inputs": [{
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
            "outputs": [{
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [{
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
            "outputs": [{
                "internalType": "uint256[]",
                "name": "",
                "type": "uint256[]"
            }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [{
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
            "inputs": [{
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
            "outputs": [{
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [{
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
            "outputs": [{
                "internalType": "string",
                "name": "",
                "type": "string"
            }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "owner",
            "outputs": [{
                "internalType": "address",
                "name": "",
                "type": "address"
            }],
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
            "inputs": [{
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
            "inputs": [{
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
            "inputs": [{
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
            "inputs": [{
                "internalType": "address",
                "name": "platformAddress",
                "type": "address"
            }],
            "name": "setPlatformAddress",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [{
                "internalType": "bytes4",
                "name": "interfaceId",
                "type": "bytes4"
            }],
            "name": "supportsInterface",
            "outputs": [{
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "symbol",
            "outputs": [{
                "internalType": "string",
                "name": "",
                "type": "string"
            }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "totalSupply",
            "outputs": [{
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [{
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }],
            "name": "transferOwnership",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [{
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }],
            "name": "uri",
            "outputs": [{
                "internalType": "string",
                "name": "",
                "type": "string"
            }],
            "stateMutability": "view",
            "type": "function"
        }
    ],
    usdc: [{
            "inputs": [{
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
            "inputs": [{
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
            "inputs": [{
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
            "inputs": [{
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
            "outputs": [{
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [{
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
            "outputs": [{
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [{
                "internalType": "address",
                "name": "account",
                "type": "address"
            }],
            "name": "balanceOf",
            "outputs": [{
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "decimals",
            "outputs": [{
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [{
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
            "outputs": [{
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [{
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
            "outputs": [{
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "name",
            "outputs": [{
                "internalType": "string",
                "name": "",
                "type": "string"
            }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "symbol",
            "outputs": [{
                "internalType": "string",
                "name": "",
                "type": "string"
            }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "totalSupply",
            "outputs": [{
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [{
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
            "outputs": [{
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [{
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
            "outputs": [{
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ]
}
class Wallet {
    constructor(blockChain) {
        // this.address = '' //地址
        this.balance = 0 // 余额
        this.signedMsg = '' // 签名
        this.web3Instance = '' // web3实例
        this.myContract = '' // 合约
        // let web3 = window.web3
        if (typeof web3 !== 'undefined') {
            // web3.currentProvider
            if (typeof window.ethereum !== 'undefined') {
                // 实例化web3
                this.web3Instance = new web3(ethereum) // 取小狐狸的地址
<<<<<<< HEAD:src/service/wallet.js
                ethereum.request({
                    method: 'eth_chainId'
                }).then(res => {
                    let setEvent = new Event('setItemEvent')
                    setEvent.key = "oooooooooo"
                    setEvent.newValue = res
                    window.dispatchEvent(setEvent)
=======
                ethereum.request({ method: 'eth_chainId' }).then(res => {
                    console.log(res)
                    let setEvent = new Event('setItemEvent')
            setEvent.key = "oooooooooo"
            setEvent.newValue = res
            window.dispatchEvent(setEvent)
>>>>>>> c99168c2ef1181c487a4b0d85cb9f55ac094e401:web/src/service/wallet.js
                })
                this.chainChanged();
                if (blockChain) {
                    this.blockChain = blockChain
                    this.web3Modal = new Web3Modal({
                        cacheProvider: true,
                        network: web3Config[blockChain]['network']
                    });
                    this.chainId = web3.utils.numberToHex(web3Config[blockChain]['chainId']);
                    this.rpc = web3Config[blockChain]['rpc'];
                    this.chainName = web3Config[blockChain]['name'];
                    // Chosen wallet provider given by the dialog window
                    this.connection = null;
                }
            } else {
                message.warning('MetaMask is uninstalled!');
            }
        }
    }
    // 一旦用户的小狐狸钱包现在的链不一致，就询问切换网络，没有就创建网络，网络切换成功后，收到监听，重新连接一下web3,就是重新调用一些connectWeb3这个方法
    async connectWeb3() {
        let that = this;
        // check if metamask
        if (typeof window.ethereum === 'undefined' || !window.ethereum.isMetaMask) {
            message.warning('MetaMask is uninstalled!');
            return null;
        }
        // 判断链对不，链不对就请求切换网络，或者添加网络，
        if (window.ethereum) {
            // 返回16进制形式的chainID，如0x1, 0x4等
<<<<<<< HEAD:src/service/wallet.js
            const chainId = await ethereum.request({
                method: 'eth_chainId'
            })
=======
            const chainId = await ethereum.request({ method: 'eth_chainId' })
>>>>>>> c99168c2ef1181c487a4b0d85cb9f55ac094e401:web/src/service/wallet.js
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{
                        chainId: this.chainId
                    }]
                });
                return that.connect();
            } catch (e) {
                //是4902，说明请求的链没有被 MetaMask 添加，需要通过 请求添加wallet_addEthereumChain
                // This error code indicates that the chain has not been added to MetaMask.
                // 主链 Polygon Mainnet： 0x89  测试链： 0x13881 80001
                if (e.code === 4902 || e.code === -32603) {
                    try {
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [{
                                // "chainId":'0x89',
                                // "chainName":'Polygon Mainnet',
                                // "rpcUrls":['https://rpc-mainnet.maticvigil.com']
                                //https://matic-mumbai.chainstacklabs.com
                                "chainId": this.chainId,
                                "chainName": this.chainName,
                                "rpcUrls": [this.rpc] //https://rpc-mumbai.matic.today
                            }]
                        });
                        return that.connect();
                    } catch (ee) {
                        return null;
                    }
                } else if (e.code === 4001) return null;
            }
            that.chainChanged();
        }
        // if (window.ethereum) {
        //     // 监听链id变化
        //     window.ethereum.on("chainChanged", (chainId1) => {
        //         let chainId = chainId1;
        //         console.log('链切换')
        //         window.location.reload();
        //     });
        // }
    }
    async getAddress() {
        try {
            // 授权获取账户
            const accounts = await ethereum.request({
                method: 'eth_requestAccounts'
            });
            // 取第一个账户
            console.log(accounts)
            const address = accounts[0];
            // const address = await signer.getAddress();
            return address;
        } catch (e) {
            console.log('Exception when calling getAddress ->', e);
            return '';
        }
    }
    accountsChanged() {
        //监听钱包切换
        ethereum.on("accountsChanged", function (accounts) {
            console.log('钱包切换')
            window.location.reload();
            // const chainId = await ethereum.request({ method: 'eth_chainId' })
            // let setEvent = new Event('setItemEvent')
            // setEvent.key = "oooooooooo"
            // setEvent.newValue = accounts
            // window.dispatchEvent(setEvent)
        });
    }
    async connect() {
        try {
            this.connection = await this.web3Modal.connect();
            let provider = new ethers.providers.Web3Provider(this.connection);
            this.provider = provider
            return provider;
        } catch (e) {
            console.log('Exception when calling connect ->', e);
            return null;
        }
    }
    async isApprovedForAll(signer, blockChain) {
        try {
            const nftContract = new ethers.Contract(contractAddress[blockChain].nft, contractAbi.nft, signer);
            const address = await this.getAddress(signer);
            let res = await nftContract.isApprovedForAll(address, contractAddress[blockChain].platform);
            return res;
        } catch (e) {
            console.log('Exception when calling approveIssue ->', e);
            return null;
        }
    }
    // 授权
    // Step 1，调用NFT合约setApprovalForAll()进行授权给platform合约
    async approveIssue(signer, blockChain, approved = true) {
        try {
            const nftContract = new ethers.Contract(contractAddress[blockChain].nft, contractAbi.nft, signer);
            // let ethContract = this.web3Instance.eth.Contract(contractAbi.nft,contractAddress.platform) //所有代币的abi可以通用（abi,合约地址）
            let txn = await nftContract.setApprovalForAll(contractAddress[blockChain].platform, approved);
            let res = await txn.wait();
            return res;
        } catch (e) {
            console.log('Exception when calling approveIssue ->', e);
            return null;
        }
    }
    async issue(signer, blockChain, nftId, amount, metadata, price, ratio) {
        /**
         * if res.status == 1, that means the transaction is successful, otherwise, failed.
         * 
         * args:
         * 
         * signer
         *      obj, the publisher
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
            const platformContract = new ethers.Contract(contractAddress[blockChain].platform, contractAbi.platform, signer);
            const seller = await this.getAddress(signer);
            let _price = this.toWei(parseFloat(price));
            let gasOptions;
            if (blockChain === 'filecoin') {
                // const [block, estim] = await baseFeeTheo(this.provider);
                // const [maxFeePerGas, maxPriorityFeePerGas] = await baseFeeTheo(this.provider);
                // console.log(block, estim)
                // const { maxFeePerGas, maxPriorityFeePerGas } = await estimateFees(this.provider);
                // maxFeePerGas: isEIP1559 ? gasPrice : null
                // maxPriorityFeePerGas: isEI1P559 ? qasPrice : nut
                // gasOptions = { gasPrice: 100, gasLimit: 10000000 }
                // console.log({ maxFeePerGas, maxPriorityFeePerGas })
                // gasOptions = { maxFeePerGas, maxPriorityFeePerGas }
            }
            let txn;
            if (gasOptions) {
                txn = await platformContract.issue(seller, nftId, amount, metadata, _price, seller, parseFloat(ratio) * 100, gasOptions);
            } else {
                txn = await platformContract.issue(seller, nftId, amount, metadata, _price, seller, parseFloat(ratio) * 100);
            }
            let res = await txn.wait();
            return res;
        } catch (e) {
            console.log('Exception when calling issue ->', e);
            message.warning("已拒绝.")
            window.hideLoading()
            return null;
        }
    }
    async allowance(signer, blockChain, symbol) {
        try {
            const usdcContract = new ethers.Contract(contractAddress[blockChain][symbol], contractAbi[symbol], signer);
            const address = await this.getAddress(signer);
            console.log(usdcContract)
            console.log(address, contractAddress[blockChain].platform)
            let res = await usdcContract.allowance(address, contractAddress[blockChain].platform);
            return res;
        } catch (e) {
            console.log('Exception when calling approveTrade ->', e);
            return null;
        }
    }
    async approve(signer, blockChain, symbol) {
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

            const usdcContract = new ethers.Contract(contractAddress[blockChain][symbol], contractAbi[symbol], signer);
            let txn = await usdcContract.approve(contractAddress[blockChain].platform, MAX_INT);
            let res = await txn.wait();
            return res;
        } catch (e) {
            console.log('Exception when calling approveTrade ->', e);
            return null;
        }
    }
    async trade(signer, blockChain, seller, nftId, amount, metadata, price, fee = 0) {
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
            let _fee = await this.getFee(signer, blockChain); // wei
            console.log("_fee", _fee)
            if (_fee != null && _fee > fee) fee = _fee;
            else fee = this.toWei(parseFloat(fee));
            console.log(price)
            console.log(parseFloat(price))
            let tradeValue = this.toWei(parseInt(amount) * parseFloat(price)) + fee;
            console.log("tradeValue-pc", tradeValue)
            const platformContract = new ethers.Contract(contractAddress[blockChain].platform, contractAbi.platform, signer);
            const buyer = await this.getAddress(signer);
            console.log("===================")
            console.log(platformContract)
            // let txn2 = await platformContract.setPlatformRatio(0)
            // let res2 = await txn2.wait();
            // console.log("getNftPrice", res2)
            console.log(seller, buyer, nftId, amount, metadata, tradeValue, fee)
            let txn = await platformContract.trade(seller, buyer, nftId, amount, metadata, tradeValue, fee);
            console.log("trade执行结果")
            let res = await txn.wait();
            return res;
        } catch (e) {
            console.log('Exception when calling trade ->', e);
            return null;
        }
    }
    async getSignature(nonce, address) {
        try {
            // const signature = await signer.signMessage(nonce);
            const signature = this.web3Instance.eth.personal.sign(nonce, address);
            return signature;
        } catch (e) {
            console.log('Exception when calling getSignature ->', e);
            return '';
        }
    }
    async sign(nonce) {
        this.signedMsg = await this.web3Instance.eth.personal.sign(nonce, this.address);
    }
    async getFee(signer, blockChain) {
        try {
            const platformContract = new ethers.Contract(contractAddress[blockChain].platform, contractAbi.platform, signer);
            let fee = await platformContract.getFee();
            console.log("fee", fee)
            return fee.toNumber();
        } catch (e) {
            console.log('Exception when calling getFee ->', e);
            return null;
        }
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
    // 合约授权
    // 实例化 myContract
    // async getApprove() {
    //     // console.log(window.web3)
    //     if (window.web3) {
    //         let web3 = new Web3(window.ethereum)
    //         // 初始化合约后
    //         let contract = new web3.eth.Contract(this.nftContractAbi, this.PLATFORM_ADDRESS) //所有代币的abi可以通用（abi,合约地址）
    //         // let ethContract = new web3.eth.Contract(abi.abi,"0x3d2dd604866d0ec1ddd5e8ef27848a6fc0962018") //所有代币的abi可以通用（abi,合约地址）
    //         console.log(contract)
    //         //授权数量
    //         let amount = 100 * Math.pow(10, 18);//转账100个
    //         // let toAddress = "0x020a23F917331cb1bDf199056DAF0bb829f1Aa7b";//被授权地址
    //         //小狐狸账户
    //         let fromAddress = await web3.eth.getAccounts()
    //         contract.methods.approve(this.PLATFORM_ADDRESS, amount + '').send({ from: fromAddress[0] })
    //     }
    // }
    // 合约转账
    send() {
        // "USDC_ADDRESS": "0x256fA9b75D0e03f0060b68630c5816b180c1f075",
        //     "DBOOK_ADDRESS": "0x020a23F917331cb1bDf199056DAF0bb829f1Aa7b",
        //         "PLATFORM_ADDRESS": "0xa0fc32D917F8d5452e4B87f07cA77C3CeA002C23"
        let contractAbi = ['这里输入你要交互合约的ABI'] //这里输入你要交互合约的ABI
        let contractAddress = '这里输入你自己要交互的0X开头的合约地址' // 这里输入你自己要交互的0X开头的合约地址
        let myContract = new web3.eth.Contract(contractAbi, contractAddress, {
            from: account, // default from address
            gasLimit: 70000,
            gasPrice: 1000000000 // default gas price in wei, 10 gwei in this case
        });
        let a = 1000000
        let toAddress = document.getElementById("toAddress").value;
        console.log("转账地址:" + toAddress)
        myContract.methods.transfer(toAddress, 1 * a, ).send({
            from: account
        }, function (error, transactionHash) {
            if (!error) {
                console.log('transactionHash is' + transactionHash);
            } else {
                console.log(error);
            }
        });
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
        ethereum.on("chainChanged", (res) => {
            console.log('链切换', res)
            // window.location.reload();
            let setEvent = new Event('setItemEvent')
            setEvent.key = "oooooooooo"
            setEvent.newValue = res
            window.dispatchEvent(setEvent)
        });
    }
    toWei(amount) {
        // 1 usdc = 1000000 wei
        return parseFloat(amount) * 10 ** 6;
    }
    // 首发购买
    async payFirstTrade(amount, price, signer) {
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
            const blockChain = this.blockChain
            console.log(amount, price)
            const address = await this.getAddress(signer);
            let tradeValue = this.toWei(parseInt(amount) * parseFloat(price));
            const platformContract = new ethers.Contract(contractAddress[blockChain].platform, contractAbi.platform, signer);
            let txn = await platformContract.payFirstTrade(tradeValue, {
                from: address,
                value: tradeValue
            });
            let res = await txn.wait();
            return res;
        } catch (e) {
            console.log('Exception when calling payFirstTrade ->', e);
            return null;
        }
    }
}
export default Wallet