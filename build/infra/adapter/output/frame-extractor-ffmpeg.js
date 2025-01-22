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

// src/infra/adapter/output/frame-extractor-ffmpeg.ts
var frame_extractor_ffmpeg_exports = {};
__export(frame_extractor_ffmpeg_exports, {
  FrameExtractorFfmpeg: () => FrameExtractorFfmpeg
});
module.exports = __toCommonJS(frame_extractor_ffmpeg_exports);
var import_fluent_ffmpeg = __toESM(require("fluent-ffmpeg"));
var FrameExtractorFfmpeg = class {
  getVideoDuration(videoPath) {
    return new Promise((resolve, reject) => {
      import_fluent_ffmpeg.default.ffprobe(videoPath, (err, metadata) => {
        if (err) return reject(err);
        resolve(metadata.format.duration || 0);
      });
    });
  }
  async extractFrames(video, interval, outputFolder, size, start = 0, end = null) {
    const actualEnd = end ?? video.duration;
    for (let currentTime = start; currentTime < actualEnd; currentTime += interval) {
      console.log(`Processando frame: ${currentTime} segundos`);
      await new Promise((resolve, reject) => {
        (0, import_fluent_ffmpeg.default)(video.path).on("end", () => resolve()).on("error", (err) => reject(err)).screenshots({
          timestamps: [currentTime],
          filename: `frame_at_${currentTime}.jpg`,
          folder: outputFolder,
          size
        });
      });
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FrameExtractorFfmpeg
});
