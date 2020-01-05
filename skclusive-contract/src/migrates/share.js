// @ts-check

// The path module provides utilities for working with file and directory paths.
import path from "path";

// fs-extra adds file system methods that aren't included in the native fs module
// and adds promise support to the fs methods.
import fs from "fs-extra";

(() => {
  const destinations = [
    "skclusive-client/src",
    "skclusive-server/src"
  ];

  const name = "shared";

  const srcPath = path.resolve(__dirname, "..", name);

  for (const destination of destinations) {
    const destinationPath = path.resolve(
      __dirname,
      "..",
      "..",
      "..",
      destination,
      ...name.split("/")
    );

    console.info(`copying contract js code to ${destination}`);

    fs.copySync(srcPath, destinationPath);
  }
})();
