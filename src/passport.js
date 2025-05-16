import passport from 'passport';
import { Strategy as JwtStrategy } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import { db } from './models';
import bcrypt from 'bcrypt-nodejs';
import 'dotenv/config';

var TokenExtractor = function (req) {
    var token = null;
    if (req && req.cookies) {
        token = req.cookies['XSRF-token'];
    }
    return token;
}


// JSON WEB TOKENS STRATEGY
passport.use(new JwtStrategy({
    jwtFromRequest: TokenExtractor,
    secretOrKey: process.env.APP_SECRET || 'NodeJSProject', 
}, async (payload, done) => {
    try {
        var user = null;
        if (payload.iam == "user") user = await db.user.findOne({ where: { id: payload.sub }, attributes: ['id', 'firstname', 'lastname', 'email', 'companyId', 'password', 'attempt', 'loggedOutAt', 'status', 'valid', 'createdAt', 'resetPassword'], required: true, include: [{ model: db.Company }] });
        else if (payload.iam == "root") {
            user = await db.User.findOne({ where: { id: payload.sub }, attributes: ['id', 'firstname', 'lastname', 'email', 'companyId', 'password', 'attempt', 'loggedOutAt', 'status', 'valid', 'createdAt', 'resetPassword'], required: true, include: [{ model: db.Company }] });
        }
        if (!user) {
            return done('user', false);
        }
        user.type = payload.iam;
        const tokenDate = new Date(payload.iat);
        if (user.loggedOutAt != null && (tokenDate.getTime() - user.loggedOutAt.getTime()) < 0) {
            return done('invalid', false);
        }

        if (new Date(payload.exp) < new Date()) {
            return done('expired', false);
        }
        if (user.resetPassword) {
            return done(null, user, 'resetPassword/' + user.email);
        }
        done(null, user);
    } catch (error) {
        done(error, false);
    }
}));

// LOCAL STRATEGY
passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
}, async (req, email, password, done) => {
    try {
        const user = await db.User.findOne({ where: { email: email }, attributes: ['id', 'firstname', 'lastname', 'email', 'password'], required: true, })
        if (!user) {
            return done(null, false);
        }
        bcrypt.compare(password, user.password, function (err, result) {
            if (!result) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        })
    }
    catch (error) {
        done(error, false);
    }
}));


// IAM ROOT STRATEGY
passport.use('root-login', new LocalStrategy({
    usernameField: 'email'
}, async (email, password, done) => {
    try {
        const user = await db.User.findOne({
            where: {
                email: email
            },
            attributes: ['id', 'firstname', 'lastname', 'email', 'password', 'createdAt',]
        });
        if (!user) {
            return done(null, false);
        }
        bcrypt.compare(password, user.password, function (err, result) {
            if (!result) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        })
    } catch (error) {
        done(error, false);
    }
}));

//client-strategy
passport.use('client-root-login', new LocalStrategy({
    usernameField: 'email'
}, async (email, password, done) => {
    try {
        const user = await db.customer.findOne({
            where: {
                email: email
            },
            attributes: ['id', 'firstname', 'lastname', 'email', 'password', 'createdAt',]
        });
        if (!user) {
            return done(null, false);
        }
        bcrypt.compare(password, user.password, function (err, result) {
            if (!result) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        })
    } catch (error) {
        done(error, false);
    }
}));

passport.use('client-local', new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
}, async (req, email, password, done) => {
    try {
        const user = await db.client.findOne({ where: { email: email } });
        if (!user) {
            return done(null, false);
        }

        if(user.status == 'inactive'){
            return done('invalid', false);
        }

        if (user.attempt == 5) {
            return done('attempt', false);
        }
        
        var isMatch=  bcrypt.compareSync(password, user.password);

        if (!isMatch) {
            user.update({
                attempt: user.attempt + 1
            })
            return done('attempt:' + (5 - user.attempt), false);
        } else {
            user.update({ attempt: 0 })
        }
        done(null, user);
    } catch (error) {
        console.log(error)
        done(error, false);
    }
}));