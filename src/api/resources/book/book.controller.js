import { db } from '../../../models';
const { Op } = require("sequelize");

export default {   

    async addBook(req, res, next) {
        try {
            const relativePath = `uploads/${req.file.filename}`;           
            const { categoryId, subCategoryId, childCategoryId, name, slug, writer, status, preview, gender, buyerPrice, price, qty, discount, discountPer, total, netPrice } = req.body;
            db.book.findOne({
                where: { name: name }
            })
                .then(book => {
                    if (!book) {
                        return db.book.create({
                            categoryId: categoryId,
                            subCategoryId: subCategoryId,
                            childCategoryId: childCategoryId,
                            name: name,
                            slug: slug,
                            status: parseInt(status) ? 'active' : 'inactive',
                            writer: writer,
                            preview: preview,
                            gender: gender,
                            buyerPrice: buyerPrice,
                            price: price,
                            qty: qty,
                            discount: discount,
                            discountPer: discountPer,
                            total: total,
                            netPrice: netPrice,
                            photo: relativePath
                            // photo: req.file.path.replace(/\\/g, '/')
                        })
                    }
                    throw new RequestError('Already exist product', 409);
                })
                .then(product => {
                    res.status(200).json({ 'success': true, msg: "Successfully inserted product" });
                })
                .catch(function (err) {
                    next(err)
                });
        }
        catch (err) {
            throw new RequestError('Error');
        }
    },
    
    async getAllGrocerryStaples(req, res, next) {
        try {
            db.category.findOne({
                attributes: ["id", "slug"],
                where: { slug: 'grocery-staples' },
                include: [{ model: db.product, order: [['createdAt', 'DESC']], include: [{ model: db.productphoto, attributes: ["id", "imgUrl"] }] }],

            })
                .then(product => {
                    res.status(200).json({ 'success': true, data: product });
                })
                .catch(function (err) {
                    next(err)
                });
        }
        catch (err) {
            throw new RequestError('Error');
        }
    },
    
    async getAllProductList(req, res, next) {
        
        try {            
            db.book.findAll({
                order: [['createdAt', 'DESC']],
                include: [{ model: db.subcategory, attributes: ["id", "sub_name"], include: [{ model: db.category, attributes: ["id", "name"] }] }]
                
            })
                .then(book => {
                    console.log(book);                 
                    res.status(200).json({ 'success': true, book });
                })
                .catch(function (err) {
                    next(err)
                });
        }
        catch (err) {
            throw new RequestError('Error');
        }
    },

    async getProductListById(req, res, next) {
        try {
            db.product.findAll({
                where: { id: req.query.id },
                include: [{ model: db.productphoto, attributes: ["id", "imgUrl"] }],
                order: [['createdAt', 'DESC']],
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

    async getAllProductList(req, res, next) {
        
        try {            
            db.product.findAll({
                order: [['createdAt', 'DESC']],
                include: [{ model: db.SubCategory, attributes: ["id", "name"], include: [{ model: db.category, attributes: ["id", "name"] }] }]
                
            })
                .then(product => {
                    console.log(product);                 
                    res.status(200).json({ 'success': true, product });
                })
                .catch(function (err) {
                    next(err)
                });
        }
        catch (err) {
            throw new RequestError('Error');
        }
    },

    async getWebProductListById(req, res, next) {
        try {
            db.book.findOne({
                where: { id: req.query.id },
                include: [{ model: db.bookphoto, attributes: ["id", "imgUrl"] }],
                order: [['createdAt', 'DESC']],
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

    async getAllProductBySlug(req, res, next) {
        try {
            db.category.findOne({
                attributes: ["id", "slug"],
                where: { slug: req.params.slug },
                include: [{ model: db.product, order: [['createdAt', 'DESC']], include: [{ model: db.productphoto, attributes: ["id", "imgUrl"] }] }]
            })
                .then(product => {
                    res.status(200).json({ 'success': true, data: product });
                })
                .catch(function (err) {
                    next(err)
                });
        }
        catch (err) {
            throw new RequestError('Error');
        }
    },

    async index(req, res, next) {
        try {
            // const { supplierId, categoryId, subCategoryId } = req.query
            db.book.findAll({
                order: [['createdAt', 'DESC']],
                // where: { supplierId: supplierId, categoryId: categoryId, subCategoryId: subCategoryId }
            })
                .then(book => {
                    res.status(200).json({ 'success': true, book });
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


