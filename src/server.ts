
import './util/module-alias';
import { Server } from '@overnightjs/core';
import express, { Application } from 'express';
import * as database from '@src/database';
import config from 'config';
import { ProductsController } from './controllers/products';
import { UsersController } from './controllers/users';
import logger from './logger';
import expressPino from 'express-pino-logger';
import cors from 'cors';
import apiSchema from './api.schema.json';
import swaggerUi from 'swagger-ui-express';
import * as OpenApiValidator from 'express-openapi-validator';
import { OpenAPIV3 } from 'express-openapi-validator/dist/framework/types';
import { apiErrorValidator } from './middlewares/api-error-validator';
import { Server as IoServer } from 'socket.io';
import * as http from "http";
import { sockets } from './sockets/socket';

export class SetupServer extends Server {
  private httpServer: http.Server | undefined;

  constructor(private port = 21456) {
    super();
    logger.info("" + config.get('App.name'));
  }

  public async init(): Promise<void> {
    this.setupExpress();
    //await this.docsSetup(); // TODO fix to production
    this.setupControllers();
    await this.databaseSetup();
    this.setupErrorHandles();
  }

  private setupExpress(): void {
    this.app.use(express.json());
    this.app.use(
      expressPino({
        logger,
      })
    );
    this.app.use(
      cors({ origin: '*' })
    );
  }

  private setupErrorHandles(): void {
    this.app.use(apiErrorValidator);
  }

  private setupControllers(): void {
    const usersController = new UsersController();
    const productsController = new ProductsController();
    this.addControllers(
      [
        usersController,
        productsController,
      ]);
  }



  private async docsSetup(): Promise<void> {
    let options = {
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: "Gift Praia"
    };
    this.app.use('/docs', swaggerUi.serve, swaggerUi.setup(apiSchema, options));
    this.app.use(
      OpenApiValidator.middleware({
        apiSpec: apiSchema as OpenAPIV3.Document,
        validateRequests: true,
        validateResponses: true,
      }),
    );
  }

  public getApp(): Application {
    return this.app;
  }

  private async databaseSetup(): Promise<void> {
    await database.connect();
  }

  public async close(): Promise<void> {
    await database.close();
  }

  public start(): void {
    this.httpServer = this.app.listen(this.port, () => {
      logger.info('Server listening on port: ' + this.port);
    });
  }

  public initSockets(): void {
    const io = new IoServer(this.httpServer);
    logger.info('Initializing Socket');
    sockets(io);
  }
}