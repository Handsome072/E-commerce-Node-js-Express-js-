const connectOnly = (request , response , next) => {
    if(request.isAuthenticated()){
        return next()
    }else{
        request.flash('error' , 'you need to loggin first')
        return response.redirect('/login')
    }
}


const notConnectedOnly = (request , response , next) => {
    if(request.isAuthenticated()){
        return response.redirect('/profil')
    }else{
        return next()
    }
}

const isAdminOnly = (request , response , next) => {
    if(request.isAuthenticated()){
        const {user} = request
        if(user.role.includes('admin')) {
            return next()
        }else{
            return response.render('error-404')
        }
    }else{
        request.flash('error' , 'you need to loggin first')
        return response.redirect('/login')
    }
}


export {connectOnly , notConnectedOnly , isAdminOnly}