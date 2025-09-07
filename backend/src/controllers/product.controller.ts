import type {Request, Response} from 'express'
import {db} from "../db";
import {productsTable} from "../db/schema/product.schema";
import {eq} from "drizzle-orm";

const getProducts = async (req: Request, res: Response) => {
    try {
        // Use pagination to avoid loading all products into memory at once
        const MAX_LIMIT = 100;
        const DEFAULT_LIMIT = 20;
        const page = Math.max(1, Number(req.query.page) || 1);
        const limitRaw = Number(req.query.limit);
        const limit = Math.min(MAX_LIMIT, limitRaw > 0 ? limitRaw : DEFAULT_LIMIT);
        const offset = (page - 1) * limit;

        // Fetch a limited set of products
        const pageProducts = await db.select().from(productsTable).limit(limit).offset(offset);

        // Also fetch total count efficiently if supported; otherwise, approximate by page size
        // Drizzle with some drivers supports .$count(), but if not available, consider a lightweight count query.
        // To keep minimal changes and compatibility, we return count for the page and include pagination info.
        return res.status(200).json({
            data: pageProducts,
            count: pageProducts.length,
            page,
            limit,
            hasMore: pageProducts.length === limit
        });
    } catch (err) {
        console.log('error', err)
        return res.status(500).json({message: "Something went wrong while getting products!"});
    }
}
const getProductById = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    if (isNaN(id)) {
        return res.status(400).json({error: 'id must be a number'});
    }
    try {
        const currentProduct = await db.select().from(productsTable).where((eq(productsTable.id, id))).limit(1)
        if (!currentProduct?.length) {
            return res.status(404).json({data: null, message: `No product found by id ${id}!`})
        }
        return res.status(200).json({data: currentProduct[0],})
    } catch (err) {
        console.log(err)
        return res.status(500).json({message: "Something went wrong while get product by id " + id,});
    }
}
const createProduct = async (req: Request, res: Response) => {
    try {
        const products = await db.insert(productsTable).values(req.body).returning()
        if (!products?.length) {
            return res.status(500).json({message: "Product not created"});
        }
        return res.status(201).json({message: "New Product created", data: products[0]});
    } catch (err) {
        console.log('error', err)
        return res.status(500).json({message: "Something went wrong while creation!", details: err});
    }
}
const updateProduct = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    if (isNaN(id)) {
        return res.status(400).json({error: 'id must be a number'});
    }
    const checkProduct = await db.select().from(productsTable).where(eq(productsTable.id, id)).limit(1)
    if (!checkProduct?.length) {
        return res.status(404).json({error: 'Product not found!'});
    }
    const updatedProduct = await db.update(productsTable).set({
        ...req.body,
        updatedAt: new Date()
    }).where(eq(productsTable.id, id)).returning()
    if (!updatedProduct?.length) {
        return res.status(500).json({error: 'Failed to update product!'});
    }
    return res.status(200).json({message: "Product updated", data: updatedProduct[0]});
}
const deleteProduct = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    if (isNaN(id)) {
        return res.status(400).json({error: 'id must be a number'});
    }
    const checkProduct = await db.select().from(productsTable).where(eq(productsTable.id, id)).limit(1)
    if (!checkProduct?.length) {
        return res.status(404).json({error: 'Product not found!'});
    }
    await db.delete(productsTable).where(eq(productsTable.id, id))
    return res.status(200).json({message: `Product with id ${id} deleted!`});
}
export {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};