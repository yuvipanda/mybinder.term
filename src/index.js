// Don't need $.ready(). Putting <script> at bottom of file has same effect!

import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { WebLinksAddon } from 'xterm-addon-web-links'

import { spawnBinder } from './binder'
import { Shell } from './shell'
import { Router } from './router'
import { printMotd } from './motd'

import 'reset-css'
import './index.css'
import 'typeface-jetbrains-mono'
import './logo-notext.svg'

import 'xterm/css/xterm.css'

function setupCopying () {
  const links = document.querySelectorAll('a.copyable')
  function onClick (ev) {
    const a = ev.target
    navigator.clipboard.writeText(a.getAttribute('href'))
    const curHTML = a.innerHTML
    setTimeout(() => {
      a.innerHTML = curHTML
      a.classList.remove('copying')
    }, 1000)

    a.classList.add('copying')
    a.innerHTML = 'Link copied!'
    ev.preventDefault()
    return false
  }
  for (const link of links) {
    link.addEventListener('click', onClick)
  }
}

function setShareLink (kind, href) {
  const a = document.getElementById('link-' + kind)
  if (href === null) {
    a.classList.add('disabled')
  } else {
    a.classList.remove('disabled')
  }

  a.setAttribute('href', href)
}

function makeTerm (element) {
  const term = new Terminal({
    fontFamily: 'JetBrains Mono',
    fontSize: 14
  })
  const fitAddon = new FitAddon()
  const weblinksAddon = new WebLinksAddon()

  term.open(element)
  term.loadAddon(fitAddon)
  term.loadAddon(weblinksAddon)
  fitAddon.fit()
  window.addEventListener('resize', () => fitAddon.fit())

  return term
}

async function run ({ location, term }) {
  const urlParams = new URLSearchParams(location.search)
  const notebookUrl = urlParams.get('notebookUrl')
  const token = urlParams.get('token')
  const binderSpec = urlParams.get('binderSpec')
  const shell = new Shell(notebookUrl, token, binderSpec, term)

  await shell.connect()

  setShareLink('new-binder', location.origin + '/v2/' + shell.binderSpec)
  setShareLink('current-binder', location.href)

  return async () => {
    setShareLink('current-binder', null)
    await shell.disconnect()
  }
}

async function launchBinder ({ term, router, location }) {
  const binderSpec = location.pathname.replace(/^\/v2\//, '')
  const binderApiUrl = 'https://mybinder.org/build/' + binderSpec

  setShareLink('new-binder', location.origin + '/v2/' + binderSpec)

  const binderInfo = await spawnBinder(binderApiUrl, (phase, msg) => {
    term.write(phase + ': ' + msg + '\r')
  })

  console.log(binderInfo)
  const token = binderInfo.token
  const notebookUrl = binderInfo.url.replace(/\/$/, '')

  const params = new URLSearchParams(location.search)
  params.set('notebookUrl', notebookUrl)
  params.set('token', token)
  params.set('binderSpec', binderSpec)

  const newUrl = '/terminal?' + params.toString()
  router.goTo(newUrl)
  console.log('pushed ' + newUrl)
}

/**
 * Main function since browsers don't support top-level await
 */
async function main () {
  const term = makeTerm(document.getElementById('terminal'))
  printMotd(term)
  setupCopying()
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
