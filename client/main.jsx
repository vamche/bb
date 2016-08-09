import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from 'app/store'
import AppMain from 'app/components/appMain'

const contentElement = document.getElementById('app-container');
const loadingDiv = document.getElementById('loading');
loadingDiv.style.display = 'none';

ReactDOM.render(
    <Provider store={store}>
        <AppMain />
    </Provider>,
    contentElement
)
