import express, {urlencoded} from 'express';
import productRouter from "./routes/product.routes";
import cors from 'cors'
import authRouter from "./routes/auth.routes";

const app = express();
const PORT = 3000

const BODY_LIMIT = process.env.JSON_BODY_LIMIT || '1mb';
app.use(express.json({ limit: BODY_LIMIT }));
app.use(urlencoded({ extended: false, limit: BODY_LIMIT }));
app.use(cors())

app.get('/', (req, res) => {
    res.send('Hello World!');
})
app.use('/api/v1', authRouter)
app.use('/api/v1', productRouter)

app.listen(PORT, () => {
    console.log('Server started on port 3000');
});