const FEED = "https://www.youtube.com/feeds/videos.xml?channel_id=UC0KYIf-En7v5Ee91PL1IchQ"
const PLAYLISTS: Record<string, string | null> = {
  "주일예배": "PL61Tjrp-GLP7vWfc5urYAh0ZJEY_XF6bK",
  "금요예배": "PL61Tjrp-GLP6Ub5td2fFjsd0LVHIpAj7A",
  "새벽예배": null,
  "쉐키나찬양단": "PL61Tjrp-GLP4HMfRHBvXU2jOMXVuF3O3I",
  "할렐루야찬양대": "PL61Tjrp-GLP7khZV0uZfKGNjoE_UTn-rT",
}

function decode(value: string) {
  return value.replaceAll("&amp;", "&").replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&#39;", "'").replaceAll("&quot;", '"')
}

function categoryOf(title: string) {
  if (/새벽|월삭/.test(title)) return "새벽예배"
  if (/금요/.test(title)) return "금요예배"
  if (/주일|설교/.test(title)) return "주일예배"
  return null
}

async function loadFeed(category: string) {
  const playlist = PLAYLISTS[category]
  const feed = playlist ? `https://www.youtube.com/feeds/videos.xml?playlist_id=${playlist}` : FEED

  try {
    const xml = await fetch(feed, { next: { revalidate: 300 } }).then(response => {
      if (!response.ok) throw new Error(`YouTube feed ${response.status}`)
      return response.text()
    })
    return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].flatMap(([, entry]) => {
      const youtubeId = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1]
      const rawTitle = entry.match(/<title>([\s\S]*?)<\/title>/)?.[1]
      const published = entry.match(/<published>([^<]+)<\/published>/)?.[1]
      if (!youtubeId || !rawTitle || !published) return []
      const title = decode(rawTitle)
      if (!playlist && categoryOf(title) !== category) return []
      return [{ youtubeId, title, category, preachedAt: new Date(published) }]
    })
  } catch (error) {
    console.error("Failed to load YouTube feed:", error)
    return []
  }
}

export async function getYoutubeSermons(category?: string) {
  if (category && !(category in PLAYLISTS)) return []
  const categories = category ? [category] : Object.keys(PLAYLISTS)
  const videos = (await Promise.all(categories.map(loadFeed))).flat()
  return [...new Map(videos.map(video => [video.youtubeId, video])).values()]
    .sort((a, b) => b.preachedAt.getTime() - a.preachedAt.getTime())
}

export function parseYoutubeId(input: string): string | null {
  const value = input.trim()
  for (const pattern of [/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([\w-]{11})/, /^([\w-]{11})$/]) {
    const match = value.match(pattern)
    if (match) return match[1]
  }
  return null
}
