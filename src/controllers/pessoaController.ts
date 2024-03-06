import express from 'express';
import { check } from 'express-validator';
import { PessoaService } from '../service/PessoaService';
import { Pessoa } from '../model/Pessoa';

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
      case 'cadastrar': {
        return [
          check('nome', 'Nome é obrigatório.').notEmpty(),
          check('cpf', 'Cpf é obrigatório.').notEmpty(),
          check('dataNascimento', 'Data de Nascimento é obrigatório.').notEmpty(),
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
        throw new Error(`Method ${method} not implemented!`);
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

  static async cadastrar(req: express.Request, res: express.Response) {
    const pessoa : Pessoa = req.body
    try{
      const result = await PessoaService.cadastrar(pessoa);
      return res.json({ success: true, result: result });
    } catch (error:any) {
      const errorOnConsult = [{ msg: error.message }];
      console.error("Erro:",error)
      return res.json({ success: false, errors: errorOnConsult });
    }
  }
}