import mongoose from 'mongoose';

export let db;

export const connect = async () => {
	await mongoose.connect("mongodb://127.0.0.1:28017/pocmongo?directConnection=true&serverSelectionTimeoutMS=2000&appName=scriptpocmongo");
	db = mongoose.connection.db;
	await db.dropDatabase();
}

export const disconnect = async () => {
	await mongoose.disconnect();
}
