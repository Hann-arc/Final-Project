'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class kabupaten extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      kabupaten.belongsTo(models.provinsi, {
        foreignKey: 'provinsi_id',
        as: 'provinsi'
      })
    }
  }
  kabupaten.init({
    name: DataTypes.STRING,
    diresmikan: DataTypes.DATEONLY,
    image: DataTypes.STRING,
    provinsi_id: DataTypes.INTEGER,
    bupati: DataTypes.STRING,
    populasi: DataTypes.BIGINT,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'kabupaten',
  });
  return kabupaten;
};