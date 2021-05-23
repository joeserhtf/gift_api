import AuthService from "@src/services/auth";
import { authMiddleware } from "../auth";

describe('AuthMiddleware', () => {
    it('should verify a JWT and call the next middleware', () => {
        const jwtToken = AuthService.generateToken({ data: 'fake' });
        const reqFake = {
            headers: {
                'Authorization': jwtToken
            },
        };

        const resFake = {};
        const nextFake = jest.fn();

        authMiddleware(reqFake, resFake, nextFake);
        expect(nextFake).toHaveBeenCalled();
    });

    it('should return UNAUTHORIZED if there is a problem on the token verification', () => {
        const reqFake = {
            headers: {
                'Authorization': 'invalid token',
            },
        };
        const sendMock = jest.fn();
        const resFake = {
            status: jest.fn(() => ({
                send: sendMock,
            })),
        };
        const nextFake = jest.fn();
        authMiddleware(reqFake, resFake as object, nextFake);
        expect(resFake.status).toHaveBeenCalledWith(401);
        expect(sendMock).toHaveBeenCalledWith({
            code: 401,
            error: 'jwt malformed',
        });
    });

    it('should return ANAUTHORIZED middleware if theres no token', () => {
        const reqFake = {
            headers: {},
        };
        const sendMock = jest.fn();
        const resFake = {
            status: jest.fn(() => ({
                send: sendMock,
            })),
        };
        const nextFake = jest.fn();
        authMiddleware(reqFake, resFake as object, nextFake);
        expect(resFake.status).toHaveBeenCalledWith(401);
        expect(sendMock).toHaveBeenCalledWith({
            code: 401,
            error: 'jwt must be provided',
        });
    });


});