
import {extensions, events} from "@neutralinojs/lib"

const extension = "imagebank_backend"
const event = "eventToExtension"

class NeutralinoCallImpl {

  // RPC over websocket idea from:
  // https://github.com/small-tech/site.js-websocket-rpc-example/blob/master/readme.md

  constructor() {
    this.callId = 0
  }

  async call(type, obj) {
    const callId = this.callId
    this.callId += 1
    const response = new Promise((resolve) => {
      const listener = (event) => {
        ///console.dir(event, {depth:null})
        const data = event.detail
        if (data.callId === callId) {
          events.off('eventFromExtension', listener)
          resolve(data)
        }
      }
      events.on('eventFromExtension', listener)
    })
      console.log(`about to send data to ${extension}`)
    await extensions.dispatch(extension, event, {...obj, type, callId})
      console.log(`awaiting data`)
    const data = await response
    console.log('received data')
    return data
  }
}

export default NeutralinoCallImpl
