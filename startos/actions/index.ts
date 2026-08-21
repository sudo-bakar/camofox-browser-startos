import { sdk } from '../sdk'
import { rotateAccessKey } from './rotateAccessKey'
import { viewAccessKey } from './viewAccessKey'

export const actions = sdk.Actions.of()
  .addAction(rotateAccessKey)
  .addAction(viewAccessKey)
