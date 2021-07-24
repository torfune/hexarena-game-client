// no easing, no acceleration
export const linear = (t: number) => t

// accelerating from zero velocity
export const easeInQuad = (t: number) => t * t

// decelerating to zero velocity
export const easeOutQuad = (t: number) => t * (2 - t)

// acceleration until halfway, then deceleration
export const easeInOutQuad = (t: number) =>
  t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t

// accelerating from zero velocity
export const easeInCubic = (t: number) => t * t * t

// decelerating to zero velocity
export const easeOutCubic = (t: number) => --t * t * t + 1

// acceleration until halfway, then deceleration
export const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1

// accelerating from zero velocity
export const easeInQuart = (t: number) => t * t * t * t

// decelerating to zero velocity
export const easeOutQuart = (t: number) => 1 - --t * t * t * t

// acceleration until halfway, then deceleration
export const easeInOutQuart = (t: number) =>
  t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t

// accelerating from zero velocity
export const easeInQuint = (t: number) => t * t * t * t * t

// decelerating to zero velocity
export const easeOutQuint = (t: number) => 1 + --t * t * t * t * t

// acceleration until halfway, then deceleration
export const easeInOutQuint = (t: number) =>
  t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t

export const easeOutElastic =
  (force = 1) =>
  (x: number): number => {
    const c4 = (force * Math.PI) / 3

    return x === 0
      ? 0
      : x === 1
      ? 1
      : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1
  }

export const easeInElastic =
  (force = 1) =>
  (x: number) => {
    const c4 = (force * Math.PI) / 3

    return x === 0
      ? 0
      : x === 1
      ? 1
      : -Math.pow(2, 10 * x - 10) * Math.sin((x * 10 - 10.75) * c4)
  }

export const easeInBack = (x: number) => {
  const c1 = 1.70158
  const c3 = c1 + 1

  return c3 * x * x * x - c1 * x * x
}

export const easeOutBack = (x: number) => {
  const c1 = 1.70158
  const c3 = c1 + 1

  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2)
}
