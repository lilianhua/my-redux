function thunk(store) {
    return function (next) {
        return function (action) {
            console.log('thunk is trigger.')
            next(action)
        }
    }
}