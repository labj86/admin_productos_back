import e, { Request, Response } from "express"
import Product from '../models/Product.model'
//import { check, validationResult } from "express-validator"

export const getProducts = async (req: Request, res: Response) => {
    const products = await Product.findAll({
        order: [
            ['id', 'DESC']
        ]
    })
    res.json({ data: products })
}

export const getProductById = async (req: Request, res: Response) => {
    const product = await searchProduct(req, res)
    if (!product) return

    res.json({ data: product })
}

export const createProduct = async (req: Request, res: Response) => {
    const product = await Product.create(req.body)
    res.status(201).json({ data: product })
}

export const updateProduct = async (req: Request, res: Response) => {
    const product = await searchProduct(req, res)
    if (!product) return

    // Actualizar
    await product.update(req.body)
    await product.save()

    res.json({ data: product })
}

export const updateAvailability = async (req: Request, res: Response) => {
    const product = await searchProduct(req, res)
    if (!product) return

    // Actualizar
    product.availability = !product.availability
    //product.availability = !product.dataValues.availability
    await product.save()

    res.json({ data: product })
}

export const deleteProduct = async (req: Request, res: Response) => {
    const product = await searchProduct(req, res)
    if (!product) return

    await product.destroy()

    res.json({ data: 'Producto Eliminado' })
}

async function searchProduct(req: Request, res: Response) {
    const product = await Product.findByPk(req.params.id)

    if (!product) {
        res.status(404).json({
            error: 'Producto No Encontrado'
        })
        return null
    }

    return product
}

// export const createProduct = async (req: Request, res: Response) => {
//     Validacion
//     await check('name')
//         .notEmpty().withMessage('El nombre del Producto no puede ir vacio')
//         .run(req)
//     await check('price')
//         .notEmpty().withMessage('El precio del Producto no puede ir vacio')
//         .isNumeric().withMessage('Valor no válido')
//         .custom( value => value > 0).withMessage('Precio no válido')
//         .run(req)
//     let errors = validationResult(req)
//     if(!errors.isEmpty()) {
//         return res.status(400).json({errors: errors.array()})
//     }
//     const product = await Product.create(req.body)
//     // const product = new Product(req.body)
//     // const savedProduct = await product.save()
//     res.json({data:product})
// }