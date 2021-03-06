import { ClassMiddleware, Controller, Delete, Get, Middleware, Post, Put } from '@overnightjs/core';
import { Request, Response } from 'express';
import { Stock } from '@src/models/stock';
import { Fabric } from '@src/models/fabrics';
import { authMiddleware } from '@src/middlewares/auth';
import logger from '@src/logger';
import { BaseController } from './base';
import config from 'config';

@Controller(`${config.get('server.base')}/${config.get('server.version')}/stock`)
export class StockController extends BaseController {
    @Get('')
    public async fetch(req: Request, res: Response): Promise<void> {
        try {
            const { page = 1, limit = 10, filter = '' } = req.query;

            const stocks = await Stock.find()
                .limit(Number(limit) * 1)
                .skip((Number(page) - 1) * Number(limit))
                .populate('warehouse');

            const count = await Stock.countDocuments();

            res.status(201).send({
                stocks,
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
            const stock = await Stock.findById(req.params.id);
            if (stock) {
                res.status(200).send(stock);
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
            const stock = new Stock(req.body);
            const result = await stock.save();
            res.status(201).send(result);
        } catch (error) {
            logger.error(error);
            this.sendCreateUpdateErrorResponse(res, error);
        }
    }

    @Put('addfabricstock')
    public async insertFabricStock(req: Request, res: Response): Promise<void> {
        try {
            const { fabric, stock } = req.body;
            let dataFabric = await Fabric.findById(fabric);
            if (dataFabric) {
                dataFabric.stocks.push(stock)
                await dataFabric.save();
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
            const stock = await Stock.findByIdAndUpdate(req.params.id, req.body);
            this.sendCreateUpdateResponse(res, 200, 'Updated with success');
        } catch (error) {
            console.error(error);
            this.sendCreateUpdateErrorResponse(res, error);
        }
    }

    @Delete(':id')
    public async delete(req: Request, res: Response): Promise<void> {
        try {
            const stock = await Stock.findByIdAndDelete(req.params.id);
            this.sendCreateUpdateResponse(res, 200, 'Deleted with success');
        } catch (error) {
            console.error(error);
            this.sendCreateUpdateErrorResponse(res, error);
        }
    }
}