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

    const event = Event.create(data)

    return event
  }

  async show ({ params, request, response, auth: { user } }) {
    const event = await Event.findOrFail(params.id)

    if (user.id !== event.user_id) {
      return response.status(401).send({ error: { message: 'Somente o criado poderá visualizar' } })
    }
    return event
  }

  async update ({ params, request, response }) {
    try {
      const event = await Event.findOrFail(params.id)
      const location = await Location.findByOrFail('event_id', params.id)

      const data = request.only(['title', 'event_date'])
      const dataLoc = request.only(['location'])
      const trx = Database.beginTransaction()
      event.merge(data)
      location.merge(dataLoc.postal_code,
        dataLoc.avenue,
        dataLoc.number,
        dataLoc.latitude,
        dataLoc.longitude)

      await event.save()
      await location.save()

      trx.commit()

      return event
    } catch (err) {
      return response.status(err.status).send({ error: { message: 'Algo deu errado' } })
    }
  }

  async destroy ({ params, request, response }) {
    const event = await Event.findOrFail(params.id)
    await event.delete()
  }
}

module.exports = EventController
