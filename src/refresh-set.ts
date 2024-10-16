/**
 * turn element or digest element to unique id
 * @param element the element to add into set
 * @returns id of the element
 */
export const DEFAULT_ID_SUPPLIER = (element: any) => {
  if (Object.hasOwnProperty.call(element, 'id')) {
    return element.id;
  } else if (Object.hasOwnProperty.call(element, 'getId')) {
    return (typeof element.getId == 'function' && element.getId());
  }
  throw new Error('No id supplier for the element');
};

/**
 * default merger that just returns newValue
 * @param oldValue the old value
 * @param newValue the new value
 * @returns merged value
 */
export const DEFAULT_MERGER = (oldValue: any, newValue: any) => {
  return newValue;
}

/**
 * Policy for refresh set
 */
export enum RefreshPolicy {
  /**
   * Discards adding value, if it already exists in the set
   */
  DISCARD,
  /**
   * Replaces the value, if it already exists in the set
   */
  REPLACE,
  /**
   * Merges the value, if it already exists in the set
   */
  MERGER,
}

export type ConstructorArgs<T> = {
  /**
   * get or digest object to id
   * @param element the element to add into set
   * @returns id of the element
   */
  idSupplier?: (element: T) => string;
  /**
   * merger for the refresh set
   */
  policy?: RefreshPolicy;
  /**
   * merger for the refresh set
   * @param oldValue the old value
   * @param newValue the new value
   * @returns merged value
   */
  merger?: (oldValue: T, newValue: T) => any;
}

/**
 * Refresh set iterator implements iterator protocol
 */
export class RefreshSetIterator<T> implements IterableIterator<T> {
  private _iterator: IterableIterator<any>;
  private _values: { [key: string]: T | undefined } | undefined;
  private _multiple: boolean;

  public constructor(iterator: IterableIterator<string | string[]>, values: { [key: string]: T | undefined } | undefined, multiple: boolean) {
    this._iterator = iterator;
    this._values = values;
    this._multiple = multiple;
  }
  [Symbol.iterator](): IterableIterator<T> {
    return this;
  }
  next(...args: [] | [undefined]): IteratorResult<T, any> {
    const result = this._iterator.next(...args);
    if (result.done) {
      return result;
    }
    if (!this._values) {
      return { value: result.value, done: false };
    }
    // entry with key and value
    if (this._multiple && Array.isArray(result.value)) {
      const resultValue = result.value as [string, string];
      return { value: [resultValue[0], this._values[resultValue[1]]] as T, done: false }
    }
    // simple value
    const value = this._values[result.value];
    if (!value) {
      throw new Error('illegal state for iterator');
    }
    return { value, done: false }
  }
}

/**
 * Refresh set
 * a set that can be refreshed with new values or custom way of merging
 * @typeparam T the type of elements in the set
 * 
 * @author codimiracle
 * @since 1.0.0
 */
export class RefreshSet<T> {
  private _set: Set<string>;
  private _values: { [key: string]: T | undefined };
  private _idSupplier!: (element: T) => string;
  private _merger!: (oldValue: T, newValue: T) => T;
  private _policy!: RefreshPolicy;

  constructor(args?: ConstructorArgs<T>) {
    const { idSupplier, policy, merger } = args || {
      idSupplier: DEFAULT_ID_SUPPLIER,
      policy: RefreshPolicy.REPLACE,
      merger: DEFAULT_MERGER,
    };
    this._set = new Set<string>();
    this._values = {};
    this._idSupplier = idSupplier || DEFAULT_ID_SUPPLIER;
    this._policy = typeof policy == 'undefined' || policy == null ? (merger ? RefreshPolicy.MERGER : RefreshPolicy.REPLACE) : policy;
    this._merger = merger || DEFAULT_MERGER;
  }
  /**
   * add a value into the set
   * @param value the value to add
   * @returns this refresh set
   */
  add(value: T): this {
    const id = this._idSupplier(value);
    if (typeof id == 'undefined' || id == null) {
      throw new Error('No id for the element');
    }
    this._set.add(id);
    if (typeof this._values[id] == 'undefined') {
      this._values[id] = value;
      return this;
    }
    switch (this._policy) {
      case RefreshPolicy.DISCARD:
        return this;
      case RefreshPolicy.REPLACE:
        this._values[id] = value;
        return this;
      case RefreshPolicy.MERGER:
        const oldValue = this._values[id];
        if (!oldValue) {
          throw new Error('illegal state for merger');
        }
        const mergedValue = this._merger(oldValue, value);
        if (!mergedValue) {
          throw new Error('illegal value for merger, it should return non null value');
        }
        this._values[id] = mergedValue;
        return this;
    }
  }
  /**
   * clear the set
   */
  clear(): void {
    this._set.clear();
    this._values = {};
  }
  /**
   * delete value from the set
   * @param value the value to delete
   * @returns true if the value is deleted, false otherwise
   */
  delete(value: T): boolean {
    const id = this._idSupplier(value);
    const result = this._set.delete(id)
    if (result) {
      this._values[id] = undefined;
    }
    return result;
  }
  /**
   * traverses the set
   * @param callbackfn a function that accepts up to three arguments. The every method calls the callbackfn function for each element in the set until the callbackfn returns a value which is coercible to the Boolean value false, or until the end of the set.
   * @param thisArg this refresh set
   */
  forEach(callbackfn: (value: T, value2: T, set: RefreshSet<T>) => void, thisArg?: any): void {
    this._set.forEach((key, key2, thisArg) => {
      const value = this._values[key];
      const value2 = this._values[key2]
      callbackfn(value as T, value2 as T, this);
    });
  }
  /**
   * check if the set contains the value
   * @param value the value to check
   * @returns true if the set contains the value, false otherwise
   */
  has(value: T): boolean {
    const id = this._idSupplier(value);
    return this._set.has(id);
  }

  /**
   * get the size of the set
   */
  get size(): number {
    return this._set.size;
  }

  /**
   * get the entries iterator of the set
   * @returns an iterator over the values in the set
   */
  entries(): IterableIterator<[string, T]> {
    return new RefreshSetIterator<[string, T]>(this._set.entries(), this._values as any, true);
  }
  /**
   * get the keys iterator of the set
   * @returns an iterator over the keys in the set
   */
  keys(): IterableIterator<string> {
    return new RefreshSetIterator<string>(this._set.keys(), undefined, false);
  }
  /**
   * get the values iterator of the set
   * @returns an iterator over the values in the set
   */
  values(): IterableIterator<T> {
    return new RefreshSetIterator(this._set.values(), this._values, false);
  }
  /**
   * get the iterator of the set
   * @returns an iterator over the values in the set
   */
  get [Symbol.iterator]() {
    return this.values
  }
  /**
   * get the string representation of the set
   */
  get [Symbol.toStringTag]() {
    return 'RefreshSet';
  }
  /**
   * convert the set to an array
   * @returns an array of the values in the set
   */
  toArray() {
    return Object.values(this._values).filter(e => !!e);
  }
}
