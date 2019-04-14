function trackPageView(url) {
  try {
    window.gtag('config', 'UA-68180597-3', {
      page_location: url,
    })
  } catch (error) {}
}

export default trackPageView
