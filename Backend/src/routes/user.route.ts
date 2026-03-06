import { Hono } from 'hono'
import { oauthGoogleConfig } from '../config/oauth.config';

import login from '../controllers/user/login.controller'
import logout from '../controllers/user/logout.controller'
import authorize from '../controllers/user/authorize.controller'

const user = new Hono()

user.use("/auth/google", oauthGoogleConfig)

user.get('/auth/google', login)
user.get('/authorize', authorize)
user.get('/logout', logout)

export default user;