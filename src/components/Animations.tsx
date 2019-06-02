import { animated, useTransition, config } from 'react-spring'
import React from 'react'

interface Props {
  children: React.ReactNode
}

export const FadeUp: React.FC<Props> = ({ children }) => {
  const transitions = useTransition(true, null, {
    config: config.stiff,
    from: { position: 'relative', top: '20px', opacity: 0 },
    enter: { top: '0px', opacity: 1 },
  })

  return (
    <>
      {transitions.map(({ key, props }) => (
        <animated.div key={key} style={props}>
          {children}
        </animated.div>
      ))}
    </>
  )
}

export const FadeDown: React.FC<Props> = ({ children }) => {
  const transitions = useTransition(true, null, {
    config: config.stiff,
    from: { position: 'relative', top: '-20px', opacity: 0 },
    enter: { top: '0px', opacity: 1 },
  })

  return (
    <>
      {transitions.map(({ key, props }) => (
        <animated.div key={key} style={props}>
          {children}
        </animated.div>
      ))}
    </>
  )
}

export const PopIn: React.FC<Props> = ({ children }) => {
  const transitions = useTransition(true, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
  })

  return (
    <>
      {transitions.map(({ key, props }) => (
        <animated.div key={key} style={props}>
          {children}
        </animated.div>
      ))}
    </>
  )
}
