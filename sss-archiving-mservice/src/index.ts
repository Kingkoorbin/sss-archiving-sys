import express, { type Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './_core/utils/db/db.util';
import { getEnv } from './_core/config/env.config';
import { maintenanceModeMiddleware } from './_core/middlewares/maintenance-mode.middleware';

import authRoute from './routes/auth.route';
import userRoute from './routes/user.route';
import csvRoute from './routes/csv.route';

import { requestLoggerMiddleware } from './_core/middlewares/request-logger.middleware';
import { multerUploadCsv } from './_core/utils/uploader/multer.config';

const app: Application = express();

async function runApp() {
  const env = await getEnv();
  // Middleware
  app.use(helmet()); // Apply standard security headers
  app.use(
    cors({
      exposedHeaders: ['X-Nodex-DateTime'],
    }),
  ); // Enable CORS for all routes

  app.use(multerUploadCsv.single('csv'));
  app.use(express.json());

  // Routes
  app.use(maintenanceModeMiddleware);
  app.use(requestLoggerMiddleware);

  app.use('/api', authRoute);
  app.use('/api', userRoute);
  app.use('/api', csvRoute);

  // Connect to MongoDB
  // connectDB();

  // Start the HTTPS server
  app.listen(Number(env?.PORT) || 5000, () => {
    console.log('@environment ', env?.ENVIRONMENT);
    console.log('@port ', Number(env?.PORT));
  });
}

runApp();
