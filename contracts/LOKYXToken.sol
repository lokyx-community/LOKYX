// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @notice Testnet/demo token shell for LOKYX V1.
/// Deploy on Base Sepolia only while developing. Do not use this file as a production token launch without review.
contract LOKYXToken is ERC20 {
    constructor(address initialHolder, uint256 initialSupply) ERC20("LOKYX", "LYX") {
        _mint(initialHolder, initialSupply * 10 ** decimals());
    }
}
