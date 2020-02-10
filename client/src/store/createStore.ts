import { init } from '@rematch/core'
import loadingPlugin from '@rematch/loading'
import models from '../models'

export default init({
  models,
  plugins: [loadingPlugin()]
})
