export const readUInt32BE = (bytes, offset) => (
  ((bytes[offset] << 24) >>> 0) +
  (bytes[offset + 1] << 16) +
  (bytes[offset + 2] << 8) +
  bytes[offset + 3]
)

export const findAscii = (bytes, value) => {
  const target = [...value].map((character) => character.charCodeAt(0))
  outer: for (let index = 0; index <= bytes.length - target.length; index += 1) {
    for (let offset = 0; offset < target.length; offset += 1) {
      if (bytes[index + offset] !== target[offset]) continue outer
    }
    return index
  }
  return -1
}

export const findEncodedTerminator = (bytes, start, encoding) => {
  if (encoding === 1 || encoding === 2) {
    for (let index = start; index + 1 < bytes.length; index += 2) {
      if (bytes[index] === 0 && bytes[index + 1] === 0) return index
    }
    return -1
  }
  return bytes.indexOf(0, start)
}

export const decodeId3Text = (bytes, encoding) => {
  if (!bytes?.length) return ''
  const labels = { 0:'windows-1252', 1:'utf-16', 2:'utf-16be', 3:'utf-8' }
  try {
    return new TextDecoder(labels[encoding] || 'utf-8').decode(bytes).replace(/^\uFEFF/, '')
  } catch {
    return new TextDecoder('utf-8').decode(bytes).replace(/^\uFEFF/, '')
  }
}

export const extractUsltLyrics = (arrayBuffer) => {
  const bytes = new Uint8Array(arrayBuffer)
  const frame = findAscii(bytes, 'USLT')
  if (frame < 0 || frame + 10 >= bytes.length) return ''

  const size = readUInt32BE(bytes, frame + 4)
  const payloadStart = frame + 10
  const payloadEnd = Math.min(payloadStart + size, bytes.length)
  const payload = bytes.slice(payloadStart, payloadEnd)
  if (payload.length < 5) return ''

  const encoding = payload[0]
  const descriptorStart = 4
  const terminator = findEncodedTerminator(payload, descriptorStart, encoding)
  if (terminator < 0) return ''

  const lyricStart = terminator + ((encoding === 1 || encoding === 2) ? 2 : 1)
  return decodeId3Text(payload.slice(lyricStart), encoding).replace(/\u0000+$/g, '')
}

export const cleanEmbeddedLyrics = (text) => {
  const lines = String(text || '').replace(/\r\n?/g, '\n').split('\n')
  const cleaned = lines.map((line) => /^\s*\[[^\]]*\]\s*$/.test(line) ? '' : line.trimEnd())
  return cleaned.join('\n').replace(/\n\s*\n(?:\s*\n)+/g, '\n\n').trim()
}

export const lyricsTextToLines = (text) => {
  const result = []
  let breakBefore = false

  cleanEmbeddedLyrics(text).split('\n').forEach((raw) => {
    const line = raw.trim()
    if (!line) {
      breakBefore = true
      return
    }
    result.push({
      time:null,
      text:line,
      breakBefore:Boolean(breakBefore && result.length)
    })
    breakBefore = false
  })

  return result
}

export const fetchEmbeddedLyrics = async (url) => {
  const read = async (range) => {
    const response = await fetch(url, { headers: range ? { Range: range } : undefined })
    if (!response.ok) throw new Error(`Lyrics request failed: ${response.status}`)
    return response.arrayBuffer()
  }

  let buffer = await read('bytes=0-131071')
  let lyrics = extractUsltLyrics(buffer)

  if (!lyrics) {
    buffer = await read(null)
    lyrics = extractUsltLyrics(buffer)
  }

  return cleanEmbeddedLyrics(lyrics)
}

export const getLyricsSyncSlug = (chapter) => {
  const source = String(chapter?.audio || '')
  const filename = source.split('/').pop() || ''
  return filename.replace(/\.mp3(?:\?.*)?$/i, '')
}

export const getLyricsSyncUrl = (chapter) => `./data/lyrics-sync/${getLyricsSyncSlug(chapter)}.json`

export const isCompleteLyricsSync = (data, expectedTrack) => {
  if (!data || data.synced !== true || !Array.isArray(data.lines) || !data.lines.length) return false
  if (expectedTrack && String(data.track || '').toUpperCase() !== String(expectedTrack).toUpperCase()) return false

  let previous = -Infinity
  return data.lines.every((line) => {
    const time = Number(line?.time)
    const valid = Number.isFinite(time) && time >= 0 && time >= previous && typeof line?.text === 'string' && line.text.trim()
    if (valid) previous = time
    return Boolean(valid)
  })
}

export const formatSyncTime = (seconds) => {
  if (!Number.isFinite(seconds) || seconds < 0) return '--:--.---'
  const minutes = Math.floor(seconds / 60)
  const rest = seconds - minutes * 60
  return `${minutes}:${rest.toFixed(3).padStart(6,'0')}`
}

export const parseSyncTime = (value) => {
  const raw = String(value || '').trim()
  if (!raw) return null
  if (/^\d+(?:\.\d+)?$/.test(raw)) return Number(raw)

  const match = raw.match(/^(\d+):([0-5]?\d(?:\.\d+)?)$/)
  if (!match) return NaN
  return Number(match[1]) * 60 + Number(match[2])
}
