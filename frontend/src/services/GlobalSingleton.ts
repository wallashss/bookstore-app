

const appGlobalState = window as any;

appGlobalState.bookRequestCount = 0;
appGlobalState.bookRequestListener = [];

export const setBookRequestCount = (count) => {
  const listener = appGlobalState.bookRequestListener || []

  appGlobalState.bookRequestCount = count;
  listener.forEach((listener) => {
    listener(count)
  })
}

export const addOnRequestCountChange = (handler) => {

  const listener = appGlobalState.bookRequestListener || []
  appGlobalState.bookRequestListener = [...listener, handler]
}

export const getBookRequestCount = () => {
  return appGlobalState.bookRequestCount;
}