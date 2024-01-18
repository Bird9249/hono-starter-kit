import { format } from "date-fns";

export default class Timestamp {
  private readonly value: string;

  constructor(timestamp?: Date | string) {
    const dateObject = timestamp || new Date();

    this.value = format(dateObject, "yyyy-MM-dd HH:mm:ss");
  }

  static create(timestamp?: Date | string): Timestamp {
    return new Timestamp(timestamp);
  }

  getValue(): string {
    return this.value;
  }
}
