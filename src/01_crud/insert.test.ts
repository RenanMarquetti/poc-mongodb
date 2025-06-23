import { connect, db, disconnect } from '../00_connection';

beforeAll(connect)

type People = {
	name: string;
	sobrenome: string;
	dataNacimento: Date;
};

const firstPeople: People = {
	name: "Renan",
	sobrenome: "Marquetti",
	dataNacimento: new Date('1996-11-03'),
};


it('insertOne', async () => {

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

	const peoples: Array<People> = [
		{name: "Jaqueline", sobrenome: "Brizola da Silva Marquetti", dataNacimento: new Date('1993-11-03')} as People,
		{name: "Abraão", sobrenome: "Brizola Marquetti", dataNacimento: new Date('2022-11-29')} as People,
		{name: "Israel", sobrenome: "Brizola Marquetti", dataNacimento: new Date('2024-11-27')} as People,
	];

	const collection = db.collection('people');
	await collection.insertMany(peoples);

	const res: Array<People> = await collection.find({}).toArray() as Array<People>;

	expect(res).toBeDefined()

	expect(res.length).toBe(4);

	expect(res).toContainEqual(firstPeople);
	peoples.forEach(p => expect(res).toContainEqual(p));

});

afterAll(disconnect);
