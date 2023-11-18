// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {EAS} from "../src/EAS.sol";
import {SchemaRegistry} from "../src/SchemaRegistry.sol";

contract DeployEAS is Script {
    function run() public returns (EAS) {
        vm.startBroadcast();
        SchemaRegistry schemaRegistry = new SchemaRegistry();
        EAS eas = new EAS(schemaRegistry);
        vm.stopBroadcast();
        return eas;
    }
}
