import express from 'express';
import { check } from 'express-validator';
import { PessoaService } from '../service/PessoaService';
import { Pessoa } from '../model/Pessoa';
import { ValidaCpf } from '../infra/validaCpf';

export class PessoaController {
  
  static validate(method: string): any[] {
    switch (method) {
      case 'confirmaPresenca': {
        return [
          check('cpf', 'Cpf é obrigatório.').notEmpty(),
          check('cpf')
            .optional({ checkFalsy: true })
            .custom(async (value, { req }) => {
              return ValidaCpf.validate(value)
            })
        ];
      }
      case 'cadastrar': {
        return [
          check('pessoa.nome', 'Nome é obrigatório.').notEmpty(),
          check('pessoa.cpf', 'Cpf é obrigatório.').notEmpty(),
          check('pessoa.dataNascimento', 'Data de Nascimento não é valida. Precisa ser inferior a 10 anos').notEmpty(),
          check('pessoa.cpf')
            .optional({ checkFalsy: true })
            .custom(async (value, { req }) => {
              return ValidaCpf.validate(value)
            })
        ];
      }
      default:
        throw new Error(`Method ${method} not implemented!`);
    }
  }

  static async confirmaPresenca(req: express.Request, res: express.Response) {
    const cpf = req.body.cpf//.replace(/\D/g, '');
    try{
      const result = await PessoaService.confirmaPresenca(cpf);
      return res.json({ success: true, result: result });
    } catch (error:any) {
      const errorOnConsult = [{ msg: error.message }];
      console.error("Erro:",error)
      return res.json({ success: false, errors: errorOnConsult });
    }
  }

  static async cadastrar(req: express.Request, res: express.Response) {
    const pessoa : Pessoa = req.body.pessoa
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