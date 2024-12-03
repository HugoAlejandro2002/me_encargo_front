import { IBoxClose } from "./boxClose";

export interface IDailyEffective {
  id_efectivo_diario: number;
  valor: number;
  cantidad: number;
  total: number;
  created_at: Date;
  updated_at: Date;
  id_cierre_caja: IBoxClose;
}
