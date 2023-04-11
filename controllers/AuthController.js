import {PrismaClient} from '@prisma/client'
import StringUtils from '../libs/StringUtils.js'
import { uploadFile } from '../libs/uploadFile.js'
import passport  from 'passport'
import bcrypt from 'bcryptjs'
import path from 'path'
import fs from 'fs'

const prisma  = new PrismaClient()

const register = async(request , response , next) => {
    try {
        switch (request.method) {
            case 'GET': {
                return response.render('auth/register')
            }
            case 'POST' : {
                const {fullname , email , password , confirmation} = request.body

                if(!StringUtils.checkString(fullname , password , email , confirmation)){
                    request.flash('error' , 'please fill all blank fields')
                    return response.redirect('/register')
                }


                const user = await prisma.users.findUnique({where: {email}})

                if(user || !email.includes('@') && !email.includes('.') ) {
                    request.flash('error' , 'invalid email adress')
                    return response.redirect('/register')
                }

                if(password !== confirmation ) {
                    request.flash('error' , 'invalid password confirmation')
                    return response.redirect('/register')
                }

                await prisma.users.create({
                    data: {
                        fullname,
                        email,
                        password: bcrypt.hashSync(password , 13),
                    }
                })

                passport.authenticate('local' , {
                    successRedirect: '/domicile',
                    failureRedirect: '/login',
                    failureFlash: true
                })(request , response , next)
                break;
            }
            default : {
                throw new Error('invalid http method')
            }
        }
    } catch (error) {
        console.log(error)
        return response.render('error-500')
    }
}

const login  = (request , response , next) => {
    switch(request.method) {
        case 'GET': {
            return response.render('auth/login')
        }
        case 'POST' : {
            passport.authenticate('local' , {
                successRedirect: '/profil',
                failureRedirect: '/login',
                failureFlash: true
            })(request , response , next)
            break
        }
        default : {
            throw new Error('invalid http method')
        }
    }
}


const logout = (request , response , next) => {
    request.logout((error) => {
        if(error) {
            next(error)
        }else{
            request.flash('success' , 'you\'re logged out')
            return response.redirect('/login')
        }
    })
}


const updateProfil = async(request , response) => {
    try {

        const {user, body} = request
        const redirectRoute = body.route

        delete body.route

        if(request.files) {
            const {image} = request.files
            const ext = path.extname(image.name)
            if(!fs.existsSync('public/users')){
                fs.mkdirSync('public/users')
            }
            body.image = `/users/${StringUtils.slugger(image.name.replace(ext , ''))}${ext}`
            
            await uploadFile(image , body.image)
        }

        await prisma.users.update({
            data: {
                ...body
            },
            where:{
                user_id: parseInt(user.user_id)
            }
        })

        return response.redirect(redirectRoute)


    } catch (error) {
        return response.render('error-500')
    }
}


const profil = (request , response) => response.render('auth/profil', {user: request.user})


const domicilePage = (request , response) => {
    return response.render('auth/domicile')
}
const phonePage = (request , response) => {
    return response.render('auth/phone')
}

const photoPage = (request , response) => {
    return response.render('auth/photo')
}


export {register , login , logout , profil , updateProfil, domicilePage ,phonePage , photoPage}