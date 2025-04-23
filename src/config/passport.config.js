import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import UserModel from '../models/user.model.js';
import Logger from '../utils/logger.js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Verificar que la clave secreta esté definida
if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET no está definido en las variables de entorno');
}

// Función para extraer el JWT de la cookie firmada
const cookieExtractor = req => {
    if (req && req.signedCookies) {
        return req.signedCookies.currentUser;
    }
    return null;
};

const headerOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
    ignoreExpiration: false
};

const cookieOptions = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: process.env.JWT_SECRET,
    ignoreExpiration: false
};

// Estrategia JWT para autenticación general usando header bearer token
passport.use('jwt', new JwtStrategy(headerOptions, async (jwtPayload, done) => {
    try {
        const user = await UserModel.findById(jwtPayload.id);
        if (!user) {
            return done(null, false);
        }
        return done(null, user);
    } catch (error) {
        Logger.error('Error en estrategia JWT:', error);
        return done(error, false);
    }
}));

// Estrategia 'current' usando cookie firmada
passport.use('current', new JwtStrategy(cookieOptions, async (jwtPayload, done) => {
    try {
        const user = await UserModel.findById(jwtPayload.id);
        if (!user) {
            return done(null, false);
        }
        return done(null, user);
    } catch (error) {
        Logger.error('Error en estrategia current:', error);
        return done(error, false);
    }
}));

export default passport; 