import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { protectRoutes, securityMiddleware, sessionMiddleware } from './middleware/security';
import routes from './routes/index';
import 'dotenv/config';
import { isAuthenticated, jwtProtect } from './middleware/protectMiddlewares';

const app: Application = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
};
app.use(cors(corsOptions));

securityMiddleware(app);

app.use(protectRoutes(['/api/user', '/api/settings', '/api/orders'], isAuthenticated));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, world!');
});

const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: corsOptions.origin,
    methods: ["GET", "POST"]
  }
});

io.use(sessionMiddleware);

io.on('connection', (socket) => {
  console.log('A user connected');
  
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  // Add your custom event handlers here
  socket.on('message', (msg) => {
    console.log('Message received: ', msg);
    io.emit('message', msg); // Broadcast the message to all connected clients
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
