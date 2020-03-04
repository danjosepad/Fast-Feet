import Delivery from '../models/Delivery';

class DeliveryEndController {
  async update(req, res) {
    // Envio de uma imagem para assinatura de usuário
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ error: 'You need to send a id as parameter' });
    }

    const order = await Delivery.findByPk(id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    await Delivery.update(
      {
        end_date: new Date(),
      },
      { where: { id } }
    );

    return res.json({ message: 'The order has been successfully delivered' });
  }
}

export default new DeliveryEndController();
