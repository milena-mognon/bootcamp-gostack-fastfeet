import { Op } from 'sequelize';
import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';

class DeliveredController {
  /**
   * List all the delivered deliveries from a deliveryman
   */
  async index(req, res) {
    const { id } = req.params;
    const { page = 1 } = req.query;

    const deliveryman = await Deliveryman.findByPk(id);
    if (!deliveryman) {
      return res.status().json({ error: 'Deliveryman not found' });
    }
    const deliveries = await Delivery.findAll({
      where: {
        deliveryman_id: id,
        end_date: { [Op.not]: null },
        canceled_at: null,
      },
      limit: 20,
      offset: (page - 1) * 20,
      order: ['created_at'],
      attributes: ['product', 'start_date', 'end_date'],
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
    return res.json(deliveries);
  }
}

export default new DeliveredController();
