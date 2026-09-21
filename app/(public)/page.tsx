import { Hero } from "@/components/home/hero"
import { WorshipTimes } from "@/components/home/worship-times"
import { FeaturedSermons } from "@/components/home/featured-sermons"
import { ChurchNews } from "@/components/home/church-news"
import { InfoBlocks } from "@/components/home/info-blocks"
import { GalleryCarousel } from "@/components/home/gallery-carousel"
import { PopupModal } from "@/components/popup-modal"
import { getActivePopups, getGallery, getLatestBulletin } from "@/lib/queries"
import { LiveStream } from "@/components/home/live-stream"
import { SocialFloat } from "@/components/home/social-float"

export default async function HomePage() {
  const [popups, bulletin, recentPhotos] = await Promise.all([getActivePopups(), getLatestBulletin(), getGallery(5)])

  return (
    <>
      <SocialFloat />
      <PopupModal popups={popups} />
      <Hero />
      <LiveStream />
      <section className="bg-white py-10">
        <div className="scroll-reveal mx-auto max-w-6xl px-4 lg:max-w-[1360px] lg:px-6">
          <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:items-stretch">
            <div>
              <FeaturedSermons />
            </div>
            <div className="rounded-2xl bg-primary/5 p-6 lg:p-8">
              <InfoBlocks bulletin={bulletin} />
              <GalleryCarousel items={recentPhotos} />
            </div>
          </div>
        </div>
      </section>
      <ChurchNews />
      <WorshipTimes />
    </>
  )
}
