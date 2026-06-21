import { PDFDocument, degrees, rgb, StandardFonts } from "pdf-lib";

/* ─── Compress ─────────────────────────────────── */
export async function compressPdf(file: File): Promise<Uint8Array> {
  const bytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });

  pdf.setTitle("");
  pdf.setAuthor("");
  pdf.setSubject("");
  pdf.setKeywords([]);
  pdf.setProducer("");
  pdf.setCreator("");

  const saved = await pdf.save({
    useObjectStreams: true,
    addDefaultPage: false,
  });

  return saved;
}

/* ─── Merge ────────────────────────────────────── */
export async function mergePdfs(files: File[]): Promise<Uint8Array> {
  const merged = await PDFDocument.create();

  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const pages = await merged.copyPages(pdf, pdf.getPageIndices());
    pages.forEach((page) => merged.addPage(page));
  }

  return merged.save();
}

/* ─── Split ────────────────────────────────────── */
export async function splitPdf(
  file: File,
  ranges: [number, number][]
): Promise<{ name: string; bytes: Uint8Array }[]> {
  const bytes = await file.arrayBuffer();
  const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const results: { name: string; bytes: Uint8Array }[] = [];

  for (let i = 0; i < ranges.length; i++) {
    const [start, end] = ranges[i];
    const newPdf = await PDFDocument.create();
    const indices = [];
    for (let p = start - 1; p < end; p++) {
      if (p >= 0 && p < src.getPageCount()) indices.push(p);
    }
    const pages = await newPdf.copyPages(src, indices);
    pages.forEach((page) => newPdf.addPage(page));
    results.push({
      name: `part_${i + 1}.pdf`,
      bytes: await newPdf.save(),
    });
  }

  return results;
}

/* ─── Rotate ───────────────────────────────────── */
export async function rotatePdf(
  file: File,
  angle: 90 | 180 | 270
): Promise<Uint8Array> {
  const bytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const pages = pdf.getPages();
  pages.forEach((page) => {
    const current = page.getRotation().angle;
    page.setRotation(degrees(current + angle));
  });
  return pdf.save();
}

/* ─── Protect ──────────────────────────────────── */
export async function protectPdf(
  file: File,
  userPassword: string,
  ownerPassword?: string
): Promise<Uint8Array> {
  const bytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
  // NOTE: pdf-lib doesn't support encryption natively.
  // For production, integrate pdf-lib-encrypt or a WASM solution.
  return pdf.save();
}

/* ─── Image to PDF ─────────────────────────────── */
export async function imagesToPdf(files: File[]): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();

  for (const file of files) {
    const bytes = await file.arrayBuffer();
    let image;

    if (file.type === "image/png") {
      image = await pdf.embedPng(bytes);
    } else {
      image = await pdf.embedJpg(bytes);
    }

    const page = pdf.addPage([image.width, image.height]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height,
    });
  }

  return pdf.save();
}

/* ─── Watermark ────────────────────────────────── */
export async function addWatermark(
  file: File,
  text: string,
  opacity: number = 0.15,
  fontSize: number = 50
): Promise<Uint8Array> {
  const bytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const pages = pdf.getPages();

  pages.forEach((page) => {
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    const textHeight = font.heightAtSize(fontSize);

    page.drawText(text, {
      x: (width - textWidth) / 2,
      y: (height - textHeight) / 2,
      size: fontSize,
      font,
      color: rgb(0.5, 0.5, 0.5),
      opacity,
      rotate: degrees(45),
    });
  });

  return pdf.save();
}

/* ─── Reorder ──────────────────────────────────── */
export async function reorderPdf(
  file: File,
  newOrder: number[]
): Promise<Uint8Array> {
  const bytes = await file.arrayBuffer();
  const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const newPdf = await PDFDocument.create();
  const zeroBased = newOrder.map((n) => n - 1);
  const pages = await newPdf.copyPages(src, zeroBased);
  pages.forEach((page) => newPdf.addPage(page));
  return newPdf.save();
}

/* ─── Get page count ───────────────────────────── */
export async function getPdfPageCount(file: File): Promise<number> {
  const bytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
  return pdf.getPageCount();
}

/* ─── Download helper ──────────────────────────── */
export function downloadBlob(data: Uint8Array, filename: string) {
  const blob = new Blob([data], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
