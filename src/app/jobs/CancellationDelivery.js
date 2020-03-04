import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    return 'CancellationDelivery';
  }

  async handle({ data }) {
    const { deliveryProblem } = data;

    await Mail.sendMail({
      to: `${deliveryProblem.delivery.deliveryman.name}<${deliveryProblem.delivery.deliveryman.email}>`,
      subject: 'Encomenda cancelado',
      template: 'CancellationDelivery',
      context: {
        deliveryman: deliveryProblem.delivery.deliveryman.name,
        recipient: deliveryProblem.delivery.recipient.name,
        product: deliveryProblem.delivery.product,
        description: deliveryProblem.description,
        canceledDate: format(
          parseISO(deliveryProblem.delivery.canceled_at),
          "'dia' dd 'de' MMMM', às' H:mm'h",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new CancellationMail();
