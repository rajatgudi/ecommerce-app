import {Router} from 'express'
import {
    createProduct,
    deleteProduct,
    getProductById,
    getProducts,
    updateProduct
} from "../controllers/product.controller";

const productRouter = Router();

productRouter.get('/products', getProducts)

productRouter.get('/products/:id', getProductById)

productRouter.post('/products', createProduct)

productRouter.put('/products/:id', updateProduct)

productRouter.delete('/products/:id', deleteProduct)

export default productRouter