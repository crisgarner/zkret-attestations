import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';
import { BarretenbergBackend } from '@noir-lang/backend_barretenberg';
import { Noir } from '@noir-lang/noir_js';
import { allowlist } from "./allowlist";
import utils from "../circuits/utils/target/utils.json";

//@ts-ignore
let backendPedersen;
//@ts-ignore
let noirPedersen;


async function initNoir() {
    //@ts-ignore
    backendPedersen = new BarretenbergBackend(utils);
    //@ts-ignore
    noirPedersen = new Noir(utils, backendPedersen);
    await noirPedersen.init();
    console.log("Noir initiated");
}

async function createMerkleRoot() {
    const leafNodes = await Promise.all(allowlist.map(async (addr: String) => pedersen(addr)));
    console.log(`leafNodes = ${leafNodes}`);
    const merkleTree = new MerkleTree(leafNodes, pedersen, { sortPairs: true });
    const merkleRoot = merkleTree.getHexRoot();
    console.log('merkle root:', merkleRoot);
    console.log('leaf 1', merkleTree.getHexProof(await leafNodes[0]));
}

async function pedersen(value: String) {
    //@ts-ignore
    const result = await noirPedersen!.execute({ inputs: [value] });
    console.log(`result is ${result!.returnValue[0]}`);
    return result!.returnValue[0];
}

async function main() {
    await initNoir()
    await pedersen("0x417a472a0676a2d023431b1f052c78f38F44a800");
    createMerkleRoot();
}

main();
