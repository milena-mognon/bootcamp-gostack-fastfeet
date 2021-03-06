// Importanto o Sequelize e Model de sequelize
import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
    // Este código será executado antes de salvar no bd
    // recebe o usuário por paramentro e pode fazer alterações
    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  checkPassword(password) {
    // retorna true se a senha estiver correta
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
