import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { protectRoutes, securityMiddleware, sessionMiddleware, wrap } from './middleware/security.js';
import routes from './routes/index.js';
import 'dotenv/config';
import { isAuthenticated } from './middleware/protectMiddlewares.js';
import { authorizeUser, initializeUser, disconnectUser } from './middleware/socket.js';
import { addFriend, removeFriend } from './controllers/socket/friendController.js';

const app: Application = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
  credentials: true,
};
app.use(cors(corsOptions));

securityMiddleware(app);

app.use(protectRoutes(['/api/friend', '/api/chat', '/api/orders'], isAuthenticated));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, world!')
return;

});

const httpServer = createServer(app);
export const io = new SocketIOServer(httpServer, {
  cors: {
    origin: corsOptions.origin,
    methods: ["GET", "POST"],
    credentials: true,
  }
});

io.use(wrap(sessionMiddleware));
io.use(authorizeUser);

io.on('connection', (socket) => {
  console.log('A user connected');
  console.log(`Socket ID: ${socket.id}`);
  console.log(`User: ${socket.request && socket.request.session && socket.request.session.user}`);

  initializeUser(socket, io);
  
  socket.on('disconnect', () => {
    disconnectUser(socket, io);
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
