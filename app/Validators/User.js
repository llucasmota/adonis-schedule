'use strict'

class User {
  get validateAll () {
    return true
  }
  get rules () {
    return {
      // validation rules
      username: 'required | unique:users',
      email: 'required | unique:users',
      password: 'required'
    }
  }
}

module.exports = User
