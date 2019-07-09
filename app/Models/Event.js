'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Event extends Model {
  location () {
    return this.hasOne('App/Model/Location')
  }
  user () {
    return this.belongsTo('App/Models/User')
  }
}

module.exports = Event
