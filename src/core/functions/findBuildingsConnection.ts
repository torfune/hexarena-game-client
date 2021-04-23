import Building from '../classes/Building'
import BuildingsConnection from '../../types/BuildingsConnection'

function findBuildingsConnection(
  connections: BuildingsConnection[],
  buildingA: Building,
  buildingB: Building
): BuildingsConnection | null {
  for (let i = 0; i < connections.length; i++) {
    const connection = connections[i]
    if (
      connection.buildings.includes(buildingA) &&
      connection.buildings.includes(buildingB)
    ) {
      return connection
    }
  }

  return null
}

export default findBuildingsConnection
