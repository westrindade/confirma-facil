import express from 'express';
import { IgrejaService } from '../service/IgrejaService';

export class IgrejaController {
  
  static async listarTodasIgrejas(req: express.Request, res: express.Response) {
    try{
      const result = await IgrejaService.listarIgreja();
      return res.json({ success: true, result: result });
    } catch (error:any) {
      const errorOnConsult = [{ msg: error.message }];
      console.error("Erro:",error)
      return res.json({ success: false, errors: errorOnConsult });
    }
  }
}