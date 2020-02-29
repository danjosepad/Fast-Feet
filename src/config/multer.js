import { diskStorage } from 'multer';
import { randomBytes } from 'crypto';
import { extname, resolve } from 'path';

export default {
  storage: diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: (req, file, cb) => {
      randomBytes(16, (err, res) => {
        if (err) return cb(err);

        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
