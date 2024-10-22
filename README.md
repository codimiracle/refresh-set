# RefreshSet
a structure for set that refresh element if same id of element is exists

[![RefreshSet CI](https://github.com/codimiracle/refresh-set/actions/workflows/refresh-set-ci.yml/badge.svg)](https://github.com/codimiracle/refresh-set/actions/workflows/refresh-set-ci.yml)
[![RefreshSet Package](https://github.com/codimiracle/refresh-set/actions/workflows/refresh-set-publish.yml/badge.svg)](https://github.com/codimiracle/refresh-set/actions/workflows/refresh-set-publish.yml)

## Install
```bash
npm install refresh-set
```
## Usage
1. using refresh set to hold elements, and update it last time
```typescript
import { RefreshSet } from 'refresh-set';

type Element = {
  id: string;
  value: number;
};

const set = new RefreshSet<Element>();

set.add({ id: '1', value: 1 });
set.add({ id: '2', value: 2 });
set.add({ id: '1', value: 3 });

console.log(set.toArray()); // [{ id: '1', value: 3 }, { id: '2', value: 2 }]
```

2. change identifier of element
```typescript
import { RefreshSet } from 'refresh-set';

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

console.log(set.toArray()); // [{ key: '1', value: 3 }, { key: '2', value: 2 }]
```

3. custom refresh method
```typescript
import { RefreshSet, RefreshPolicy } from 'refresh-set';

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

console.log(set.toArray()); // [{ id: '1', value: 4 }, { id: '2', value: 2 }]
```

## contributing
1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

## License
[MIT](LICENSE)
