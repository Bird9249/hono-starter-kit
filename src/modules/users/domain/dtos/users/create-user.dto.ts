import { object, string } from 'zod'

const CreateUserDto = object({
  username: string().min(3).max(255),
  email: string().email(),
  password: string().min(8),
})

type CreateUserDtoType = Zod.infer<typeof CreateUserDto>

export { CreateUserDto, type CreateUserDtoType }
