import fs from 'fs';
import multer from 'multer';
import path from 'path';
type FileUploadRequest = import('express').Request & {
  params: import('express').Request['params'] & {
    requestId?: string;
    requirementInstanceId?: string;
  };
};

type StoredFile = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
};

const storage = multer.diskStorage({
  destination: (
    req: FileUploadRequest,
    file: StoredFile,
    callback: (error: Error | null, destination: string) => void
  ) => {
    const requestId = req.params.requestId ?? 'general';
    const requirementId = req.params.requirementInstanceId ?? 'unknown';
    const destinationPath = path.join(
      process.cwd(),
      'uploads',
      'requests',
      String(requestId),
      String(requirementId)
    );

    if (!fs.existsSync(destinationPath)) {
      fs.mkdirSync(destinationPath, { recursive: true });
    }

    callback(null, destinationPath);
  },
  filename: (
    req: FileUploadRequest,
    file: StoredFile,
    callback: (error: Error | null, filename: string) => void
  ) => {
    const timestamp = Date.now();
    const extension = path.extname(file.originalname);
    const safeBaseName = path
      .basename(file.originalname, extension)
      .replace(/[^a-zA-Z0-9-_]/g, '_');
    callback(null, `${safeBaseName}_${timestamp}${extension}`);
  }
});

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

export const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES
  }
});
