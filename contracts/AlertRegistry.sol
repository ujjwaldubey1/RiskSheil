// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract AlertRegistry {
    struct Alert {
        address garden;
        address manager;
        string reason;
        uint256 timestamp;
        bytes metadata;
    }

    Alert[] public alerts;

    event AlertSaved(uint256 indexed id, address indexed garden, address indexed manager, string reason);

    function saveAlert(address garden, address manager, string calldata reason, bytes calldata metadata) external {
        alerts.push(Alert(garden, manager, reason, block.timestamp, metadata));
        emit AlertSaved(alerts.length - 1, garden, manager, reason);
    }

    function alertsCount() external view returns (uint256) {
        return alerts.length;
    }
}

