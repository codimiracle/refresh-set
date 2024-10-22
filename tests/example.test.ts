import { RefreshPolicy, RefreshSet } from "../src";

describe("testExample1", () => {

  type Element = {
    id: string;
    value: number;
  };

  const set = new RefreshSet<Element>();

  set.add({ id: '1', value: 1 });
  set.add({ id: '2', value: 2 });
  set.add({ id: '1', value: 3 });

  it('example 1 must be pass', () => {
    expect(set.toArray()).toEqual([{ id: '1', value: 3 }, { id: '2', value: 2 }]);
  });
});

describe("testExample2", () => {
  type Element = {
    key: string;
    value: number;
  };

  // default id supplier is element.id
  const set = new RefreshSet<Element>({
    idSupplier: (element) => element.key,
  });

  set.add({ key: '1', value: 1 });
  set.add({ key: '2', value: 2 });
  set.add({ key: '1', value: 3 });

  it('example 2 must be pass', () => {
    expect(set.toArray()).toEqual([{ key: '1', value: 3 }, { key: '2', value: 2 }]);
  });
});

describe("testExample3", () => {
  type Element = {
    id: string;
    value: number;
  };

  const set = new RefreshSet<Element>({
    policy: RefreshPolicy.MERGER,
    merger: (oldElement, newElement) => {
      newElement.value = oldElement.value + newElement.value;
      return newElement;
    },
  });

  set.add({ id: '1', value: 1 });
  set.add({ id: '2', value: 2 });
  set.add({ id: '1', value: 3 });

  it('example 3 must be pass', () => {
    expect(set.toArray()).toEqual([{ id: '1', value: 4 }, { id: '2', value: 2 }]);
  });
});
