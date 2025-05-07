export class IncrementingValue {
    private _value: number;
  
    constructor(initialValue: number = -1) {
      this._value = initialValue;
    }
  
    get value(): number {
      this._value++;
      return this._value;
    }
  }