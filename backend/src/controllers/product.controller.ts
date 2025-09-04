import {Request, Response} from 'express'

const getProducts = async (req: Request, res: Response) => {
    res.send('GET all products');
}
const getProductById = async (req: Request, res: Response) => {
    const id = req.params.id;
    res.send(`GET product by Id: ${id}`);
}
const createProduct = async (req: Request, res: Response) => {
    res.send(`POST new product  `);
}
const updateProduct = async (req: Request, res: Response) => {
    const id = req.params.id;
    res.send(`PUT product with Id: ${id}`);
}
const deleteProduct = async (req: Request, res: Response) => {
    const id = req.params.id;
    res.send(`DELETE product with Id ${id}`);
}
export
{
    getProducts, getProductById, createProduct, updateProduct, deleteProduct
}