'use strict'

const Event = use('App/Models/Event')

const Database = use('Database')

class EventController {
  async index ({ request, response, view, auth }) {
    const { date } = request.get()

    const event = await Event.findBy({ 'event_date': date })
    if (event) {
      return event
    }
    return response.status(204).send()
  }

  async store ({ request, response, auth }) {
    const data = request.only(['title', 'event_date', 'postal_code', 'address'])

    const findEvent = await Event.findBy('event_date', data.event_date)
    if (findEvent) {
      return response.status(401).send({ erro: {
        message: 'Já existe um evento com essa data', event: findEvent } })
    }
    const event = Event.create({ ...data, 'user_id': auth.user.id })

    return event
  }

  async show ({ params, request, response, auth: { user } }) {
    const event = await Event.findOrFail(params.id)

    if (user.id !== event.user_id) {
      return response.status(401).send({ error: { message: 'Somente o criado poderá visualizar' } })
    }
    return event
  }

  async update ({ params, request, response, auth }) {
    const event = await Event.findOrFail(params.id)
    if (event.user_id !== auth.user.id) {
      return response.status(401).send({ error: { message: 'Apenas o criado poderá alterar' } })
    }
    const data = request.only(['title', 'event_date', 'address', 'postal_code'])
  }

  async destroy ({ params, request, response }) {
    const event = await Event.findOrFail(params.id)
    await event.delete()
  }
}

module.exports = EventController
