// <!-- =========================================================================================
// 	File Name: rabbitMQ.js
// 	Description: socket消息通知
// ========================================================================================== -->

let rabbitMQ = null

window.rabbitMQ = function(cb, close) {
  try {
    rabbitMQ = localStorage.rabbitMQ
  } catch (error) { }

  const mq = rabbitMQ
  const id = 'hz12'// userInfo.userId

  if (!mq || !id) return

  if (!this.ws) this.ws = new WebSocket(mq)
  this.clientSock = window.Stomp.over(window.ws)
  if (close) return this.clientSock.disconnect()

  this.clientSock.heartbeat.outgoing = 50000
  this.clientSock.heartbeat.incoming = 0

  // 连接
  const on_connect = () => {
    // this.clientSock.subscribe(`/queue/${id}`, res => {
    this.clientSock.subscribe(`/exchange/HospitalDataBoardExchange/hospitalDataBoard`, res => {
      console.log('有消息来了')
      cb(res)
    })
  }
  // 错误
  const on_error = err => {
    console.log('error', err)
    this.connectionNumber = (this.connectionNumber || 0) + 1
    if (this.ConnectionNumber < 8) {
      setTimeout(() => {
        this.rabbitMQ()
      }, 5000)
    }
  }
  this.clientSock.connect('gdguest', 'gdguest', on_connect, on_error, '/')
}
