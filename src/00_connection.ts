import mongoose from 'mongoose';

export let db;

export const connect = async () => {
	const host = "mongodb://localhost:27017/pocmongo"
	await mongoose.connect(host);
	db = mongoose.connection.db;
	await db.dropDatabase();
}

export const disconnect = async () => {
	await mongoose.disconnect();
}
