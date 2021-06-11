import { ClassMiddleware, Controller, Delete, Get, Middleware, Post, Put } from '@overnightjs/core';
import { Request, Response } from 'express';
import { Order } from '@src/models/order';
import { authMiddleware } from '@src/middlewares/auth';
import logger from '@src/logger';
import { BaseController } from './base';
import config from 'config';
import { OrderItem } from '@src/models/order_item';

@Controller(`${config.get('server.base')}/${config.get('server.version')}/order`)
export class OrderController extends BaseController {

    @Get('')
    public async fetch(req: Request, res: Response): Promise<void> {
        try {
            const { page = 1, limit = 10, filter = '' } = req.query;

            let orders = await Order.find(
                {
                    orderId: { $regex: String(filter), $options: 'i' }
                }
            )
                .limit(Number(limit) * 1)
                .skip((Number(page) - 1) * Number(limit));

            const count = await Order.countDocuments({
                orderId: { $regex: String(filter), $options: 'i' }
            });

            orders.map((ord) => {
                ord.toJSON();
            })

            res.status(201).send({
                orders,
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
            const order = await Order.findById(req.params.id)
                .populate(
                    {
                        path: 'items',
                        populate: [
                            {
                                path: 'product',
                                select: ['images', 'barcode', 'description', 'id'],
                            },
                            {
                                path: 'fabric',
                                select: ['images', 'name', 'id'],
                            },
                        ]
                    }
                );

            if (order) {
                res.status(200).send(order?.toJSON());
            } else {
                res.status(204).send();
            }
        } catch (error) {
            logger.error(error);
            this.sendCreateUpdateErrorResponse(res, error);
        }
    }

    @Post('')
    public async createUpdate(req: Request, res: Response): Promise<void> {
        try {

            let itemsCreated = await this.insertOrderItem(req.body.items);

            let amount = 0;
            let bruteValue = 0;
            let shippingFee = 0;
            let discount = 0;

            let itemsId: string[] = [];

            itemsCreated.forEach((element: any) => {
                itemsId.push(element._id);
                bruteValue += (element.valueItem * element.quantity);
                amount += element.amount;
            });

            if (req.body.shippingFee) {
                shippingFee = req.body.shippingFee;
                amount += shippingFee;
            }

            if (req.body.discount) {
                discount = req.body.discount;
                amount -= discount;
            }

            let data: any = {
                items: itemsId,
                amount: amount,
                bruteValue: bruteValue,
                shippingFee: shippingFee,
                discount: discount
            }

            let checkOrder: any = {};
            let orderToSave = new Order(data);

            if (req.body.orderId || req.body.orderId == '') {
                checkOrder = await Order.findOneAndUpdate({ orderId: req.body.orderId }, data, {
                    new: true
                });

                if (!checkOrder) checkOrder = await orderToSave.save();
            } else {
                checkOrder = await orderToSave.save();
            }

            res.status(201).send(checkOrder?.toJSON());
        } catch (error) {
            logger.error(error);
            this.sendCreateUpdateErrorResponse(res, error);
        }
    }

    @Put('addItem')
    public async addItem(req: Request, res: Response): Promise<void> {
        try {

            // if (!req.body.orderId) {
            //     return this.sendErrorResponse(res, {
            //       code: 401,
            //       message: 'User not found!',
            //     });
            //   }

            let itemsCreated = await this.insertOrderItem(req.body.items);

            let amount = 0;
            let bruteValue = 0;
            let shippingFee = 0;
            let discount = 0;

            let itemsId: string[] = [];

            itemsCreated.forEach((element: any) => {
                itemsId.push(element._id);
                bruteValue += (element.valueItem * element.quantity);
                amount += element.amount;
            });

            if (req.body.shippingFee) {
                shippingFee = req.body.shippingFee;
                amount += shippingFee;
            }

            if (req.body.discount) {
                discount = req.body.discount;
                amount -= discount;
            }

            let data: any = {
                items: itemsId,
                amount: amount,
                bruteValue: bruteValue,
                shippingFee: shippingFee,
                discount: discount
            }

            let checkOrder: any = {};
            let orderToSave = new Order(data);

            if (req.body.orderId || req.body.orderId == '') {
                checkOrder = await Order.findOneAndUpdate({ orderId: req.body.orderId }, data, {
                    new: true
                });

                if (!checkOrder) checkOrder = await orderToSave.save();
            } else {
                checkOrder = await orderToSave.save();
            }

            res.status(201).send(checkOrder?.toJSON());
        } catch (error) {
            logger.error(error);
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

    private async insertOrderItem(items: Array<any>): Promise<any> {
        let orderItems = await OrderItem.insertMany(items);
        console.log(orderItems);
        return orderItems;
    }

    private stockResume(products: any): any {
        if (Array.isArray(products)) {
            products.map(async (prod: any) => {
                await prod.fabrics.map(async (fab: any) => {
                    let stock = 0;
                    let reserved = 0;
                    await fab.stocks.map((stck: any) => {
                        if (stck.active) {
                            stock += stck.quantity;
                            reserved += stck.reserved;
                        }
                    });
                    fab.stock = (stock - reserved);
                    fab.readyStock = 0;
                    delete fab.__v;
                    delete fab.stocks;
                });
                delete prod.__v;
                delete prod.category.__v;
            });
        } else {
            products.fabrics.map(async (fab: any) => {
                let stock = 0;
                let reserved = 0;
                await fab.stocks.map((stck: any) => {
                    if (stck.active) {
                        stock += stck.quantity;
                        reserved += stck.reserved;
                    }
                });
                fab.stock = (stock - reserved);
                fab.readyStock = 0;
                delete fab.__v;
                delete fab.stocks;
            });

            delete products.__v;
            delete products.category.__v;
        }
        return products;
    }

}