import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { createServer } from 'http';
import swaggerUI from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import { swaggerOptions } from './swagger/config';
import sequelize from './util/database';
import './models/index';
import { initializeSocket } from './util/socket_be';
import { startConsumer } from './services/consumer';

import { router as feedRouter } from './router/feed';
import { router as userRouter } from './router/user';
import { router as influencerRouter } from './router/influencer';
import { router as membershipProductRouter } from './router/membershipProduct';
import { router as paymentsRouter } from './router/payments';
import { router as authRouter } from './router/auth';
import { router as roomRouter } from './router/room';
import { router as messageRouter } from './router/message';
import { router as accessRouter } from './router/access';
import { router as notiRouter } from './router/notification';
import { router as commentRouter } from './router/comment';
import { router as homeFeedRouter } from './router/homeFeed';
import { router as admin } from './router/admin';

import cookieParser from 'cookie-parser';

const port: number = 4000;
const app = express();
const server = createServer(app);

app.use(cookieParser());
app.set('trust proxy', 1);


if (process.env.MORGAN === 'true') {
  app.use(morgan('dev'));
}
app.use(
  cors({
    origin: ['https://final-fe-vercel.vercel.app', 'https://whatcpu.p-e.kr'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.use('/auth', authRouter);
app.use('/access', accessRouter);
app.use('/feed', feedRouter);
app.use('/user', userRouter);
app.use('/influencer', influencerRouter);
app.use('/membership', membershipProductRouter);
app.use('/room', roomRouter);
app.use('/message', messageRouter);
app.use('/payments', paymentsRouter);
app.use('/noti', notiRouter);
app.use('/comment', commentRouter);
app.use('/homefeed', homeFeedRouter);
app.use('/admin', admin);

const io = initializeSocket(server);

// Connection Error 핸들러 등록
io?.engine.on("connection_error", (err: any) => {
  console.error("Socket.IO connection error:", err); // 에러 로그 출력
});

sequelize
  .authenticate()
  .then(() =>
    console.log('Database connection has been established successfully.')
  )
  .catch((err) => console.error('Unable to connect to the database:', err));

sequelize
  .sync({ alter: false, logging: false })
  .then(() => console.log('All models were synchronized successfully.'))
  .catch((err) => console.error('Model synchronization failed:', err));

app.use((err: Error, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.get('/', (req, res) => {
  res.send('서버가 정상적으로 동작 중입니다!');
});

server.listen(port, async () => {
  console.log(`http://localhost:${port}`);
  // await startConsumer();
});
