import { Pessoa } from '../model/Pessoa';
import { PresencaStatusEnum } from './../model/PresencaStatusEnum';
import { PessoaService } from "./PessoaService"
import _ from "lodash";

export class RelatorioService {

  static async listarSumarizacaoPresentes(): Promise<any> {
    const data = await PessoaService.listar();
    return sumarizacaoPorStatus(normalizaDados(data))

    function sumarizacaoPorStatus(arr:Pessoa[]){
      let retorno : any = {};

      let total : number  = 0;
      let totalPresente : number  = 0
      let totalAusente : number  = 0
      let totalJustificado : number  = 0

      let listTotal : any = []
      let listPresente : any = []
      let listAusente : any = []
      let listJustificado : any = []
      
      arr.map(item => {
        const key = item?.status

        switch(key){
          case PresencaStatusEnum.PRESENTE:
            totalPresente +=1;
            listPresente.push({igreja: item.igreja,cargo:item.cargo, nome:item.nome, status: item.status })
            listTotal.push({igreja: item.igreja,cargo:item.cargo, nome:item.nome, status: item.status })
            break;
          case PresencaStatusEnum.AUSENTE:
            totalAusente +=1
            listAusente.push({igreja: item.igreja,cargo:item.cargo, nome:item.nome, status: item.status })
            listTotal.push({igreja: item.igreja,cargo:item.cargo, nome:item.nome, status: item.status })
            break;
          case PresencaStatusEnum.JUSTIFICADO:
            totalJustificado +=1
            listJustificado.push({igreja: item.igreja,cargo:item.cargo, nome:item.nome, status: item.status })
            listTotal.push({igreja: item.igreja,cargo:item.cargo, nome:item.nome, status: item.status })
            break;
        }
      });

      total = totalPresente + totalAusente + totalJustificado;
        
      retorno.total = {total: total, list: listTotal}
      retorno.presente = {total: totalPresente, list: listPresente}
      retorno.ausente = {total: totalAusente, list: listAusente}
      retorno.justificativa = {total: totalJustificado, list: listJustificado}

      return retorno;
      
    }

    function normalizaDados(arr:any){

      if (!Array.isArray(arr)) {
        console.error('Input is not an array',arr);
        return arr; // or handle the error in an appropriate way
      }
      let arrReturn : any = []
      arr.forEach(element => {
        const statusNormalizado = element.status ? element.status === PresencaStatusEnum.CADASTRO_NOVO ? PresencaStatusEnum.PRESENTE : element.status
                                                 : PresencaStatusEnum.AUSENTE
        let item = {
          igreja: element.igreja,
          cargo: element.cargo,
          nome: element.nome,
          status: statusNormalizado
        }
        arrReturn.push(item)
      });
      return arrReturn;
      // return arr.map((obj) => ({        
      //   ...obj,
      //   statuS: obj.status === PresencaStatusEnum.CADASTRO_NOVO ? PresencaStatusEnum.COMPARECEU : obj.status
      // }));
    }
  }
}