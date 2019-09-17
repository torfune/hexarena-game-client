const isSupported = () => {
  try {
    const key = 'TEST_KEY'
    localStorage.setItem(key, key)
    localStorage.removeItem(key)
    return true
  } catch {
    return false
  }
}

class LocalStorageManager {
  static supported = isSupported()

  static get(key: string) {
    if (this.supported) {
      return localStorage.getItem(key)
    } else {
      return null
    }
  }
  static set(key: string, value: string) {
    if (this.supported) {
      localStorage.setItem(key, value)
    }
  }
  static delete(key: string) {
    if (this.supported) {
      localStorage.removeItem(key)
    }
  }
}

export default LocalStorageManager
