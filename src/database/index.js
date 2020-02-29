// Criar conexão com banco de dados

import Sequelize from 'sequelize';
import databaseConfig from '../config/database';

import Deliveryman from '../app/models/Deliveryman';
import Recipient from '../app/models/Recipient';
import User from '../app/models/User';
import Avatar from '../app/models/Avatar';
import Signature from '../app/models/Signature';
import Order from '../app/models/Order';

const models = [User, Recipient, Deliveryman, Avatar, Signature, Order];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
