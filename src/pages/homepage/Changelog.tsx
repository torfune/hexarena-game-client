import { PRIMARY, BREAKPOINT } from '../../constants/react'
import styled from 'styled-components'
import changelog from '../../constants/changelog'
import React, { Fragment } from 'react'
import Heading from '../../components/Heading'

const MONOSPACE = 'Monaco, Consolas, Courier, Courier New, Lucida Console'

const Container = styled.div`
  margin-top: 96px;
  grid-column: 2;
  grid-row: 3;

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

const ReleaseHead = styled.div`
  background: #222;
  font-size: 16px;
  font-weight: 600;
  margin-top: 24px;
  padding: 8px 20px;
  border: 1px solid #111;
  border-bottom: 0;
  color: #fff;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  font-family: ${MONOSPACE};
`

const ReleaseBody = styled.div`
  color: #fff;
  margin-bottom: 32px;
  background: #282828;
  padding: 0 20px;
  border: 1px solid #111;
  font-size: 14px;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
`

const Point = styled.p`
  font-size: 14px;
  margin-top: 10px;
  margin-bottom: 10px;
  position: relative;
  padding-left: 20px;
  font-family: ${MONOSPACE};

  ::before {
    content: '';
    width: 7px;
    height: 7px;
    background: ${PRIMARY};
    display: block;
    position: absolute;
    left: 0px;
    top: 6px;
    border-radius: 100%;
  }
`

const Changelog = () => (
  <Container>
    <Heading>Changelog</Heading>

    {changelog.map(release => (
      <Fragment key={release.label}>
        <ReleaseHead>{release.label}/2019</ReleaseHead>
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
