import { ClassMiddleware, Controller, Delete, Get, Middleware, Post, Put } from '@overnightjs/core';
import { Request, Response } from 'express';
import { Fabric } from '@src/models/fabrics';
import { authMiddleware } from '@src/middlewares/auth';
import logger from '@src/logger';
import { BaseController } from './base';
import config from 'config';
import { Product } from '@src/models/products';

@Controller(`${config.get('server.base')}/${config.get('server.version')}/fabric`)
export class FabricController extends BaseController {

    @Get('')
    public async fetch(req: Request, res: Response): Promise<void> {
        try {
            const { page = 1, limit = 10, filter = '' } = req.query;

            const fabrics = await Fabric.find(
                {
                    name: { $regex: String(filter), $options: 'i' }
                }
            )
                .limit(Number(limit) * 1)
                .skip((Number(page) - 1) * Number(limit))
                .populate({ path: 'stocks', select: ['quantity', 'reserved', 'active', 'id'] });

            const count = await Fabric.countDocuments();

            res.status(201).send({
                fabrics,
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
            const fabric = await Fabric.findById(req.params.id);
            if (fabric) {
                res.status(200).send(fabric);
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
        try {
            const fabric = new Fabric(req.body);
            const result = await fabric.save();
            res.status(201).send(result);
        } catch (error) {
            logger.error(error);
            this.sendCreateUpdateErrorResponse(res, error);
        }
    }

    @Put('addfabrictoproduct')
    @Middleware(authMiddleware)
    public async insertFabricToProduct(req: Request, res: Response): Promise<void> {
        try {
            const { fabric, product } = req.body;
            let dataProduct = await Product.findById(product);
            if (dataProduct) {
                dataProduct.fabrics.push(fabric)
                await dataProduct.save();
            } else {
                throw ('Nao encontrado');
            }
            this.sendCreateUpdateResponse(res, 200, 'Update with success');
        } catch (error) {
            console.error(error);
            this.sendCreateUpdateErrorResponse(res, error);
        }
    }

    @Put(':id')
    @Middleware(authMiddleware)
    public async update(req: Request, res: Response): Promise<void> {
        try {
            const fabric = await Fabric.findByIdAndUpdate(req.params.id, req.body);
            this.sendCreateUpdateResponse(res, 200, 'Updated with success');
        } catch (error) {
            console.error(error);
            this.sendCreateUpdateErrorResponse(res, error);
        }
    }

    @Delete(':id')
    public async delete(req: Request, res: Response): Promise<void> {
        try {
            const fabric = await Fabric.findByIdAndDelete(req.params.id);
            this.sendCreateUpdateResponse(res, 200, 'Deleted with success');
        } catch (error) {
            console.error(error);
            this.sendCreateUpdateErrorResponse(res, error);
        }
    }

}