import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import Call from './call'
// Import init function from "@neutralinojs/lib"
import { init, window, events, app} from "@neutralinojs/lib"


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App callObj={Call} />
  </React.StrictMode>,
)

initialize()

async function initialize() {
    init()
    const menu = [
        {
            id: 'file',
            text: 'Imagebank',
            menuItems: [
                { id: "about", text: "About ImageBank"},
                { text: "-"},
                { id: "quit", text: 'Quit ImageBank', shortcut: "q" }
            ]
        },
        {
            text: 'Edit',
            menuItems: [
                { id: 'cut', text: 'Cut', action: 'cut:', shortcut: 'x' },
                { id: 'copy', text: 'Copy', action: 'copy:', shortcut: 'c' },
                { id: 'paste', text: 'Paste', action: 'paste:', shortcut: 'v' },
            ]
        }
    ]
    await window.setMainMenu(menu)
    await events.on("mainMenuItemClicked", (evt) => {
        switch(evt.detail.id) {
        case "quit":
            app.exit(0)
        default:
            console.log(`Menu option ${evt.detail.id} not implemented`)
        }
    })
}
