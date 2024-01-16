export default class IsDefault {
  private readonly value: boolean;

  private constructor(isDefault: boolean) {
    this.value = isDefault;
  }

  static create(isDefault: boolean): IsDefault {
    return new IsDefault(isDefault);
  }

  getValue(): boolean {
    return this.value;
  }
}
