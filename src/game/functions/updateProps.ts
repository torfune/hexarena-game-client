import Primitive from '../../types/Primitive'
import Prop from '../../types/Prop'

interface Item {
  setProp: (key: string, value: Primitive) => void
  props: { [key: string]: Prop<Primitive> }
}

const updateProps = <T extends Item>(
  item: T,
  parsed: { [key: string]: Primitive }
) => {
  const entries = Object.entries(parsed)
  for (let j = 0; j < entries.length; j++) {
    const entry = entries[j]
    const key = entry[0]
    const value = entry[1]
    if (!Object.keys(item.props).includes(key)) continue
    item.setProp(key, value)
  }
}

export default updateProps
