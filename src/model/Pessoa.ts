import { PresencaStatusEnum } from "./PresencaStatusEnum";

export interface Pessoa {
  igreja: string,
  cargo: string,
  nome: string,
  cpf: string,
  dataNascimento: string,
  status: PresencaStatusEnum
}