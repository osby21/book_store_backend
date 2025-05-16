import express from 'express';
import categoryController from './category.controller';
import { sanitize } from '../../../middleware/sanitizer';
import { jwtStrategy } from '../../../middleware/strategy';

export const categoryRouter = express.Router();
categoryRouter.route('/create').post(sanitize(), categoryController.index);
categoryRouter.route('/list').get(sanitize(),jwtStrategy, categoryController.getList);
categoryRouter.route('/main/list').get(sanitize(), categoryController.mainList);
categoryRouter.route('/sub-category/create').post(sanitize(), categoryController.subCategoryCreate);
categoryRouter.route('/sub-category/list').get(sanitize(), categoryController.subCategoryList);
categoryRouter.route('/child-category/create').post(sanitize(), categoryController.childCategoryCreate);
categoryRouter.route('/child-category/list').get(sanitize(), categoryController.childCategoryList);

//update
categoryRouter.route('/main/update').post(sanitize(), categoryController.MainCategoryUpdate);
categoryRouter.route('/sub-cat/update').post(sanitize(), categoryController.SubCategoryUpdate);

//Filter 
categoryRouter.route('/sub-list').get(sanitize(), categoryController.getSubCategoryList);


