// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IUltraVerifier} from "../resolver/ZkResolver.sol";

contract MockUltraVerifier is IUltraVerifier {
    function verify(bytes calldata _proof, bytes32[] calldata _publicInputs) external view returns (bool) {
        return true;
    }
}
