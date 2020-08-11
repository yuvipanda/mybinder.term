// Don't need $.ready(). Putting <script> at bottom of file has same effect!

import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

import 'xterm/css/xterm.css';
import './index.css';

// ASCII terminal color codes
const COLORS = {
    'FG_RED': '\x1b[31m',
    'FG_GREEN': '\x1b[32m',
    'RESET': '\x1b[0m'
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
async function getTerminadoUrl(notebookUrl, token) {
    const url = notebookUrl + "/api/terminals";
    const headers = {
        'Authorization': 'token ' + token
    }

    // TODO: This could fail for two primary reasons: Binder is not running, Network Error
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
            // TODO: This can fail because your image build fails, or launching fails
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
    return new Promise(async (resolve, reject) => {
        term.write('Connecting to server.');
        const connectingProgress = setInterval(() => term.write('.'), 500);
        let terminadoUrl;
        try {
            terminadoUrl = await getTerminadoUrl(notebookUrl, token);
        } catch (e) {
            term.write(`${COLORS.FG_RED}${e.message}${COLORS.RESET}`)
            clearInterval(connectingProgress);
            reject()
            return
        }
        // TODO: Deal with socket connection failures
        const socket = new WebSocket(terminadoUrl);

        socket.addEventListener('open', (ev) => {
            term.write(`${COLORS.FG_GREEN}Connected!${COLORS.RESET}\r\n`)
            clearTimeout(connectingProgress);
            resolve(socket)
            console.log('Websocket connection started')
            // Tell remote terminal what size we are
            socket.send(JSON.stringify(['set_size', term.rows, term.cols]));
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
            console.log(input_string)
        })

        term.onResize((dims) => {
            socket.send(JSON.stringify(['set_size', dims.rows, dims.cols]));
        })
    })
}

async function build(context) {
    // Launch new binder
    const binderApiUrl = 'https://mybinder.org/build' + window.location.pathname.replace(/^\/v2/, '');
    const binderInfo = await spawnBinder(binderApiUrl, (phase, msg) => {
        context.term.write(phase + ": " + msg + "\r")
    });
    console.log(binderInfo)
    token = binderInfo.token;
    notebookUrl = binderInfo.url.replace(/\/$/, '');

    let params = new URLSearchParams(window.location.search);
    params.set('notebookUrl', notebookUrl);
    params.set('token', token)

    window.history.pushState({}, '', '/terminal?' + params.toString())
    route(context);
}

async function run(context) {
    const urlParams = new URLSearchParams(window.location.search);
    const notebookUrl = urlParams.get('notebookUrl');
    const token = urlParams.get('token')

    const websocket = await attachTerm(context.term, notebookUrl, token);

    if (urlParams.has('initialCommand')) {
        // FIXME: Injection?
        websocket.send(JSON.stringify(['stdin', urlParams.get('initialCommand')]));
    }
}
/**
 * Main function since browsers don't support top-level await
 */
async function main() {
    let term = new Terminal();
    let fitAddon = new FitAddon();
    term.open(document.getElementById('terminal'));
    term.loadAddon(fitAddon);
    fitAddon.fit();
    window.addEventListener('resize', () => fitAddon.fit())

    route({
        term: term
    })
}

function route(context) {
    const path = window.location.pathname;
    if (path.startsWith("/v2/")) {
        // We gonna build an image maybe
        build(context)
    } else if (path.startsWith("/terminal")) {
        // We gonna show some stuff!
        run(context)
    } else {
        // We should show a form of sorts here
        alert(invalid);
    }
}
main()