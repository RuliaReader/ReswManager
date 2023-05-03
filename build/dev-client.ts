/**
 *  Client Hot Replacement Module By LancerComet at 18:22, 2017/4/21.
 *  # Carry Your World #
 *  ---
 *  This module will be loaded in browser to enable hot module replacement.
 *  Import this module in every entry of webpack configuration.
 */

import 'eventsource-polyfill'

// @ts-ignore
import * as hotClient from 'webpack-hot-middleware/client'

hotClient.subscribe((event: any) => {
  if (event.action === 'reload') {
    window.location.reload()
  }
})
