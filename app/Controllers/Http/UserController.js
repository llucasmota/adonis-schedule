'use strict'

const User = use('App/Models/User')

class UserController {
  async store ({ request }) {
    const data = request.only(['username', 'email', 'password'])

    const user = await User.create(data)

    return user
  }
  async update ({ request, response, auth }) {
    try {
      const username = request.only(['username'])
      const user = await User.findByOrFail('username', auth.user.username)
      user.username = username
      user.merge(username)
      await user.save()

      return response.status(204).send(user)
    } catch (err) {
      return response.status(err.status).send({ error: { message: 'Algo não deu certo' } })
    }
  }
}

module.exports = UserController
