export function getParamFromUrl(param: string) {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get(param)
}
