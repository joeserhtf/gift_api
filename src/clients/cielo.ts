import { InternalError } from '@src/util/errors/internal-error';
import config, { IConfig } from 'config';
import * as HTTPUtil from '@src/util/request';
import { TimeUtil } from '@src/util/time';
import CacheUtil from '@src/util/cache';
import logger from '@src/logger';
import { CieloNewSale } from '@src/interfaces/cielo_new_sale';
import { CieloActionResponse } from '@src/interfaces/cielo_action';

export class ClientRequestError extends InternalError {
  constructor(message: string) {
    const internalMessage =
      'Unexpected error when trying to communicate to Cielo';
    super(`${internalMessage}: ${message}`);
  }
}

export class CieloResponseError extends InternalError {
  constructor(message: string) {
    const internalMessage =
      'Unexpected error returned by the Client service';
    super(`${internalMessage}: ${message}`);
  }
}

const cieloResourceConfig: IConfig = config.get(
  'App.resources.cielo'
);

export class Cielo {
  constructor(
    protected request = new HTTPUtil.Request()
  ) { }

  public async createCardSale(paymentData: Partial<CieloNewSale>): Promise<CieloNewSale> {
    try {
      const response = await this.request.post<CieloNewSale>(
        `${cieloResourceConfig.get('reqUrl')}/1/sales/`,
        paymentData,
        {
          headers: {
            "MerchantId": `${cieloResourceConfig.get('mechantId')}`,
            "MerchantKey": `${cieloResourceConfig.get('mechantKey')}`
          }
        }
      );

      return response.data;
    } catch (err) {
      if (HTTPUtil.Request.isRequestError(err)) {
        throw new CieloResponseError(`Error: ${JSON.stringify(err.response.data)} Code: ${err.response.status}`)
      }
      throw new ClientRequestError(err.message);
    }
  }

  //TODO implemente teste
  public async fetchSaleData(paymentId: string): Promise<CieloNewSale> {
    try {
      const response = await this.request.get<CieloNewSale>(
        `${cieloResourceConfig.get('reqUrl')}/1/sales/${paymentId}`,
        {
          headers: {
            "MerchantId": `${cieloResourceConfig.get('mechantId')}`,
            "MerchantKey": `${cieloResourceConfig.get('mechantKey')}`
          }
        }
      );

      return response.data;
    } catch (err) {
      if (HTTPUtil.Request.isRequestError(err)) {
        throw new CieloResponseError(`Error: ${JSON.stringify(err.response.data)} Code: ${err.response.status}`)
      }
      throw new ClientRequestError(err.message);
    }
  }

  //TODO implemente teste
  public async captureSale(paymentId: string): Promise<CieloActionResponse> {
    try {
      const response = await this.request.put<CieloActionResponse>(
        `${cieloResourceConfig.get('reqUrl')}/1/sales/${paymentId}/capture`,
        {
          headers: {
            "MerchantId": `${cieloResourceConfig.get('mechantId')}`,
            "MerchantKey": `${cieloResourceConfig.get('mechantKey')}`
          }
        }
      );

      return response.data;
    } catch (err) {
      if (HTTPUtil.Request.isRequestError(err)) {
        throw new CieloResponseError(`Error: ${JSON.stringify(err.response.data)} Code: ${err.response.status}`)
      }
      throw new ClientRequestError(err.message);
    }
  }

  //TODO implemente teste
  public async cancelSale(paymentId: string): Promise<CieloActionResponse> {
    try {
      const response = await this.request.put<CieloActionResponse>(
        `${cieloResourceConfig.get('reqUrl')}/1/sales/${paymentId}/void`,
        {
          headers: {
            "MerchantId": `${cieloResourceConfig.get('mechantId')}`,
            "MerchantKey": `${cieloResourceConfig.get('mechantKey')}`
          }
        }
      );

      return response.data;
    } catch (err) {
      if (HTTPUtil.Request.isRequestError(err)) {
        throw new CieloResponseError(`Error: ${JSON.stringify(err.response.data)} Code: ${err.response.status}`)
      }
      throw new ClientRequestError(err.message);
    }
  }

  // TODO implemente billet creation
  public async createBilletSale(paymentData: any): Promise<any> {
    try {
      const response = await this.request.post<any>(
        `${cieloResourceConfig.get('reqUrl')}/1/sales/`,
        paymentData,
        {
          headers: {
            "MerchantId": `${cieloResourceConfig.get('mechantId')}`,
            "MerchantKey": `${cieloResourceConfig.get('mechantKey')}`
          }
        }
      );

      return response.data;
    } catch (err) {
      if (HTTPUtil.Request.isRequestError(err)) {
        throw new CieloResponseError(`Error: ${JSON.stringify(err.response.data)} Code: ${err.response.status}`)
      }
      throw new ClientRequestError(err.message);
    }
  }

}