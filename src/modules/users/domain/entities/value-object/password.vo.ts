export default class Password {
  private readonly value: string

  constructor(password: string) {
    const minPasswordLength = 8
    if (password.length < minPasswordLength) {
      throw new Error(`ລະຫັດຜ່ານຕ້ອງມີຄວາມຍາວຢ່າງໜ້ອຍ ${minPasswordLength} ຕົວອັກສອນ`)
    }

    this.value = password
  }

  get getValue(): string {
    return this.value
  }
}
