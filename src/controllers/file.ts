import { ClassMiddleware, Controller, Delete, Get, Middleware, Post, Put } from '@overnightjs/core';
import { Request, Response } from 'express';
import { authMiddleware } from '@src/middlewares/auth';
import logger from '@src/logger';
import { BaseController } from './base';
import config from 'config';

const B2 = require('backblaze-b2');

const b2 = new B2({
    applicationKeyId: config.get('App.storage.backblaze.appKeyId'),
    applicationKey: config.get('App.storage.backblaze.appKey')
});

const b2FilePath = config.get('App.storage.backblaze.filePath');

@Controller(`${config.get('server.base')}/${config.get('server.version')}/file`)
export class FileController extends BaseController {

    @Post('')
    public async uploadProductImage(req: Request, res: Response): Promise<void> {
        try {

            await b2.authorize();

            const uploadPath = await b2.getUploadUrl(config.get('App.storage.backblaze.bucketId'));

            const buff = Buffer.from(req.body.data, 'base64');

            const result = await b2.uploadFile({
                uploadUrl: uploadPath.data.uploadUrl,
                uploadAuthToken: uploadPath.data.authorizationToken,
                filename: `products/${req.body.path}${req.body.fileName}`,
                mime: req.body.mime,
                data: buff
            });

            if(req.body.product && req.body.product != '') {
                //TODO Insert new image to product
            }

            res.status(201).send({
                url: `${b2FilePath}/${result.data.fileName}`,
                product: ''
            });
        } catch (error) {
            logger.error(error);
            this.sendCreateUpdateErrorResponse(res, error);
        }
    }

    @Delete('')
    public async deleteProductImage(req: Request, res: Response): Promise<void> {
        try {
            const order = await Order.findByIdAndDelete(req.params.id);
            this.sendCreateUpdateResponse(res, 200, 'Deleted with success');
        } catch (error) {
            console.error(error);
            this.sendCreateUpdateErrorResponse(res, error);
        }
    }

}