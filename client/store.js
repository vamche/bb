import { createStore, applyMiddleware  } from 'redux'
import thunk from 'redux-thunk'

import AppReducers from 'app/reducers/appReducers'

const store = createStore(
    AppReducers,
    applyMiddleware(thunk)
)

export default store;
