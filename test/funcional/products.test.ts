import { Product } from '@src/models/products';
import { User } from '@src/models/user';
import AuthService from '@src/services/auth';

describe('Products functional tests', () => {
    const defaultUser = {
        name: 'Joeser',
        email: 'hyf@mail.com',
        password: '1234',
    };
    let token: string;
    beforeEach(async () => {
        await Product.deleteMany({});
        await User.deleteMany({});
        const user = await new User(defaultUser).save();
        token = AuthService.generateToken(user.toJSON());
    });
    describe('When creating a new product', () => {

        it('should create a product with success', async () => {
            const newProduct = {
                cod: '000005',
                barcode: '1234567891234',
                description: 'Lampada Linda',
                price: 10.90,
                salePrice: 8.80
            };

            const response = await global.testRequest
                .post('/products')
                .set({ 'authorization': token })
                .send(newProduct);
            expect(response.status).toBe(201);
            //Object containing matches the keys and values, even if includes other keys such as id.
            expect(response.body).toEqual(expect.objectContaining(newProduct));
        });

        it('should return a validation error', async () => {
            const newProduct = {
                cod: '000005',
                barcode: '1234567891234',
                description: '123123',
                price: 'invalid_string',
                salePrice: 8.80
            };
            const response = await global.testRequest
                .post('/products')
                .set({ 'authorization': token })
                .send(newProduct);

            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                code: 400,
                error: 'Bad Request',
                message:
                    `Products validation failed: price: Cast to Number failed for value \"invalid_string\" at path \"price\"`,
            });
        });

        it.skip('should return 500 when there is any error other than validation error', async () => {
            //TODO think in a way to throw a 500
        });
    });
});