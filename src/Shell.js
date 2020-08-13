import './index.css'

// ASCII terminal color codes
const COLORS = {
  FG_RED: '\x1b[31m',
  FG_GREEN: '\x1b[32m',
  RESET: '\x1b[0m'
}

/**
 * Return a URL pointing to a websocket handler speaking the terminado protocol.
 *
 * Should ideally be done once per page load, and this terminal can be reused
 * on disconnects.
 *
 * @param {String} notebookUrl Full URL to notebook server
 * @param {String} token Authentication token for talking to the notebook server
 */
async function getTerminadoUrl (notebookUrl, token) {
  const url = notebookUrl + '/api/terminals'
  const headers = {
    Authorization: 'token ' + token
  }

  // TODO: This could fail for two primary reasons: Binder is not running, Network Error
  const resp = await fetch(url, {
    method: 'POST',
    headers: headers
  })

  const data = await resp.json()
  const terminalName = data.name

  const socketUrl = new URL(notebookUrl + '/terminals/websocket/' + terminalName + '?token=' + token)
  // Get ws or wss url from http or https url
  socketUrl.protocol = socketUrl.protocol === 'https:' ? 'wss:' : 'ws:'
  return socketUrl
}

async function attachTerm (term, notebookUrl, token) {
  return new Promise(async (resolve, reject) => {
    term.write('Connecting to server.')
    const connectingProgress = setInterval(() => term.write('.'), 500)
    let terminadoUrl
    try {
      terminadoUrl = await getTerminadoUrl(notebookUrl, token)
    } catch (e) {
      term.write(`${COLORS.FG_RED}${e.message}${COLORS.RESET}`)
      clearInterval(connectingProgress)
      reject(e)
      return
    }
    // TODO: Deal with socket connection failures
    const socket = new WebSocket(terminadoUrl)

    socket.addEventListener('open', (ev) => {
      term.write(`${COLORS.FG_GREEN}Connected!${COLORS.RESET}\r\n`)
      clearTimeout(connectingProgress)
      resolve(socket)
      console.log('Websocket connection started')
      // Tell remote terminal what size we are
      socket.send(JSON.stringify(['set_size', term.rows, term.cols]))
    })

    socket.addEventListener('message', (ev) => {
      const data = JSON.parse(ev.data)
      if (data[0] === 'stdout') {
        term.write(data[1])
      } else {
        console.log(data)
      }
    })

    term.onData((inputString) => {
      socket.send(JSON.stringify(['stdin', inputString]))
      console.log(inputString)
    })

    term.onResize((dims) => {
      socket.send(JSON.stringify(['set_size', dims.rows, dims.cols]))
    })
  })
}

export async function connectShell (term, notebookUrl, token) {
  console.log(term)
  await attachTerm(term, notebookUrl, token)
}
