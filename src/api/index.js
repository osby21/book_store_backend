import express from 'express';
import { authRouter } from './resources/auth'
import { categoryRouter } from './resources/category'
import { bookRouter } from './resources/book'
import { clientRouter } from './resources/client';

 
export const restRouter = express.Router();
restRouter.use('/auth', authRouter); // Para la interfaz de administracion
restRouter.use('/client', clientRouter); // Para la interfaz del consumidor
restRouter.use('/category', categoryRouter);
restRouter.use('/book', bookRouter);


