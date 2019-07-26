'use strict'
const Route = use('Route')

Route.post('/users', 'UserController.store').validator(['User'])
Route.put('/users', 'UserController.update').middleware(['auth'])

Route.post('/sessions', 'SessionController.store')

Route.post('events', 'EventController.store').middleware(['auth'])
Route.put('/events/:id', 'EventController.update').middleware(['auth'])
Route.get('events', 'EventController.index').middleware(['auth'])
Route.get('/events/:id', 'EventController.show').middleware(['auth'])
Route.delete('/events/:id', 'EventController.destroy').middleware(['auth'])

Route.post('/events/share/:id', 'EventShareController.share').middleware(['auth'])
