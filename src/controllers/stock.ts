import { ClassMiddleware, Controller, Delete, Get, Middleware, Post, Put } from '@overnightjs/core';
import { Request, Response } from 'express';
import { Stock } from '@src/models/stock';
import { authMiddleware } from '@src/middlewares/auth';
import logger from '@src/logger';
import { BaseController } from './base';
import config from 'config';

@Controller(`${config.get('server.base')}/${config.get('server.version')}/stock`)
export class StockController extends BaseController {
    @Get(':id')
    public async fetchOne(req: Request, res: Response): Promise<void> {
        try {
            const product = await Product.findById(req.params.id);
            if(product){
                res.status(200).send(product);
            }else{
                res.status(204).send();
            }
        } catch (error) {
            logger.error(error);
            this.sendCreateUpdateErrorResponse(res, error);
        }
    }

    
}