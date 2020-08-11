import React, { useEffect, useRef } from 'react'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'

export function Term ({ setTerm }) {
  const termElement = useRef(null)
  useEffect(() => {
    const term = new Terminal()
    const fitAddon = new FitAddon()
    term.open(termElement.current)
    term.loadAddon(fitAddon)
    fitAddon.fit()
    window.addEventListener('resize', () => fitAddon.fit())
    setTerm(term)

    return () => {
      term.dispose()
    }
  }, [])

  return <div ref={termElement}></div>
}
