import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { protectRoutes, securityMiddleware } from './middleware/security';
import routes from './routes/index';
import 'dotenv/config';
import { jwtProtect } from './middleware/protectMiddlewares';

const app: Application = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
};
app.use(cors(corsOptions));

securityMiddleware(app);

app.use(protectRoutes(['/api/user', '/api/settings', '/api/orders'], jwtProtect));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, world!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
