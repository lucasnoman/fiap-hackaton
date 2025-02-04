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

// src/infra/adapter/input/video-input.ts
var video_input_exports = {};
__export(video_input_exports, {
  getVideoInput: () => getVideoInput
});
module.exports = __toCommonJS(video_input_exports);
var import_node_path = __toESM(require("path"));
var import_node_readline = __toESM(require("readline"));
var import_zod = require("zod");
var videoPathSchema = import_zod.z.string().min(1, "Path cannot be empty").refine((path2) => path2.endsWith(".mp4"), {
  message: 'Path must end with ".mp4"'
});
var timeSchema = import_zod.z.preprocess(
  (val) => parseInt(val, 10),
  import_zod.z.number().min(0)
);
var getVideoInput = async () => {
  const rl = import_node_readline.default.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  const question = (query) => new Promise((resolve) => rl.question(query, resolve));
  const inputPath = await question(
    "Video file path (press Enter for default): "
  );
  const defaultPath = import_node_path.default.resolve(
    process.cwd(),
    "global",
    "Marvel_DOTNET_CSHARP.mp4"
  );
  const resolvedPath = inputPath ? import_node_path.default.resolve(process.cwd(), inputPath) : defaultPath;
  const pathValidation = videoPathSchema.safeParse(resolvedPath);
  if (!pathValidation.success) {
    throw new Error(
      `Invalid video path: ${pathValidation.error.issues.map((i) => i.message).join(", ")}`
    );
  }
  const startTimeRaw = await question(
    "Enter start time in seconds (press Enter for default = 0): "
  );
  const startTime = startTimeRaw.trim() ? timeSchema.safeParse(startTimeRaw).data ?? 0 : 0;
  const endTimeRaw = await question(
    "Enter end time in seconds (press Enter for default = end of video): "
  );
  const endTime = endTimeRaw.trim() ? timeSchema.safeParse(endTimeRaw).data ?? 0 : null;
  rl.close();
  return { videoPath: resolvedPath, startTime, endTime };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getVideoInput
});
