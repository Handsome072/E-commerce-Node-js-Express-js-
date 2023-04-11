const likeIcon = document.querySelectorAll('.send-like');

// [1 ,2 ,3, 4]
// [1]

if(likeIcon.length != 0 && likeIcon != null ) {
    likeIcon.forEach(element => {
        element.addEventListener('click' , (event) => {
            const currentElement = event.target
            const span = currentElement.nextElementSibling

            const id =currentElement.id
            if (currentElement.classList.contains('far')) {
                axios.get('/like/add/'+id)
                .then((response) => {
                    const {data} = response
                    if(data.message === 'success') {
                        currentElement.classList.replace('far' , 'fas')
                        currentElement.id = data.like.like_id
                        span.textContent = parseInt(span.textContent) + 1
                    }else{
                        window.location = '/login'
                    }
                })
                .catch(error => console.log(error))
            }else{
                axios.get('/like/remove/'+id)
                .then((response) => {
                    const {data} = response
                    if(data.message === 'success') {
                        currentElement.classList.replace('fas' , 'far')
                        currentElement.id = data.like.product_id
                        span.textContent = parseInt(span.textContent) - 1
                    }else{
                        window.location = '/login'
                    }
                })
                .catch(error => console.log(error))
            }
        })
    })
}
