import {Router} from 'express'
import { isAdminOnly } from '../config/security.js'
import { adminHome } from '../controllers/AdminController.js'
import { insertCategory, removeCategory } from '../controllers/CategoryController.js'
import { insertProductExection, insertProductPage, showProducts } from '../controllers/ProductController.js'


const AdminRoute = Router()

AdminRoute.get('/' , isAdminOnly, adminHome)
AdminRoute.get('/categories' ,isAdminOnly, insertCategory)
AdminRoute.post('/categories' , isAdminOnly,insertCategory)
AdminRoute.get('/categories/delete/:id' , isAdminOnly,removeCategory)
AdminRoute.get('/products/:currentPage' ,isAdminOnly, showProducts)
AdminRoute.get('/products/item/add' ,isAdminOnly, insertProductPage)
AdminRoute.post('/products/item/add' , isAdminOnly,insertProductExection)

export default AdminRoute
