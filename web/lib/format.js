/**
 * 转换 Date 对象
 * @param {Date} date
 * @returns {Object}
 */
function standardizedDate(date) {
  const stdDate = {}
  const format = (num) => `00${num}`.substr(-2)

  stdDate.year = String(date.getFullYear())
  stdDate.month = format(date.getMonth() + 1)
  stdDate.day = format(date.getDate())
  stdDate.hour = format(date.getHours())
  stdDate.minute = format(date.getMinutes())
  stdDate.second = format(date.getSeconds())
  stdDate._month = date.getMonth() + 1
  stdDate._day = date.getDate()

  return stdDate
}

/**
 * 将时间对象或时间戳或 UTCString 转换为毫秒数
 * @param {Date|Number|string} date
 */
function date2ms(date) {
  if (date instanceof Date) return +date

  if (+date) {
    date = +date
    return date / 1e10 > 1 ? date : date * 1000
  } else {
    return +new Date(date)
  }
}

export default {
  date2ms,

  /**
   * 将时间对象或毫秒数或 UTCString 转换为时间戳
   * @param {Date|Number|string} date
   */
  date2timestamp(date) {
    date = date2ms(date)
    return Math.ceil(date / 1000)
  },

  /**
   * 格式化时间戳为相应时间字符串
   * @param {Number|Date} date 时间对象或时间戳或毫秒数或 UTCString
   * @param {String} format 'YYYY-MM-DD HH:mm:ss'
   * @return {String}
   */
  formatDate(date, format) {
    date = date2ms(date)
    const stdDate = standardizedDate(new Date(date))
    const map = {
      YYYY: 'year',
      MM: 'month',
      M: '_month',
      DD: 'day',
      D: '_day',
      HH: 'hour',
      mm: 'minute',
      ss: 'second',
    }

    const matchList = format.match(/(YYYY|MM|DD|M|D|HH|mm|ss)/g) || []
    matchList.forEach((item) => {
      format = format.replace(item, stdDate[map[item]])
    })
    return format
  },

  /**
   * 把错误的数据转正 strip(0.09999999999999998)=0.1
   * @param {Number} num 目标数字
   * @param {Number} precision 精度值，默认12
   */
  fixPrecision(num, precision = 12) {
    return +parseFloat(num.toPrecision(precision))
  },

  /**
   * 计算两个时间的天数差
   */
  diffDay(date1, date2) {
    date1 = date2ms(date1)
    date2 = date2ms(date2)
    return Math.floor(Math.abs(date1 - date2) / 1000 / 3600 / 24)
  },

  getServerTimestamp(res) {
    return this.date2timestamp(res.header.Date)
  },

  /**
   * 时间字符串转时间戳
   * Safari/iPhone 不支持yyyy-mm-dd / yyyy.mm.dd 这种格式，所以统一转为 yyyy/mm/dd HH:mm:ss
   * @param {string} dateStr '2020-05-21 11:11:11' '2020.05.21 11:11:11'
   */
  dateStrToTimestamp(dateStr) {
    if (!dateStr) {
      return ''
    }
    const newDataStr = dateStr.replace(/\.|-/g, '/')
    const date = new Date(newDataStr)
    return date.getTime() / 1000
  },
}

/**
 * 尝试进行 JSON.parse，并去除不可见字符
 */
export function tryJsonParse(input) {
  if (typeof input === 'string') {
    try {
      return JSON.parse(invisibleCharFilter(input))
    } catch (e) {
      return input
    }
  }

  return input
}

/**
 * 移除不可见字符
 */
export function invisibleCharFilter(str) {
  // eslint-disable-next-line
  const reg = /[\u0000-\u001f\u000B\u000C\u00A0\uFEFF\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000]/g
  return str.replace(reg, '')
}

/**
 * 从 options 中获取指定参数，兼容扫小程序码进入的情况
 * @param {String} options 开发工具模拟的 options.scene 的参数值需要进行 encodeURIComponent
 */
export function parseOptionsScene(fieldName, options) {
  const {scene} = options
  let result = options[fieldName]
  if (scene) {
    const query = decodeURIComponent(scene)
    const queryArr = query.split('&') || []
    queryArr.forEach((item) => {
      const itemArr = item.split('=')
      if (itemArr[0] === fieldName) result = itemArr[1]
    })
  }
  return result
}

/**
 * 构造 query string
 * @param {object} data 用来构造 query 的对象
 */
export function genQuery(data) {
  if (!data) return ''
  return Object.keys(data)
    .map((key) => {
      const val = data[key]
      return `${key}=${String(val)}`
    })
    .join('&')
}
