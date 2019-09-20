import Primitive from '../../types/Primitive'
import Prop from '../../types/Prop'

interface Item {
  updateProps: (props: string[]) => void
  props: { [key: string]: Prop<Primitive> }
}

const updateProps = <T extends Item>(
  item: T,
  parsed: { [key: string]: Primitive }
) => {
  const entries = Object.entries(parsed)
  const updatedProps: string[] = []
  for (let j = 0; j < entries.length; j++) {
    const entry = entries[j]
    const key = entry[0]
    const value = entry[1]

    if (
      !Object.keys(item.props).includes(key) ||
      item.props[key].current === value
    ) {
      continue
    }

    item.props[key].previous = item.props[key].current
    item.props[key].current = value
    updatedProps.push(key)
  }
  item.updateProps(updatedProps)
}

export default updateProps
