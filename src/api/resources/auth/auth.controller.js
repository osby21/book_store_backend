import 'dotenv/config';
import { db } from '../../../models';
import bcrypt from 'bcrypt-nodejs';
import config from '../../../config';
import JWT from 'jsonwebtoken';

var JWTSign = function (user, date) {
    var secret = process.env.APP_SECRET || "dhuessjj4jq377y2uSw2y2Seeu232msdkdknnke"
    return JWT.sign({
        iss: config.app.name,
        sub: user.email,
        iat: date.getTime(),
        exp: new Date().setMinutes(date.getMinutes() + 30)
    }, secret);
}
export default {

    /* Add client api start here................................*/

    async register(req, res, next) {
        const { firstName, lastName, email, password } = req.body;
        var passwordHash = bcrypt.hashSync(password);
        db.User.findOne({ where: { email: email }, paranoid: false })
            .then(find => {
                if (find) {
                    throw new RequestError('Email is already in use', 409);
                }
                return db.User.create({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: passwordHash
                })

            })
            .then(user => {
                if (user) {
                    return res.status(200).json({ success: true, msg: "New Registration added and password has been sent to " + email + " ." });
                }
                else
                    res.status(500).json({ 'success': false });
            })
            .catch(err => {
                console.log(err)
                next(err);
            })
      
    },

    async login(req, res, next) {
        var date = new Date();
        var token = JWTSign(req.user, date);
        var usuario = req.user;
        var secure = (process.env.APP_SECURE == 'true') || false
        res.cookie('XSRF-token',     token, {
            expire: new Date().setMinutes(date.getMinutes() + 30),
            httpOnly: true, secure: secure
        });
        
        return res.status(200).json({ success: true ,token, usuario:usuario});
    },

}