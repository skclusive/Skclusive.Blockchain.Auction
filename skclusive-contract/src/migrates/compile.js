// @ts-check

// The path module provides utilities for working with file and directory paths.
import path from "path";

// fs-extra adds file system methods that aren't included in the native fs module
// and adds promise support to the fs methods.
import fs from "fs-extra";

// It is used to compile solidity files
import solc from "solc";

import Contract from "../shared/contracts/Contract";

import sources from "./sources";

export default async function compile(
  name,
  imports = [],
  options = {},
  ...args
) {
  const sol = `${name}.sol`;

  const json = `${name}.json`;

  // This code removes a file or directory inside the Build directory
  // __dirname returns the current the directory path
  const buildPath = path.resolve(__dirname, "..", "shared", "artifacts", json);

  fs.removeSync(buildPath);

  const input = {
    language: "Solidity",
    sources: sources([name, ...imports]),
    settings: {
      outputSelection: {
        "*": {
          "*": ["*"]
        }
      }
    }
  };

  // This code compile the contract code and return the contracts object
  const output = JSON.parse(solc.compile(JSON.stringify(input)));

  // Ensures that the directory 'Build' exists. If the directory structure does not exist, it is created.
  // fs.ensureDirSync(buildPath);

  const { errors = [] } = output;

  const warnings = errors.filter(error => error.type === "Warning");

  if (warnings.length) {
    console.warn("Warnings: ", warnings);
  }

  const typeerrors = errors.filter(error => error.type !== "Warning");

  if (typeerrors.length) {
    throw new Error(JSON.stringify(typeerrors, null, 2));
  }

  const binary = output.contracts[sol][name];

  const {
    abi,
    evm: { bytecode, gasEstimates }
  } = binary;

  const code = {
    bytecode: `0x${bytecode.object}`,
    abi,
    gasEstimates,
    address: ""
  };

  const contract = new Contract(code);

  const opts = {
    // gas: gasEstimates.creation.totalCost,
    ...options
  };

  const address = await contract.deploy(opts, ...args);

  code.address = address;

  console.log(`${sol} is deployed at ${address}`);

  // Create a JSON file with contract. It will be used to create contract instance from Angular application.
  fs.outputJsonSync(path.resolve(buildPath), code, { spaces: 2 });

  return address;
}
