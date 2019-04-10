import React from 'react'
import styled from 'styled-components'
import store from '../../../../../store'
import { observer } from 'mobx-react-lite'

const Table = styled.table`
  text-align: left;
  border-collapse: collapse;
  margin: 0 auto;
  color: #222;
  width: 256px;
`

const Field = styled.td`
  padding: 16px 0;
  border-bottom: 1px solid #ccc;
  text-align: ${props => props.align};
  font-weight: ${props => props.weight};
  width: ${props => props.width};
`

const Pattern = styled.div`
  border-radius: 100%;
  width: 16px;
  height: 16px;
  display: inline-block;
  background: ${props => props.color};
  margin-right: 8px;
  position: relative;
  top: 2px;
`

const PlayersTable = () => {
  const players = [...store.players].sort((a, b) => {
    if (a.tilesCount > b.tilesCount) {
      return -1
    } else if (a.tilesCount < b.tilesCount) {
      return 1
    } else {
      return 0
    }
  })

  return (
    <Table>
      <thead>
        <tr>
          <Field width="300px">Player</Field>
          <Field align="right">Tiles</Field>
        </tr>
      </thead>

      <tbody>
        {players.map(({ id, name, pattern, tilesCount }) => (
          <tr key={id}>
            <Field weight="600">
              <Pattern color={pattern} />
              <span>{name}</span>
            </Field>
            <Field align="right" weight="600">
              {tilesCount}
            </Field>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default observer(PlayersTable)
