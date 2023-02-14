"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import {PythonShell} from 'python-shell';
class IndexController {
    constructor() {
        this.index = (req, res, next) => {
            try {
                console.log("lmao");
                res.json({
                    hello: "world"
                });
            }
            catch (err) {
                next(err);
            }
        };
        this.python = (req, res, next) => {
            try {
                let { PythonShell } = require('python-shell');
                var options = {
                    args: [req.query.firstname, req.query.lastname]
                };
                PythonShell.run('./process.py', options, function (err, data) {
                    console.log(data);
                    console.log(err);
                    console.log(options);
                    // res.send(data);
                });
                res.json({
                    hello: "world"
                });
            }
            catch (err) {
                next(err);
            }
        };
    }
}
exports.default = IndexController;
