import multer from 'multer';

export const fileFilter = (req: any, file: any, callback: any) => {
  if (file.mimetype === 'text/csv') {
    callback(null, true);
  } else callback(null, false);
};

export const multerUploadCsv = multer({
  storage: multer.memoryStorage(),
});
