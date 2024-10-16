import { RefreshSet } from "../src";

describe('test1kAdd', () => {
  const refreshSet = new RefreshSet<{id: number, value: string}>();
  for (let i = 0; i < 1000; i++) {
    refreshSet.add({id: i, value: `value${i}`});
  }
  it('must be 1k element in it', () => {
    expect(refreshSet.size).toBe(1000);
  });
});

describe('test10kAdd', () => {
  const refreshSet = new RefreshSet<{id: number, value: string}>();
  for (let i = 0; i < 10000; i++) {
    refreshSet.add({id: i, value: `value${i}`});
  }
  it('must be 1k element in it', () => {
    expect(refreshSet.size).toBe(10000);
  });
});

describe('test100kAdd', () => {
  const refreshSet = new RefreshSet<{id: number, value: string}>();
  for (let i = 0; i < 100000; i++) {
    refreshSet.add({id: i, value: `value${i}`});
  }
  it('must be 1k element in it', () => {
    expect(refreshSet.size).toBe(100000);
  });
});