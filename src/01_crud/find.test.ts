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

const execTest = async (lambdaFilter: (i) => boolean, findSelect: Object) => {
  const dataExpect = data.filter(lambdaFilter);

  const cursor = db.collection('inventory').find(findSelect);
  const res = await cursor.toArray();

  expect(res).toBeDefined();

  expect(res.length).toBe(dataExpect.length);

  dataExpect.forEach(i => expect(res).toContainEqual(i));
}

beforeAll(async () => {
  await connect();
  await db.collection('inventory').insertMany(data);
})


test('should selected all inventory data', async () => {
  
  const lambdaFilter = i => true;

  const paramFind = {};

  await execTest(lambdaFilter, paramFind);
});

test('should select inventory for status equals "D" ', async () => {
  
  const lambdaFilter = i => i.status == 'D';

  const paramFind = { status: 'D' };

  await execTest(lambdaFilter, paramFind);
});

test('should select inventory for status in "A" or "D" ', async () => {
  
  const lambdaFilter = i => i.status == 'A' || i.status == 'D';

  const paramFind = { status: { $in: ['A', 'D']}};

  await execTest(lambdaFilter, paramFind);
});

test('should select inventory for status equals "A" and qty less than 30', async () => {
  
  const lambdaFilter = i => i.status == 'A' && i.qty < 30;

  const paramFind = { status: 'A', qty: {$lt: 30}};

  await execTest(lambdaFilter, paramFind);
});

test('should select inventory for status equals "A" or qty less than 30', async () => {
  
  const lambdaFilter = i => i.status == 'A' || i.qty < 30;

  const paramFind = { $or: [{ status: 'A' }, {qty: {$lt: 30}}]};

  await execTest(lambdaFilter, paramFind);
});

test('should select inventory for status equals "A" and (qty less than 30 or item first caracter is "p")', async () => {
  
  const lambdaFilter = i => i.status == 'A' && (i.qty < 30 || i.item[0] == "p");

  const paramFind = {status: 'A', $or: [{qty: {$lt: 30}}, {item: {$regex: '^p'}}]};

  await execTest(lambdaFilter, paramFind);
});

test('should select inventory for status equals "A" and (qty less than 30 or item first caracter is "p")', async () => {
  
  const lambdaFilter = i => i.status == 'A' && (i.qty < 30 || i.item[0] == "p");

  const paramFind = {status: 'A', $or: [{qty: {$lt: 30}}, {item: {$regex: '^p'}}]};

  await execTest(lambdaFilter, paramFind);
});

// find in embedded document
test('should select inventory for size.uom equals "in"', async () => {

  const lambdaFilter = i => i.size.uom == "in";

  const paramFind = {'size.uom': 'in'};

  await execTest(lambdaFilter, paramFind);
});

test('should select inventory for size.l less than 15', async () => {

  const lambdaFilter = i => i.size.h < 15;

  const paramFind = {'size.h': {$lt: 15}};

  await execTest(lambdaFilter, paramFind);
});

test('should select inventory for size.l less than 15 and size.uom equals to "in" and status equals to "D"', async () => {

  const lambdaFilter = i => i.size.h < 15 && i.size.uom == 'in' && status == 'D';

  const paramFind = {'size.h': {$lt: 15}, 'size.uom': 'in', status: 'D'};

  await execTest(lambdaFilter, paramFind);
});

test('should select inventory for size equals to { h: 14, w: 21, uom: "cm" }', async () => {

  const lambdaFilter = i => i.size == { h: 14, w: 21, uom: 'cm' };

  const paramFind = {size: { h: 14, w: 21, uom: 'cm' }}; // esse método de busca não é aconcelhado, porque é necessario uma correspondencia exata, se mudar a ordem dos campos já não reconhece 

  await execTest(lambdaFilter, paramFind);
});

afterAll(disconnect);

