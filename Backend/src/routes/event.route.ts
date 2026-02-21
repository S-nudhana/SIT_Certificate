import { Hono } from 'hono'

import getEvents from '../controllers/event/getEvents.controller'
import getEvent from '../controllers/event/getEvent.controller'
import createEvent from '../controllers/event/createEvent.controller'
import updateEvent from '../controllers/event/updateEvent.controller'
import deleteEvent from '../controllers/event/deleteEvent.controller'

import authMiddleware from '../middlewares/auth.middleware'

const event = new Hono()

event.post('/', authMiddleware(['admin']), createEvent)
event.put('/:id', authMiddleware(['admin']), updateEvent)
event.delete('/:id', authMiddleware(['admin']), deleteEvent)

event.get('', getEvents)
// event.get('/', authMiddleware(['admin', 'professor']), getEvents)
event.get('/:id', authMiddleware(['admin', 'professor']), getEvent)

export default event;