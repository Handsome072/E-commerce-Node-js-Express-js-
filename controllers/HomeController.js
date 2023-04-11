import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()

const home = async(request , response) => {
    try {
        const {user} = request
        const products = await prisma.products.findMany({
            include: {
                images: true,
                likes: true
            },
            orderBy:{category_id: 'asc'},
        })

        // return response.download('public/e-commerce(1).zip')
        return response.render('home' , {products , user:request.user})
    } catch (error) {
        console.log(error)
        return response.render('error-500')
    }
}


// 192.168.43.145:9000


export {home}