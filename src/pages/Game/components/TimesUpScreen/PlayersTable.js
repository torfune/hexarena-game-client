import React from 'react'
import styled from 'styled-components'

const Table = styled.table`
  text-align: left;
  border-collapse: collapse;
  margin: 100px auto;
`

const Row = styled.tr``

const Field = styled.td`
  padding: 16px;
  border-bottom: 1px solid #666;
  text-align: ${props => props.align};
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

const PlayersTable = ({ players }) => {
  players.sort((a, b) => {
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
        <Row>
          <Field>Player</Field>
          <Field />
          <Field />
          <Field align="right">Tiles</Field>
        </Row>
      </thead>

      <tbody>
        {players.map(({ id, name, pattern, tilesCount }) => (
          <Row key={id}>
            <Field>
              <Pattern color={pattern} />
              {name}
            </Field>
            <Field />
            <Field />
            <Field align="right">{tilesCount}</Field>
          </Row>
        ))}
      </tbody>
    </Table>
  )
}

export default PlayersTable
