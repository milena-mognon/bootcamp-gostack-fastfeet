import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import User from '../models/User';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    // Regras de validação
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });

    // Validação dos dados
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    // Recuperação dos dados enviados na requisição
    const { email, password } = req.body;

    // Busca de usuário pelo email
    const user = await User.findOne({ where: { email } });

    // Verificação (Usuário encontrado/existente)
    if (!user) {
      return res.status(401).json({ error: 'User not found!' });
    }

    // Verificação (Senha)
    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match!' });
    }

    const { id, name } = user;

    // Resposta - Tudo certo para logar
    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
