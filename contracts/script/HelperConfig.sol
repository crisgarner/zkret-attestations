// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {MockUltraVerifier} from "../src/mocks/MockUltraVerifier.sol";
import {Script} from "forge-std/Script.sol";
import {SchemaRegistry} from "../src/SchemaRegistry.sol";
import {EAS} from "../src/EAS.sol";

contract HelperConfig is Script {
    struct NetworkConfig {
        address easAddress;
        address schemaRegistryAddress;
        address attesterAddress;
        address zkVerifierAddress;
    }

    NetworkConfig public activeNetworkConfig;

    constructor() {
        if (block.chainid == 534352) {
            // Scroll mainet
            activeNetworkConfig = getMainetConfig();
        } else if (block.chainid == 534351) {
            // Scroll sepolia testnet
            activeNetworkConfig = getSepoliaConfig();
        } else {
            // Anvil
            activeNetworkConfig = getAnvilConfigOrDeploy();
        }
    }

    function getMainetConfig() private pure returns (NetworkConfig memory) {
        NetworkConfig memory config = NetworkConfig({
            easAddress: address(0),
            schemaRegistryAddress: address(0),
            attesterAddress: address(0),
            zkVerifierAddress: address(0)
        });
        return config;
    }

    function getSepoliaConfig() private pure returns (NetworkConfig memory) {
        NetworkConfig memory config = NetworkConfig({
            easAddress: address(0x5Ac2d741957efFFa9084dCC332C91a2df9DabF44),
            schemaRegistryAddress: address(0x67906BfF01c109523a1a30C47a167Ec6922263e4),
            attesterAddress: address(0x417a472a0676a2d023431b1f052c78f38F44a800),
            zkVerifierAddress: address(0)
        });
        return config;
    }

    function getAnvilConfigOrDeploy() private returns (NetworkConfig memory) {
        if (activeNetworkConfig.easAddress != address(0)) {
            return activeNetworkConfig;
        }

        vm.startBroadcast();
        SchemaRegistry schemaRegistry = new SchemaRegistry();
        EAS eas = new EAS(schemaRegistry);
        MockUltraVerifier mock = new MockUltraVerifier();
        vm.stopBroadcast();

        NetworkConfig memory config = NetworkConfig({
            easAddress: address(eas),
            schemaRegistryAddress: address(schemaRegistry),
            attesterAddress: address(0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266), // Anvil default wallet
            zkVerifierAddress: address(mock)
        });
        return config;
    }
}
