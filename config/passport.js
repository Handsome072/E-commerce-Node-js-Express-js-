import {PrismaClient} from '@prisma/client'
import bcrypt from 'bcryptjs'
import { Strategy } from 'passport-local'


const prisma = new PrismaClient()


const passport = (passport) => {
    passport.use(
        new Strategy({usernameField: 'email'} , async(email , password , done) => {
            try {
                const userInfo = await prisma.users.findUnique({where: {email} })

                if(!userInfo){
                    return done(null , false , {message:"invalid credentials"})
                }

                const isValid = bcrypt.compareSync(password , userInfo.password)

                if(!isValid) {
                    return done(null , false , {message:"invalid credentials"})
                }

                delete userInfo.password

                return done(null , userInfo)

            } catch (error) {
                throw new Error(error.message)
            }
        })
    )

    passport.serializeUser((user , done) => {
        done(null , user.user_id)
    })

    passport.deserializeUser(async(id , done) => {
        try {
            const user = await prisma.users.findUnique({where: {user_id: parseInt(id)}})
            done(null , user)
        } catch (error) {
            throw new Error(error.message)
        }
    })

}

export default passport