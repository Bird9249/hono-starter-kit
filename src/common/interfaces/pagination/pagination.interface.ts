import { IOrderBy } from "./order-by.interface";

export interface IPaginate<Entity> extends IOrderBy<Entity> {
  offset?: number | null;
  limit?: number | null;
}
