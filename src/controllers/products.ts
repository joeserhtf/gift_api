import { ClassMiddleware, Controller, Delete, Get, Middleware, Post, Put } from '@overnightjs/core';
import { Request, Response } from 'express';
import { Product } from '@src/models/products';
import { authMiddleware } from '@src/middlewares/auth';
import logger from '@src/logger';
import { BaseController } from './base';
import config from 'config';

@Controller(`${config.get('server.base')}/${config.get('server.version')}/product`)
export class ProductsController extends BaseController {

    @Get('')
    public async fetch(req: Request, res: Response): Promise<void> {
        try {
            const { page = 1, limit = 10, filter = '' } = req.query;

            const products = await Product.find(
                {
                    description: { $regex: String(filter), $options: 'i' }
                }
            )
                .limit(Number(limit) * 1)
                .skip((Number(page) - 1) * Number(limit))
                .populate('category')
                .populate({path: 'fabrics', populate: { path: 'stocks', select: ['quantity', 'reserved', 'active', 'id'] }});

            const count = await Product.countDocuments();

            res.status(201).send({
                products,
                page: Number(page),
                limit: Number(limit),
                total_pages: Math.ceil(count / Number(limit)),
            });
        } catch (error) {
            logger.error(error);
            this.sendCreateUpdateErrorResponse(res, error);
        }
    }

    @Get(':id')
    public async fetchOne(req: Request, res: Response): Promise<void> {
        try {
            const product = await Product.findById(req.params.id);
            if (product) {
                res.status(200).send(product);
            } else {
                res.status(204).send();
            }
        } catch (error) {
            logger.error(error);
            this.sendCreateUpdateErrorResponse(res, error);
        }
    }

    @Post('')
    @Middleware(authMiddleware)
    public async create(req: Request, res: Response): Promise<void> {
        console.log(`${config.get('server.base')}/${config.get('server.version')}/product`)
        try {
            const product = new Product(req.body);
            const result = await product.save();
            res.status(201).send(result);
        } catch (error) {
            logger.error(error);
            this.sendCreateUpdateErrorResponse(res, error);
        }
    }

    @Put(':id')
    @Middleware(authMiddleware)
    public async update(req: Request, res: Response): Promise<void> {
        try {
            const product = await Product.findByIdAndUpdate(req.params.id, req.body);
            this.sendCreateUpdateResponse(res, 200, 'Updated with success');
        } catch (error) {
            console.error(error);
            this.sendCreateUpdateErrorResponse(res, error);
        }
    }

    @Delete(':id')
    public async delete(req: Request, res: Response): Promise<void> {
        try {
            const product = await Product.findByIdAndDelete(req.params.id);
            this.sendCreateUpdateResponse(res, 200, 'Deleted with success');
        } catch (error) {
            console.error(error);
            this.sendCreateUpdateErrorResponse(res, error);
        }
    }

}