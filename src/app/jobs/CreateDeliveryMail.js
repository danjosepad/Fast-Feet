import Mail from '../../lib/Mail';

class CreateDeliveryMail {
  get key() {
    return 'CreateDeliveryMail';
  }

  async handle({ data }) {
    const { delivery, recipient, deliveryman } = data;

    await Mail.sendMail({
      to: `${deliveryman.name}<${deliveryman.email}>`,
      subject: 'Nova encomenda',
      template: 'createdelivery',
      context: {
        deliveryman: deliveryman.name,
        user: recipient.name,
        product: delivery.product,
      },
    });
  }
}

export default new CreateDeliveryMail();
