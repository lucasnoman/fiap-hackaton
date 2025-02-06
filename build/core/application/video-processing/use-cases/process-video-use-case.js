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

// src/core/application/video-processing/use-cases/process-video-use-case.ts
var process_video_use_case_exports = {};
__export(process_video_use_case_exports, {
  ProcessVideoUseCase: () => ProcessVideoUseCase
});
module.exports = __toCommonJS(process_video_use_case_exports);

// src/core/domain/video-processing/entities/video.ts
var Video = class {
  constructor(path, duration) {
    this.path = path;
    this.duration = duration;
    if (duration < 0) {
      throw new Error("Invalid video duration");
    }
  }
};

// src/core/application/video-processing/services/directory-service.ts
var import_node_fs = __toESM(require("fs"));
var DirectoryService = class {
  /**
   * Verifies if a directory exists, and creates it if it doesn't.
   * @param dirPath - The path of the directory to check/create.
   */
  static ensureDirectoryExists(dirPath) {
    if (!import_node_fs.default.existsSync(dirPath)) {
      import_node_fs.default.mkdirSync(dirPath, { recursive: true });
      console.log(`Directory created: ${dirPath}
`);
    }
  }
};

// src/core/application/video-processing/use-cases/process-video-use-case.ts
var ProcessVideoUseCase = class {
  constructor(frameExtractor, zipCreator) {
    this.frameExtractor = frameExtractor;
    this.zipCreator = zipCreator;
  }
  async execute(videoPath, outputFolder, zipFilePath, interval, imageSize, startTime, endTime) {
    DirectoryService.ensureDirectoryExists(outputFolder);
    const videoDuration = await this.frameExtractor.getVideoDuration(videoPath);
    const video = new Video(videoPath, videoDuration);
    await this.frameExtractor.extractFrames(
      video,
      interval,
      outputFolder,
      imageSize,
      startTime,
      endTime
    );
    await this.zipCreator.createZip(outputFolder, zipFilePath);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ProcessVideoUseCase
});
