export class Router {
  /**
   * Create a static URL Router
   *
   * @param {Array} routes
   *     Array of dictionaries with following entries:
   *     1. 'match' - a regex object
   *     2. 'callback' - an async function called when current
   *                     path matches the match regex. This function can
   *                     return another async function, which will be called
   *                     when the user navigates away from this route
   *
   * @param {Object} context
   *    Object passed to route callback. In addition to this, the
   *    Route object is also passed (as `route`)
  */
  constructor (routes, context) {
    this.routes = routes
    this.cleanupFunc = null
    this.context = context

    window.addEventListener('popstate', (ev) => {
      // FIXME: Handle errors
      console.log(ev)
      this.route()
    })
  }

  /**
   * Activate correct route for given location
   *
   * If current route has a cleanup function, it will also be called
   *
   * @param {Location} location Current location determining which route to activate
   */
  async route (location = window.location) {
    if (this.cleanupFunc) {
      await this.cleanupFunc()
      this.cleanupFunc = null
    }
    for (const route of this.routes) {
      if (location.pathname.match(route.match)) {
        this.cleanupFunc = await route.callback({
          ...this.context,
          router: this,
          location: location
        })
        break
      }
    }
  }

  async goTo (newUrl) {
    window.history.pushState({}, '', newUrl)
    await this.route()
  }
}
