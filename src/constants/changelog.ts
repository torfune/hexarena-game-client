const changelog = [
  {
    version: 'Alpha 1.39',
    points: ['HTTPS', 'Match found notifications', 'Dark HUD', 'Bug fixes'],
  },
  {
    version: 'Alpha 1.38',
    points: [
      'Faster responsivity for players with higher latency.',
      'Army arrow animations',
      'Spectate next game button',
      'Bug fixes',
    ],
  },
  {
    version: 'Alpha 1.37',
    points: ['Action animations.'],
  },
  {
    version: 'Alpha 1.36',
    points: ['Balance changes.', 'Balanced 2v2 games.'],
  },
  {
    version: 'Alpha 1.35',
    points: ['Matchmaking improvements.', 'Bug fixes.'],
  },
  {
    version: 'Alpha 1.34',
    points: [
      'Forests are no longer generating gold.',
      'Army stops after capturing forest tile.',
      'UI improvements.',
      'Balance changes.',
    ],
  },
  {
    version: 'Alpha 1.33',
    points: ['Village rework', 'Balance changes', 'Bug fixes'],
  },
  {
    version: 'Alpha 1.32',
    points: [
      'Economy HUD',
      'Build tower on forest tile',
      'Balance changes',
      'Bug fixes',
    ],
  },
  {
    version: 'Alpha 1.31',
    points: ['Forest rework', 'Balance changes', 'Bug fixes'],
  },
  {
    version: 'Alpha 1.30',
    points: ['Updated artwork', 'Balance changes', 'Bug fixes'],
  },
  {
    version: 'Alpha 1.29',
    points: [
      "Villages don't spawn anymore.",
      'Improved world generator.',
      'Balanced spawn locations.',
      'Bug fixes.',
    ],
  },
  {
    version: 'Alpha 1.28',
    points: ['Premade teams mode.', 'Improved matchmaking.'],
  },
  {
    version: 'Alpha 1.27',
    points: ['Duel mode.', 'Lot of bug fixes and small improvements.'],
  },
  {
    version: 'Alpha 1.26',
    points: ['Towers & Castles.', 'Chat timestamps.'],
  },
  {
    version: 'Alpha 1.25',
    points: ['Fixed spectate related bugs.'],
  },
  {
    version: 'Alpha 1.24',
    points: [
      'Spectator mode.',
      'Kick AFKs after 1 minute.',
      'Right click can only be used for camera movement.',
    ],
  },
  {
    version: 'Alpha 1.23',
    points: [
      'Performance optimizations.',
      'Army range set to 5.',
      'Dynamic world size based on number of players.',
      'Actions are no longer cancelable.',
      'Slower game tempo.',
      'You get gold of player you just captured.',
      'Gold cap set to 80.',
      'UI improvements.',
      'Bug fixes.',
    ],
  },
  {
    version: 'Alpha 1.22',
    points: [
      'Auto-capture surrounded neutral tiles.',
      'Improved match making.',
      'Bug fixes.',
    ],
  },
  {
    version: 'Alpha 1.21',
    points: [
      'Unlimited number of concurrently running actions.',
      'Every player starts with 1 village.',
      'Capturing a tile costs 1 gold.',
      'Bug fixes.',
    ],
  },
  {
    version: 'Alpha 1.20',
    points: [
      'Improved match making.',
      'FFA mode.',
      'Balance changes.',
      'Bug fixes.',
      'UI improvements.',
    ],
  },
  {
    version: 'Alpha 1.19',
    points: [
      'Global chat.',
      'Sending gold to your ally.',
      'Flat attack duration: 2 seconds.',
      'Not possible to build Castle next to enemy Base.',
      'ELO is visible even if you are not in the top 20.',
      'Guest ELO.',
      'Bug fixes.',
      'UI improvements.',
    ],
  },
  {
    version: 'Alpha 1.18',
    points: [
      'Drag & Drop army sending.',
      'Zoom on E/Q keys.',
      'UI/HUD improvements.',
      'Bug fixes.',
    ],
  },
  {
    version: 'Alpha 1.17',
    points: [
      'Gold and Village counts are visible in leaderboard.',
      'Cutting forests is faster.',
      'Forest gold yield set to 3.',
      'UI/HUD improvements.',
      'Bug fixes.',
    ],
  },
  {
    version: 'Alpha 1.16',
    points: [
      'Performance optimizations.',
      'Keyboard camera movement (WASD).',
      'HUD improvements.',
      'Bug fixes.',
    ],
  },
  {
    version: 'Alpha 1.15',
    points: [
      'Initial gold set to 4.',
      'Faster manual attacks.',
      'Random neutral castles.',
      'Gold for capturing villages.',
      'UI improvementes.',
      'Bug fixes.',
    ],
  },
  {
    version: 'Alpha 1.14',
    points: [
      'Repairing is faster than recruiting.',
      'Captured neutral villages join your empire.',
      'Forests block vision.',
      'Game tempo is a bit slower now.',
      'FPS and PING values ingame.',
    ],
  },
  {
    version: 'Alpha 1.13',
    points: [
      'Unlimited gold capacity.',
      'Villages generate gold every 30 seconds.',
      'Disabled connection through an ally.',
      'Bug fixes.',
    ],
  },
  {
    version: 'Alpha 1.12',
    points: [
      'Google login.',
      'ELO rating system.',
      'Improved world generator.',
      'Mountains are no longer capturing adjacent tiles.',
      'Gold animations.',
      'Bug fixes.',
    ],
  },
  {
    version: 'Alpha 1.11',
    points: [
      'Wood is replaced with Gold, it works the same way.',
      'Surrender button (when playing 1 vs 2).',
      'UI improvements.',
      'Bug fixes.',
    ],
  },
  {
    version: 'Alpha 1.10',
    points: ['UI improvements.', 'Bug fixes.'],
  },
  {
    version: 'Alpha 1.9',
    points: ['UI improvements.', 'More colors.', 'Bug fixes.'],
  },
  {
    version: 'Alpha 1.8',
    points: ['Alliance request notifications.', 'Bug fixes.'],
  },
  {
    version: 'Alpha 1.7',
    points: ['Shared vision in an alliance.', 'Several bugs were fixed.'],
  },
  {
    version: 'Alpha 1.6',
    points: [
      'Redesigned edge of the map.',
      'Cutting trees takes longer, but you get 2 wood instead of 1.',
      'Added spectators mode (on defeat).',
      'Alliances are visible in the leaderboard.',
      'Redesigned "Game over" screen.',
    ],
  },
  {
    version: 'Alpha 1.5.1',
    points: [
      'Alliance request timeout set to 20 seconds.',
      'Dead players stay in the leaderboard.',
      'Small bug fixes.',
    ],
  },
  {
    version: 'Alpha 1.5',
    points: [
      'Added Alliances. If your ally wins, you win too.',
      'Villages are no longer spawning in range of enemy Castles.',
      'Added neutral Villages and Camps.',
    ],
  },
  {
    version: 'Alpha 1.4.1',
    points: [
      'Camps are spawning less frequently.',
      'The game automatically finishes after 10 minutes. The player with most tiles wins.',
    ],
  },
  {
    version: 'Alpha 1.4',
    points: [
      'More responsive armies.',
      'The color selector was moved to waiting screen.',
      'Villages can spawn 2 forests and 2 camps.',
      'Added WASD camera movement.',
      'Improved hover descriptions, it now shows wood costs.',
      'Small graphics improvements & bug fixes.',
    ],
  },
  {
    version: 'Alpha 1.3.2',
    points: [
      'The leaderboard is now sorted correctly.',
      'Fixed some small bugs and glitches.',
    ],
  },
  {
    version: 'Alpha 1.3.1',
    points: [
      'Faster manual attacks.',
      'Added capture previews.',
      'Fixed many small bugs and glitches.',
    ],
  },
  {
    version: 'Alpha 1.3',
    points: [
      'Added action queue.',
      'Slower game tempo.',
      'Auto-capture of neutral tiles with >= 5 neighbors.',
      'Smaller world size.',
      'In-game action icons.',
      "Window resize doesn't break the game.",
    ],
  },
  {
    version: 'Alpha 1.2.1',
    points: ['Added waiting screen chat.', 'Game is more stable.'],
  },
  {
    version: 'Alpha 1.2',
    points: [
      'Wood capacity is now 6 instead of 4.',
      'Castle costs 2 wood instead of 1.',
      'Castle starts with a free army.',
      'Game is split into multiple arena instances with 3 - 6 players. Last alive wins.',
      'Capturing a mountain is as fast as any other tile.',
      'Selectable pattern colors.',
      'Manual attacks are a little bit slower.',
      'Several army bugs are fixed.',
    ],
  },
  {
    version: 'Alpha 1.1',
    points: [
      'Improved Mountain generator.',
      'Escape now cancels Action instead of quitting the game.',
      'Player names are visible on hover.',
      'Added contested tiles icons.',
      'Improved Village spawning algorithm, they never spawn on empire border.',
    ],
  },
  {
    version: 'Alpha 1.0',
    points: [
      'Every Player starts with 7 tiles, with Capital at center.',
      'Added Hit Points System. Capitals have 2 hit points.',
      'Removed Camps (replaced with Villages and Mountains).',
      'Removed cooldown on Army recruitment.',
      'Removed Action countering system.',
      'Removed Water.',
      'Gold system is replaced with Wood system, with 1 Wood for cutting each Forest tile. Wood is used for building Castles and recruiting armies.',
      'Armies can be used to destroy Castles.',
      'Added Camps with Armies. Randomly spawned by Villages.',
      'Added Villages. Villages spawn on your territory as it grows. Capturing a Village also captures neighboring tiles. Villages randomly spawn Forests and Camps.',
      'Capturing a Mountain also captures neighboring tiles.',
      'Non-neutral Mountains cannot be captured.',
      'Disabled manual attacks on non-neutral tiles.',
      'Disabled manual attacks on neutral tiles with 2 or more neighboring players.',
      'Improved graphics & animations.',
      'Lots of other various changes.',
    ],

    editedBy: 'Joeyjojo',
  },
]

export default changelog
