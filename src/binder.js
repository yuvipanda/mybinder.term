async function spawnBinder (binderApiUrl, progressFunc) {
  const es = new EventSource(binderApiUrl)

  return new Promise((resolve, reject) => {
    let phase = null
    es.onmessage = (evt) => {
      const msg = JSON.parse(evt.data)
      // TODO: This can fail because your image build fails, or launching fails
      if (msg.phase && msg.phase !== phase) {
        phase = msg.phase.toLowerCase()
        console.log('Binder phase: ' + phase)
      }
      if (msg.message) {
        console.log('Binder: ' + msg.message)
        progressFunc(msg.phase, msg.message)
      }
      switch (msg.phase) {
        case 'failed':
          console.error('Failed to build', msg)
          es.close()
          reject(msg)
          break
        case 'ready':
          es.close()
          resolve(msg)
          break
        default:
          console.log(msg)
      }
    }
  })
}

export async function launchBinder (term, binderSpec) {
  const binderApiUrl = 'https://mybinder.org/build/' + binderSpec
  const binderInfo = await spawnBinder(binderApiUrl, (phase, msg) => {
    term.write(phase + ': ' + msg + '\r')
  })

  console.log(binderInfo)
  const token = binderInfo.token
  const notebookUrl = binderInfo.url.replace(/\/$/, '')

  const params = new URLSearchParams(window.location.search)
  params.set('notebookUrl', notebookUrl)
  params.set('token', token)

  const newUrl = '/terminal?' + params.toString()
  window.history.pushState({}, '', newUrl)
  console.log('pushed ' + newUrl)
}
