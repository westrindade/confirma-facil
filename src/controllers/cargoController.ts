import express from 'express';
import { CargoService } from '../service/CargoService';


export class CargoController {
  
  static async listarTodosCargos(req: express.Request, res: express.Response) {
    try{
      const result = await CargoService.listarCargo();
      return res.json({ success: true, result: result });
    } catch (error:any) {
      const errorOnConsult = [{ msg: error.message }];
      console.error("Erro:",error)
      return res.json({ success: false, errors: errorOnConsult });
    }
  }
}