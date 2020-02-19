import Mail from '../../lib/Mail';

class NewDeliveryMail {
  // get é usado para retornar variáveis sem criar um cosntructor
  get key() {
    return 'NewDeliveryMail';
  }

  // handle será chamado para cada job, neste caso, o envio de cada email
  async handle({ data }) {
    const { delivery } = data;
    await Mail.sendMail({
      to: `${delivery.deliveryman.name} < ${delivery.deliveryman.email} >`,
      subject: 'Nova Encomenda Cadastrada para Entrega',
      template: 'new_delivery',
      context: {
        product: delivery.product,
        deliveryman: delivery.deliveryman.name,
        recipient: delivery.recipient.name,
        address: {
          street: delivery.recipient.address,
          number: delivery.recipient.number,
          complement: delivery.recipient.complement,
          zip: delivery.recipient.zip,
          city: delivery.recipient.city,
          state: delivery.recipient.state,
        },
      },
    });
  }
}

export default new NewDeliveryMail();
