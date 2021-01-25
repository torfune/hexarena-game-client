import styled from 'styled-components'
import React, { useState, useEffect } from 'react'
import { PRIMARY, Z_INDEX, TRANSITION } from '../../constants/react'
import { useTransition, animated } from 'react-spring'
import Armies from './Armies'
import Goal from './Goal'
import Controls from './Controls'
import Mechanics from './Mechanics'
import Buildings from './Buildings'
import Villages from './Villages'
import store from '../../store'

const Container = styled(animated.div)`
  position: fixed;
  top: 100px;
  border: 1px solid #000;
  background: #161616;
  border-radius: 8px;
  height: 500px;
  width: 800px;
  color: #fff;
  left: calc(50vw - 400px);
  z-index: ${Z_INDEX.HEADER + 2};
  padding: 16px 32px;
  box-shadow: 0px 0px 32px #000000aa;
`

const Background = styled.div`
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background: #000;
  opacity: 0.6;
  position: fixed;
  z-index: ${Z_INDEX.HEADER + 1};
`

const Heading = styled.p`
  font-weight: 600;
  font-size: 16px;
  display: flex;
  align-items: center;

  img {
    height: 18px;
    filter: invert(1);
    margin-right: 8px;
    margin-top: -2px;
  }
`

const CloseButton = styled.div`
  opacity: 0.6;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: -17px;
  margin-top: 0px;

  img {
    height: 14px;
    filter: invert(1);
  }

  :hover {
    opacity: 1;
  }
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
`

const ContinueButton = styled.div`
  background: ${PRIMARY};
  font-weight: 500;
  border-radius: 4px;
  width: 200px;
  text-align: center;
  padding: 8px 0;
  position: absolute;
  bottom: 0px;
  left: calc(270px - 100px);

  :hover {
    opacity: 0.8;
  }
`

const Navigation = styled.div`
  width: 140px;
  border-right: 1px solid #333;
`

const NavigationItem = styled.p<{ selected: boolean }>`
  padding: 8px 0;
  color: ${props => (props.selected ? '#fff' : '#888')};
  font-weight: ${props => (props.selected ? '700' : '600')};
  font-size: 12px;

  :hover {
    color: #fff;
  }
`

const TabContent = styled.div`
  width: 560px;
  position: relative;
  height: 390px;
`

const Row = styled.div`
  display: flex;
  margin-top: 16px;
  justify-content: space-between;
`

const TABS = [
  'MECHANICS',
  'BUILDINGS',
  'ARMIES',
  'VILLAGES',
  'GOAL',
  'CONTROLS',
]

const START_TAB = 0

interface Props {
  show: boolean
  close: () => void
}
const HowToPlay: React.FC<Props> = ({ show, close }) => {
  const transitions = useTransition(show, null, TRANSITION.SCALE)
  const [tab, setTab] = useState(TABS[START_TAB])

  useEffect(() => {
    if (show) {
      setTab(TABS[START_TAB])

      if (store.game && store.game.loop) {
        store.game.loop.stop()
      }
    } else {
      if (store.game && store.game.loop) {
        store.game.loop.start()
      }
    }
  }, [show])

  const handleContinueClick = () => {
    const currentTabIndex = TABS.indexOf(tab)
    if (currentTabIndex === TABS.length - 1) {
      close()
      return
    }

    setTab(TABS[currentTabIndex + 1])
  }

  return (
    <>
      {transitions.map(
        ({ item, key, props }) =>
          item && (
            <Container key={key} style={props}>
              <Header>
                <Heading>
                  <img src="/static/icons/book.svg" />
                  How to play
                </Heading>
                <CloseButton onClick={close}>
                  <img src="/static/icons/cross.svg" />
                </CloseButton>
              </Header>

              <Row>
                <Navigation>
                  {TABS.map(TAB => (
                    <NavigationItem
                      key={TAB}
                      onClick={() => setTab(TAB)}
                      selected={tab === TAB}
                    >
                      {TAB}
                    </NavigationItem>
                  ))}
                </Navigation>

                <TabContent>
                  {(() => {
                    switch (tab) {
                      case 'GOAL':
                        return <Goal />
                      case 'CONTROLS':
                        return <Controls />
                      case 'MECHANICS':
                        return <Mechanics />
                      case 'BUILDINGS':
                        return <Buildings />
                      case 'ARMIES':
                        return <Armies />
                      case 'VILLAGES':
                        return <Villages />
                    }
                    return null
                  })()}
                  <ContinueButton onClick={handleContinueClick}>
                    {TABS.indexOf(tab) === TABS.length - 1
                      ? 'Close'
                      : 'Continue'}
                  </ContinueButton>
                </TabContent>
              </Row>
            </Container>
          )
      )}
      {show && <Background onClick={close} />}
    </>
  )
}

export default HowToPlay
