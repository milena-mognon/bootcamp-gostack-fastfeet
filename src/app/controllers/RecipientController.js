import * as Yup from 'yup';
import Recipient from '../models/Recipient';

class RecipientController {
  /**
   * List all the recipients
   */
  async index(req, res) {
    const users = await Recipient.findAll();

    return res.json(users);
  }

  /**
   * Create a recipient
   */
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      address: Yup.string().required(),
      number: Yup.number().required(),
      complement: Yup.string(),
      zip: Yup.string().required(),
      state: Yup.string().required(),
      city: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Error!' });
    }

    const { id, name, address, city } = await Recipient.create(req.body);
    return res.json({
      id,
      name,
      address,
      city,
    });
  }

  /**
   * Update a Recipient
   */
  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().notOneOf([null, '']),
      address: Yup.string().notOneOf([null, '']),
      number: Yup.number(),
      complement: Yup.string().notOneOf([null, '']),
      zip: Yup.string().notOneOf([null, '']),
      state: Yup.string().notOneOf([null, '']),
      city: Yup.string().notOneOf([null, '']),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Error!' });
    }

    const { id } = req.params;
    const user = await Recipient.findByPk(id);

    const { name, address, city } = await user.update(req.body);

    return res.json({
      id,
      name,
      address,
      city,
    });
  }
}

export default new RecipientController();
