import 'dotenv/config';
import { db } from './models';
import { restRouter } from './api';
import config from './config';
import appManager from './app';
import './errors';
import cors from 'cors';
import path from 'path';
import express from 'express';


console.log(__dirname);
global.appRoot = path.resolve(__dirname);

const PORT = process.env.APP_PORT || 5100
const HOST = process.env.APP_URL || 'localhost'

const app = appManager.setup(config);

// Servir archivos estáticos desde src/uploads
app.use('/uploads', express.static(path.join(__dirname, 'src', 'uploads')));

/*cors handling*/
app.use(cors({
	origin:true,
    credentials:true
}));
app.options('*', cors());

/* Route handling */
app.use('/api', restRouter);

app.use(function(req, res, next){
	if(!req.user){
		res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
	}
	next();
});

app.use((req, res, next) => {
	next(new RequestError('Invalid route', 404));
});

app.use((error, req, res, next) => {
	if (!(error instanceof RequestError)) {
		error = new RequestError('Some Error Occurred', 500, error.message);
    }
		error.status = error.status || 500;
	res.status(error.status);
	let contype = req.headers['content-type'];
	var json = !(!contype || contype.indexOf('application/json') !== 0);
	if (json) {
		return res.json({ errors: error.errorList });
	} else {
		res.render(error.status.toString(), {layout: null})
	}
});



/* Database Migrations */
db.sequelize.sync();

/* Database Connection */
db.sequelize.authenticate().then(function () {
	console.log('Database is OK !!');	
}).catch(function (err) {
	console.log(err, "Something went wrong with the Database !")
});

/* Start Listening service */
app.listen(PORT, HOST, () => {
	console.log(`Server is running at PORT http://${HOST}:${PORT}`);
});