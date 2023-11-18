import {  Barretenberg, Fr } from '@aztec/bb.js';
import { BarretenbergBackend } from '@noir-lang/backend_barretenberg';
import { Noir } from '@noir-lang/noir_js';
import { allowlist } from "./allowlist";
import utils from "../circuits/utils/target/utils.json";
import { MerkleTree } from './merkleTree';

//@ts-ignore
let backendPedersen;
//@ts-ignore
let noirPedersen;
let api:Barretenberg;


async function initNoir() {
    //@ts-ignore
    backendPedersen = new BarretenbergBackend(utils);
    //@ts-ignore
    noirPedersen = new Noir(utils, backendPedersen);
    await noirPedersen.init();
    api = await Barretenberg.new(/* num_threads */ 1);
    api.pedersenInit();
    console.log("Noir initiated");
}

async function createMerkleRoot() {
    const merkleTree = new MerkleTree(2);
    await merkleTree.initialize(allowlist.map((v) => Fr.fromString(v)));
    console.log(merkleTree.root().toString());
    console.log(merkleTree.getIndex(Fr.fromString(allowlist[0])));
    console.log(await merkleTree.proof(0));
}

async function main() {
    await initNoir()
    await createMerkleRoot();
    //@ts-ignore
    backendPedersen!.destroy();
    //@ts-ignore
    noirPedersen!.destroy();
    //@ts-ignore
    api!.destroy();
}

main();
