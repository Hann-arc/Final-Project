'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class provinsi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
     provinsi.belongsTo(models.user, {
      foreignKey: 'user_id',
      as: 'user'
     });
     provinsi.hasMany(models.kabupaten, {
      foreignKey: 'provinsi_id',
      as: 'kabupaten'
     })
    }
  }
  provinsi.init({
    name: DataTypes.STRING,
    diresmikan: DataTypes.DATEONLY,
    image: DataTypes.STRING,
    pulau: DataTypes.STRING,
    gubernur: DataTypes.STRING,
    populasi: DataTypes.BIGINT,
    user_id: DataTypes.INTEGER,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'provinsi',
  });
  return provinsi;
};