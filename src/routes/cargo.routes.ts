import express from 'express';
import { BaseRoutesConfig } from './base.routes.config';
import { validationResult } from 'express-validator';
import { CargoController } from '../controllers/cargoController';

export class CargoRoutes extends BaseRoutesConfig  {

  constructor(app: express.Application) {
    super(app, 'CargoRoutes');
  }

  configureRoutes(): express.Application {

    console.info(`[cargo.routes]`);

    this.app.route('/cargo/listarTodosCargos')
      .get((req: express.Request, res: express.Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
          return res.json({ success: false, hcaptcha: false, errors: errors.array() });
        }

        return CargoController.listarTodosCargos(req,res);
      })
    ;
    return this.app;
  }
}
