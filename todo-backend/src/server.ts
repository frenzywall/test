import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import todoRoutes from './routes/todos.routes';
import userRoutes from './routes/users.routes';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Reading connection details from dotenv file
const dbConnection: string | undefined = process.env.DB_CONN_STRING;
const dbName: string | undefined = process.env.DB_NAME;
const collectionTodosName: string | undefined = process.env.DB_TODOS_COLLECTION_NAME;
const collectionUsersName: string | undefined = process.env.DB_USERS_COLLECTION_NAME;

const servicePort: string = process.env.SERVICE_PORT || '8080';
const serviceIpAddress: string = process.env.SERVICE_IP_ADDRESS || '0.0.0.0';

// Validate required environment variables
if (!dbConnection || !dbName || !collectionTodosName || !collectionUsersName) {
    console.error('Missing required environment variables.');
    process.exit(1);
}

// Connect to MongoDB Database with the given database name and connection String
mongoose.connect(dbConnection, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        const db = mongoose.connection.db;
        console.log('Connected to MongoDB');
        
        app.listen(parseInt(servicePort), serviceIpAddress, () => {
            console.log(`App is running on: http://${serviceIpAddress}:${servicePort}`);
        });
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1);
    });

// Once the connection is established, callback
mongoose.connection.once('open', () => {
    console.log('MongoDB database connected successfully!');
});

// Route handlers
app.use(`/${collectionTodosName}`, todoRoutes);
app.use(`/${collectionUsersName}`, userRoutes);

export default app;
