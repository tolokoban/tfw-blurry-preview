"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cfg_json_1 = __importDefault(require("./cfg.json"));
var blurry_view_1 = __importDefault(require("./view/blurry-view"));
exports.default = {
    version: cfg_json_1.default.version,
    BlurryView: blurry_view_1.default
};
//# sourceMappingURL=index.js.map