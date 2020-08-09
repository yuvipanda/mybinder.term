// Don't need $.ready(). Putting <script> at bottom of file has same effect!

async function getWebsocket(notebook_url, token) {
    // FIXME: Start a new terminal only if we don't already have one
    const url = notebook_url + '/api/terminals';
    const headers = {
        'Authorization': 'token ' + token
    }

    const curTerminals = await (await fetch(url, {headers: headers})).json();
    let terminalName;
    if (curTerminals.length) {
        // FIXME: Uh, let's not hardcode this?
        terminalName = curTerminals[0].name;
    } else {
        const resp = await fetch(url, {
            method: 'POST',
            headers: headers
        });

        const data = await resp.json();
        terminalName = data.name;
    }

    let socketUrl = notebook_url + '/terminals/websocket/' + terminalName + '?token=' + token;
    // Get ws or wss url from http or https url
    socketUrl = socketUrl.replace(/^http(s)?:\/\//, 'ws$1://');

    return new WebSocket(socketUrl);
}


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
        console.log('open');
        console.log(ev);
        fitAddon.fit();
    })

    socket.addEventListener('message', (ev) => {
        const data = JSON.parse(ev.data);
        if (data[0] == 'stdout') {
            term.write(data[1]);
        }
    })

    term.onData((input_string) => {
        socket.send(JSON.stringify(['stdin', input_string]))
        console.log(input_string);
    })

    term.onResize((dims) => {
        socket.send(JSON.stringify(['set_size', dims.rows, dims.cols]));
    })

    window.addEventListener('resize', () => fitAddon.fit())

}

main()