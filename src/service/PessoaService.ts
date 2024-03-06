import { Pessoa } from "../model/Pessoa";
import { BASE_URL } from "../infra/config";
import * as XLSX from 'xlsx';
import { PresencaStatusEnum } from "../model/PresencaStatusEnum";
import { LayoutPlanilhaEnum } from "../model/LayoutPlannilhaEnum";
//import fs from "fs"

export class PessoaService {

  static async buscarPorCpf(cpf:string) : Promise<Pessoa> {
    const dataHoraConsulta = retornaDataConsulta()
    let pessoa : Pessoa = buildPessoa();
    let acheiPessoa : Boolean = true;

    const cpfSemFormatacao = cpf.replace(/[.-]/g,'').replace('-','.')
    
    try {

      const workbook = XLSX.readFile(BASE_URL);

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const sheetRef = worksheet['!ref'];
      if (sheetRef) {
        const range = XLSX.utils.decode_range(sheetRef);

        for (let R = range.s.r + 1; R <= range.e.r + 1; ++R) {
          
          //CPF
          const cpfCelula = worksheet[`${ LayoutPlanilhaEnum.CPF_COLUNA }${R}`];
          const cpfSemFormatacaoEXCEL : string | null = cpfCelula ? String(cpfCelula.v).replace(/[.-]/g,'') : null;

          if (cpfSemFormatacaoEXCEL == cpfSemFormatacao) {
            
            pessoa = preenchePessoa(worksheet, R) ;

            worksheet[`${LayoutPlanilhaEnum.STATUS_COLUNA}${R}`] = { t: 's', v: PresencaStatusEnum.COMPARECEU };
            worksheet[`${LayoutPlanilhaEnum.DATA_REGISTRO_COLUNA}${R}`] = { t: 's', v: dataHoraConsulta };

            acheiPessoa = true
            break;
          } else {acheiPessoa = false}
        }

        XLSX.writeFile(workbook, BASE_URL);
      } else {
        console.error('A referência da planilha ("!ref") não foi encontrada no arquivo Excel.');
      }

    } catch (error){
      console.error('Erro ao atualizar o status:', error);
      throw error;
    }

    if (!acheiPessoa){
      throw new Error("Pessoa não encontrada")
    }

    return pessoa;

    function buildPessoa(){
      return {
        igreja: '',cargo: '',nome: '',cpf: '',dataNascimento: '',status: PresencaStatusEnum.COMPARECEU
      };
    }

    function preenchePessoa(data:any, i: Number){

      let pessoaReturn : Pessoa = buildPessoa();
    
      //IGREJA
      const igrejaCelula = data[`${ LayoutPlanilhaEnum.IGREJA_COLUNA }${i}`];
      pessoaReturn.igreja = String(igrejaCelula.v).toUpperCase()
      //CARGO
      const cargoCelula = data[`${ LayoutPlanilhaEnum.CARGO_COLUNA }${i}`];
      pessoaReturn.cargo = String(cargoCelula.v).toUpperCase()
      //NOME
      const nomeCelula = data[`${ LayoutPlanilhaEnum.NOME_COLUNA }${i}`];
      pessoaReturn.nome = String(nomeCelula.v).toUpperCase()
      // CPF
      const cpfCelula = data[`${ LayoutPlanilhaEnum.CPF_COLUNA }${i}`];
      pessoaReturn.cpf = cpfCelula.v
      // DATA NASCIMENTO
      const dataNascCelula = data[`${ LayoutPlanilhaEnum.DATA_NASCIMENTO_COLUNA }${i}`];
      pessoaReturn.dataNascimento = dataNascCelula.v

      return pessoaReturn;
    }

    function retornaDataConsulta()
    {
      const dataAtual = new Date();

      const dia = String(dataAtual.getDate()).padStart(2, '0');
      const mes = String(dataAtual.getMonth() + 1).padStart(2, '0'); // O mês é baseado em zero
      const ano = String(dataAtual.getFullYear());
      const hora = String(dataAtual.getHours()).padStart(2, '0');
      const minutos = String(dataAtual.getMinutes()).padStart(2, '0');
      const segundos = String(dataAtual.getSeconds()).padStart(2, '0');

      return `${dia}/${mes}/${ano} ${hora}:${minutos}:${segundos}`;
    }
  }

  static async cadastrar(pessoa:Pessoa) : Promise<string> {
    const pessoaNew : Pessoa = pessoa;
    try {

      const workbook = XLSX.readFile(BASE_URL);

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const sheetRef = worksheet['!ref'];
      if (sheetRef) {
        const lastRow = sheetRef.split(':')[1].replace(/[A-Za-z]/g, '');
        const newRow = Number(lastRow) +1;

        worksheet[`${LayoutPlanilhaEnum.IGREJA_COLUNA}${newRow}`] = { t: 's', v: pessoaNew.igreja};
        worksheet[`${LayoutPlanilhaEnum.CARGO_COLUNA}${newRow}`] = { t: 's', v: pessoaNew.cargo };
        worksheet[`${LayoutPlanilhaEnum.NOME_COLUNA}${newRow}`] = { t: 's', v: pessoaNew.nome };
        worksheet[`${LayoutPlanilhaEnum.CPF_COLUNA}${newRow}`] = { t: 's', v: pessoaNew.cpf };
        worksheet[`${LayoutPlanilhaEnum.DATA_NASCIMENTO_COLUNA}${newRow}`] = { t: 's', v: pessoaNew.dataNascimento };
        worksheet[`${LayoutPlanilhaEnum.STATUS_COLUNA}${newRow}`] = { t: 's', v: PresencaStatusEnum.CADASTR_NOVO };
        worksheet[`${LayoutPlanilhaEnum.DATA_REGISTRO_COLUNA}${newRow}`] = { t: 's', v: retornaDataConsulta() };
  
        // console.log('BASE_URL',BASE_URL)
        // console.log('worksheet',worksheet)
        //console.log('workbook',workbook)
        XLSX.writeFile(workbook,BASE_URL);

      } else {
        console.error('A referência da planilha ("!ref") não foi encontrada no arquivo Excel.');
      }

      return 'Sucesso';

    } catch (error){
      console.error('Erro ao atualizar o status:', error);
      throw error;
    }

    function retornaDataConsulta()
    {
      const dataAtual = new Date();

      const dia = String(dataAtual.getDate()).padStart(2, '0');
      const mes = String(dataAtual.getMonth() + 1).padStart(2, '0'); // O mês é baseado em zero
      const ano = String(dataAtual.getFullYear());
      const hora = String(dataAtual.getHours()).padStart(2, '0');
      const minutos = String(dataAtual.getMinutes()).padStart(2, '0');
      const segundos = String(dataAtual.getSeconds()).padStart(2, '0');

      return `${dia}/${mes}/${ano} ${hora}:${minutos}:${segundos}`;
    }

  }
}