import multer from "multer";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const MAX_IMAGE_UPLOAD_SIZE = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const MIME_TYPE_EXTENSIONS = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

export const uploadDestination = path.resolve(__dirname, "../public/uploads");

try {
  fs.mkdirSync(uploadDestination, { recursive: true });
} catch (err) {
  throw new Error(`Failed to create upload directory: ${uploadDestination}`, {
    cause: err,
  });
}

export const createSafeImageFilename = (file) => {
  const extension = MIME_TYPE_EXTENSIONS[file.mimetype] || ".jpg";
  return `product-${crypto.randomUUID()}-${Date.now()}${extension}`;
};

export const imageFileFilter = (req, file, cb) => {
  if (ALLOWED_IMAGE_MIME_TYPES.has(file.mimetype)) {
    cb(null, true);
    return;
  }

  cb(
    new Error("Only image files are allowed. Supported types: JPG, PNG, WEBP."),
    false,
  );
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDestination);
  },
  filename: (req, file, cb) => {
    cb(null, createSafeImageFilename(file));
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_IMAGE_UPLOAD_SIZE,
  },
  fileFilter: imageFileFilter,
});

export default upload;
