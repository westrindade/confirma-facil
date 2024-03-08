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

    this.app.route('/pessoa/confirmar')
      .get((req: express.Request, res: express.Response) => {
        res.render('pessoa/confirmar-presenca');
      })
      .post(PessoaController.validate('confirmaPresenca'), async (req: express.Request, res: express.Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
          return res.json({ success: false, hcaptcha: false, errors: errors.array() });
        }
        return PessoaController.confirmaPresenca(req,res);
      })
    ;

    this.app.route('/pessoa/new')
      .get((req: express.Request, res: express.Response) => {
        res.render('pessoa/form/cadastrar');
      })
      .post(PessoaController.validate('cadastrar'), async (req: express.Request, res: express.Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
          return res.json({ success: false, hcaptcha: false, errors: errors.array() });
        }
        return PessoaController.cadastrar(req,res);
      })
    ;

    this.app.route('/pessoa/listar')
      .get((req: express.Request, res: express.Response) => {
        return PessoaController.listar(req,res);
      })
    ;

    this.app.route('/pessoa/justificativa')
      .get((req: express.Request, res: express.Response) => {
        res.render('pessoa/justificativa');
      })
      .post(PessoaController.validate('justificativa'), async (req: express.Request, res: express.Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
          return res.json({ success: false, hcaptcha: false, errors: errors.array() });
        }
        return PessoaController.informarJustificativa(req,res);
      })
    ;

    return this.app;
  }
}
