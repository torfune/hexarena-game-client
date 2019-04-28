import { animated, useTransition, config } from 'react-spring'

export const FadeUp = ({ children }) => {
  const transitions = useTransition(true, null, {
    config: config.stiff,
    from: { position: 'relative', top: '20px', opacity: 0 },
    enter: { top: '0px', opacity: 1 },
  })

  return transitions.map(({ key, props }) => (
    <animated.div key={key} style={props}>
      {children}
    </animated.div>
  ))
}

export const FadeDown = ({ children }) => {
  const transitions = useTransition(true, null, {
    config: config.stiff,
    from: { position: 'relative', top: '-20px', opacity: 0 },
    enter: { top: '0px', opacity: 1 },
  })

  return transitions.map(({ key, props }) => (
    <animated.div key={key} style={props}>
      {children}
    </animated.div>
  ))
}

export const PopIn = ({ children }) => {
  const transitions = useTransition(true, null, {
    // config: config.stiff,
    from: { opacity: 0 },
    enter: { opacity: 1 },
  })

  return transitions.map(({ key, props }) => (
    <animated.div key={key} style={props}>
      {children}
    </animated.div>
  ))
}
