import { object, string } from "zod";

export const LogoutDto = object({
  authorization: string(),
});

export type LogoutDtoType = Zod.infer<typeof LogoutDto>;
