import { CreateUserDto } from "./create-user.dto";

const UpdateUserDto = CreateUserDto.omit({ password: true });

type UpdateUserDtoType = Zod.infer<typeof UpdateUserDto>;

export { UpdateUserDto, type UpdateUserDtoType };
