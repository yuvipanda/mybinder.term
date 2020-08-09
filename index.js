// Don't need $.ready(). Putting <script> at bottom of file has same effect!
/**
 * Return a URL pointing to a websocket handler speaking the terminado protocol.
 *
 * Should ideally be done once per page load, and this terminal can be reused
 * on disconnects.
 *
 * @param {String} notebookUrl Full URL to notebook server
 * @param {String} token Authentication token for talking to the notebook server
 */
async function getTerminadoUrl(notebookUrl, token) {
    const url = new URL('/api/terminals', notebookUrl);
    const headers = {
        'Authorization': 'token ' + token
    }

    const resp = await fetch(url, {
        method: 'POST',
        headers: headers
    });

    const data = await resp.json();
    const terminalName = data.name;

    let socketUrl = new URL('/terminals/websocket/' + terminalName + '?token=' + token, notebookUrl);
    // Get ws or wss url from http or https url
    socketUrl.protocol = socketUrl.protocol == 'https' ? 'wss' : 'ws';
    return socketUrl;
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
    const terminadoUrl = await getTerminadoUrl(notebookUrl, token);
    const socket = new WebSocket(terminadoUrl);

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