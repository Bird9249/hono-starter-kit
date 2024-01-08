export default class Email {
  private readonly value: string

  constructor(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new Error('ຮູບແບບອີເມວບໍ່ຖືກຕ້ອງ')
    }

    this.value = email
  }

  get getValue(): string {
    return this.value
  }
}
