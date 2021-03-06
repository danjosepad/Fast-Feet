import * as Yup from 'yup';

import { format, parseISO } from 'date-fns';
import DeliveryProblem from '../models/DeliveryProblem';
import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';

import CancellationDelivery from '../jobs/CancellationDelivery';
import Queue from '../../lib/Queue';

class DeliveryProblemController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const deliveryProblems = await DeliveryProblem.findAll({
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: Delivery,
          as: 'delivery',
          attributes: ['id', 'product', 'canceled_at', 'start_date'],
          include: [
            {
              model: Recipient,
              as: 'recipient',
              attributes: ['id', 'name'],
            },
            {
              model: Deliveryman,
              as: 'deliveryman',
              attributes: ['id', 'name'],
            },
          ],
        },
      ],
    });

    return res.json(deliveryProblems);
  }

  async show(req, res) {
    const { page = 1 } = req.query;

    // Validar se o retorno do SQL tá certo
    const deliveryProblems = await DeliveryProblem.findAll(
      { where: { delivery_id: req.params.id } },
      {
        limit: 20,
        offset: (page - 1) * 20,
        include: [
          {
            model: Delivery,
            as: 'delivery',
            attributes: ['id', 'product', 'canceled_at', 'start_date'],
            include: [
              {
                model: Recipient,
                as: 'recipient',
                attributes: ['id', 'name'],
              },
              {
                model: Deliveryman,
                as: 'deliveryman',
                attributes: ['id', 'name'],
              },
            ],
          },
        ],
      }
    );

    return res.json(deliveryProblems);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const delivery = await Delivery.findByPk(req.params.id);

    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found' });
    }

    const newDeliveryProblem = await DeliveryProblem.create({
      delivery_id: req.params.id,
      description: req.body.description,
    });

    return res.json(newDeliveryProblem);
  }

  async delete(req, res) {
    const deliveryProblem = await DeliveryProblem.findByPk(req.params.id, {
      include: [
        {
          model: Delivery,
          as: 'delivery',
          attributes: [
            'deliveryman_id',
            'recipient_id',
            'start_date',
            'canceled_at',
            'product',
          ],
          include: [
            {
              model: Deliveryman,
              as: 'deliveryman',
            },
            {
              model: Recipient,
              as: 'recipient',
            },
          ],
        },
      ],
    });

    if (!deliveryProblem) {
      return res.status(404).json({ error: 'Delivery Problem not found' });
    }

    await deliveryProblem.update(
      {
        canceled_date: new Date(),
      },
      { where: { id: req.params.id } }
    );

    deliveryProblem.delivery.canceled_at = new Date();

    await Queue.add(CancellationDelivery.key, {
      deliveryProblem,
    });

    return res.json({ message: 'The delivery has been successfully canceled' });
  }
}

export default new DeliveryProblemController();
