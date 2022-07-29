import format from './format'

export default function countdown(config) {
  const defaultConfig = {
    timeRemaining: 0, // 单位为秒
    step: 1000,
    onChange: () => {},
    onEnd: () => {},
  }

  const _config = {...defaultConfig, ...config}
  const {timeRemaining, onChange, step, onEnd} = _config
  const now = format.date2timestamp(Date.now())
  const endTimestamp = now + timeRemaining

  const millSecondsNow = format.date2ms(Date.now())
  const millSecondsEndTimestamp = format.date2ms(millSecondsNow + timeRemaining * 1000)

  let timer = null

  update()

  function update() {
    const now = format.date2timestamp(Date.now())

    const millSecondsNow = new Date().getTime()
    let millSecondsRemaining = millSecondsEndTimestamp - millSecondsNow

    let remaining = endTimestamp - now
    remaining = remaining < 0 ? 0 : Math.abs(remaining)
    millSecondsRemaining = millSecondsRemaining < 0 ? 0 : Math.abs(millSecondsRemaining)
    const offset = {
      remaining,
      millSecondsRemaining,
      seconds: padZero(Math.floor(remaining) % 60),
      minutes: padZero(Math.floor(remaining / 60) % 60),
      hours: padZero(Math.floor(remaining / 60 / 60) % 24),
      days: String(Math.floor(remaining / 60 / 60 / 24)),
    }

    onChange(offset)

    // 判断是否已经到时
    const isEnd = now >= endTimestamp

    if (!isEnd && remaining > 0) {
      timer = setTimeout(update, step)
    } else {
      onEnd()
    }
  }

  return () => {
    timer = clearTimeout(timer)
  }
}

function padZero(num, prefix = '00', bit = -2) {
  return (prefix + num).substr(bit)
}
