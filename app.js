import express from 'express'
import path from 'path'
import session from 'express-session'
import flash from 'connect-flash'
import expressEjsLayouts from 'express-ejs-layouts'
import fileUpload from 'express-fileupload'
import HomeRoute from './routes/HomeRoute.js'
import AdminRoute from './routes/AdminRoute.js'
import passport from 'passport'
import passportConfig from './config/passport.js'

const app = express()

passportConfig(passport)

app.use(fileUpload())
app.use(expressEjsLayouts)
app.use(flash())
app.use(express.urlencoded({extended:false}))
app.use(express.static(path.resolve('public')))
app.set('view engine' , 'ejs')

app.use(session({
    resave: true,
    secret:'secret',
    saveUninitialized: true
}))


app.use((request , response, next) => {
    response.locals.error = request.flash('error')
    response.locals.success = request.flash('success')
    response.locals.info = request.flash('info')
    next()
})

app.use(passport.initialize())
app.use(passport.session())

app.use('/' , HomeRoute)
app.use('/admin' , AdminRoute)

app.listen(9000 , () => console.log('server started on: http://127.0.0.1:9000'))

