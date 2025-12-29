import express, { Application } from 'express'
import cors from 'cors'
import { postRouter } from '../modules/posts/post.routes';

const app: Application = express();

app.use(express.json());
app.use(cors())

app.use('/posts', postRouter)

app.get('/', async (req, res) => {
    res.send('Hi i am trying to create a blog app using prisma with postgreSQL')
})

export default app;