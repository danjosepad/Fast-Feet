import {
  setHours,
  setMinutes,
  setSeconds,
  isAfter,
  isBefore,
  startOfDay,
  endOfDay,
} from 'date-fns';
import { Op } from 'sequelize';

import Deliveryman from '../models/Deliveryman';
import Delivery from '../models/Delivery';

import CreateDeliveryMail from '../jobs/CreateDeliveryMail';
import Queue from '../../lib/Queue';
import Mail from '../../lib/Mail';

class DeliveryStartController {
  async update(req, res) {
    const DateWhitoutHMS = new Date().getTime();

    const startSchedule = setSeconds(
      setMinutes(setHours(DateWhitoutHMS, 8), 0),
      0
    );
    const endSchedule = setSeconds(
      setMinutes(setHours(DateWhitoutHMS, 18), 0),
      0
    );

    const searchDate = new Date();

    if (
      isBefore(searchDate, startSchedule) ||
      isAfter(searchDate, endSchedule)
    ) {
      return res
        .status(400)
        .json({ error: 'Out of service, try again tomorrow' });
    }
    const checkDeliveryLimit = await Delivery.count({
      where: {
        deliveryman_id: req.params.deliverymanId,
        canceled_at: null,
        start_date: {
          [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
        },
      },
    });

    if (checkDeliveryLimit >= 5) {
      return res.status(401).json({
        error: 'You already picked up 5 orders today, come back tomorrow ',
      });
    }

    /*
    const deliverymanExists = await Deliveryman.findByPk(
      req.params.deliverymanId
    );

    if (!deliverymanExists) {
      return res.status(404).json({ error: 'Deliveryman not found' });
    }

    const deliveryExists = await Delivery.findByPk(req.params.deliveryId);

    if (!deliveryExists) {
      return res.status(404).json({ error: 'Order not found' });
    }
    */
    const deliveryDeliverymanExists = await Delivery.findOne({
      where: {
        id: req.params.deliveryId,
        deliveryman_id: req.params.deliverymanId,
      },
    });

    if (!deliveryDeliverymanExists) {
      return res.status(404).json({
        error: 'We couldnt find any delivery associate to this deliveryman',
      });
    }

    await Delivery.update(
      {
        start_date: new Date(),
      },
      { where: { id: req.params.deliveryId } }
    );

    return res.json({ message: 'The deliveryman got the order' });

    // Validar rota para que o deliveryman possa realizar apenas 5 entregas por dia
  }
}

export default new DeliveryStartController();
