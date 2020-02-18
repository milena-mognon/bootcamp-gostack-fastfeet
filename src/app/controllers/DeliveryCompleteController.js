import Delivery from '../models/Delivery';
import File from '../models/File';

class DeliveryCompleteController {
  /**
   * Update delivery -> complete
   */
  async update(req, res) {
    const { id } = req.params;

    const delivery = await Delivery.findByPk(id);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not found' });
    }

    if (!req.file) {
      return res.status(400).json({
        error: 'To complete de delivery you need to add a signature image',
      });
    }

    if (delivery.end_date) {
      return res.status(400).json({
        error: 'This delivery is already complete',
      });
    }

    const { originalname: name, filename: path } = req.file;

    const file = await File.create({ name, path });

    await delivery.update({ end_date: new Date(), signature_id: file.id });

    return res.json(delivery);
  }
}

export default new DeliveryCompleteController();
