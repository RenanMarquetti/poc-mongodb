import { connect, db, disconnect } from '../00_connection';

type People = {
	name: string;
	sobrenome: string;
	dataNacimento: Date;
};

const data: Array<People> = [
	{name: "Renan", sobrenome: "Marquetti", dataNacimento: new Date('1996-11-03')} as People,
	{name: "Jaqueline", sobrenome: "Brizola da Silva Marquetti", dataNacimento: new Date('1993-11-03')} as People,
	{name: "Abraão", sobrenome: "Brizola Marquetti", dataNacimento: new Date('2022-11-29')} as People,
	{name: "Israel", sobrenome: "Brizola Marquetti", dataNacimento: new Date('2024-11-27')} as People,
];

beforeAll(connect)

it('insertOne', async () => {
	const firstPeople = data[0];

	const collection = db.collection('people');

	await collection.insertOne(firstPeople);

	const res: Array<People> = await collection.find({}).toArray() as Array<People>;

	expect(res).toBeDefined()

	expect(res.length).toBe(1);

	const resPeople = res[0];

	expect(resPeople).toBeDefined();
	expect(resPeople).toEqual(firstPeople);

});

it('insertMany', async () => {
	const peoples = data.slice(1)

	const collection = db.collection('people');
	await collection.insertMany(peoples);

	const res: Array<People> = await collection.find({}).toArray() as Array<People>;

	expect(res).toBeDefined()

	expect(res.length).toBe(data.length);

	data.forEach(p => expect(res).toContainEqual(p));

});

afterAll(disconnect);

