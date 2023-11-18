// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {EAS} from "../EAS.sol";
import {SchemaResolver, Attestation} from "./SchemaResolver.sol";

interface IUltraVerifier {
    function verify(bytes calldata _proof, bytes32[] calldata _publicInputs) external view returns (bool);
}

contract ZkResolver is SchemaResolver {
    error ZkResolver__InvalidMerkleRoot();
    error ZkResolver__InvalidProof();
    error ZkResolver__NotAttester();

    address private s_attester;
    bytes32 private s_merkleRoot;

    IUltraVerifier private immutable i_verifier;

    constructor(EAS _eas, address _attester, IUltraVerifier _verifier) SchemaResolver(_eas) {
        require(_attester != address(0));
        s_attester = _attester;
        i_verifier = _verifier;
    }

    function onAttest(Attestation calldata attestation, uint256 value) internal virtual override returns (bool) {
        if (attestation.attester != s_attester) {
            return false;
        }

        s_merkleRoot = abi.decode(attestation.data, (bytes32));
        return true;
    }

    function onRevoke(Attestation calldata attestation, uint256 value) internal virtual override returns (bool) {
        s_merkleRoot = abi.decode(attestation.data, (bytes32));
        return true;
    }

    function prove(bytes calldata _proof, bytes32[] calldata _publicInputs) external view returns (bool isValidProof) {
        if (_publicInputs[0] != s_merkleRoot) {
            revert ZkResolver__InvalidMerkleRoot();
        }

        isValidProof = i_verifier.verify(_proof, _publicInputs);
    }
}
