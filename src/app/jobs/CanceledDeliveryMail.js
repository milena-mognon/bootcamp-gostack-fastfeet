import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class CanceledDeliveryMail {
  // get é usado para retornar variáveis sem criar um cosntructor
  get key() {
    return 'CanceledDeliveryMail';
  }

  // handle será chamado para cada job, neste caso, o envio de cada email
  async handle({ data }) {
    const { delivery, delivery_problem } = data;
    await Mail.sendMail({
      to: `${delivery.deliveryman.name} < ${delivery.deliveryman.email} >`,
      subject: 'Entrega Cancelada',
      template: 'canceled_delivery',
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
        delivery_problem,
        date: format(
          parseISO(delivery.canceled_at),
          "'dia' dd 'de' MMMM', às ' H:mm'h",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new CanceledDeliveryMail();
