import { ClassMiddleware, Controller, Delete, Get, Middleware, Post, Put } from '@overnightjs/core';
import { Request, Response } from 'express';
import { authMiddleware } from '@src/middlewares/auth';
import logger from '@src/logger';
import { BaseController } from './base';
import config from 'config';
import { Order } from '@src/models/order';
const AWS = require('aws-sdk');

const B2 = require('backblaze-b2');

const b2 = new B2({
    applicationKeyId: config.get('App.storage.backblaze.appKeyId'),
    applicationKey: config.get('App.storage.backblaze.appKey')
});

const b2FilePath = config.get('App.storage.backblaze.filePath');
const awsId = config.get('App.storage.aws.id');
const awsISecret = config.get('App.storage.aws.secret');

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
        } catch (error: any) {
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

    @Post('aws')
    public async uploadAWS(req: any, res: Response): Promise<void> {
        try {

            const s3 = new AWS.S3({
                accessKeyId: awsId,
                secretAccessKey: awsISecret
            });

            const file = req.files.arquivo;

            const params = {
                Bucket: "elasticbeanstalk-us-east-2-588034663611",
                Key: `birru/${file.name}`,
                Body: file.data,
                ContentType: req.body.type,
            };

            s3.upload(params, function (err: any, data: any) {
                if (err) {
                    res.status(201).send({
                        url: `https://elasticbeanstalk-us-east-2-588034663611.s3.us-east-2.amazonaws.com/`,
                    });
                }

                res.status(201).send({
                    url: `https://elasticbeanstalk-us-east-2-588034663611.s3.us-east-2.amazonaws.com/`,
                });
            });
        } catch (error: any) {
            console.log(error);
            logger.error(error);
            this.sendCreateUpdateErrorResponse(res, error);
        }
    }

}