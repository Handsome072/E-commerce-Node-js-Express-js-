import {Router} from 'express'
import { connectOnly, notConnectedOnly } from '../config/security.js'
import { domicilePage, login, logout, phonePage, photoPage, profil, register, updateProfil } from '../controllers/AuthController.js'
import { home } from '../controllers/HomeController.js'
import { addLike, removeLike } from '../controllers/LikeController.js'
import { getProductBySlugg } from '../controllers/ProductController.js'

const HomeRoute = Router()

HomeRoute.get('/' , home)
HomeRoute.get('/register' ,notConnectedOnly, register)
HomeRoute.post('/register' ,notConnectedOnly, register)
HomeRoute.get('/login' ,notConnectedOnly ,login)
HomeRoute.post('/login' ,notConnectedOnly, login)
HomeRoute.get('/logout' ,connectOnly ,logout)
HomeRoute.get('/profil' ,connectOnly, profil)
HomeRoute.post('/profil/update' , connectOnly, updateProfil)
HomeRoute.get('/domicile' ,connectOnly ,domicilePage)
HomeRoute.get('/phone' ,connectOnly, phonePage)
HomeRoute.get('/photo' ,connectOnly, photoPage)
HomeRoute.get('/products/details/:slugg' , getProductBySlugg)
HomeRoute.get('/like/add/:id' , connectOnly , addLike)
HomeRoute.get('/like/remove/:id' , connectOnly , removeLike)


export default HomeRoute
