const parseQuery = () => {
  const url = window.location.href
  const queryString = url.split('?')[1]
  if (!queryString) return {}
  const queryParts = queryString.split('&')

  const query: { [key: string]: string } = {}
  for (const part of queryParts) {
    const [key, value] = part.split('=')
    query[key] = value
  }

  return query
}

export default parseQuery
