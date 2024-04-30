import { diskStorage } from 'multer';

export const storage = diskStorage({
  destination: './public/upload/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
