import { RefreshSet, RefreshSetIterator } from "../src"

describe('testEntriesIter', () => {
  const refreshSet = new RefreshSet<{id: number, value: string}>();
  refreshSet.add({id: 1, value: 'a'});
  
  it('should return an iterator', () => {
    const iter = refreshSet.entries();
    expect(iter).toBeInstanceOf(RefreshSetIterator);
  });
});

describe('testEntriesIterNext', () => {
  const refreshSet = new RefreshSet<{id: number, value: string}>();
  refreshSet.add({id: 1, value: 'a'});

  it('should return target element', () => {
    const iter = refreshSet.entries();
    const next = iter.next();
    expect(next.done).toBe(false);
    expect(next.value).toEqual([1, {id: 1, value: 'a'}]);
    expect(iter.next().done).toBe(true);
  });
});

describe('testValuesIter', () => {
  const refreshSet = new RefreshSet<{id: number, value: string}>();
  refreshSet.add({id: 1, value: 'a'});

  it('should return an iterator', () => {
    const iter = refreshSet.values();
    expect(iter).toBeInstanceOf(RefreshSetIterator);
  });
});

describe('testValuesIterNext', () => {
  const refreshSet = new RefreshSet<{id: number, value: string}>();
  refreshSet.add({id: 1, value: 'a'});

  it('should return target element', () => {
    const iter = refreshSet.values();
    const next = iter.next();
    expect(next.done).toBe(false);
    expect(next.value).toEqual({id: 1, value: 'a'});
    expect(iter.next().done).toBe(true);
  });
});

describe('testKeysIter', () => {
  const refreshSet = new RefreshSet<{id: number, value: string}>();
  refreshSet.add({id: 1, value: 'a'});

  it('should return an iterator', () => {
    const iter = refreshSet.keys();
    expect(iter).toBeInstanceOf(RefreshSetIterator);
  });
});

describe('testKeysIterNext', () => {
  const refreshSet = new RefreshSet<{id: number, value: string}>();
  refreshSet.add({id: 1, value: 'a'});

  it('should return target element', () => {
    const iter = refreshSet.keys();
    const next = iter.next();
    expect(next.done).toBe(false);
    expect(next.value).toEqual(1);
    expect(iter.next().done).toBe(true);
  });
});

describe('testSymbolIter', () => {
  const refreshSet = new RefreshSet<{id: number, value: string}>();
  refreshSet.add({id: 1, value: 'a'});

  it('should return an iterator', () => {
    const iter = refreshSet[Symbol.iterator]();
    expect(iter).toBeInstanceOf(RefreshSetIterator);
  });
});

describe('testSymbolIterNext', () => {
  const refreshSet = new RefreshSet<{id: number, value: string}>();
  refreshSet.add({id: 1, value: 'a'});

  it('should return a element', () => {
    const iter = refreshSet[Symbol.iterator]();
    const next = iter.next();
    expect(next.done).toBe(false);
    expect(next.value).toEqual({id: 1, value: 'a'});
    expect(iter.next().done).toBe(true);
  });
});
