'use strict'

const User = use('App/Models/User')
const Hash = use('Hash')

class UserController {
  async store ({ request }) {
    const data = request.only(['username', 'email', 'password'])

    const user = await User.create(data)

    return user
  }
  // async update ({ request, response, auth }) {
  //   try {
  //     const username = request.only(['username'])
  //     const user = await User.findByOrFail('username', auth.user.username)
  //     user.username = username
  //     user.merge(username)
  //     await user.save()

  //     return response.status(204).send(user)
  //   } catch (err) {
  //     return response.status(err.status).send({ error: { message: 'Algo não deu certo' } })
  //   }
  // }
  async update ({ request, response, auth: { user } }) {
    const data = request.only(['username', 'password_new', 'confirm_pass', 'password_old'])
    // verificando se a senha antiga informada é a mesma que está persistida
    const isSame = await Hash.verify(data.password_old, user.password)
    if (!isSame) {
      return response.status(401).send({ message: { error: 'A senha antiga não é válida' } })
    }
    if (!data.confirm_pass) {
      return response.status(400).send({ message: { error: 'A confirmação de senha não foi informada' } })
    }
    if (data.confirm_pass !== data.password_new) {
      return response.status(401).send({ error: { message: 'A senha e a confirmação de senha não são iguais ' } })
    }
  }
}

module.exports = UserController
