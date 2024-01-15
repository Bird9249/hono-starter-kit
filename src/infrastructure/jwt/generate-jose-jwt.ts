import { Duration, add } from "date-fns";
import { SignJWT, decodeJwt, jwtVerify } from "jose";
import { Service } from "typedi";
import { IGenerateJwt, IPayload } from "./port/generate-jwt.interface";
import { jwtSecret } from "./secret";

@Service()
export default class GenerateJoseJwt implements IGenerateJwt {
  async sign(
    payload: IPayload,
    expired?: { amount: number; duration: keyof Duration } | undefined
  ): Promise<string> {
    const jwt = new SignJWT(payload).setProtectedHeader({ alg: "HS256" });

    if (expired) {
      const currentDate = new Date();
      const exp = add(currentDate, {
        [expired.duration]: expired.amount,
      });

      jwt.setExpirationTime(exp);
    }

    return await jwt.sign(jwtSecret);
  }

  async verify(token: string): Promise<IPayload> {
    const { payload } = await jwtVerify<IPayload>(token, jwtSecret);
    return payload;
  }

  decode(token: string): IPayload {
    return decodeJwt<IPayload>(token);
  }
}
