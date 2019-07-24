'use strict'

const Event = use('App/Models/Event')
const moment = require('moment')
const Mail = use('Mail')

class EventShareController {
  async share ({ request, response, auth }) {
    const data = request.only(['id', 'email'])
    console.log(data.email)
    const event = await Event.findOrFail(data.id)
    // console.log(event)

    if (event.user_id !== auth.user.id) {
      return response.status(401).send({ error: { message: 'Apenas o criador pode compartilhar' } })
    }
    // verifica se o evento é passado
    const trueDate = moment().isAfter(event.event_date)
    if (trueDate) {
      return response.status(401).send({ error: { message: 'Um evento passado não poderá ser compartilhado' } })
    }
  }
}

module.exports = EventShareController
