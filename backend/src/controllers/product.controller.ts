import {Request, Response} from 'express'
import {db} from "../db";
import {productsTable} from "../db/schema/product.schema";
import {eq} from "drizzle-orm";

const getProducts = async (req: Request, res: Response) => {
    try {
        const allProducts = await db.select().from(productsTable)
        if (!allProducts.length) {
            res.status(400).json({data: [], message: 'No products found!', count: 0,})
        }
        res.status(200).json({data: allProducts, count: allProducts.length})
    } catch (err) {
        console.log('error', err)
        res.json({message: "Something went wrong while get all products!"});

    }

}
const getProductById = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    if (isNaN(id)) {
        return res.status(500).json({error: 'id must be a number'});
    }
    try {
        const currentProduct = await db.select().from(productsTable).where((eq(productsTable.id, id)))
        if (!currentProduct?.length) {
            res.status(400).json({data: null, message: `No product found by id ${id}!`})
        }
        res.status(200).json({data: currentProduct,})
    } catch (err) {
        console.log(err)
        res.status(500).json({message: "Something went wrong while get product by id " + id,});
    }
    res.send(`GET product by Id: ${id}`);
}
const createProduct = async (req: Request, res: Response) => {
    try {
        const products = await db.insert(productsTable).values(req.body).returning()
        if (!products?.length) {
            res.status(500).json({message: "Product not created"});
        }
        res.status(201).json({message: "New Product created", data: products});
    } catch (err) {
        console.log('error', err)
        res.status(500).json({message: "Something went wrong while creation!", details: err});
    }
}
const updateProduct = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    if (isNaN(id)) {
        return res.status(500).json({error: 'id must be a number'});
    }
    const checkProduct = await db.select().from(productsTable).where(eq(productsTable.id, id))
    if (!checkProduct?.length) {
        res.status(400).json({error: 'Product not found!'});
    }
    const updatedProduct = await db.update(productsTable).set({
        ...req.body,
        updatedAt: new Date()
    }).where(eq(productsTable.id, id)).returning()
    if (!updateProduct?.length) {
        res.status(400).json({error: 'Product not found!'});
    }
    res.status(200).json({message: "Product updated", data: updatedProduct});
}
const deleteProduct = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    if (isNaN(id)) {
        return res.status(500).json({error: 'id must be a number'});
    }
    const checkProduct = await db.select().from(productsTable).where(eq(productsTable.id, id))
    if (!checkProduct?.length) {
        res.status(400).json({error: 'Product not found!'});
    }
    const deletedProduct = await db.delete(productsTable).where(eq(productsTable.id, id))
    if (!deletedProduct) {
        res.status(404).json({error: 'Product not found!'});
    }
    res.status(200).json({message: `Product with id ${id} deleted!`});
}
export
{
    getProducts, getProductById, createProduct, updateProduct, deleteProduct
}