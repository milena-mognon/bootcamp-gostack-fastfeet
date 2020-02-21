import DeliveryProblem from '../models/DeliveryProblem';
import Delivery from '../models/Delivery';
// import Deliveryman from '../models/Deliveryman';
// import Recipient from '../models/Recipient';

class CancelDeliveryController {
  /**
   * Cancel Delivery
   */

  async delete(req, res) {
    const { problem_id } = req.params;

    const delivery_problem = await DeliveryProblem.findByPk(problem_id, {
      include: [
        {
          model: Delivery,
          as: 'delivery',
        },
      ],
    });

    if (!delivery_problem) {
      return res.status(400).json({ error: 'Delivery problem not found' });
    }
    const delivery = await Delivery.findByPk(delivery_problem.delivery.id);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not found' });
    }

    if (delivery.end_date) {
      return res
        .status(400)
        .json({ error: 'This delivery has already been delivered' });
    }

    delivery.canceled_at = new Date();
    await delivery.save();

    return res.json({ message: 'Delivery Canceled' });
  }
}

export default new CancelDeliveryController();
