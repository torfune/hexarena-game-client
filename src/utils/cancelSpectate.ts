import getWebClientUrl from './getWebClientUrl'

function cancelSpectate() {
  window.parent.postMessage('goBack', getWebClientUrl())
}

export default cancelSpectate
