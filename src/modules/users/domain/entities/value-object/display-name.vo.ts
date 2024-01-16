export default class DisplayName {
  private readonly value: string;

  private constructor(displayName: string) {
    if (displayName.length < 3 || displayName.length > 50) {
      throw new Error("ຊື່ທີ່ສະແດງຈະຕ້ອງຢູ່ລະຫວ່າງ 3 ຫາ 50 ຕົວອັກສອນ");
    }

    this.value = displayName;
  }

  static create(displayName: string): DisplayName {
    return new DisplayName(displayName);
  }

  getValue(): string {
    return this.value;
  }
}
