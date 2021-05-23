import { Cielo } from '@src/clients/cielo';
import saleCardFraud from '@test/fixtures/cielo_new_sale_card _fraud.json';
import * as HTTPUtil from '@src/util/request';
import CacheUtil from '@src/util/cache';

jest.mock('@src/util/request');
//jest.mock('@src/util/cache');

describe('Cielo client', () => {
  /**
   * Used for static method's mocks
   */
  const MockedRequestClass = HTTPUtil.Request as jest.Mocked<
    typeof HTTPUtil.Request
  >;

  /**
   * Used for instance method's mocks
   */
  const mockedRequest = new HTTPUtil.Request() as jest.Mocked<HTTPUtil.Request>;

  it('should return new sale card from the Cielo service', async () => {

    mockedRequest.post.mockResolvedValue({ data: saleCardFraud } as HTTPUtil.Response);

    const cielo = new Cielo(mockedRequest);
    const response = await cielo.createCardSale();
    expect(response).toEqual(saleCardFraud);
  });

  it('should get a generic error from Cielo service when the request fail before reaching the service', async () => {
    mockedRequest.post.mockRejectedValue({ message: 'Network Error' });

    const cielo = new Cielo(mockedRequest);

    await expect(cielo.createCardSale()).rejects.toThrow(
      'Unexpected error when trying to communicate to Cielo: Network Error'
    );
  });

  it('should get an CieloResponse Error when the Cielo service responds with error', async () => {
    mockedRequest.post.mockRejectedValue({
      response: {
        status: 404,
        data: [
          {
            "Code": 119,
            "Message": "At least one Payment is required"
          }
        ],
      },
    });

    /**
     * Mock static function return
     */
    MockedRequestClass.isRequestError.mockReturnValue(true);

    const cielo = new Cielo(mockedRequest);

    await expect(cielo.createCardSale()).rejects.toThrow(
      'Unexpected error returned by the Client service: Error: [{"Code":119,"Message":"At least one Payment is required"}] Code: 404'
    );
  });
});