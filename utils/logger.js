import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener el nombre del archivo y el directorio actual en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directorios para los logs y los archivos JSON
const logDir = path.join(__dirname, 'logs');
const jsonLogDir = path.join(logDir, 'json');

// Crear directorios si no existen
import { existsSync, mkdirSync } from 'fs';
if (!existsSync(logDir)) {
  mkdirSync(logDir);
}
if (!existsSync(jsonLogDir)) {
  mkdirSync(jsonLogDir);
}

// Configuración del logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new DailyRotateFile({
      filename: path.join(logDir, 'combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxFiles: '7d',
      auditFile: path.join(jsonLogDir, 'combined-audit.json')
    }),
    new DailyRotateFile({
      filename: path.join(logDir, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxFiles: '7d',
      auditFile: path.join(jsonLogDir, 'error-audit.json')
    })
  ]
});

export default logger;
