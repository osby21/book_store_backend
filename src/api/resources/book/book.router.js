import express from 'express';
import bookController from './book.controller';
import { sanitize } from '../../../middleware/sanitizer';
import upload from '../../../img_upload';


export const bookRouter = express.Router();
bookRouter.route('/add').post(sanitize(), upload.single('photo'), bookController.addBook);
bookRouter.route('/getAllproduct').get(sanitize(), bookController.index);
bookRouter.route('/getWebProductById').get(sanitize(), bookController.getWebProductListById);
bookRouter.route('/getAllproductList').get(sanitize(), bookController.getAllProductList);

//Category by product
bookRouter.route('/getAllGroceryStaple').get(sanitize(), bookController.getAllGrocerryStaples);
bookRouter.route('/list/:slug').get(sanitize(), bookController.getAllProductBySlug);











