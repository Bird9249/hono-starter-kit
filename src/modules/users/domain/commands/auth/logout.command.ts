import { LogoutDtoType } from "../../dtos/auth/logout.dto";

export default class LogoutCommand {
  constructor(public readonly dto: LogoutDtoType) {}
}
