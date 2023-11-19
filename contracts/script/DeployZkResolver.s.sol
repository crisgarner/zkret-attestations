// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {EAS} from "../src/EAS.sol";
import {ZkResolver, IUltraVerifier} from "../src/resolver/ZkResolver.sol";
import {Script} from "forge-std/Script.sol";
import {HelperConfig} from "./HelperConfig.sol";

contract DeployZkResolver is Script {
    function run() public returns (ZkResolver) {
        HelperConfig helperConfig = new HelperConfig();

        (
            address easAddress, /* address schemaRegistryAddress */
            ,
            address attesterAddress,
            address ultraVerifier, /* address zkResolver */
        ) = helperConfig.activeNetworkConfig();

        vm.startBroadcast();
        ZkResolver instance = new ZkResolver(EAS(easAddress), attesterAddress, IUltraVerifier(ultraVerifier));
        vm.stopBroadcast();

        return instance;
    }
}
