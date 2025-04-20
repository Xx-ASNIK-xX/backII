import winston from 'winston';
import path from 'path';

// Configuración de niveles personalizados
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4
};

// Colores para cada nivel
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white'
};

// Agregar colores a winston
winston.addColors(colors);

// Formato para desarrollo (más detallado y colorido)
const developmentFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.colorize({ all: true }),
    winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`
    )
);

// Formato para producción (JSON para mejor procesamiento)
const productionFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
);

// Determinar el nivel según el entorno
const level = process.env.NODE_ENV === 'development' ? 'debug' : 'warn';

// Crear los transportes
const transports = [
    // Siempre escribir errores en un archivo separado
    new winston.transports.File({
        filename: path.join(process.cwd(), 'logs', 'error.log'),
        level: 'error',
        format: productionFormat
    }),
    // Archivo con todos los logs
    new winston.transports.File({
        filename: path.join(process.cwd(), 'logs', 'combined.log'),
        format: productionFormat
    })
];

// En desarrollo, también mostrar en consola
if (process.env.NODE_ENV !== 'production') {
    transports.push(
        new winston.transports.Console({
            format: developmentFormat
        })
    );
}

// Crear el logger
const Logger = winston.createLogger({
    level: level,
    levels,
    transports
});

export default Logger; 