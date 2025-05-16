import { db } from '../../../models';
import JWT from 'jsonwebtoken';
import config from '../../../config';
import bcrypt from 'bcrypt-nodejs';
import speakeasy from 'speakeasy';
import nodemailer from 'nodemailer';
import { validateEmail } from '../../../functions'
import 'dotenv/config';

const OTP_EXPIRATION_MINUTES = 10;

var JWTSign = function (user, date) {
    return JWT.sign({
        iss: config.app.name,
        sub: user.id,
        iam : user.type,
        iat: date.getTime(),
        exp: new Date().setMinutes(date.getMinutes() + 30)
    }, config.app.secret);
}

function generateOtp() {
    let token = speakeasy.totp({
        secret: "mdUlDbW14WEpWWktuT2NWTVcyRmlLUEtRYTplalRncnAxVnZoZ3BVTDdjTGt6ckxCQk",
        encoding: 'base32',
        step: (30 - Math.floor((new Date().getTime() / 1000.0 % 30)))
    });
    return token;
}

export default {    
    async initiateRegistration(req, res, next) {
        try {
            const { firstName, lastName, phone, address, email, password, gender } = req.body;            
            
            // Buscar registro temporal
            const existingUser = await db.client.findOne({
                where: { email }, paranoid: false
            });           

            const pendingUser = await db.PendingCustomer.findOne({
                where: { email }
            });            
            
            if (existingUser || pendingUser) {
                throw new RequestError('El correo ya está registrado', 409);
            }
    
            // Generar OTP y hash de contraseña
            const otp = generateOtp();
            const passwordHash = bcrypt.hashSync(password);
            const expiresAt = new Date(Date.now() + OTP_EXPIRATION_MINUTES * 60000);
    
            // Guardar en tabla temporal
            await db.PendingCustomer.create({
                firstName, 
                lastName, 
                phone, 
                address, 
                email, 
                gender,
                password: passwordHash,
                otp,
                expiresAt
            });
    
            // Enviar correo y manejar errores
            try {
                
                var smtpTransport = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: process.env.GMAIL_USER,
                        pass: process.env.GMAIL_PASSWORD,
                    },
                });
                // 2. Configurar el contenido del correo
                const mailOptions = {
                    from: process.env.GMAIL_USER,
                    to: email,
                    subject: 'ShopStore Market Website Registration',
                    html: `
                        <div style="font-family: Arial, sans-serif; color: #333;">
                            <h2 style="color: #2c3e50;">Dear user,</h2>
                            <p>Gracias por registrarte con ShopStore Market.</p>
                            <div style="background: #f8f9fa; padding: 20px; border-radius: 5px;">
                                <strong style="font-size: 24px; color: #27ae60;">${otp}</strong>
                            </div>
                            <p>Este codigo expira en 30 segundos.</p>
                            <p><em>Este correo es generado por la aplicación. Por favor, no responda.</em></p>
                            <hr style="border-color: #eee;">
                            <p>Nuestros mejores deseos,<br> Equipo ShopStore Market<br>Tienda virtual</p>
                        </div>
                    `
                };
                await smtpTransport.sendMail(mailOptions);

                res.status(200).json({ 
                    success: true, 
                    key: otp, 
                    msg: "New Registration added and password has been sent to " + email + " ." 
                });
            } catch (emailError) {
                console.error("Error sending email:", emailError);
                // Opcional: revertir la creación del usuario si es necesario
                throw new RequestError('Registration succeeded, but failed to send email', 500);
            }
        } catch (error) {
            next(error);
        }
    },
    // Controlador para verificar OTP
    async verifyOtp(req, res, next) {
        try {
            const { firstName, lastName, phone, address, email, password, gender, otp } = req.body;
            
            // Buscar registro temporal
            const pendingUser = await db.PendingCustomer.findOne({
                where: { email }
            });

            if (!pendingUser) {
                throw new RequestError('Registro no encontrado', 404);
            }

            // Validar OTP y expiración
            if (pendingUser.otp !== otp) {
                throw new RequestError('Código OTP inválido', 401);
            }

            if (new Date() > pendingUser.expiresAt) {
                await pendingUser.destroy();
                throw new RequestError('Código OTP expirado', 410);
            }
            
            // Crear usuario final
            const newUser = await db.client.create({
                firstName: pendingUser.firstName,
                lastName: pendingUser.lastName,
                phone: pendingUser.phone,
                address: pendingUser.address,
                email: pendingUser.email,
                password: pendingUser.password,
                gender: pendingUser.gender,
                verified: true
            });

            // Limpiar registro temporal
            await pendingUser.destroy();

            res.status(201).json({
                success: true,
                message: 'Usuario registrado exitosamente',
                data: newUser
            });
        } catch (error) {
            next(error);
        }
    },

    async findUser(req,res,next){
        db.client.findOne({ 
            where: { email: req.query.email }, paranoid: false,
            include: [{ model: db.Address }]
         })
        .then(user => {
            if (user) {
                return res.status(200).json({ success: true, data:user});
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
        var secure = (process.env.APP_SECURE == 'true') || false
        res.cookie('XSRF-token',     token, {
            expire: new Date().setMinutes(date.getMinutes() + 30), 
            httpOnly: true, secure: secure
        });
        
        return res.status(200).json({ success: true ,token});
    },

    async rootUserCheck(req, res) {
        if (validateEmail(req.body.email)) {
            db.user.findOne({
                where: {
                    email: req.body.email
                }
            })
                .then(user => {
                    if (user) return res.status(200).json({
                        success: true,
                        redirect: false,
                        email: req.body.email
                    });
                    return res.status(401).json({
                        success: false,
                        redirect: false,
                        msg: "La informacion de inicio de sesion que proporcionó no exite. Intenta de nuevo o crea una cuenta."
                    })
                })
        }
    },

    async getAllClient(req,res,next){
        db.client.findAll()
        .then(user => {
            if (user) {
                return res.status(200).json({ success: true, data:user});
            }
            else
                res.status(500).json({ 'success': false });
        })
        .catch(err => {
            console.log(err)
            next(err);
        })
    },

    async deleteClient(req, res, next) {
        try {
            db.client.findOne({ where: { id: parseInt(req.query.id) } })
            .then(client => {
                if (client) {
                    return db.client.destroy({ where: { id: client.id } })
                }
                throw new RequestError('Cliente no encontrado')
            })
            .then(re => {
                return res.status(200).json({'msg':'success','status': "Cliente eliminado satisfactoriamente" });
            }).catch(err => {
                next(err)
            })
        }
        catch (err) {
            throw new RequestError('Error');
        }
    },

    //Api client update 
    async getClientUpdate(req, res, next) {
        try {
            const{ id, firstName, lastName, phone, gender }= req.body.data;
            db.client.findOne({ where: { id: id } })
            .then(client => {
                if (client) {
                    return db.client.update({ 
                        firstName: firstName, lastName: lastName, phone: phone, gender: gender
                     },{where: {id: client.id}})
                }
                throw new RequestError('client is not found')
            })
            .then(re => {
                return res.status(200).json({'msg':'success','status': "deleted client Seccessfully" });
            }).catch(err => {
                next(err)
            })
        }
        catch (err) {
            throw new RequestError('Error');
        }
    },

}




