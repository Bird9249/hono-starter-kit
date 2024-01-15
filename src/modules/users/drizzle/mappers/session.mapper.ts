import Session from "../../domain/entities/session.entity";
import { InsertSessionType } from "../schema";

export class SessionMapper {
  toModel(entity: Session): InsertSessionType {
    return {
      id: entity.id.getValue(),
      user_id: entity.user_id,
    };
  }
}
