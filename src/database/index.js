import Sequelize from 'sequelize';
import User from '../app/models/User';
import Recipient from '../app/models/Recipient';

import databaseConfig from '../config/database';

// Array com o nome dos models
const models = [User, Recipient];

/**
 * Loader de Models
 * Todos os models da aplicação
 */
class Database {
  constructor() {
    this.init();
  }

  init() {
    // agora existe a conexão com a base de dados
    this.connection = new Sequelize(databaseConfig);

    // percorrer o array e retornar o init que espera receber a conexão
    models.map(model => model.init(this.connection));
  }
}

export default new Database();
