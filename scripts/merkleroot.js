const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');


const whitelistAddresses = require("./allowlist").default;

function createMerkleRoot() {
    const leafNodes = whitelistAddresses.map(addr => keccak256(addr));
    const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
    const merkleRoot = merkleTree.getHexRoot();
    console.log('merkle root:', merkleRoot);
    console.log('leaf 1', merkleTree.getHexProof(leafNodes[0]));
}

createMerkleRoot();
