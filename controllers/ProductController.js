import Pagination from '../libs/pagination.js'
import {PrismaClient} from '@prisma/client'
import StringUtils from '../libs/StringUtils.js' 
import path from 'path'
import {uploadFile} from '../libs/uploadFile.js'
import fs from 'fs'

const prisma = new PrismaClient()


const showProducts = async( request , response) => {
    try {
        const currentPage = parseInt(request.params.currentPage)

        const pagination = new Pagination(prisma.products, currentPage)

        return response.render('admin/products/show' , {
            products: await pagination.getData(),
            pages: await pagination.getGetPageNumber(),
            currentPage :  currentPage,
            nextPage: await pagination.getNextPage(),
            previousPage: await pagination.getPreviousPage()
        })

    } catch (error) {
        console.log(error)
        return response.render('error-500')
    }
}

const insertProductPage = async(request , response) => {
    try {
        const categories = await prisma.categories.findMany({orderBy: {name:'asc'}})
        return response.render('admin/products/add' , {categories})
    } catch (error) {
        return response.render('error-500')
    }
}


// class StringUtils
// slugg unique
// checkString
// generateFilePath ===>  /products/IMG-ksbdfsjkbdf.png

// class UploadFile 

const insertProductExection = async(request , response) => {
    try {
        const {name , price , quantity , category, content } = request.body

        if(!request.files) {
            request.flash('error' , 'image is required')
            return response.redirect('/admin/products/item/add')
        }

        let {images} = request.files
        if(images.length === undefined ){
            images = [images]
        }

        if(!StringUtils.checkString(name , price , quantity , category , content)) {
            request.flash('error' , 'please fill all blank fields')
            return response.redirect('/admin/products/item/add')
        }

        const createdProduct = await prisma.products.create({
            data: {
                name: name,
                slugg: StringUtils.slugger(name),
                price: parseInt(price),
                quantity_max: parseInt(quantity),
                category_id: parseInt(category),
                content: content
            }
        })

        for(let image of images) {
            const extension = path.extname(image.name)
            if(!fs.existsSync('public/products')){
                fs.mkdirSync('public/products')
            }
            const newFilename = `/products/${StringUtils.slugger(image.name.replace(extension , ''))}${extension}`
            await uploadFile(image , newFilename)
            await prisma.images.create({
                data: {
                    name: newFilename,
                    product_id: createdProduct.product_id,
                }
            })
        }

        return response.redirect('/admin/products/1')
               
    } catch (error) {
        console.log(error)
        return response.render('error-500')
    }
}

// auth | autorisation 
// ROLE_ADMIN ==> /admin
//  USER ADMIN => select pagination , delete , Update (table)

// Profil ===> affichage user info (udpate info , pdp)
// update password ( password , new password , new password confirmation)


/**
 *  REGISTER (
 *      fullname ,
 *      email,
 *      password,
 *      confirmation password,
 *      connecter
 * )
 * 
 * ===> page 1 profil
 * ===> page 2 domicile
 * ===> page 3 phone
 * ===> redirect profil page
 */



const getProductBySlugg = async(request , response) => {
    try {
        const {slugg} = request.params
        const product = await prisma.products.findUnique({
            where:{slugg: slugg},
            include: {
                likes: true,
                images:true
            }
        })

        if(!product) {
            return response.render('error-404')
        }
        return response.render('products/details' , {
            product,
            user: request.user
        })
    } catch (error) {
        console.log(error)
        return response.render('error-500')
    }
}

export {insertProductPage , showProducts  , insertProductExection , getProductBySlugg}