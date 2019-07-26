'use strict'

const Event = use('App/Models/Event')
const User = use('App/Models/User')
const moment = require('moment')
const Kue = use('Kue')
const Job = use('App/Jobs/ShareEvent')

class EventShareController {
  async share ({ request, response, auth, params }) {
    const data = request.only(['email'])

    const event = await Event.findOrFail(params.id)
    // console.log(event)

    if (event.user_id !== auth.user.id) {
      return response.status(401).send({ error: { message: 'Apenas o criador pode compartilhar' } })
    }
    // verifica se o evento é passado
    const trueDate = moment().isAfter(event.event_date)
    if (trueDate) {
      return response.status(401).send({ error: { message: 'Um evento passado não poderá ser compartilhado' } })
    }
    Kue.dispatch(Job.key,
      {
        toMail: data.email,
        fromMail: auth.user.email,
        event
      },
      {
        attempt: 3
      })
  }
}

module.exports = EventShareController
