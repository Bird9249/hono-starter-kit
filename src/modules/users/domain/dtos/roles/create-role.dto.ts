import { array, number, object, string } from "zod";

const CreateRoleDto = object({
  name: string().min(3).max(50),
  permission_ids: array(number()),
});

type CreateRoleDtoType = Zod.infer<typeof CreateRoleDto>;

export { CreateRoleDto, type CreateRoleDtoType };
