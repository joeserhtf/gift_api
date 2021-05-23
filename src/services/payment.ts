import { Cielo } from '@src/clients/cielo';
import { InternalError } from '@src/util/errors/internal-error';
import logger from '@src/logger';
import { CieloNewSale } from '@src/interfaces/cielo_new_sale';
import _ from 'lodash';
import { PaymentData } from '@src/interfaces/payment';

export class PaymentProcessingInternalError extends InternalError {
    constructor(message: string) {
        super(`Unexpected error during the forecast processing: ${message}`);
    }
}

export interface PaymentResult {
    PaymentId: string;
    Status: string;
    Amount: number;
    Client: string;
    OrderId: string;
    Date: string;
}

export class Payment {
    constructor(
        protected cielo = new Cielo()
    ) { }

    public async processPaymentCard(payment: PaymentData): Promise<{}> {
        try {

            const clientData = await this.searchClient('');

            const orderData = this.searchOrder('');

            let data: Partial<CieloNewSale> = {
                MerchantOrderId: "",
                Customer: undefined,
                Payment: undefined
            };

            const paymentData = this.cielo.createCardSale(data);

            return Promise.resolve({});

        } catch (error) {
            logger.error(error);
            throw new PaymentProcessingInternalError(error.message);
        }
    }

    private normalizeSendData() {

    }

    private searchClient(clientId: string): Promise<any> {
        return Promise.resolve({});
    }

    private searchOrder(orderId: string): Promise<any> {
        return Promise.resolve({});
    }
}