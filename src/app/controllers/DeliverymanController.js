import * as Yup from 'yup';
import Deliveryman from '../models/Deliveryman';
import Avatar from '../models/Avatar';

class DeliverymanController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const deliverymans = await Deliveryman.findAll({
      order: ['name'],
      attributes: ['id', 'name', 'email', 'avatar_id'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: Avatar,
          as: 'avatar',
          attributes: ['url', 'name', 'path'],
        },
      ],
    });

    return res.json(deliverymans);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const emailExists = await Deliveryman.findOne({
      where: { email: req.body.email },
    });

    if (emailExists) {
      return res
        .status(400)
        .json({ error: 'This email is already registered on our database' });
    }

    const { id, name, email } = await Deliveryman.create(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email(),
      avatar_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const deliveryman = await Deliveryman.findByPk(req.params.id);

    if (!deliveryman) {
      return res.status(404).json({ error: 'Deliveryman not found' });
    }

    const { email } = req.body;

    if (email !== deliveryman.email) {
      const userExists = await Deliveryman.findOne({
        where: { email: req.body.email },
      });

      if (userExists) {
        return res.status(400).json({ error: 'User already exists' });
      }
    }

    const delivery = await deliveryman.update(req.body);

    return res.json(delivery);
  }

  async delete(req, res) {
    const deliveryman = await Deliveryman.findByPk(req.params.id);

    if (!deliveryman) {
      return res.status(404).json({ error: 'Deliveryman not found' });
    }

    await deliveryman.destroy();

    return res.json({
      message: 'The deliveryman has been deleted successfully',
    });
  }
}

export default new DeliverymanController();
