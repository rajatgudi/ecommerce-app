import express, {urlencoded} from 'express';
import productRouter from "./routes/product.routes";
import cors from 'cors'

const app = express();
const PORT = 3000

app.use(express.json());
app.use(urlencoded({extended: false}));
app.use(cors())

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.use('/api/v1', productRouter)
app.listen(PORT, () => {
    console.log('Server started on port 3000');
});