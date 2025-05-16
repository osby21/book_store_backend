import { db } from '../../../models';


export default {

    /* Add client api start here................................*/

    async index(req, res, next) {
        const { name, slug } = req.body;
        db.category.findOne({ where: { name: name } })
            .then(data => {
                if (data) {
                    return db.category.update({ slug: slug }, { where: { id: data.id } })
                }
                return db.category.create({ name: name, slug: slug })
            })
            .then(category => {
                res.status(200).json({ 'success': true, msg: "Successfully inserted category" });
            })
            .catch(function (err) {
                next(err)
            });
    },

    async MainCategoryUpdate(req, res, next) {
        const { id, name, slug } = req.body;
        db.category.findOne({ where: { id: id } })
            .then(data => {
                if (data) {
                    return db.category.update({ slug: slug, name: name }, { where: { id: data.id } })
                }
                throw new RequestError('Id is Empty', 409);
            })
            .then(category => {
                res.status(200).json({ 'success': true, msg: "Successfully inserted category" });
            })
            .catch(function (err) {
                next(err)
            });
    },
    async getList(req, res, next) { 
        try {
            db.childcategory.findAll({
                include: [{ model: db.subcategory, attributes: ['id', 'sub_name'], include: [{ model: db.category, attributes: ["id", "name"] }] }]
            })
                .then(list => {
                    res.status(200).json({ 'success': true, data: list });
                })
                .catch(function (err) {
                    next(err)
                });
        }
        catch (err) {
            throw new RequestError('Error');
        }
    },

    async mainList(req, res, next) {
        db.category.findAll()
            .then(category => {
                res.status(200).json({ 'success': true, data: category });
            })
            .catch(function (err) {
                next(err)
            });
    },
    // create subcategory

    async subCategoryCreate(req, res, next) {
        const { name, categoryId } = req.body;
        db.subcategory.findOne({ where: { name: name } })
            .then(data => {
                if (data) {
                    return db.subcategory.update({ name: name, categoryId: categoryId }, { where: { id: data.id } })
                }
                return db.subcategory.create({ name: name, categoryId: categoryId })
            })
            .then(data => {
                res.status(200).json({ 'success': true, msg: "Successfully inserted category" });
            })
            .catch(function (err) {
                next(err)
            });
    },
    
    async subCategoryList(req, res, next) {
        db.SubCategory.findAll({
            include: [{ model: db.category, attributes: ["id", "name"] }]
        })
            .then(category => {
                res.status(200).json({ 'success': true, data: category });
            })
            .catch(function (err) {
                next(err)
            });
    },

    //child category id
    async childCategoryCreate(req, res, next) {
        const { name, categoryId, subCatId } = req.body;
        db.childcategory.findOne({ where: { name: name } })
            .then(data => {
                if (data) {
                    return db.childcategory.update({ name: name, categoryId: categoryId, subCatId: subCatId }, { where: { id: data.id } })
                }
                return db.childcategory.create({ name: name, categoryId: categoryId, subCatId: subCatId })
            })
            .then(data => {
                res.status(200).json({ 'success': true, msg: "Successfully inserted childcategory" });
            })
            .catch(function (err) {
                next(err)
            });
    },

    async childCategoryList(req, res, next) {
        
        db.ChildCategory.findAll({
            include: [{ model: db.category, attributes: ["id", "name"] }]
        })
            .then(category => {
                res.status(200).json({ 'success': true, data: category });
            })
            .catch(function (err) {
                next(err)
            });
    },

    async SubCategoryUpdate(req, res, next) {
        const { id, name } = req.body;
        db.SubCategory.findOne({ where: { id: id } })
            .then(data => {
                if (data) {
                    return db.SubCategory.update({ name: name }, { where: { id: data.id } })
                }
                throw new RequestError('Id is Empty', 409);
            })
            .then(category => {
                res.status(200).json({ 'success': true, msg: "Successfully inserted category" });
            })
            .catch(function (err) {
                next(err)
            });
    },
    async getSubCategoryList(req, res, next) {
        try {
            db.SubCategory.findAll({
                where: { categoryId: req.query.categoryId },
                include: [{ model: db.category, attributes: ["id", "name"] }]
            })
                .then(list => {
                    res.status(200).json({ 'success': true, data: list });
                })
                .catch(function (err) {
                    next(err)
                });
        }
        catch (err) {
            throw new RequestError('Error');
        }
    },
}