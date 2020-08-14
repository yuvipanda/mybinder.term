// Don't need $.ready(). Putting <script> at bottom of file has same effect!

import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'

import { launchBinder } from './binder'
import { Shell } from './shell'
import { Router } from './router'
import { printMotd } from './motd'

import './index.css'

import 'xterm/css/xterm.css'

function makeTerm (element) {
  const term = new Terminal()
  const fitAddon = new FitAddon()
  term.open(element)
  term.loadAddon(fitAddon)
  fitAddon.fit()
  window.addEventListener('resize', () => fitAddon.fit())

  return term
}

async function run ({ location, term }) {
  const urlParams = new URLSearchParams(location.search)
  const notebookUrl = urlParams.get('notebookUrl')
  const token = urlParams.get('token')
  const shell = new Shell(notebookUrl, token, term)

  await shell.connect()
  return async () => {
    await shell.disconnect()
  }
}

/**
 * Main function since browsers don't support top-level await
 */
async function main () {
  const term = makeTerm(document.getElementById('terminal'))
  printMotd(term)
  const router = new Router([
    {
      match: /^\/terminal\/?/,
      callback: run
    },
    {
      match: /^\/v2\//,
      callback: launchBinder
    }
  ], { term: term })

  await router.route()
}

main()
