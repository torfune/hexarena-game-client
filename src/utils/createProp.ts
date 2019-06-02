import Prop from '../types/Prop'
import Primitive from '../types/Primitive'

const createProp = <T = Primitive>(value: T): Prop<T> => ({
  current: value,
  previous: value,
})

export default createProp
