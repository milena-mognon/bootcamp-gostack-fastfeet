import * as Yup from 'yup';
import Deliveryman from '../models/Deliveryman';

class DeliverymanController {
  /**
   * Listagem dos Entregadores
   */
  async index(req, res) {
    const deliverymen = await Deliveryman.findAll();
    return res.json(deliverymen);
  }

  /**
   * Cadastro de Entregador
   */
  async store(req, res) {
    /**
     * Validação
     */
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      avatar_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    /**
     * Verificação: entregador já cadastrado ou não
     * campo único para verificação: email
     */
    const deliverymanExist = await Deliveryman.findOne({
      where: { email: req.body.email },
    });

    if (deliverymanExist) {
      return res.status(400).json({ error: 'Deliveryman Already Exist!' });
    }

    /**
     * Cadastro do Entregador
     */
    const { name, email, avatar_id } = await Deliveryman.create(req.body);

    /**
     * Resposta / Retorno
     */
    return res.json({
      name,
      email,
      avatar_id,
    });
  }

  async update(req, res) {
    return res.json();
  }
}

export default new DeliverymanController();
