import * as Yup from 'yup';
import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.number().required(),
      complement: Yup.string().required(),
      state: Yup.string()
        .required()
        .max(3),
      city: Yup.string().required(),
      postal_code: Yup.string()
        .required()
        .min(8),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const recipientExists = await Recipient.findOne({
      where: { name: req.body.name },
    });

    if (recipientExists) {
      return res.status(400).json({ error: 'Recipient already exists' });
    }

    const {
      id,
      name,
      street,
      number,
      complement,
      state,
      city,
      postal_code,
    } = await Recipient.create(req.body);

    return res.json({
      id,
      name,
      street,
      number,
      complement,
      state,
      city,
      postal_code,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.number().required(),
      complement: Yup.string().required(),
      state: Yup.string()
        .required()
        .max(3),
      city: Yup.string().required(),
      postal_code: Yup.string()
        .required()
        .min(8),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const recipientExists = await Recipient.findOne({
      where: { name: req.body.name },
    });

    if (!recipientExists) {
      return res.status(400).json({ error: 'Recipient not found' });
    }

    await Recipient.update(
      {
        street: req.body.street,
        number: req.body.number,
        complement: req.body.complement,
        state: req.body.state,
        city: req.body.city,
        postal_code: req.body.postal_code,
      },
      { where: { name: req.body.name } }
    );

    return res.json(req.body);
  }
}

export default new RecipientController();
