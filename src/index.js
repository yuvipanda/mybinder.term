// Don't need $.ready(). Putting <script> at bottom of file has same effect!

import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'

import { spawnBinder } from './binder'
import { Shell } from './shell'
import { Router } from './router'

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

async function launchBinder ({ term, router, location }) {
  const binderSpec = location.pathname.replace(/^\/v2\//, '')
  const binderApiUrl = 'https://mybinder.org/build/' + binderSpec
  const binderInfo = await spawnBinder(binderApiUrl, (phase, msg) => {
    term.write(phase + ': ' + msg + '\r')
  })

  console.log(binderInfo)
  const token = binderInfo.token
  const notebookUrl = binderInfo.url.replace(/\/$/, '')

  const params = new URLSearchParams(location.search)
  params.set('notebookUrl', notebookUrl)
  params.set('token', token)

  const newUrl = '/terminal?' + params.toString()
  router.goTo(newUrl)
  console.log('pushed ' + newUrl)
}

/**
 * Main function since browsers don't support top-level await
 */
async function main () {
  const term = await makeTerm(document.getElementById('terminal'))

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
