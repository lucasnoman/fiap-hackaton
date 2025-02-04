"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/infra/adapter/output/zip-creator-archiver.ts
var zip_creator_archiver_exports = {};
__export(zip_creator_archiver_exports, {
  ZipCreatorArchiver: () => ZipCreatorArchiver
});
module.exports = __toCommonJS(zip_creator_archiver_exports);
var import_node_fs = __toESM(require("fs"));
var import_archiver = __toESM(require("archiver"));
var ZipCreatorArchiver = class {
  createZip(sourceFolder, zipFilePath) {
    return new Promise((resolve, reject) => {
      const output = import_node_fs.default.createWriteStream(zipFilePath);
      const archive = (0, import_archiver.default)("zip", { zlib: { level: 9 } });
      output.on("close", resolve);
      archive.on("error", reject);
      archive.pipe(output);
      archive.directory(sourceFolder, false);
      archive.finalize();
    });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ZipCreatorArchiver
});
