import { Op } from 'sequelize';

import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import Signature from '../models/Signature';

class DeliveriesController {
  async index(req, res) {
    const delivery = await Delivery.findAll({
      where: { deliveryman_id: req.params.id },
      order: ['start_date'],
      start_date: null,
      canceled_at: {
        [Op.ne]: null,
      },
      attributes: ['id', 'product', 'start_date'],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'id',
            'name',
            'street',
            'number',
            'complement',
            'state',
            'city',
            'postal_code',
          ],
        },
      ],
    });

    return res.json(delivery);
  }
}

export default new DeliveriesController();
