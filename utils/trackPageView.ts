const trackPageView = (url: string) => {
  try {
    ;(window as any).gtag('config', 'UA-68180597-3', {
      page_location: url,
    })
  } catch {
    console.warn(`Page view track failed.`)
  }
}

export default trackPageView
