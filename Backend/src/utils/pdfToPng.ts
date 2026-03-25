import { pdfToImg } from "pdftoimg-js";

export async function convertPdfToPng(certTemplatePath: string) {
    const dataUrl = await pdfToImg(certTemplatePath, {
        pages: "firstPage",
        imgType: "png",
        scale: 1,
    });

    const base64 = dataUrl.split(",")[1];
    const buffer = Buffer.from(base64, "base64");

    return new File([buffer], "certificate.png", { type: "image/png" });
}