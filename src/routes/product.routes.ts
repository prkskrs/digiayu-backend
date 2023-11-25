import express from 'express';
import { Container } from 'typedi';
const router = express.Router();
import RequestValidator from '../middlewares/validator';
import requestSchemas from './requestSchemas';
import AuthControllers from '../controllers/auth.controller';
const authControllers = Container.get(AuthControllers);

// router.post(
//   '/signup',
//   RequestValidator(requestSchemas.productRoutesSchemas.createProduct.body, 'body'),
//   RequestValidator(requestSchemas.authRoutesSchemas.signup.headers, 'headers'),
//   authControllers.signUp,
// );

export default router;
