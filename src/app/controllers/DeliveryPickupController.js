import { getHours } from 'date-fns';
import Delivery from '../models/Delivery';

class DeliveryPickupController {
  /**
   * Update delivery -> start
   */
  async update(req, res) {
    const { id } = req.params;

    const delivery = await Delivery.findByPk(id);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not found' });
    }

    const current_time = getHours(new Date());

    if (!(current_time >= 8 && current_time < 18)) {
      return res.status(400).json({
        error: 'You cannot pickup deliveries out of business hours',
      });
    }

    delivery.start_date = new Date();
    await delivery.save();

    return res.json(delivery);
  }
}

export default new DeliveryPickupController();
