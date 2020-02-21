import * as Yup from 'yup';
import DeliveryProblem from '../models/DeliveryProblem';
import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';

class DeliveryProblemController {
  /**
   * List all the problems of a delivery
   */
  async index(req, res) {
    const { id } = req.params;

    const delivery = await Delivery.findByPk(id);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not found ' });
    }

    const delivery_problems = await DeliveryProblem.findAll({
      where: {
        delivery_id: id,
      },
      attributes: ['description'],
      include: [
        {
          model: Delivery,
          as: 'delivery',
          attributes: ['product', 'start_date'],
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
        },
      ],
    });
    return res.json(delivery_problems);
  }

  /**
   * Create a delivery problem
   */
  async store(req, res) {
    const { id } = req.params;

    const delivery = await Delivery.findByPk(id);
    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not found' });
    }

    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails ' });
    }

    if (!delivery.start_date) {
      return res
        .status(400)
        .json({ error: 'This delivery has not been picked up yet' });
    }

    if (delivery.end_date) {
      return res
        .status(400)
        .json({ error: 'This delivery has already been delivered' });
    }

    req.body.delivery_id = id;

    const problem = await DeliveryProblem.create(req.body);

    return res.json(problem);
  }
}

export default new DeliveryProblemController();
