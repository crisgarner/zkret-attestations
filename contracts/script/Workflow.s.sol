// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {HelperConfig} from "./HelperConfig.sol";
import {IEAS, AttestationRequest, AttestationRequestData} from "../src/IEAS.sol";
import {ISchemaResolver} from "../src/resolver/ISchemaResolver.sol";
import {SchemaRegistry} from "../src/SchemaRegistry.sol";

contract Workflow is Script {
    function run() public returns (address) {
        HelperConfig helperConfig = new HelperConfig();
        (address easAddr, address schemaRegistryAddr, address attester, address ultraVerifier, address zkResolver) =
            helperConfig.activeNetworkConfig();
        SchemaRegistry registry = SchemaRegistry(schemaRegistryAddr);
        IEAS eas = IEAS(easAddr);

        string memory schema = "bool isHuman 3";

        bytes memory merkleRoot =
            abi.encode(bytes32(0x100a1699a37444f7f0809a13d20f4658f91299d514b954d6c91c3993df56e2ac));

        vm.startBroadcast();
        bytes32 uuid = registry.register(schema, ISchemaResolver(zkResolver), false);
        AttestationRequestData memory attestationData = AttestationRequestData({
            recipient: address(0),
            expirationTime: 0,
            revocable: false,
            refUID: bytes32(0),
            data: merkleRoot,
            value: 0
        });
        AttestationRequest memory request = AttestationRequest({schema: uuid, data: attestationData});
        eas.attest(request);
        vm.stopBroadcast();

        return zkResolver;
    }
}
