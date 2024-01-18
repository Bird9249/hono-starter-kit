export default class Username {
  private readonly value: string;

  constructor(username: string) {
    if (username.length < 3 || username.length > 20) {
      throw new Error("ຊື່ຜູ້ໃຊ້ຕ້ອງມີຄວາມຍາວລະຫວ່າງ 3 ຮອດ 20 ຕົວອັກສອນ");
    }

    this.value = username;
  }

  getValue(): string {
    return this.value;
  }

  static create(username: string): Username {
    return new Username(username);
  }
}
