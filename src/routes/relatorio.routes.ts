import express from 'express';
import { BaseRoutesConfig } from './base.routes.config';
import { RelatorioController } from '../controllers/relatorioController';

export class RelatorioRoutes extends BaseRoutesConfig  {

  constructor(app: express.Application) {
    super(app, 'RelatorioRoutes');
  }

  configureRoutes(): express.Application {

    console.info(`[relatorio.routes]`);

    this.app.route('/relatorio/total')
      .get((req: express.Request, res: express.Response) => {
        res.render('relatorio/totalGeral/relatorioTotalGeral');
      })
    ;

    this.app.route('/relatorio/total/listar')
      .get(async (req: express.Request, res: express.Response) => {
        return await RelatorioController.listarSumarizacaoPresentes(req,res);
      })
    ;

    return this.app;
  }
}
