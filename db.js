const Sequelize = require('sequelize')
const db = new Sequelize({
    dialect: 'mysql',
    database: 'authdb',
    password: 'authpass',
    username: 'authuser',
})

const Users = db.define('user', {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: Sequelize.DataTypes.STRING(30),
      unique: true,
      allowNull: false
    },
    email: {
      type: Sequelize.DataTypes.STRING(100),
    },
    password: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false
    },
    avatar:{
      type:Sequelize.DataTypes.STRING
    }
  })
  
  module.exports = {
    db, Users
  }