const { Model, DataTypes } = require('sequelize')
const db = require('./database')

class User extends Model {}

User.init(
  {
    username: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
  },
  {
    modelName: 'user',
    sequelize: db,
    //timestamps: false dont add updated_at and inserted_at
  },
)

module.exports = User
