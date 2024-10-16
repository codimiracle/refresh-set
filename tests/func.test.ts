import { RefreshPolicy, RefreshSet } from "../src";

type TestObject = { id: number, value: string };

describe('testAdd', () => {
  const refreshSet = new RefreshSet();
  it("empty set", () => {
    expect(refreshSet.size).toBe(0);
  });
});

describe('testSymbolToStringTag', () => {
  const refreshSet = new RefreshSet<TestObject>();
  refreshSet.add({ id: 1, value: 'a' });

  it('should return "RefreshSet"', () => {
    expect(refreshSet[Symbol.toStringTag]).toBe('RefreshSet');
  });
});

describe('testForEach', () => {
  const refreshSet = new RefreshSet<TestObject>();
  refreshSet.add({ id: 1, value: 'a' });
  refreshSet.add({ id: 2, value: 'b' });
  refreshSet.add({ id: 3, value: 'c' });

  it('should return 3', () => {
    expect(refreshSet.size).toBe(3);
  })

  it('should return all elements', () => {
    const result: any[] = [];
    refreshSet.forEach((item) => {
      result.push(item.value);
    });
    expect(result).toEqual(['a', 'b', 'c']);
  });
});

describe('testDelete', () => {
  const refreshSet = new RefreshSet<TestObject>();
  refreshSet.add({ id: 1, value: 'a' });
  refreshSet.add({ id: 2, value: 'b' });
  refreshSet.add({ id: 3, value: 'c' });

  it('should return true', () => {
    expect(refreshSet.delete({ id: 2, value: 'b' })).toBe(true);
  });
  it('should return false', () => {
    expect(refreshSet.delete({ id: 4, value: 'd' })).toBe(false);
  });
  it('should return 2', () => {
    expect(refreshSet.size).toBe(2);
  });
});

describe('testClear', () => {
  const refreshSet = new RefreshSet<TestObject>();
  refreshSet.add({ id: 1, value: 'a' });
  refreshSet.add({ id: 2, value: 'b' });
  refreshSet.add({ id: 3, value: 'c' });

  it('should return 3', () => {
    expect(refreshSet.size).toBe(3);
  });
  it('should return 0', () => {
    refreshSet.clear();
    expect(refreshSet.size).toBe(0);
  });
});

describe('testHas', () => {
  const refreshSet = new RefreshSet<TestObject>();
  refreshSet.add({ id: 1, value: 'a' });
  refreshSet.add({ id: 2, value: 'b' });
  refreshSet.add({ id: 3, value: 'c' });

  it('should return true', () => {
    expect(refreshSet.has({ id: 2, value: 'b' })).toBe(true);
  });
});

describe('testToArray', () => {
  const refreshSet = new RefreshSet<TestObject>();
  refreshSet.add({ id: 1, value: 'a' });
  refreshSet.add({ id: 2, value: 'b' });
  refreshSet.add({ id: 3, value: 'c' });

  it('should return 3', () => {
    expect(refreshSet.toArray().length).toBe(3);
  });
  it('should return all elements', () => {
    expect(refreshSet.toArray()).toEqual([{ id: 1, value: 'a' }, { id: 2, value: 'b' }, { id: 3, value: 'c' }]);
  });
});

describe('testIdSupplier', () => {
  const args = { idSupplier: (item: TestObject) => item.value };
  const refreshSet = new RefreshSet<TestObject>(args);
  refreshSet.add({ id: 1, value: 'a' });
  refreshSet.add({ id: 2, value: 'b' });
  refreshSet.add({ id: 3, value: 'c' });

  it('should return 3', () => {
    expect(refreshSet.size).toBe(3);
  });
  it('should return keys that is value in elements', () => {
    expect(Array.from(refreshSet.keys())).toEqual(['a', 'b', 'c']);
  });
});

describe('testNoIdSupplier', () => {
  const refreshSet = new RefreshSet<TestObject>();

  it('should throws Error', () => {
    expect(() => refreshSet.add({} as any)).toThrow('No id supplier for the element');
  });
});

describe('testInvalidId', () => {
  const args = { idSupplier: (item: TestObject) => null as any };
  const refreshSet = new RefreshSet<TestObject>(args);

  it('should throws Error', () => {
    expect(() => refreshSet.add({ id: 1, value: 'a' })).toThrow('No id for the element');
  });
});

describe('testMerger', () => {
  const args = {
    merger: (oldValue: TestObject, newValue: TestObject) => (
      { id: oldValue.id, value: oldValue.value + newValue.value }
    )
  };
  const refreshSet = new RefreshSet<TestObject>(args);
  refreshSet.add({ id: 1, value: 'a' });
  refreshSet.add({ id: 2, value: 'b' });
  refreshSet.add({ id: 3, value: 'c' });
  refreshSet.add({ id: 1, value: 'aa' });

  it('should return 3', () => {
    expect(refreshSet.size).toBe(3);
  });
  it('should return all elements that one element is merged', () => {
    expect(refreshSet.toArray()).toEqual([{ id: 1, value: 'aaa' }, { id: 2, value: 'b' }, { id: 3, value: 'c' }]);
  });
});

describe('testPolicyDiscard', () => {
  const args = { policy: RefreshPolicy.DISCARD };
  const refreshSet = new RefreshSet<TestObject>(args);
  refreshSet.add({ id: 1, value: 'a' });
  refreshSet.add({ id: 2, value: 'b' });
  refreshSet.add({ id: 3, value: 'c' });
  refreshSet.add({ id: 1, value: 'aa' });

  it('should return 3', () => {
    expect(refreshSet.size).toBe(3);
  });
  it('should return all elements that one element is remains old value', () => {
    expect(refreshSet.toArray()).toEqual([{ id: 1, value: 'a' }, { id: 2, value: 'b' }, { id: 3, value: 'c' }]);
  });
});

describe('testPolicyReplace', () => {
  const args = { policy: RefreshPolicy.REPLACE };
  const refreshSet = new RefreshSet<TestObject>(args);
  refreshSet.add({ id: 1, value: 'a' });
  refreshSet.add({ id: 2, value: 'b' });
  refreshSet.add({ id: 3, value: 'c' });
  refreshSet.add({ id: 4, value: 'd' });
  refreshSet.add({ id: 1, value: 'aa' });

  it('should return 4', () => {
    expect(refreshSet.size).toBe(4);
  });
  it('should return all elements that one element is replaced', () => {
    expect(refreshSet.toArray()).toEqual([{ id: 1, value: 'aa' }, { id: 2, value: 'b' }, { id: 3, value: 'c' }, { id: 4, value: 'd' }]);
  });
});