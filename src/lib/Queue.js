import Bee from 'bee-queue';
import NewDeliveryMail from '../app/jobs/NewDeliveryMail';
import redisConfig from '../config/redis';
// sempre que for criado mais jobs eles devem ser importados aqui
const jobs = [NewDeliveryMail];

class Queue {
  constructor() {
    // cada background job vai ter sua própria fila
    this.queues = {};

    this.init();
  }

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        // bee é a fila
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  // adicionar novos jobs dentro de cada fila
  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];

      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, error) {
    console.log(`Queue ${job.queue.name}: FAILED`, error);
  }
}

export default new Queue();
