import { object, string } from "zod";

const LoginDto = object({
  username: string().min(3).max(255),
  password: string().min(8),
});

type LoginDtoType = Zod.infer<typeof LoginDto>;

export { LoginDto, type LoginDtoType };
