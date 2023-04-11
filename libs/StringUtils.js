class StringUtils {

    static slugger(text) {
        return `${text.replaceAll(' ', '-')}-${Math.random().toString(36)}`

    }

    static checkString(...strings) {
        for(let string of strings)
            if (!string)
                return false
        return true
    }

}


export default StringUtils


