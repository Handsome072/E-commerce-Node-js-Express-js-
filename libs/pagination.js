class Pagination {

     constructor (model , currentPage , limit = 20){

        this.model = model
        this.limit = limit
        this.currentPage = currentPage

        this.offset = (currentPage * this.limit ) - this.limit 

    }


    async getDataNumber() {
        return await this.model.count()
    }


    async getGetPageNumber() {
        return Math.ceil(
            await this.getDataNumber() / this.limit
        )
    }
    
    async getData() {
        return await this.model.findMany({
            take: this.limit,
            skip: this.offset,
            include: {
                images: true
            }
        })
    }

    async getNextPage() {
        return (
            await this.getGetPageNumber() == this.currentPage
            ? 1
            : this.currentPage + 1
        )
    }

    async getPreviousPage() {
        return (
            this.currentPage == 1
            ?  await this.getGetPageNumber()
            : this.currentPage - 1
        )
    }

}


export default Pagination