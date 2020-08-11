// Don't need $.ready(). Putting <script> at bottom of file has same effect!

import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import { LaunchBinder } from './LaunchBinder'
import { Shell } from './Shell'

import 'xterm/css/xterm.css'
import './index.css'

function App () {
  return (
    <Router>
      <Switch>
        <Route path="/v2">
          <LaunchBinder binderSpec="gh/yuvipanda/requirements/master" />
        </Route>
        <Route path="/terminal" render={routeProps => {
          const params = new URLSearchParams(routeProps.location.search)
          return <Shell notebookUrl={params.get('notebookUrl')} token={params.get('token')} />
        }}>
        </Route>
      </Switch>
    </Router>
  )
}
/**
 * Main function since browsers don't support top-level await
 */
function main () {
  ReactDOM.render(<App />, document.getElementById('root'))
}
main()
