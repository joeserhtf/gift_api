import { Controller, Get, Middleware, Post, Delete, Put } from '@overnightjs/core';
import { Response, Request } from 'express';
import { User } from '@src/models/user';
import { BaseController } from './base';
import AuthService from '@src/services/auth';
import { authMiddleware } from '@src/middlewares/auth';

@Controller('v1/user')
export class UsersController extends BaseController {
  @Get('me')
  @Middleware(authMiddleware)
  public async me(req: Request, res: Response): Promise<Response> {
    const email = req.decoded ? req.decoded.email : undefined;

    const user = await User.findOne({
      email
    });
    if (!user) {
      return this.sendErrorResponse(res, {
        code: 404,
        message: 'User not found!'
      });
    }
    return res.send(user);
  }

  @Get('all')
  @Middleware(authMiddleware)
  public async fetch(req: Request, res: Response): Promise<void> {
    try {
      const user = await User.find();
      res.status(200).send(user);
    } catch (error) {
      console.error(error);
      this.sendCreateUpdateErrorResponse(res, error);
    }
  }

  @Get(':id')
  @Middleware(authMiddleware)
  public async fetchOne(req: Request, res: Response): Promise<Response> {
    const user = await User.findById(req.params.id);
    if (!user) {
      return this.sendErrorResponse(res, {
        code: 404,
        message: 'User not found!'
      });
    }
    return res.send(user);
  }

  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const user = new User(req.body);
      const newUser = await user.save();
      res.status(201).send(newUser);
    } catch (error) {
      this.sendCreateUpdateErrorResponse(res, error);
    }
  }

  @Post('authenticate')
  public async authenticate(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return this.sendErrorResponse(res, {
        code: 401,
        message: 'User not found!',
      });
    }
    if (!(await AuthService.comparePasswords(password, user.password))) {
      return this.sendErrorResponse(res, {
        code: 401,
        message: 'Password does not match!',
      });
    }
    const authorization = AuthService.generateToken(user.toJSON());
    console.log({ ...user.toJSON(), ...{ authorization } });

    return res.status(200).send({ ...user.toJSON(), ...{ authorization } });
  }

  @Put(':id')
  @Middleware(authMiddleware)
  public async update(req: Request, res: Response): Promise<void> {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, req.body);
      this.sendCreateUpdateResponse(res, 200, 'Updated with success');
    } catch (error) {
      console.error(error);
      this.sendCreateUpdateErrorResponse(res, error);
    }
  }

  @Delete(':id')
  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      this.sendCreateUpdateResponse(res, 200, 'Deleted with success');
    } catch (error) {
      console.error(error);
      this.sendCreateUpdateErrorResponse(res, error);
    }
  }
}