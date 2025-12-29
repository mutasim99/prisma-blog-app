import express, { Application } from 'express'
import cors from 'cors'
import { postRouter } from '../modules/posts/post.routes';
import { toNodeHandler } from "better-auth/node";
import { auth } from '../lib/auth';

const app: Application = express();

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());
app.use(cors({
    origin: process.env.APP_URL || 'http://localhost:4000',
    credentials: true
}))

app.use('/posts', postRouter)

app.get('/', async (req, res) => {
    res.send('Hi i am trying to create a blog app using prisma with postgreSQL')
})

export default app;