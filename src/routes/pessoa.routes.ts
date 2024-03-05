import express from 'express';
import { BaseRoutesConfig } from './base.routes.config';
import { validationResult } from 'express-validator';
import { PessoaController } from '../controllers/pessoaController';
//import path from 'path';

export class PessoaRoutes extends BaseRoutesConfig  {

  constructor(app: express.Application) {
    super(app, 'PessoaRoutes');
  }

  configureRoutes(): express.Application {

    console.info(`[pessoa.routes]`);

    this.app.route('/pessoa/consultar')
      .get((req: express.Request, res: express.Response) => {
        res.render('pessoa/consultar');
      })
      .post(PessoaController.validate('consultar'), async (req: express.Request, res: express.Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
          return res.json({ success: false, hcaptcha: false, errors: errors.array() });
        }
        return PessoaController.buscarPorCpf(req,res);
      })
    ;

    return this.app;
  }
}
