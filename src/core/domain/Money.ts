export class Money {
  private constructor(private readonly _value: number) {
    if (_value < 0) {
      throw new Error('Money cannot be negative');
    }
  }

  static of(value: number): Money {
    return new Money(value);
  }

  get value(): number {
    return this._value;
  }

  add(other: Money): Money {
    return new Money(this._value + other._value);
  }

  multiply(multiplier: number): Money {
    if (multiplier < 0) {
      throw new Error('Multiplier must be non-negative');
    }
    return new Money(this._value * multiplier);
  }
} 