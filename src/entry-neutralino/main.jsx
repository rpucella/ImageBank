import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '../App'
import Call from './call'
// Import init function from "@neutralinojs/lib"
import { init } from "@neutralinojs/lib"


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App callObj={Call} />
  </React.StrictMode>,
)

init()
