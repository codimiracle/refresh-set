# RefreshSet
a structure for set that refresh element if same id of element is exists

## Install
```bash
npm install refresh-set
```
## Usage
```typescript
import RefreshSet from 'refresh-set';

type Element = {
  id: string;
  value: number;
};

const set = new RefreshSet<Element>();

set.add({ id: '1', value: 1 });
set.add({ id: '2', value: 2 });
set.add({ id: '1', value: 3 });

console.log(set.toArray()); // [{ id: '1', value: 3 }, { id: '2', value: 2 }
```

## contributing
1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

## License
[MIT](LICENSE)
