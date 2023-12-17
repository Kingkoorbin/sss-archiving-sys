import { type Request, type Response } from 'express';
import csvtojson from 'csvtojson';

export const extractCsv = async (req: Request, res: Response) => {
  try {
    const file = req.file as any;
    if (file == undefined) {
      throw new Error('No file uploaded.');
    }

    return await csvtojson().fromString(file.buffer.toString());
    // Convert CSV to JSON
  } catch (error) {
    throw error;
  }
};
