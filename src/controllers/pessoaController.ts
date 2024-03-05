import express from 'express';
import { check } from 'express-validator';
import { PessoaService } from '../service/PessoaService';

export class PessoaController {
  
  static validate(method: string): any[] {
    switch (method) {
      case 'consultar': {
        return [
          check('cpf', 'Cpf é obrigatório.').notEmpty(),
          check('cpf')
            .optional({ checkFalsy: true })
            .custom(async (value, { req }) => {
              const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
              const cpf = value//.replace(/\D/g, '');
              if (!cpfRegex.test(cpf)) {
                console.error(`[Pessoa] Cpf ${cpf} com formato inválido.`);
                throw new Error('Cpf com formato inválido.');
              }
              return true;
            })
        ];
      }
      default:
        throw new Error('Method not implemented!');
    }
  }

  static async buscarPorCpf(req: express.Request, res: express.Response) {
    const cpf = req.body.cpf//.replace(/\D/g, '');
    try{
      const result = await PessoaService.buscarPorCpf(cpf);
      return res.json({ success: true, result: result });
    } catch (error:any) {
      const errorOnConsult = [{ msg: error.message }];
      console.error("Erro:",error)
      return res.json({ success: false, errors: errorOnConsult });
    }
  }
}