import {PrismaClient} from '@prisma/client'


const prisma = new PrismaClient()


const addLike = async(request ,response) => {
    try {
        const {id} = request.params
        const {user} = request
        const like  = await prisma.likes.create({
            data: {
                product_id: parseInt(id),
                user_id: parseInt(user.user_id)
            }
        })
        return response.json({message: 'success' , like: like})
    } catch (error) {
        return response.render('error-500')
    }
}


const removeLike = async(request ,response) => {
    try {
        const {id} = request.params
        
        const like = await prisma.likes.delete({
            where: {
                likes_id: parseInt(id)
            }
        })
        return response.json({message: 'success' , like})
    } catch (error) {
        return response.render('error-500')
    }
}


export {addLike , removeLike}