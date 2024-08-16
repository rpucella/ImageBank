import axios from 'axios'

class CallImpl {

  constructor() {
    ///console.log('creating websocket')
    const websocket = new WebSocket("/api", "ws")
    this.websocket = websocket
    websocket.onerror = (event) => {
      console.dir(event, {depth:null})
    }
    this.isReady = new Promise((resolve) => {
      websocket.onopen = (event) => {
        resolve(true)
      }
    })
    this.callId = 0
  }

  async call(type, obj) {
    ///const formData = this.createForm({...obj, type})
    await this.isReady
    const websocket = this.websocket
    const callId = this.callId
    this.callId += 1
    const response = new Promise((resolve) => {
      const listener = (event) => {
        const data = JSON.parse(event.data)
        if (data.callId === callId) {
          websocket.removeEventListener('message', listener)
          resolve(data)
        }
      }
      websocket.addEventListener('message', listener)
    })
    //const { data } = await axios.post('/api', formData)
    ///console.log('sending socket message')
    websocket.send(JSON.stringify({...obj, type, callId}))
    ///console.log('waiting on', response)
    const data = await response
    return data
  }

  // async postCall(type, obj) {
  //   const formData = this.createForm({...obj, type})
  //   const { data } = await axios.post('/api', formData)
  //   return data
  // }

}


export default CallImpl
