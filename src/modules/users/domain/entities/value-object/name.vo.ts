export default class Name {
  private readonly value: string;

  private constructor(name: string) {
    if (name.length < 3 || name.length > 50) {
      throw new Error("ຊື່ຈະຕ້ອງຢູ່ລະຫວ່າງ 3 ຫາ 50 ຕົວອັກສອນ");
    }

    this.value = name;
  }

  static create(name: string): Name {
    return new Name(name);
  }

  getValue(): string {
    return this.value;
  }
}
