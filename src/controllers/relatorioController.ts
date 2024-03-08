import express from 'express';
import { RelatorioService } from '../service/RelatorioService';


export class RelatorioController {
  
  static async listarSumarizacaoPresentes(req: express.Request, res: express.Response) {
    try{
      const result = await RelatorioService.listarSumarizacaoPresentes();
      return res.json({ success: true, result: result });
    } catch (error:any) {
      const errorOnConsult = [{ msg: error.message }];
      console.error("Erro:",error)
      return res.json({ success: false, errors: errorOnConsult });
    }
  }
}