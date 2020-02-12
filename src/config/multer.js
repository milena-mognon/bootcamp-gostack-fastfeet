/**
 * Multer: Biblioteca que trabalha com upload de arquivos
 * crypto: Biblioteca que trabalha com criptografia
 */
import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

// exporta um objeto de configuração
export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err);
        /* o cb (callback) recebe como primeiro parametro o erro
         * se não tem erro recebe null
         * foi verificado anteriormente se tinha erro
         * res = resposta de crypto.randomBytes
         */
        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
