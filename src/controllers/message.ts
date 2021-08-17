import { ClassMiddleware, Controller, Delete, Get, Middleware, Post, Put } from '@overnightjs/core';
import { Request, Response } from 'express';
import { authMiddleware } from '@src/middlewares/auth';
import logger from '@src/logger';
import { BaseController } from './base';
import config from 'config';
import { Message } from '@src/models/message';

@Controller(`${config.get('server.base')}/${config.get('server.version')}/message`)
export class MessageController extends BaseController {

    @Get('')
    public async fetch(req: Request, res: Response): Promise<void> {
        try {
            const { page = 1, limit = 10, filter = '' } = req.query;

            const messages = await Message.find({})
                .limit(Number(limit) * 1)
                .skip((Number(page) - 1) * Number(limit));

            const count = await Message.countDocuments();

            res.status(201).send({
                messages,
                page: Number(page),
                limit: Number(limit),
                total_pages: Math.ceil(count / Number(limit)),
            });
        } catch (error) {
            logger.error(error);
            this.sendCreateUpdateErrorResponse(res, error);
        }
    }

    @Get('chat/:id')
    public async fetchByChat(req: Request, res: Response): Promise<void> {
        try {
            const messages = await Message.find(
                {
                    chatId: Number(req.params.id)
                }
            );

            res.status(200).send(messages);
        } catch (error) {
            logger.error(error);
            this.sendCreateUpdateErrorResponse(res, error);
        }
    }

    @Get('nextid')
    public async fetchNextChatId(req: Request, res: Response): Promise<void> {
        try {
            const messages = await Message.find({}).sort({ chatId: -1 }).limit(1);

            res.status(201).send({
                id: messages[0].chatId + 1
            });
        } catch (error) {
            logger.error(error);
            this.sendCreateUpdateErrorResponse(res, error);
        }
    }

    @Post('')
    //@Middleware(authMiddleware)
    public async create(req: Request, res: Response): Promise<void> {
        try {
            console.log(req.body);
            const warehouse = new Message(req.body);
            const result = await warehouse.save();
            res.status(201).send(result);
        } catch (error) {
            logger.error(error);
            this.sendCreateUpdateErrorResponse(res, error);
        }
    }

    @Put(':id')
    //@Middleware(authMiddleware)
    public async update(req: Request, res: Response): Promise<void> {
        try {
            const warehouse = await Message.findByIdAndUpdate(req.params.id, req.body);
            this.sendCreateUpdateResponse(res, 200, 'Updated with success');
        } catch (error) {
            console.error(error);
            this.sendCreateUpdateErrorResponse(res, error);
        }
    }

    @Put('class/:id')
    //@Middleware(authMiddleware)
    public async updateClass(req: Request, res: Response): Promise<void> {
        try {
            const warehouse = await Message.findByIdAndUpdate(req.params.id, {
                classification: req.body.classification
            });
            this.sendCreateUpdateResponse(res, 200, 'Updated with success');
        } catch (error) {
            console.error(error);
            this.sendCreateUpdateErrorResponse(res, error);
        }
    }

    @Delete(':id')
    public async delete(req: Request, res: Response): Promise<void> {
        try {
            const warehouse = await Message.findByIdAndDelete(req.params.id);
            this.sendCreateUpdateResponse(res, 200, 'Deleted with success');
        } catch (error) {
            console.error(error);
            this.sendCreateUpdateErrorResponse(res, error);
        }
    }

}