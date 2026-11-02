import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import sequelize from './util/db';

import './models/candidate.model';
import './models/register.model';

import authRouter from './routes/authroute';
import userRouter from './routes/userRoute';
import eventrouter from './routes/eventroute';
import { RouteProtector } from './middlewares/auth.middleware';

dotenv.config({ path: './.env' });

const app: Express = express();

const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174')
  .split(',').map(origin => origin.trim()).filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.get('/health', (_req, res) => res.json({ status: 'healthy', service: 'campus-ambassador' }));

app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/register', eventrouter);
app.use('/', RouteProtector);

// ✅ Database connection + Server start
async function run() {
  try {
    if (!process.env.SECRET_TOKEN) throw new Error('SECRET_TOKEN is required');
    await sequelize.authenticate();
    console.log(`Database connected (${sequelize.getDialect()})`);

    await sequelize.sync(); 
    console.log('✅ All models were synchronized successfully.');

    const port = Number(process.env.PORT || 8001);
    const host = process.env.HOST || (process.env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1');
    app.listen(port, host, () => {
      console.log(`CA server listening on ${host}:${port}`);
    });
  } catch (err) {
    console.error('❌ Server startup error:', err);
    process.exitCode = 1;
  }
}

run();
