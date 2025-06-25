import { connect, db, disconnect } from '../00_connection';

type Size = {
  h: number,
  w: number,
  uom: string,
}

type Inventory = {
  item: string,
  qty: number,
  size: Size,
  status: string,
}

const data: Array<Inventory> = [
  {
    item: 'journal',
    qty: 25,
    size: { h: 14, w: 21, uom: 'cm' },
    status: 'A'
  },
  {
    item: 'notebook',
    qty: 50,
    size: { h: 8.5, w: 11, uom: 'in' },
    status: 'A'
  },
  {
    item: 'paper',
    qty: 100,
    size: { h: 8.5, w: 11, uom: 'in' },
    status: 'D'
  },
  {
    item: 'planner',
    qty: 75,
    size: { h: 22.85, w: 30, uom: 'cm' },
    status: 'D'
  },
  {
    item: 'postcard',
    qty: 45,
    size: { h: 10, w: 15.25, uom: 'cm' },
    status: 'A'
  }
];

beforeAll(async () => {
  await connect();
  await db.collection('inventory').insertMany(data);
})


test('should selected all inventory data', async () => {
  const cursor = db.collection('inventory').find({});
  const res = await cursor.toArray();

  expect(res).toBeDefined();

  expect(res.length).toBe(data.length);

  data.forEach(i => expect(res).toContainEqual(i));
});

test('should select inventory for status equals "D" ', async () => {
  const dataExpect = data.filter(i => i.status == 'D');

  const cursor = db.collection('inventory').find({ status: 'D' });
  const res = await cursor.toArray();

  expect(res).toBeDefined();

  expect(res.length).toBe(dataExpect.length);

  dataExpect.forEach(i => expect(res).toContainEqual(i));
});

test('should select inventory for status in "A" or "D" ', async () => {
  const dataExpect = data.filter(i => i.status == 'A' || i.status == 'D');

  const cursor = db.collection('inventory').find({ status: { $in: ['A', 'D']}});
  const res = await cursor.toArray();

  expect(res).toBeDefined();

  expect(res.length).toBe(dataExpect.length);

  dataExpect.forEach(i => expect(res).toContainEqual(i));
});

test('should select inventory for status equals "A" and qty less than 30', async () => {
  const dataExpect = data.filter(i => i.status == 'A' && i.qty < 30);

  const cursor = db.collection('inventory').find({ status: 'A', qty: {$lt: 30}});
  const res = await cursor.toArray();

  expect(res).toBeDefined();

  expect(res.length).toBe(dataExpect.length);

  dataExpect.forEach(i => expect(res).toContainEqual(i));
});

test('should select inventory for status equals "A" or qty less than 30', async () => {
  const dataExpect = data.filter(i => i.status == 'A' || i.qty < 30);

  const cursor = db.collection('inventory').find({ $or: [{ status: 'A' }, {qty: {$lt: 30}}]});
  const res = await cursor.toArray();

  expect(res).toBeDefined();

  expect(res.length).toBe(dataExpect.length);

  dataExpect.forEach(i => expect(res).toContainEqual(i));
});

test('should select inventory for status equals "A" and (qty less than 30 or item first caracter is "p")', async () => {
  const dataExpect = data.filter(i => i.status == 'A' && (i.qty < 30 || i.item[0] == "p"));

  const cursor = db.collection('inventory').find({status: 'A', $or: [{qty: {$lt: 30}}, {item: {$regex: '^p'}}]});
  const res = await cursor.toArray();

  expect(res).toBeDefined();

  expect(res.length).toBe(dataExpect.length);

  dataExpect.forEach(i => expect(res).toContainEqual(i));
});


afterAll(disconnect);

