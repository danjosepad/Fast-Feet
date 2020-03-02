import {
  startOfDay,
  endOfDay,
  setHours,
  setMinutes,
  setSeconds,
  format,
  isAfter,
  isBefore,
} from 'date-fns';

import Deliveryman from '../models/Deliveryman';
import Order from '../models/Order';

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
        .status(404)
        .json({ error: 'Out of service, try again tomorrow' });
    }

    const deliveryman = await Deliveryman.findByPk(req.params.deliverymanId);

    if (!deliveryman) {
      return res.status(404).json({ error: 'Deliveryman not found' });
    }

    const order = await Order.findByPk(req.params.orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const updatedOrder = await Order.update(
      {
        start_date: new Date(),
      },
      { where: { id: req.params.orderId } }
    );

    return res.json(updatedOrder);
  }
}

export default new DeliveryStartController();
