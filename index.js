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
    const url = notebookUrl + "/api/terminals";
    const headers = {
        'Authorization': 'token ' + token
    }

    const resp = await fetch(url, {
        method: 'POST',
        headers: headers
    });

    const data = await resp.json();
    const terminalName = data.name;

    let socketUrl = new URL(notebookUrl + '/terminals/websocket/' + terminalName + '?token=' + token);
    // Get ws or wss url from http or https url
    socketUrl.protocol = socketUrl.protocol == 'https:' ? 'wss:' : 'ws:';
    return socketUrl;
}

async function spawnBinder(binderApiUrl, progressFunc) {
    let es = new EventSource(binderApiUrl);

    return new Promise((resolve, reject) => {
        let phase = null;
        es.onmessage = (evt) => {
            let msg = JSON.parse(evt.data);
            if (msg.phase && msg.phase !== phase) {
                phase = msg.phase.toLowerCase();
                console.log("Binder phase: " + phase);
            }
            if (msg.message) {
                console.log("Binder: " + msg.message);
                progressFunc(msg.phase, msg.message)
            }
            switch (msg.phase) {
                case "failed":
                    console.error("Failed to build", url, msg);
                    es.close();
                    reject(msg)
                    break;
                case "ready":
                    es.close();
                    resolve(msg);
                    break;
                default:
                    console.log(msg);
            }
        };
    })
}

async function attachTerm(term, notebookUrl, token) {
    const terminadoUrl = await getTerminadoUrl(notebookUrl, token);
    const socket = new WebSocket(terminadoUrl);

    socket.addEventListener('open', (ev) => {
        console.log('Websocket connection started')
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

}

function parseURL() {
}
/**
 * Main function since browsers don't support top-level await
 */
async function main() {
    let notebookUrl, token;
    // Setup xterm
    let term = new Terminal();
    let fitAddon = new window.FitAddon.FitAddon();
    term.open(document.getElementById('terminal'));
    term.loadAddon(fitAddon);
    fitAddon.fit();
    window.addEventListener('resize', () => fitAddon.fit())

    // Fetch connection parameters from query params
    const path = document.location.pathname;
    if (path.startsWith('/v2/')) {
        // Launch new binder
        const binderApiUrl = 'https://mybinder.org/build' + path.replace(/^\/v2/, '');
        const binderInfo = await spawnBinder(binderApiUrl, (phase, msg) => {
            term.write(phase + ": " + msg + "\r")
        });
        console.log(binderInfo)
        token = binderInfo.token;
        notebookUrl = binderInfo.url.replace(/\/$/, '');
    } else if (path.startsWith('/terminal')) {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('notebookUrl')) {
            notebookUrl = urlParams.get('notebookUrl');
            token = urlParams.get('token')
        }
    } else {
        alert('invalid URL')
    }


    await attachTerm(term, notebookUrl, token);
    window.history.pushState({}, '', '/terminal?notebookUrl=' + notebookUrl + '&token=' + token)
}

main()