import React, { useEffect, useState, useReducer, useRef } from 'react'
import styled from 'styled-components'
import Label from './Label'
import { observer } from 'mobx-react-lite'
import store from '../../../../store'

const Container = styled.div`
  padding: 16px 20px;
  flex-grow: 1;
`

const BarWrapper = styled.div`
  height: 36px;
  margin-top: 12px;
  background: #ddd;
  border-radius: 4px;
  overflow: hidden;
`

const BarFill = styled.div<{ percentage: number }>`
  width: ${props => props.percentage}%;
  height: 100%;
  background: #444;
`

let interval: NodeJS.Timeout | null = null

const Income = () => {
  const [percentage, setPercentage] = useState<number>(0)
  const [incomeStartedAt, setIncomeStartedAt] = useState<number | null>(null)
  const incomeStartedAtRef = useRef(incomeStartedAt)
  incomeStartedAtRef.current = incomeStartedAt

  useEffect(() => {
    interval = setInterval(update, 16)
    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [])

  useEffect(() => {
    setIncomeStartedAt(Date.now() + store.ping)
    setPercentage(0)
  }, [store.nextIncomeAt])

  const update = () => {
    const { ping, nextIncomeAt } = store
    const incomeStartedAt = incomeStartedAtRef.current

    if (!nextIncomeAt || !incomeStartedAt) {
      setPercentage(0)
      return
    }

    const now = Date.now() + ping
    const total = nextIncomeAt - incomeStartedAt
    const onePercent = total / 100
    const current = now - incomeStartedAt
    const percentage = Math.round(current / onePercent)

    setPercentage(percentage)
  }

  return (
    <Container>
      <Label>Next income</Label>

      <BarWrapper>
        <BarFill percentage={percentage} />
      </BarWrapper>
    </Container>
  )
}

export default observer(Income)
