import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { promises as fs } from "fs";

export const fetchAndFillCertificate = async (
    pdfBytes: Buffer,
    name: string,
    surname: string,
    textYPosition: number,
    textXPosition: number,
    textSize: number
): Promise<Buffer | null> => {
  try {
    const pdfDoc = await PDFDocument.load(pdfBytes);
    pdfDoc.registerFontkit(fontkit);

    const fontBytes = await fs.readFile("./fonts/NotoSansThai-Regular.ttf");
    const thaiFont = await pdfDoc.embedFont(fontBytes);

    const page = pdfDoc.getPages()[0];
    const text = `${name} ${surname}`;
    const fontSize = textSize;
    const { width, height } = page.getSize();

    const textWidth = thaiFont.widthOfTextAtSize(text, fontSize);
    const x = (width - textWidth) / 2 + (textXPosition || 0);
    const y = height * (textYPosition / 100);

    page.drawText(text, {
      x: x,
      y: y,
      size: fontSize,
      font: thaiFont,
      color: rgb(0, 0, 0),
    });

    const modifiedPdfBytes = await pdfDoc.save();
    return Buffer.from(modifiedPdfBytes);
  } catch (error) {
    console.error("Error processing PDF:", error);
    return null;
  }
};

export const validateThaiFont = async (): Promise<boolean> => {
  try {
    const fontBytes = await fs.readFile("./fonts/NotoSansThai-Regular.ttf");
    return fontBytes.length > 0;
  } catch (error) {
    console.error("Thai font file not found or invalid:", error);
    return false;
  }
};