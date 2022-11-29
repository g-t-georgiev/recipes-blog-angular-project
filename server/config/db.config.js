import mongoose from 'mongoose';

import envConfig from './env.config.js';


const dbConnectOptions = {
	useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    autoIndex: false, // Don't build indexes
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
}

export function dbConnector() {
	return mongoose.connect(envConfig.dbURL, dbConnectOptions);
};

export default dbConnector;