import { PRIMARY } from '../../constants/react'
import Heading from './Heading'
import React from 'react'
import styled from 'styled-components'
import changelog from 'constants/changelog'

const Container = styled.div``

const UpdateContainer = styled.div`
  color: #fff;
  margin-top: 32px;
  margin-bottom: 32px;
  background: #383838;
  padding: 48px;
  border-radius: 8px;
  box-shadow: 0px 1px 24px 0px rgba(0, 0, 0, 0.05);
`

const Version = styled.h3`
  font-size: 32px;
  margin-bottom: 32px;
`

const Point = styled.p`
  font-size: 20px;
  margin-top: 20px;
  position: relative;
  line-height: 32px;
  padding-left: 32px;

  ::before {
    content: '';
    width: 10px;
    height: 10px;
    background: ${PRIMARY};
    display: block;
    position: absolute;
    left: 0px;
    top: 12px;
    border-radius: 100%;
  }
`

const EditorCredits = styled.p`
  text-align: right;
  font-style: italic;

  span {
    font-weight: 600;
    font-size: 18px;
    color: ${PRIMARY};
  }
`

const ReleaseNotes = () => (
  <Container>
    <Heading>What's new</Heading>

    {changelog.map(release => (
      <UpdateContainer key={release.version}>
        <Version>{release.version}</Version>
        {release.points.map(point => (
          <Point key={point}>{point}</Point>
        ))}
        {release.editedBy && (
          <EditorCredits>
            Edited by <span>{release.editedBy}</span>
          </EditorCredits>
        )}
      </UpdateContainer>
    ))}
  </Container>
)

export default ReleaseNotes
