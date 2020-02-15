import * as Yup from 'yup';
import Order from '../models/Order';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';

class OrderController {
  /**
   * List all the orders
   */
  async index(req, res) {
    const orders = await Order.findAll({
      attributes: ['id', 'product', 'start_date', 'end_date'],
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name'],
        },
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'name',
            'address',
            'number',
            'complement',
            'zip',
            'state',
            'city',
          ],
        },
      ],
    });
    return res.json(orders);
  }

  /**
   * Create an Order
   */
  async store(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string().notOneOf(['', null]),
      deliveryman_id: Yup.number(),
      recipient_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const { deliveryman_id, recipient_id } = req.body;

    const recipientExist = await Recipient.findByPk(recipient_id);

    if (!recipientExist) {
      return res.status(400).json({ error: 'Recipient does not exist' });
    }

    const deliverymanExist = await Deliveryman.findByPk(deliveryman_id);

    if (!deliverymanExist) {
      return res.status(400).json({ error: 'Deliveryman does not exist' });
    }

    const { product } = await Order.create(req.body);

    return res.json({
      product,
      deliveryman_id,
      recipient_id,
    });
  }
}

export default new OrderController();
