'use strict'
const Route = use('Route')

Route.post('/users', 'UserController.store')
Route.put('/users', 'UserController.update').middleware(['auth'])

Route.post('/sessions', 'SessionController.store')
Route.resource('events', 'EventController').middleware(['auth'])
