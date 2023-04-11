const uploadFile = (image , path) => {

    return new Promise((resolve , reject) => {
       
        image.mv(`public${path}` , (error) => {
            if(error){
                reject(error)
            }else{
                resolve(true)
            }
        })
        

    })
}


export {uploadFile}