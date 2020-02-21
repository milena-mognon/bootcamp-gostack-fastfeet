import DeliveryProblem from '../models/DeliveryProblem';
import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';
import Queue from '../../lib/Queue';
import CanceledDeliveryMail from '../jobs/CanceledDeliveryMail';

class CancelDeliveryController {
  /**
   * Cancel Delivery
   */

  async delete(req, res) {
    const { problem_id } = req.params;

    const delivery_problem = await DeliveryProblem.findByPk(problem_id, {
      attributes: ['description'],
      include: [
        {
          model: Delivery,
          as: 'delivery',
          attributes: ['id'],
        },
      ],
    });

    if (!delivery_problem) {
      return res.status(400).json({ error: 'Delivery problem not found' });
    }
    const delivery = await Delivery.findByPk(delivery_problem.delivery.id, {
      attributes: ['id', 'product', 'canceled_at'],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'name',
            'address',
            'number',
            'complement',
            'city',
            'state',
          ],
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name', 'email'],
        },
      ],
    });

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not found' });
    }

    if (delivery.end_date) {
      return res
        .status(400)
        .json({ error: 'This delivery has already been delivered' });
    }

    if (delivery.canceled_at) {
      return res
        .status(400)
        .json({ error: 'This delivery has already been canceled' });
    }

    delivery.canceled_at = new Date();
    await delivery.save();

    await Queue.add(CanceledDeliveryMail.key, {
      delivery,
      delivery_problem,
    });

    return res.json({ message: 'Delivery Canceled' });
  }
}

export default new CancelDeliveryController();
