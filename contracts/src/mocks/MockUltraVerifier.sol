// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IUltraVerifier} from "../resolver/ZkResolver.sol";
import {ISchemaResolver, Attestation} from "../resolver/ISchemaResolver.sol";

contract MockUltraVerifier is IUltraVerifier, ISchemaResolver {
    function verify(bytes calldata _proof, bytes32[] calldata _publicInputs) external view returns (bool) {
        return true;
    }

    function isPayable() external pure override returns (bool) {
        return false;
    }

    function attest(Attestation calldata attestation) external payable override returns (bool) {
        return true;
    }

    function multiAttest(Attestation[] calldata attestations, uint256[] calldata values)
        external
        payable
        override
        returns (bool)
    {
        return true;
    }

    function revoke(Attestation calldata attestation) external payable override returns (bool) {
        return true;
    }

    function multiRevoke(Attestation[] calldata attestations, uint256[] calldata values)
        external
        payable
        override
        returns (bool)
    {
        return true;
    }
}
