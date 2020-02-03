import jwt from 'jsonwebtoken';

/**
 * Biblioteca util é padrão do node
 * promsify é usado para pegar pega função de callback e tranforma em uma que
 * pode usar async/await
 */
import { promisify } from 'util';

import authConfig from '../../config/auth';

export default async (req, res, next) => {
  // Recupera o token enviado na requisição através do header
  const authHeader = req.headers.authorization;

  // Verifica se o token foi enviado
  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided.' });
  }

  /**
   * Técnica da desentruturação, quando é passado uma virgula direto será
   * utilizado somente a primeira posição do array, a posição 0 é descartada
   */
  const [, token] = authHeader.split(' ');

  // É utilizado try/cathc pois pode retornar erro
  try {
    /**
     * decoded é o valor retornado por jwt.verify()
     * Como a função jwt.veryfy() por padrão usa callback será utilizado
     * promisify(jwt.verify) retorna outra função e ,desta forma, podemos chamar
     * esta função logo em seguida passando outro () e os parametros da função
     * (token, authConfig.secret)
     */
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    // Requisição passa a ter o id do usuário
    req.userId = decoded.id;

    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid Token.' });
  }
};
