import styled from 'styled-components'
import TabHeading from './TabHeading'
import React from 'react'
import TabDescription from './TabDescription'

const Container = styled.div``

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const BuildingName = styled.p`
  text-align: center;
  font-size: 14px;
  margin-bottom: 8px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 2px;
`

const Image = styled.img`
  height: 96px;
  border-top: 1px solid #000;
  border-bottom: 1px solid #000;
`

const Arrow = styled.img.attrs({
  src: '/game/static/icons/arrow.svg',
})`
  height: 32px;
  filter: invert(1);
  margin: 0 8px;
  transform: rotate(180deg);
  opacity: 0.5;
`

const Health = styled.div`
  margin-left: 2px;
  opacity: 0.5;
  display: flex;
  align-items: center;

  img {
    height: 16px;
    filter: invert(1);
  }

  p {
    font-weight: 500;
    font-size: 20px;
    margin-left: 6px;
  }
`

const RecruitIcon = styled.img.attrs({
  src: '/game/static/icons/recruit.svg',
})`
  filter: invert(1);
  height: 20px;
  opacity: 0.5;
  margin-right: 2px;
`

const Building = styled.div`
  background: #111;
  padding-top: 8px;
  border-radius: 4px;
  border: 1px solid #000;
`

const BuildingStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 6px;
  padding-right: 6px;
  padding-bottom: 4px;
`

const Buildings = () => {
  return (
    <Container>
      <TabHeading>
        <img src="/game/static/images/castle-icon.png" />
        Buildings
      </TabHeading>

      <TabDescription>
        <li>
          Every building can store and send <span>Army</span>.
        </li>
        <li>Strategic placement is very important.</li>
      </TabDescription>

      <Row>
        <Building>
          <BuildingName>Capital</BuildingName>
          <Image src="/game/static/images/base-ingame.png" />
          <BuildingStats>
            <Health>
              <img src="/game/static/icons/heart.svg" />
              <p>2</p>
            </Health>
            <RecruitIcon />
          </BuildingStats>
        </Building>

        <Row>
          <Building>
            <BuildingName>Camp</BuildingName>
            <Image src="/game/static/images/camp-ingame.png" />
            <BuildingStats>
              <Health>
                <img src="/game/static/icons/heart.svg" />
                <p>0</p>
              </Health>
            </BuildingStats>
          </Building>

          <Arrow />

          <Building>
            <BuildingName>Tower</BuildingName>
            <Image src="/game/static/images/tower-ingame.png" />
            <BuildingStats>
              <Health>
                <img src="/game/static/icons/heart.svg" />
                <p>2</p>
              </Health>
            </BuildingStats>
          </Building>

          <Arrow />

          <Building>
            <BuildingName>Castle</BuildingName>
            <Image src="/game/static/images/castle-ingame.png" />
            <BuildingStats>
              <Health>
                <img src="/game/static/icons/heart.svg" />
                <p>3</p>
              </Health>
              <RecruitIcon />
            </BuildingStats>
          </Building>
        </Row>
      </Row>
    </Container>
  )
}

export default Buildings
