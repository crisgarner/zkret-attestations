import { MerkleTree } from 'merkletreejs' ;
import keccak256 from 'keccak256';
import {BarretenbergBackend} from '@noir-lang/backend_barretenberg';
import {Noir} from '@noir-lang/noir_js';
import {allowlist} from "./allowlist";
import utils from "../circuits/utils/target/utils.json"

async function initNoir(){
     //@ts-ignore
    const backendPedersen = new BarretenbergBackend(utils);
    //@ts-ignore
    const noirPedersen = new Noir(utils, backendPedersen);
    await noirPedersen.init();
    console.log("Noir initied");
}

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

function pedersen(){

}

initNoir()
createMerkleRoot();
verify();
