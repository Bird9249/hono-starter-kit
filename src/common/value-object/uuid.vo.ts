export default class UUID {
  private readonly value: string;

  private constructor(uuid: string) {
    const uuidRegex =
      /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;
    if (!uuidRegex.test(uuid)) {
      throw new Error("ຮູບແບບ UUID ບໍ່ຖືກຕ້ອງ");
    }

    this.value = uuid;
  }

  static generate(): UUID {
    const newUuid = crypto.randomUUID();
    return new UUID(newUuid);
  }

  getValue(): string {
    return this.value;
  }
}
