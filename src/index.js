// Don't need $.ready(). Putting <script> at bottom of file has same effect!

import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'

import { launchBinder } from './binder'
import { connectShell } from './shell'

import './index.css'

import 'xterm/css/xterm.css'

export async function makeTerm (element) {
  const term = new Terminal()
  const fitAddon = new FitAddon()
  term.open(element)
  term.loadAddon(fitAddon)
  fitAddon.fit()
  window.addEventListener('resize', () => fitAddon.fit())

  return term
}
async function route (term, location) {
  if (location.pathname.startsWith('/v2/')) {
    const binderSpec = location.pathname.replace(/^\/v2\//, '')
    await launchBinder(term, binderSpec)
  } else if (location.pathname.startsWith('/terminal')) {
    const urlParams = new URLSearchParams(location.search)
    const notebookUrl = urlParams.get('notebookUrl')
    const token = urlParams.get('token')
    await connectShell(term, notebookUrl, token)
  }
}

/**
 * Main function since browsers don't support top-level await
 */
async function main () {
  const term = await makeTerm(document.getElementById('terminal'))
  route(term, window.location)
}

main()
