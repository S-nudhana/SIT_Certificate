import { Hono } from 'hono'
import login from '../controllers/user/login.controller'
import authorize from '../controllers/user/authorize.controller'

const user = new Hono()

user.post('/login', login)
user.get('/authorize', authorize)

export default user;