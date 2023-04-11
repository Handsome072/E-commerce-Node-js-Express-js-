import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()


const insertCategory = async( request , response) => {
    try {
        switch(request.method) {
            case 'GET': {
                const data = await prisma.categories.findMany({orderBy: {name:'asc'} })
                return response.render('admin/categories/add' , {categories: data})
            }
            case 'POST': {
                let {name} = request.body
                name = typeof name !== 'undefined' ? name.trim().toLowerCase() : name
                if(!name){
                    request.flash('error' , 'please fill all blank fieds')
                    return response.redirect('/admin/categories')
                }
                const category = await prisma.categories.findUnique({
                    where: {
                        name:name
                    }
                })
                if(category) {
                    request.flash('error' , 'this category already exists')
                    return response.redirect('/admin/categories')
                }
                await prisma.categories.create({data:{name}})
                request.flash('success' , 'category added')
                return response.redirect('/admin/categories')
            }
            default : {
                throw new Error('undefined http methoed')
            }
        }
    } catch (error) {
        return response.render('error-500')
    }
}

const removeCategory = async(request , response) => {
    try {
        const data = await prisma.categories.delete({
            where:{
                category_id: parseInt(request.params.id)
            }
        })
        request.flash('success' , `category ${data.name} deleted`)
        return response.redirect('/admin/categories')
    } catch (error) {
        return response.render('error-500')
    }
}

export {insertCategory, removeCategory}