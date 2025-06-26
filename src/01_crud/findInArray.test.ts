import { connect, db, disconnect } from '../00_connection';

type Inventory = {
  item: string,
  qty: number,
  tags: Array<string>,
  dim_cm: Array<number>,
}

const data: Array<Inventory> = [
  {
    item: 'journal',
    qty: 25,
    tags: ['blank', 'red'] as Array<string>,
    dim_cm: [14, 21] as Array<number>,
  },
  {
    item: 'notebook',
    qty: 50,
    tags: ['red', 'blank'] as Array<string>,
    dim_cm: [14, 21] as Array<number>,
  },
  {
    item: 'paper',
    qty: 100,
    tags: ['red', 'blank', 'plain'] as Array<string>,
    dim_cm: [14, 21] as Array<number>,
  },
  {
    item: 'planner',
    qty: 75,
    tags: ['blank', 'red'] as Array<string>,
    dim_cm: [22.85, 30] as Array<number>,
  },
  {
    item: 'postcard',
    qty: 45,
    tags: ['blue'] as Array<string>,
    dim_cm: [10, 15.25] as Array<number>,
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


test('should selecte inventory tags is exactly ["red", "blank"]', async () => {
  
  const lambdaFilter = i => i.tags.toString() == ["red", "blank"].toString();

  const paramFind = {tags: ["red", "blank"]};

  await execTest(lambdaFilter, paramFind);
});

test('should selecte inventory tags is includes ["red", "blank"]', async () => {
  
  const lambdaFilter = i => i.tags.includes("red") && i.tags.includes("blank");

  const paramFind = {tags: { $all: ["red", "blank"]}};

  await execTest(lambdaFilter, paramFind);
});

test('should selecte inventory tags is includes "red"', async () => {

  const lambdaFilter = i => i.tags.includes("red");

  const paramFind = {tags: "red"};

  await execTest(lambdaFilter, paramFind);
});

test('should selecte inventory dim_cm includes value greater than 25', async () => {

  const lambdaFilter = i => i.dim_cm.findIndex(d => d > 25) > -1;

  const paramFind = {dim_cm: {$gt: 25}};

  await execTest(lambdaFilter, paramFind);
});

test('should selecte inventory dim_cm includes value greater than 15 or less than 20', async () => {

  const lambdaFilter = i => i.dim_cm.findIndex(d => d > 15) > -1 && i.dim_cm.findIndex(d => d < 20) > -1;

  const paramFind = {dim_cm: {$gt: 15, $lt: 20}};

  await execTest(lambdaFilter, paramFind);
});

test('should selecte inventory dim_cm includes value greater than 22 and less than 30', async () => {

  const lambdaFilter = i => i.dim_cm.findIndex(d => d > 22 && d < 30) > -1;

  const paramFind = {dim_cm: {$elemMatch: {$gt: 22, $lt: 30}}};

  await execTest(lambdaFilter, paramFind);
});

test('should selecte inventory dim_cm first value is greater than 25', async () => {

  const lambdaFilter = i => i.dim_cm[1] > 25;

  const paramFind = {'dim_cm.1': {$gt: 25}};

  await execTest(lambdaFilter, paramFind);
});


test('should selecte inventory dim_cm is length equals three', async () => {

  const lambdaFilter = i => i.dim_cm.length == 3;

  const paramFind = {dim_cm: {$size: 3}};

  await execTest(lambdaFilter, paramFind);
});


afterAll(disconnect);

