function createStore(reducer, preloadedState, enhancer) {
    if (typeof reducer !== 'function') throw new Error('reducer 必须是函数')

    // enhancer生成加强版的store
    if (typeof enhancer !== 'undefined') {
        if (typeof enhancer !== 'function') throw new Error('enhancer 必须是函数')
        return enhancer(createStore)(reducer, preloadedState)
    }

    let currentState = preloadedState
    const currentListeners = []

    function getState() {
        return currentState
    }

    function dispatch(action) {
        // 判断action是否是对象
        if (!isPlainObject(action)) throw new Error('action 必须是对象')
        // 判断action中是否有type属性
        if (typeof action.type === 'undefined') throw new Error('action 必须要有type属性')
        currentState = reducer(currentState, action)
        currentListeners.forEach(listener => {
            listener()
        })
    }

    function subscribe(listener) {
        currentListeners.push(listener)
    }

    return {
        getState,
        dispatch,
        subscribe
    }
}

/**
 * 判断obj是否是对象
 * @param obj
 */
function isPlainObject(obj) {
    // 排除基本数据类型和null
    if (typeof obj !== 'object' || obj == null) return false
    // 排除数组
    let proto = obj
    while (Object.getPrototypeOf(proto) != null) {
        proto = Object.getPrototypeOf(proto)
    }
    return proto === Object.getPrototypeOf(obj)
}

function applyMiddleware(...middlewares) {
    return function (createStore) {
        return function (reducer, preloadedState) {
            const store = createStore(reducer, preloadedState)
            const middlewareStore = {
                getState: store.getState,
                dispatch: store.dispatch
            }
            const chain = middlewares.map(middleware => middleware(middlewareStore))
            const dispatch = compose(...chain)(store.dispatch)
            return {
                ...store,
                dispatch
            }
        }
    }
}

function compose() {
    const func = [...arguments]
    return function (dispatch) {
        for (let i = func.length - 1; i >= 0; i--) {
            dispatch = func[i](dispatch)
        }
        return dispatch
    }
}