'use strict'

const User = use('App/Models/User')
const Hash = use('Hash')

class UserController {
  async store ({ request, response }) {
    const data = request.only(['username', 'email', 'password'])
    const findUser = await User.findBy('username', data.username)
    if (findUser) {
      return response.status(401).send({ error: { message: 'Algo deu errado' } })
    }
    const user = await User.crrrreate(data)

    return user
  }

  async update ({ request, response, auth: { user } }) {
    const data = request.only(['username', 'password', 'confirm_pass', 'password_old'])
    // verificando se a senha antiga informada é a mesma que está persistida
    if (data.password_old) {
      const isTruePass = await Hash.verify(data.password_old, user.password)

      if (!isTruePass) {
        return response.status(400).send({ error: { message: 'Senha antiga não confere' } })
      }
      if (data.confirm_pass !== data.password) {
        return response.status(400).send({ error: { message: 'A senha nova e sua confirmação não confereem' } })
      }

      delete data.password_old
      delete data.confirm_pass
    }
    user.merge(data)
    await user.save()
    return user
  }
}

module.exports = UserController
