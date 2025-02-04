"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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

// src/main.ts
var import_node_path2 = __toESM(require("path"));

// src/core/domain/video-processing/entities/video.ts
var Video = class {
  constructor(path3, duration) {
    this.path = path3;
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

// src/infra/adapter/input/video-input.ts
var import_node_path = __toESM(require("path"));
var import_node_readline = __toESM(require("readline"));
var import_zod = require("zod");
var videoPathSchema = import_zod.z.string().min(1, "Path cannot be empty").refine((path3) => path3.endsWith(".mp4"), {
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

// src/infra/adapter/output/frame-extractor-ffmpeg.ts
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

// src/infra/adapter/output/zip-creator-archiver.ts
var import_node_fs2 = __toESM(require("fs"));
var import_archiver = __toESM(require("archiver"));
var ZipCreatorArchiver = class {
  createZip(sourceFolder, zipFilePath) {
    return new Promise((resolve, reject) => {
      const output = import_node_fs2.default.createWriteStream(zipFilePath);
      const archive = (0, import_archiver.default)("zip", { zlib: { level: 9 } });
      output.on("close", resolve);
      archive.on("error", reject);
      archive.pipe(output);
      archive.directory(sourceFolder, false);
      archive.finalize();
    });
  }
};

// src/main.ts
(async () => {
  console.log("Process started...");
  try {
    const { videoPath, startTime, endTime } = await getVideoInput();
    const outputFolder = import_node_path2.default.resolve(process.cwd(), "output", "Images");
    const zipFilePath = import_node_path2.default.resolve(process.cwd(), "output", "images.zip");
    const frameExtractor = new FrameExtractorFfmpeg();
    const zipCreator = new ZipCreatorArchiver();
    const useCase = new ProcessVideoUseCase(frameExtractor, zipCreator);
    await useCase.execute(
      videoPath,
      outputFolder,
      zipFilePath,
      20,
      "1920x1080",
      startTime,
      endTime
    );
    console.log("Process completed successfully.");
  } catch (error) {
    console.error("An error occurred during the process:", error);
  }
})();
