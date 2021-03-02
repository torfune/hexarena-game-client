import GameMode from '../types/GameMode'

function formatMode(mode: GameMode) {
  switch (mode) {
    case '1v1':
    case 'AI_1v1':
      return '1 vs 1'
    case '2v2':
      return '2 vs 2'
    case 'FFA-3':
    case 'AI_FFA-3':
      return 'FFA 3'
    case 'FFA-6':
    case 'AI_FFA-6':
      return 'FFA 6'
    default:
      throw Error(`Unsupported game mode: ${mode}`)
  }
}

export default formatMode
