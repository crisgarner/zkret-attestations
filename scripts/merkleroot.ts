import { MerkleTree } from 'merkletreejs';
import {  Barretenberg, Fr } from '@aztec/bb.js';
import { BarretenbergBackend } from '@noir-lang/backend_barretenberg';
import { Noir } from '@noir-lang/noir_js';
import { allowlist } from "./allowlist";
import utils from "../circuits/utils/target/utils.json";

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
    const leafNodes = await Promise.all(allowlist.map(async (addr: string) => pedersen(addr)));
    const merkleTree = new MerkleTree(leafNodes, pedersen, { sortPairs: true });
    const merkleRoot = merkleTree.getHexRoot();
    console.log('merkle root:', merkleRoot);
    // console.log('leaf 1', merkleTree.getHexProof(await leafNodes[0]));
}

async function pedersen(value: string|Buffer) {
    const input = Fr.fromString(value.toString());
    // const result = await api.pedersenCommit([input]);
    const result =  await api.pedersenPlookupCommit([input])
    console.log(`result is ${result}`);
    return result.toBuffer();
    //@ts-ignore
    // const result = await noirPedersen!.execute({ inputs: [value] });
    // console.log(`result is ${result!.returnValue[0]}`);
    // return result!.returnValue[0];
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
