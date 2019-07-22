'use strict'

const Event = use('App/Models/Event')
const moment = require('moment')

class EventShareController {
  async store ({ request, response, auth }) {
    const { id, email } = request.all()
    const event = Event.findOrFail(id)

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
