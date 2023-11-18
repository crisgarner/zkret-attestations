import { MerkleTree } from 'merkletreejs' ;
import keccak256 from 'keccak256';
import {BarretenbergBackend} from '@noir-lang/backend_barretenberg';
import {Noir} from '@noir-lang/noir_js';
import {allowlist} from "./allowlist"


function createMerkleRoot() {
    const leafNodes = allowlist.map((addr:String) => keccak256(addr));
    const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
    const merkleRoot = merkleTree.getHexRoot();
    console.log('merkle root:', merkleRoot);
    console.log('leaf 1', merkleTree.getHexProof(leafNodes[0]));
}

function verify(){
 console.log(Noir);
}

createMerkleRoot();
verify();
