import { type Request, type Response } from 'express';
import { extractCsv } from '../_core/services/csv-uploader.service';
import PDFDocument from 'pdfkit';
import { validateGeneratePdfBody } from '../_core/validators/csv.validator';
import { statuses } from '../_core/const/api.statuses';
import axios from 'axios';
import { getEnv } from '../_core/config/env.config';
import dayjs from 'dayjs';
import { convertToISODate, isEmpty } from '../_core/utils/common/common.util';

export const uploadCsv = async (req: Request, res: Response) => {
  try {
    const csvData = await extractCsv(req, res);
    const env = await getEnv();

    const mappedData = csvData.map((v) => {
      const mappedObject: any = {
        name: v['Name of Employee'],
        sss_no: v['SS Number'],
        ss: v['SS'],
        ec: v['EC'],
        total: v['Total Contributions'],
        batchDate: req.body?.batchDate
      };

      if(!isEmpty(v['SBR No'])) {
        mappedObject.sbr_no = v['SBR No'];
      }
      if(!isEmpty(v['SBR Date'])) {
        mappedObject.sbr_date = convertToISODate(v['SBR Date']);
      }
      return mappedObject;
    });
    
    await axios.post(`${env.RECEIVER_HOST}/api/record/v1`, {
      contributions: mappedData,
    });

    return res.status(200).json(statuses['00']);
  } catch (error: any) {
    console.log(error.response.data);
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const generatePdf = async (req: Request, res: Response) => {
  try {
    const error = validateGeneratePdfBody(req.body);
    if (error) {
      return res.status(400).json({
        ...statuses['501'],
        error: error.details[0].message.replace(/['"]/g, ''),
      });
    }

    const array: any[] = req.body?.array
      .map((v: any) => ({
        name: v?.name,
        sbr_date: v?.sbr_date,
        sbr_no: v?.sbr_no,
        sss_no: v?.sss_no,
        ss: v?.ss,
        ec: v?.ec,
        total: v?.total,
      }))
      .filter((v: any) => v?.sbr_date && v?.sbr_no);

    if (!req.body?.array.length) {
      return res.status(400).json({ message: 'PDF Generation requires value. ' });
    }

    // Create a new PDF document
    const doc = new PDFDocument();

    // Set response headers for PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=SSS-ARCHIVING-SYS-${dayjs(new Date()).format()}.pdf`);

    // Pipe the PDF content to the response
    doc.pipe(res);

    // Set padding
    const padding = {
      top: doc.page.margins.top + doc.page.margins.bottom, // 10% padding at top and bottom
      right: doc.page.margins.left + doc.page.margins.right, // 20% padding on both left and right
    };

    // Add content to the PDF

    // Define the number of rows per page
    const rowsPerPage = 25;

    // Flag to track if the header has been drawn
    let headerDrawn = false;

    // Declare startX outside the loop
    let startX: number;
    let currentY: number = 0;
    // Calculate the fixed width for each column
    const firstColumnWidth = 150;
    const otherColumnsWidth = 60;
    const tableHeaders = ['Employee', 'SBR Date', 'SBR No.', 'SS No.', 'SS', 'EC', 'Total'];
    const tableWidth = firstColumnWidth + (tableHeaders.length - 1) * otherColumnsWidth;

    doc.fillColor('black').fontSize(24).text('SSS Archiving System', {
      align: 'center',
    });

    doc
      .fillColor('black')
      .fontSize(10)
      .text(`Date Generated ${new Date().toISOString().substring(0, 10)}`, {
        align: 'center',
      });

    // Iterate through employee data and create a table
    for (let i = 0; i < array.length; i += rowsPerPage) {
      const currentData = array.slice(i, i + rowsPerPage);

      // Draw table headers only on the first page
      if (!headerDrawn) {
        currentY = padding.top;

        // Adjust the startX for the first column based on the fixed width
        startX = (doc.page.width - tableWidth) / 2;

        // Draw table headers with black background, white text, and 0.5px borders
        doc.rect(startX, currentY, tableWidth, 20).fillAndStroke('#EA0976', 'white');
        tableHeaders.forEach((header, index) => {
          const columnWidth = index === 0 ? firstColumnWidth : otherColumnsWidth;
          doc
            .fillColor('white')
            .fontSize(10)
            .text(header, startX + 5, currentY + 5, {
              width: columnWidth,
              align: 'left',
            });
          startX += columnWidth;
        });

        // Move to the next row
        currentY += 20;
        headerDrawn = true;
      }
      // Draw a row for each employee
      currentY = padding.top + 20; // Move down to start drawing below the header

      doc.font('Helvetica').fontSize(8);
      currentData.forEach((employee, rowIndex) => {
        startX = (doc.page.width - tableWidth) / 2; // Reset startX for each row

        Object.entries(employee).forEach(([key, value], index) => {
          const columnWidth = index === 0 ? firstColumnWidth : otherColumnsWidth;
          doc.fillColor('black').text(value as any, startX + 5, currentY + 5, {
            width: columnWidth,
            align: 'left',
          });
          startX += columnWidth;
        });

        // Move to the next row
        currentY += 20;
      });

      // Add a new page for the next set of rows
      if (i + rowsPerPage < array.length) {
        doc.addPage();
      }
    }

    let totalRowY = currentY + 20; // Add 20px margin after the last row

    // Check if there's space for another row (20px margin)
    if (totalRowY + 20 > doc.page.height - padding.top) {
      // Add a new page with 20px margin
      doc.addPage();
      totalRowY = padding.top + 20; // Reset totalRowY after adding a new page
    }

    const totalStartX = (doc.page.width - tableWidth) / 2;
    doc.rect(totalStartX, totalRowY + 5, tableWidth, 0.1).fillAndStroke('#EA0976');

    // doc.rect(totalStartX, totalRowY, tableWidth, 30).fillAndStroke('#EA0976', 'white');
    const totalColumnWidth = otherColumnsWidth * (tableHeaders.length - 1); // Exclude the first column
    const total = array.reduce((acc, employee) => acc + (parseFloat(employee['total'].replace(',', '')) || 0), 0);

    doc
      .fillColor('#777')
      .fontSize(10)
      .text('Total Contributions', totalStartX + totalColumnWidth - 40, totalRowY + 25, {
        align: 'right',
      });

    doc
      .fillColor('black')
      .fontSize(16)
      .text(
        `PHP ${total.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`,
        totalStartX + totalColumnWidth,
        totalRowY + 40,
        {
          align: 'right',
        },
      );

    // Finalize the PDF
    doc.end();
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
