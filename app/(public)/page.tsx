import { Hero } from "@/components/home/hero"
import { WorshipTimes } from "@/components/home/worship-times"
import { FeaturedSermons } from "@/components/home/featured-sermons"
import { ChurchNews } from "@/components/home/church-news"
import { InfoBlocks } from "@/components/home/info-blocks"
import { GalleryPreview } from "@/components/home/gallery-preview"
import { PopupModal } from "@/components/popup-modal"
import { getActivePopups, getLatestBulletin } from "@/lib/queries"
import { LiveStream } from "@/components/home/live-stream"
import { SocialFloat } from "@/components/home/social-float"

export default async function HomePage() {
  const [popups, bulletin] = await Promise.all([getActivePopups(), getLatestBulletin()])

  return (
    <>
      <SocialFloat />
      <PopupModal popups={popups} />
      <Hero />
      <LiveStream />
      <InfoBlocks bulletin={bulletin} />
      <FeaturedSermons />
      <ChurchNews />
      <GalleryPreview />
      <WorshipTimes />
    </>
  )
}
