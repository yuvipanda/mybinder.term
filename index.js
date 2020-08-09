// Don't need $.ready(). Putting <script> at bottom of file has same effect!
/**
 * Return a websocket connecting to terminal 1 on a notebook server
 *
 * If terminal 1 is not already running in the notebook server, we start it
 * first before making a websocket connection.
 *
 * @param {String} notebookUrl Full URL to notebook server
 * @param {String} token Authentication token for talking to the notebook server
 */
async function getWebsocket(notebookUrl, token) {
    // FIXME: Start a new terminal only if we don't already have one
    const url = new URL('/api/terminals', notebookUrl);
    const headers = {
        'Authorization': 'token ' + token
    }

    const curTerminals = await (await fetch(url, {headers: headers})).json();
    let terminalName;
    if (curTerminals.length) {
        // Get terminal 1
        terminalName = curTerminals[0].name;
    } else {
        const resp = await fetch(url, {
            method: 'POST',
            headers: headers
        });

        const data = await resp.json();
        terminalName = data.name;
    }

    let socketUrl = new URL('/terminals/websocket/' + terminalName + '?token=' + token, notebookUrl);
    // Get ws or wss url from http or https url
    socketUrl.protocol = socketUrl.protocol == 'https' ? 'wss' : 'ws';

    return new WebSocket(socketUrl);
}


/**
 * Main function since browsers don't support top-level await
 */
async function main() {
    let term = new Terminal();
    let fitAddon = new window.FitAddon.FitAddon();

    term.open(document.getElementById('terminal'));
    term.loadAddon(fitAddon);

    // Fetch connection parameters from query params
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const notebookUrl = urlParams.get('notebookUrl');
    const socket = await getWebsocket(notebookUrl, token)

    socket.addEventListener('open', (ev) => {
        console.log('Websocket connection started')
        fitAddon.fit();
    })

    socket.addEventListener('message', (ev) => {
        const data = JSON.parse(ev.data);
        if (data[0] == 'stdout') {
            term.write(data[1]);
        } else {
            console.log(data);
        }
    })

    term.onData((input_string) => {
        socket.send(JSON.stringify(['stdin', input_string]))
    })

    term.onResize((dims) => {
        socket.send(JSON.stringify(['set_size', dims.rows, dims.cols]));
    })

    window.addEventListener('resize', () => fitAddon.fit())
}

main()