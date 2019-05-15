import { DEBUG_COMMANDS } from '../../constants/game'

const getDebugCommand = (key: string) => {
  for (const command of DEBUG_COMMANDS) {
    if (command[0] === key) {
      return command[1]
    }
  }

  return null
}

export default getDebugCommand
