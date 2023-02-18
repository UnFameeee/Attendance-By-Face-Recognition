import { NextFunction, Request, Response } from "express";
// import {PythonShell} from 'python-shell';

class IndexController {
  public index = (req: Request, res: Response, next: NextFunction): void => {
    try {
      res.json({
        hello: "world"
      });
    } catch (err) {
      next(err);
    }
  }

  public python = (req: Request, res: Response, next: NextFunction): void => {
    try {
      let { PythonShell } = require('python-shell');
      var options = {
        args: [req.query.firstname, req.query.lastname]
      };
      PythonShell.run('./process.py', options, function (err: any, data: any) {
        console.log(data);
        res.send(data);
      });
    } catch (err) {
      next(err);
    }
  }
}

export default IndexController;