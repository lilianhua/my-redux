function logger(store) {
    return function (next) {
        return function (action) {
            console.log('logger is trigger.')
            next(action)
        }
    }
}