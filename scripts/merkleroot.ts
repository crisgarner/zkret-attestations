import { Fr } from '@aztec/bb.js';
import { BarretenbergBackend } from '@noir-lang/backend_barretenberg';
import { Noir } from '@noir-lang/noir_js';
import { toHex } from 'viem'
import { allowlist } from "./allowlist";
import { MerkleTree } from './merkleTree';
import circuit from "../circuits/target/attestation.json";

let backend: BarretenbergBackend;
let noir: Noir;

async function initNoir() {
    //@ts-ignore
    backend = new BarretenbergBackend(circuit, { threads: 8 });
    //@ts-ignore
    noir = new Noir(circuit, backend);
    await noir.init();
    // api = await Barretenberg.new(/* num_threads */ 1);
    // api.pedersenInit();
    console.log("Noir initiated");
}

async function createMerkleRoot() {
    const merkleTree = new MerkleTree(2);
    await merkleTree.initialize(allowlist.map((v) => Fr.fromString(v)));
    // console.log(merkleTree.root().toString());
    // console.log(merkleTree.getIndex(Fr.fromString(allowlist[0])));
    // console.log(await merkleTree.proof(0));
    console.log("merkleTree generated.")
    return merkleTree;
}

async function verify(merkleTree: MerkleTree, address: string) {
    console.log('generating proof');
    const index = merkleTree.getIndex(Fr.fromString(address));
    const merkleproof = await merkleTree.proof(index);
    const inputs = { leaf: merkleproof.leaf.toString() as `0x${string}`, index: index, hashpath: merkleproof.pathElements.map(x => x.toString()), root: merkleTree.root().toString() as `0x${string}`, };
    //@ts-ignore
    const proof = await noir.generateFinalProof(inputs);
    console.log("Proof = ", toHex(proof.proof));
    const result = await noir.verifyFinalProof(proof);
    return result;
}

async function main() {
    await initNoir()
    const merkleTree = await createMerkleRoot();
    const result = await verify(merkleTree, "0xc59975735ed4774b3Ee8479D0b5A26388B929a34");
    console.log("verifcation result = ", result);
    noir!.destroy();
    backend!.destroy();
    //@ts-ignore
    // backendPedersen!.destroy();
    //@ts-ignore
    // noirPedersen!.destroy();
    //@ts-ignore
    // api!.destroy();
}

main();
