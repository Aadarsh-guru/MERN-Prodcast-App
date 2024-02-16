import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import http from 'http';
import path from 'path';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';
import connectToDatabase from './config/db.config';
import initializeSocketIo from './services/socket.service';
import socketMiddleware from './middlewares/socket.middleware';

// constants declaration
const app = express();
const PORT = Number(process.env.PORT) || 8000;
const httpServer = http.createServer(app);

// socket server initialised.
const io = new Server(httpServer, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.CORS_ORIGIN as string,
        credentials: true
    }
});

// mount the `io` instance on the app
app.set("io", io);

// socket-io middleware for authentication
io.use(socketMiddleware);

// middlewares
app.use(cors({
    origin: process.env.CORS_ORIGIN as string,
    credentials: true
}));
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(morgan('dev'));

// serving static assets
app.use(express.static('client/dist'));

//routes import
import authRoutes from './routes/auth.routes';
import mediaRoutes from './routes/media.routes';
import roomRoutes from './routes/room.routes';

//routes declaration
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/media", mediaRoutes);
app.use("/api/v1/room", roomRoutes);

// initial route 
app.get('/*', (_, res) => {
    return res.sendFile(path.resolve('client/dist/index.html'));
});

// database connection
connectToDatabase();

// initialized socket listeners
initializeSocketIo(io);

// listening server
httpServer.listen(PORT, () =>
    console.log(`server is running at http://localhost:${PORT}`)
);
