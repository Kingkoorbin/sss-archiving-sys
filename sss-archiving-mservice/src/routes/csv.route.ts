import { Router } from 'express';
import { uploadCsv, generatePdf } from '../controllers/csv.controller';
import { checkUserOrigin } from '../_core/middlewares/check-origin.middleware';

const router = Router();

router.post('/upload/v1/csv', uploadCsv as any);
router.post('/generate/v1/pdf', generatePdf as any);

export default router;
