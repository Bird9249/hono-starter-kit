import { number, object, string } from "zod";

const CreateUserDto = object({
  username: string().min(3).max(255),
  email: string().email(),
  password: string().min(8),
  role_ids: number().array().min(1),
});

type CreateUserDtoType = Zod.infer<typeof CreateUserDto>;

export { CreateUserDto, type CreateUserDtoType };
