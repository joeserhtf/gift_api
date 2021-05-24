import { ClassMiddleware, Controller, Delete, Get, Middleware, Post, Put } from '@overnightjs/core';
import { Request, Response } from 'express';
import { Provider } from '@src/models/provider';
import { authMiddleware } from '@src/middlewares/auth';
import logger from '@src/logger';
import { BaseController } from './base';
import config from 'config';

@Controller(`${config.get('server.base')}/${config.get('server.version')}/provider`)
export class ProviderController extends BaseController {

    @Get('')
    public async fetch(req: Request, res: Response): Promise<void> {
        try {
            const { page = 1, limit = 10, filter = '' } = req.query;

            const providers = await Provider.find(
                {
                    name: { $regex: String(filter), $options: 'i' }
                }
            )
                .limit(Number(limit) * 1)
                .skip((Number(page) - 1) * Number(limit));

            const count = await Provider.countDocuments();

            res.status(201).send({
                providers,
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
            const provider = await Provider.findById(req.params.id);
            if (provider) {
                res.status(200).send(provider);
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
            const provider = new Provider(req.body);
            const result = await provider.save();
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
            const provider = await Provider.findByIdAndUpdate(req.params.id, req.body);
            this.sendCreateUpdateResponse(res, 200, 'Updated with success');
        } catch (error) {
            console.error(error);
            this.sendCreateUpdateErrorResponse(res, error);
        }
    }

    @Delete(':id')
    public async delete(req: Request, res: Response): Promise<void> {
        try {
            const provider = await Provider.findByIdAndDelete(req.params.id);
            this.sendCreateUpdateResponse(res, 200, 'Deleted with success');
        } catch (error) {
            console.error(error);
            this.sendCreateUpdateErrorResponse(res, error);
        }
    }

}