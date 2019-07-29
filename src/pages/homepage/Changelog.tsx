import { PRIMARY } from '../../constants/react'
import styled from 'styled-components'
import changelog from '../../constants/changelog'
import React, { Fragment } from 'react'

const Container = styled.div`
  margin-top: 96px;
`

const Heading = styled.h2`
  font-size: 32px;
  font-weight: 500;
  color: #fff;
`

const ReleaseHead = styled.div`
  background: #222;
  font-size: 24px;
  font-weight: 600;
  margin-top: 32px;
  padding: 16px 48px;
  border: 1px solid #111;
  border-bottom: 0;
  color: #fff;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
`

const ReleaseBody = styled.div`
  color: #fff;
  margin-bottom: 32px;
  background: #282828;
  padding: 16px 48px;
  border: 1px solid #111;
  padding-bottom: 32px;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
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

const Changelog = () => (
  <Container>
    <Heading>Changelog</Heading>

    {changelog.map(release => (
      <Fragment key={release.label}>
        <ReleaseHead>{release.label}</ReleaseHead>
        <ReleaseBody>
          {release.changes.map(change => (
            <Point key={change}>{change}</Point>
          ))}
        </ReleaseBody>
      </Fragment>
    ))}
  </Container>
)

export default Changelog
