import DeliveryProblem from '../models/DeliveryProblem';
import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';

class DeliveriesProblemsController {
  /**
   * List all the deliveries with problems
   */
  async index(req, res) {
    const deliveries_problems = await DeliveryProblem.findAll({
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
    return res.json(deliveries_problems);
  }
}

export default new DeliveriesProblemsController();
