import './index.css'

// ASCII terminal color codes
const COLORS = {
  FG_RED: '\x1b[31m',
  FG_GREEN: '\x1b[32m',
  RESET: '\x1b[0m'
}

export class Shell {
  constructor (notebookUrl, token, term) {
    this.notebookUrl = notebookUrl
    this.token = token
    this.term = term
    this.socket = null

    this._xterm_listeners = []
  }

  async createTerminal () {
    const url = this.notebookUrl + '/api/terminals'
    const headers = {
      Authorization: 'token ' + this.token
    }

    // TODO: This could fail for two primary reasons: Binder is not running, Network Error
    const resp = await fetch(url, {
      method: 'POST',
      headers: headers
    })

    const data = await resp.json()
    return data.name
  }

  async connect () {
    const terminalName = await this.createTerminal()
    const socketUrl = this.notebookUrl.replace(/^http(s)?:\/\//, 'ws$1://') + '/terminals/websocket/' + terminalName + '?token=' + this.token

    this.socket = new WebSocket(socketUrl)

    this.term.write('Connecting to notebook server.')
    const connectingProgress = setInterval(() => this.term.write('.'), 500)

    this.socket.addEventListener('open', (ev) => {
      clearInterval(connectingProgress)
      this.term.write(`${COLORS.FG_GREEN}Connected!${COLORS.RESET}\r\n\r\n`)
      this.term.write(`Share this session with others by sending the following URL: \r\n${window.location.href}\r\n`)
      this.term.write('Consider using tmux, screen or byobu to collaborate in realtime with others!\r\n')
      this.term.write('\r\n')
      this.onSocketOpen(ev)
    })
    this.socket.addEventListener('close', (ev) => {
      console.log('this was fired')
      this.term.write(`\r\n${COLORS.FG_RED}Connection closed${COLORS.RESET}\r\n`)
    })
    this.socket.addEventListener('message', this.onSocketMessage.bind(this))
    this._xterm_listeners.push(this.term.onData(this.onTermInput.bind(this)))
    this._xterm_listeners.push(this.term.onResize((dims) => this.setSize(dims.rows, dims.cols)))
  }

  async disconnect () {
    // Disconnect all xterm listeners
    for (const listener of this._xterm_listeners) {
      listener.dispose()
    }
    this._xterm_listeners = []

    // Close websocket, rather than try to clear all events manually
    this.socket.close()
    this.socket = null
  }

  onSocketOpen (ev) {
    this.setSize(this.term.rows, this.term.cols)
  }

  onSocketMessage (ev) {
    const data = JSON.parse(ev.data)
    if (data[0] === 'stdout') {
      this.term.write(data[1])
    } else {
      console.log(data)
    }
  }

  onTermInput (inputString) {
    this.socket.send(JSON.stringify(['stdin', inputString]))
  }

  setSize (rows, cols) {
    this.socket.send(JSON.stringify(['set_size', rows, cols]))
  }
}
