import Timestamp from "../../../../common/value-object/timestemp.vo";
import UUID from "../../../../common/value-object/uuid.vo";
import Session from "../../domain/entities/session.entity";
import { SessionSchema } from "../schema";

export class SessionMapper {
  toModel(entity: Session): SessionSchema {
    return {
      id: entity.id.getValue(),
      user_id: entity.user_id,
      created_at: entity.created_at.getValue(),
    };
  }

  toEntity(model: SessionSchema): Session {
    const entity = new Session();
    entity.id = new UUID(model.id);
    entity.user_id = model.user_id;
    entity.created_at = Timestamp.create(model.created_at);
    return entity;
  }
}
