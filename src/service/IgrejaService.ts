import { IgrejaEnum } from "../model/IgrejaEnum";


export class IgrejaService {

  static async listarIgreja(): Promise<string[]> {
    return Object.values(IgrejaEnum);
  }
}