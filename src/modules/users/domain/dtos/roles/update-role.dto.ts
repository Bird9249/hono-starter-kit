import { CreateRoleDto } from "./create-role.dto";

const UpdateRoleDto = CreateRoleDto;

type UpdateRoleDtoType = Zod.infer<typeof UpdateRoleDto>;

export { UpdateRoleDto, type UpdateRoleDtoType };
