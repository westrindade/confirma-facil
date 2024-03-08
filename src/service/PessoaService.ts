import { Pessoa } from "../model/Pessoa";
import { FILE_NAME_BASE } from "../infra/config";
import * as XLSX from 'xlsx';
import { PresencaStatusEnum } from "../model/PresencaStatusEnum";
import { LayoutPlanilhaEnum } from "../model/LayoutPlannilhaEnum";
import { Utils } from "../infra/utils";
import { configDotenv } from "dotenv";

export class PessoaService {

  static async confirmaPresenca(cpf:string) : Promise<Pessoa> {
    const dataHoraConsulta = Utils.obterDataConsulta()
    let pessoa : Pessoa = buildPessoa();
    let acheiPessoa : Boolean = true;

    const cpfSemFormatacao = cpf.replace(/[.-]/g,'').replace('-','.')
    
    try {

      const workbook = XLSX.readFile(FILE_NAME_BASE);

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

            worksheet[`${LayoutPlanilhaEnum.STATUS_COLUNA}${R}`] = { t: 's', v: PresencaStatusEnum.PRESENTE };
            worksheet[`${LayoutPlanilhaEnum.DATA_REGISTRO_COLUNA}${R}`] = { t: 's', v: dataHoraConsulta };

            acheiPessoa = true
            break;
          } else {acheiPessoa = false}
        }

        XLSX.writeFile(workbook, FILE_NAME_BASE);
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
        igreja: '',cargo: '',nome: '',cpf: '',dataNascimento: '',status: PresencaStatusEnum.PRESENTE
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

  }

  static async cadastrar(pessoa:Pessoa) : Promise<string> {
    try {

      let retorno : any = {id: 1, mensagem: ''};

      const workbook = XLSX.readFile(FILE_NAME_BASE);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const sheetRef = worksheet['!ref'];
      if (sheetRef) {
        const range = XLSX.utils.decode_range(sheetRef);

        for (let R = range.s.r + 1; R <= range.e.r + 1; ++R) {
          
          const row = R;
          const cpfCelula = worksheet[`${ LayoutPlanilhaEnum.CPF_COLUNA }${row}`];
          const cpfSemFormatacaoEXCEL : string | null = cpfCelula ? String(cpfCelula.v).replace(/[.-]/g,'') : null;

          const cpfSemFormatacao = pessoa.cpf.replace(/[.-]/g,'').replace('-','.')

          if (!cpfCelula) {
            const newRow = Number(row);

            worksheet[`${LayoutPlanilhaEnum.IGREJA_COLUNA}${newRow}`] = { t: 's', v: pessoa.igreja};
            worksheet[`${LayoutPlanilhaEnum.CARGO_COLUNA}${newRow}`] = { t: 's', v: pessoa.cargo };
            worksheet[`${LayoutPlanilhaEnum.NOME_COLUNA}${newRow}`] = { t: 's', v: pessoa.nome };
            worksheet[`${LayoutPlanilhaEnum.CPF_COLUNA}${newRow}`] = { t: 's', v: pessoa.cpf };
            worksheet[`${LayoutPlanilhaEnum.DATA_NASCIMENTO_COLUNA}${newRow}`] = { t: 's', v: pessoa.dataNascimento };
            worksheet[`${LayoutPlanilhaEnum.STATUS_COLUNA}${newRow}`] = { t: 's', v: PresencaStatusEnum.CADASTRO_NOVO };
            worksheet[`${LayoutPlanilhaEnum.DATA_REGISTRO_COLUNA}${newRow}`] = { t: 's', v: Utils.obterDataConsulta() };

            retorno.id = 1
            retorno.mensagem = `CPF ${pessoa.cpf} cadastrado com sucesso`
            break;
          } else if (cpfSemFormatacaoEXCEL == cpfSemFormatacao) {
            retorno.id = 2
            retorno.mensagem = `CPF ${pessoa.cpf} já existe`
          }
        }
        XLSX.writeFile(workbook,FILE_NAME_BASE);
      } else {
        console.error('A referência da planilha ("!ref") não foi encontrada no arquivo Excel.');
      }

      if (retorno.id == 2){
        console.error(retorno.mensagem)
        throw new Error(retorno.mensagem)
      }
      return retorno.mensagem;

    } catch (error){
      console.error('Erro ao atualizar o status:', error);
      throw error;
    }
  }

  static async listar() : Promise<any> {
    var jsonArrayComIgreja;

    try {

      const workbook = XLSX.readFile(FILE_NAME_BASE);

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const sheetRef = worksheet['!ref'];
      if (sheetRef) {
        
        const jsonData : Pessoa[] = XLSX.utils.sheet_to_json(worksheet);

        jsonArrayComIgreja = jsonData.filter((obj: Pessoa) => {
          return obj.hasOwnProperty('igreja');
        });

      } else {
        console.error('A referência da planilha ("!ref") não foi encontrada no arquivo Excel.');
      }

    } catch (error){
      console.error('Erro ao atualizar o status:', error);
      throw error;
    }
    return jsonArrayComIgreja;
  }

  static async informarJustificativa(param) : Promise<string> {
    const dataHoraConsulta = Utils.obterDataConsulta()
    let acheiPessoa : Boolean = true;

    const cpfSemFormatacao = param.cpf.replace(/[.-]/g,'').replace('-','.')
    
    try {

      const workbook = XLSX.readFile(FILE_NAME_BASE);

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
            
            worksheet[`${LayoutPlanilhaEnum.STATUS_COLUNA}${R}`] = { t: 's', v: PresencaStatusEnum.JUSTIFICADO };
            worksheet[`${LayoutPlanilhaEnum.DATA_REGISTRO_COLUNA}${R}`] = { t: 's', v: dataHoraConsulta };
            worksheet[`${LayoutPlanilhaEnum.JUSTIFICATIVA}${R}`] = { t: 's', v: param.justificativa };

            acheiPessoa = true
            break;
          } else {acheiPessoa = false}
        }

        XLSX.writeFile(workbook, FILE_NAME_BASE);
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

    return "Sucesso"

  }
}