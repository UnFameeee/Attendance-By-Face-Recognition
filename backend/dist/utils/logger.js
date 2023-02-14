"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stream = exports.logger = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const winston_1 = __importDefault(require("winston"));
// logs dir
const logDir = (0, path_1.join)(__dirname, "../../logs");
if (!(0, fs_1.existsSync)(logDir)) {
    (0, fs_1.mkdirSync)(logDir);
}
// Define log format
const logFormat = winston_1.default.format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`);
/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */
const logger = winston_1.default.createLogger({
    format: winston_1.default.format.combine(winston_1.default.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
    }), logFormat),
    // transports: [
    //   // debug log setting
    //   new winstonDaily({
    //     level: 'debug',
    //     datePattern: 'YYYY-MM-DD',
    //     dirname: logDir + '/debug', // log file /logs/debug/*.log in save
    //     filename: `%DATE%.log`,
    //     maxFiles: 30, // 30 Days saved
    //     json: false,
    //     zippedArchive: true,
    //   }),
    //   // error log setting
    //   new winstonDaily({
    //     level: 'error',
    //     datePattern: 'YYYY-MM-DD',
    //     dirname: logDir + '/error', // log file /logs/error/*.log in save
    //     filename: `%DATE%.log`,
    //     maxFiles: 30, // 30 Days saved
    //     handleExceptions: true,
    //     json: false,
    //     zippedArchive: true,
    //   }),
    // ],
});
exports.logger = logger;
logger.add(new winston_1.default.transports.Console({
    format: winston_1.default.format.combine(winston_1.default.format.splat(), winston_1.default.format.colorize()),
}));
const stream = {
    write: (message) => {
        logger.info(message.substring(0, message.lastIndexOf('\n')));
    },
};
exports.stream = stream;
