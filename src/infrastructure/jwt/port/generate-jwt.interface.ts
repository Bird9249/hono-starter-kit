import { DurationUnit } from "date-fns";
import { JWTPayload } from "jose";

export interface IPayload extends JWTPayload {
  token_id: string;
  sub: string;
  name: string;
  role?: string;
}

export interface IGenerateJwt {
  sign(
    payload: IPayload,
    expired?: { amount: number; duration: DurationUnit }
  ): Promise<string>;

  verify(token: string): Promise<IPayload>;

  decode(token: string): IPayload;
}
