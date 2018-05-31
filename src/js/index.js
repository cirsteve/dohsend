import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reducers from './reducers/index'
import DohsendApp from './components/index.jsx'

const store = createStore(reducers, applyMiddleware(thunk));

render(
    <Provider store={store}>
        <DohsendApp />
    </Provider>,
   document.querySelector('#root')
)
