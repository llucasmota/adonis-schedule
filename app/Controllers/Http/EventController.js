'use strict'

const Event = use('App/Models/Event')
const Location = use('App/Models/Location')
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
    const data = request.only(['title', 'event_date', 'location'])
    const findEvent = await Event.findBy(
      {
        'user_id': auth.user.id,
        'event_date': data.event_date
      }
    )
    if (findEvent) {
      return response.status(401).send({ erro: {
        message: 'Já existe um evento com essa data', event: findEvent } })
    }
    const trx = await Database.beginTransaction()

    const event = new Event()
    event.user_id = auth.user.id
    event.title = data.title
    event.event_date = data.event_date
    await event.save(event)

    const location = new Location()
    location.postal_code = data.location.postal_code
    location.avenue = data.location.avenue
    location.event_id = event.id
    await location.save(location)

    trx.commit()

    event.location = location

    return event
  }

  async show ({ params, request, response, view }) {

  }

  async update ({ params, request, response }) {
  }

  async destroy ({ params, request, response }) {
    const event = await Event.findOrFail(params.id)
    await event.delete()
  }
}

module.exports = EventController
