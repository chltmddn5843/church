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
      <section className="bg-white py-14 md:py-20">
        <div className="scroll-reveal mx-auto max-w-6xl px-4 lg:max-w-[1360px] lg:px-6">
          <div className="grid gap-12 lg:grid-cols-[1fr_320px] lg:gap-10">
            <div>
              <FeaturedSermons />
            </div>
            <div>
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
