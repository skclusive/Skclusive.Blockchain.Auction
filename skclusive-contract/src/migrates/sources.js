// @ts-check

// The path module provides utilities for working with file and directory paths.
import path from "path";

// fs-extra adds file system methods that aren't included in the native fs module
// and adds promise support to the fs methods.
import fs from "fs-extra";

export function source(file) {
  const sol = `${file}.sol`;
  const content = fs.readFileSync(
    path.resolve(__dirname, "..", "solidity", sol),
    "utf8"
  );
  return {
    [sol]: {
      content
    }
  };
}

export default function sources(files) {
  return files.reduce((sources, file) => ({ ...sources, ...source(file) }), {});
}
