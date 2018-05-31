class lyric {

  static getLyric(url, cb) {
    const request = new XMLHttpRequest()
    request.open('GET', url, true)
    request.responseType = 'text'
    // fix for the messy code problem for Chinese.  reference: http://xx.time8.org/php/20101218/ajax-xmlhttprequest.html
    // request['overrideMimeType'] && request.overrideMimeType("text/html;charset=gb2312");
    request.onload = () => {
      cb(this.parseLyric(request.response))
    }
    request.onerror = (e) => {
      console.log(e)
    }
    request.onabort = (e) => {
      console.log(e)
    }
    request.send()
  }

  static parseLyric(text) {
    // get each line from the text
    let lines = text.split('\n')
        // this regex mathes the time [00.12.78]
    const pattern = /\[\d{2}:\d{2}.\d{2}\]/g
    const result = []

    // Get offset from lyrics
    const offset = this.getOffset(text)

    // exclude the description parts or empty parts of the lyric
    while (!pattern.test(lines[0])) {
      lines = lines.slice(1)
    }
    // remove the last empty item
    lines[lines.length - 1].length === 0 && lines.pop()
    // display all content on the page
    lines.forEach((v) => {
      const time = v.match(pattern)
      const value = v.replace(pattern, '')
      time && time.forEach((v1) => {
            // convert the [min:sec] to secs format then store into result
        const t = v1.slice(1, -1).split(':')
        //result.push([(parseInt(t[0], 10) * 60) + parseFloat(t[1]) + (parseInt(offset, 10) / 1000), value])
        result.push({
          time: (parseInt(t[0], 10) * 60) + parseFloat(t[1]) + (parseInt(offset, 10) / 1000),
          text: value,
        })
      })
    })
    // sort the result by time
    result.sort((a, b) => {
      return a.time - b.time
    })
    return result
  }

  static getOffset(text) {
    // Returns offset in miliseconds.
    let offset = 0
    try {
      const offsetLine = text.match(/\[offset:\-?\+?\d+\]/g)[0]
      offset = parseInt(offsetLine.split(':')[1], 10)
    } catch (err) {
      offset = 0
    }
    return offset
  }
}

export default lyric
