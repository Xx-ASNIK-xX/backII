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

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
};

// Estrategia JWT para autenticación general
passport.use('jwt', new JwtStrategy(options, async (jwtPayload, done) => {
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

// Estrategia para la ruta /current
passport.use('current', new JwtStrategy(options, async (jwtPayload, done) => {
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