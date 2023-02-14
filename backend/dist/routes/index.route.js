"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_controller_1 = __importDefault(require("../controllers/index.controller"));
const express_1 = require("express");
class IndexRoute {
    constructor() {
        this.path = "/";
        this.router = (0, express_1.Router)();
        this.indexController = new index_controller_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(`${this.path}`, this.indexController.index);
        this.router.get(`${this.path}python`, this.indexController.python);
    }
}
exports.default = IndexRoute;
