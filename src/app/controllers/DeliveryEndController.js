import Order from './OrderController';

class DeliveryEndController {
  async store(req, res) {
    const { id } = req.params.id;

    if (!id) {
      return res
        .status(400)
        .json({ error: 'You need to send a id as parameter' });
    }

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const finishedOrder = await Order.update(
      {
        end_date: new Date(),
      },
      { where: { id } }
    );

    return res.json(finishedOrder);
  }
}

export default new DeliveryEndController();
