// eslint-disable-next-line @typescript-eslint/ban-types
export function debounce(func: Function, time: number): Function {
  let timer: any = null
  return function () {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(func, time)
  }
}
