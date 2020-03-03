import { setHours, setMinutes, setSeconds, isAfter, isBefore } from 'date-fns';

import Deliveryman from '../models/Deliveryman';
import Delivery from '../models/Delivery';

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

    if (
      isBefore(new Date(), startSchedule) ||
      isAfter(new Date(), endSchedule)
    ) {
      return res
        .status(400)
        .json({ error: 'Out of service, try again tomorrow' });
    }

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

    await Delivery.update(
      {
        start_date: new Date(),
      },
      { where: { id: req.params.deliveryId } }
    );

    return res.json({ message: 'The deliveryman got the order' });
  }
}

export default new DeliveryStartController();
