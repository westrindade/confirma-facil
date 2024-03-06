import express from 'express';
import { BaseRoutesConfig } from './base.routes.config';
import { validationResult } from 'express-validator';
import { IgrejaController } from '../controllers/igrejaController';

export class IgrejaRoutes extends BaseRoutesConfig  {

  constructor(app: express.Application) {
    super(app, 'IgrejaRoutes');
  }

  configureRoutes(): express.Application {

    console.info(`[igreja.routes]`);

    this.app.route('/igreja/listarTodasIgrejas')
      .get((req: express.Request, res: express.Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
          return res.json({ success: false, hcaptcha: false, errors: errors.array() });
        }

        return IgrejaController.listarTodasIgrejas(req,res);
      })
    ;
    return this.app;
  }
}
