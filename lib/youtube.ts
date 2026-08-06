const FEED = "https://www.youtube.com/feeds/videos.xml?channel_id=UC0KYIf-En7v5Ee91PL1IchQ"

function decode(value: string) {
  return value.replaceAll("&amp;", "&").replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&#39;", "'").replaceAll("&quot;", '"')
}

function categoryOf(title: string) {
  if (/새벽|월삭/.test(title)) return "새벽예배"
  if (/금요/.test(title)) return "금요예배"
  if (/주일|설교/.test(title)) return "주일예배"
  return null
}

export async function getYoutubeSermons(category?: string) {
  try {
    const xml = await fetch(FEED, { next: { revalidate: 300 } }).then(response => {
      if (!response.ok) throw new Error(`YouTube feed ${response.status}`)
      return response.text()
    })
    return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].flatMap(([, entry]) => {
      const youtubeId = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1]
      const rawTitle = entry.match(/<title>([\s\S]*?)<\/title>/)?.[1]
      const published = entry.match(/<published>([^<]+)<\/published>/)?.[1]
      if (!youtubeId || !rawTitle || !published) return []
      const title = decode(rawTitle)
      const itemCategory = categoryOf(title)
      if (!itemCategory || (category && category !== itemCategory)) return []
      return [{ youtubeId, title, category: itemCategory, preachedAt: new Date(published) }]
    })
  } catch (error) {
    console.error("Failed to load YouTube feed:", error)
    return []
  }
}
