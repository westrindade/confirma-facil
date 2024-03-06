import { CargoEnum } from "../model/CargoEnum";

export class CargoService {

  static async listarCargo(): Promise<string[]> {
    return Object.values(CargoEnum);
  }
}