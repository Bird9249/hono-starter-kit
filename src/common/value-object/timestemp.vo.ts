import { format } from "date-fns";

export default class Timestamp {
  private readonly value: string | null;

  constructor(timestamp?: Date | string | null) {
    if (timestamp === null) {
      this.value = null;
    } else {
      const dateObject = timestamp || new Date();

      this.value = format(dateObject, "yyyy-MM-dd HH:mm:ss");
    }
  }

  get getValue(): string | null {
    return this.value;
  }
}
