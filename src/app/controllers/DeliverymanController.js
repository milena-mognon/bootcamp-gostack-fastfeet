import * as Yup from 'yup';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class DeliverymanController {
  /**
   * List all the deliverymen
   */
  async index(req, res) {
    const deliverymen = await Deliveryman.findAll({
      attributes: ['name', 'email'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });
    return res.json(deliverymen);
  }

  /**
   * Create a deliveryman
   */
  async store(req, res) {
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

    const deliverymanExist = await Deliveryman.findOne({
      where: { email: req.body.email },
    });

    if (deliverymanExist) {
      return res.status(400).json({ error: 'Deliveryman Already Exist!' });
    }

    const { name, email, avatar_id } = await Deliveryman.create(req.body);

    return res.json({
      name,
      email,
      avatar_id,
    });
  }

  /**
   * Update a deliveryman
   */
  async update(req, res) {
    const { id } = req.params;
    const schema = Yup.object().shape({
      name: Yup.string().notOneOf([null, '']),
      email: Yup.string()
        .email()
        .notOneOf([null, '']),
      avatar_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const { email, avatar_id } = req.body;

    const deliveryman = await Deliveryman.findByPk(id);

    if (email && email !== deliveryman.email) {
      const deliverymanExist = await Deliveryman.findOne({ where: { email } });

      if (deliverymanExist) {
        return res.status(400).json({ error: 'Deliveryman Already Exist!' });
      }
    }

    if (avatar_id) {
      const avatarExist = await File.findByPk(avatar_id);
      if (!avatarExist) {
        return res.status(400).json({ error: 'Avatar image does not exist' });
      }
    }

    const { name } = await deliveryman.update(req.body);

    return res.json({
      name,
      email,
    });
  }

  /**
   * Delete a deliveryman
   */
  async delete(req, res) {
    const { id } = req.params;

    const deliveryman = await Deliveryman.findByPk(id);

    if (!deliveryman) {
      return res.json({ error: 'Deliveryman not found' });
    }

    await deliveryman.destroy();

    return res.json(deliveryman);
  }
}

export default new DeliverymanController();
