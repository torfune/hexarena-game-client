import { PRIMARY, BREAKPOINT } from '../../constants/react'
import styled from 'styled-components'
import changelog from '../../constants/changelog'
import React, { Fragment } from 'react'

const Container = styled.div`
  margin-top: 96px;
  grid-column: 2;
  grid-row: 4;

  @media (max-width: ${BREAKPOINT.MAIN_1}) {
    grid-column: 1 / span 2;
    grid-row: 5;
  }

  @media (max-width: ${BREAKPOINT.MAIN_2}) {
    grid-column: 1;
    grid-row: 6;
  }

  @media (max-width: ${BREAKPOINT.HIDE_CHAT}) {
    grid-column: 1 / span 2;
  }

  @media (max-width: ${BREAKPOINT.MAIN_4}) {
    grid-column: 1;
  }

  @media (max-width: ${BREAKPOINT.FINAL}) {
    display: none;
  }
`

const Heading = styled.h2`
  font-size: 28px;
  font-weight: 500;
  color: #fff;
`

const ReleaseHead = styled.div`
  background: #222;
  font-size: 20px;
  font-weight: 500;
  margin-top: 32px;
  padding: 16px 32px;
  border: 1px solid #111;
  border-bottom: 0;
  color: #fff;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`

const ReleaseBody = styled.div`
  color: #fff;
  margin-bottom: 32px;
  background: #282828;
  padding: 0 32px;
  border: 1px solid #111;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
`

const Point = styled.p`
  font-size: 20px;
  margin-top: 20px;
  margin-bottom: 20px;
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
