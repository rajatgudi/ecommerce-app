import {Router} from 'express'
import {
    createProduct,
    deleteProduct,
    getProductById,
    getProducts,
    updateProduct
} from "../controllers/product.controller";
import {validateData} from "../middlewares/validation.middleware";
import {createProductSchema, updateProductSchema} from "../db/schema/product.schema";

const productRouter = Router();
productRouter.get('/products', getProducts)

productRouter.get('/products/:id', getProductById)

productRouter.post('/products', validateData(createProductSchema), createProduct)

productRouter.put('/products/:id', validateData(updateProductSchema), updateProduct)

productRouter.delete('/products/:id', deleteProduct)

export default productRouter