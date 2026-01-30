import { Money } from '@/core/domain/Money';

describe('Money', () => {
  it('creates correctly', () => {
    const m = Money.of(1000);
    expect(m.value).toBe(1000);
  });

  it('adds values', () => {
    const a = Money.of(1000);
    const b = Money.of(2000);
    const sum = a.add(b);
    expect(sum.value).toBe(3000);
  });

  it('throws on negative value', () => {
    expect(() => Money.of(-100)).toThrow();
  });
}); 




