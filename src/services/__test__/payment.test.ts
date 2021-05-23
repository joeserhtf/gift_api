import { Cielo } from '@src/clients/cielo';
import payment_fix from '@test/fixtures/payment_fix.json';
import { Payment } from '@src/services/payment';

jest.mock('@src/clients/cielo');

describe('Payment Service', () => {

    it('should return the needed payment info', async () => {

        Cielo.prototype.createCardSale = jest.fn().mockResolvedValue(payment_fix);

        const expectedResponse = {
            "PaymentId": "123456789",
            "Status": 0,
            "ClientId": "2f12ff321f321",
            "OrderId": "f321f321f213f"
        }

        const payment = new Payment(new Cielo());

        const paymentResult = await payment.processPaymentCard(payment_fix);
        expect(paymentResult).toEqual(expectedResponse);

    });

});