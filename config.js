
module.exports = {
    db: {
      user: '',
      host: '',
      database: '',
      password: '',
      port: 5432
    },
    server: {
      port: 3000
    }
  };
  

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('seguridad', 'postgres', '123', {
  host: 'localhost',
  dialect: 'postgres'
});

module.exports = sequelize;

