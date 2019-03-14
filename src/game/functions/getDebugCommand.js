const getDebugCommand = key => {
  const debugCommands = [
    ['1', 'capture'],
    ['2', 'add_army'],
    ['3', 'lose_tile'],
    ['4', 'add_forest'],
    ['5', 'add_camp'],
    ['6', 'add_player'],
    ['7', 'send_army'],
    ['q', 'remove_hitpoint'],
    ['w', 'add_hitpoint'],
    ['e', 'add_castle'],
    ['r', 'dummy_capture'],
    ['t', 'add_village'],
    ['c', 'clear'],
    ['f', 'dummy_send_army'],
  ]

  for (const command of debugCommands) {
    if (command[0] === key) {
      return command[1]
    }
  }

  return null
}

export default getDebugCommand
