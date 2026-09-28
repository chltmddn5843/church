import { Hero } from "@/components/home/hero"
import { WorshipTimes } from "@/components/home/worship-times"
import { FeaturedSermons } from "@/components/home/featured-sermons"
import { ChurchNews } from "@/components/home/church-news"
import { InfoBlocks } from "@/components/home/info-blocks"
import { ChurchSchool } from "@/components/home/church-school"
import { PopupModal } from "@/components/popup-modal"
import { getActivePopups, getLatestBulletin } from "@/lib/queries"
import { LiveStream } from "@/components/home/live-stream"
import { SocialFloat } from "@/components/home/social-float"
import { MessageCards } from "@/components/message-cards"

export default async function HomePage() {
  const [popups, bulletin] = await Promise.all([getActivePopups(), getLatestBulletin()])

  return (
    <>
      <SocialFloat />
      <PopupModal popups={popups} />
      <Hero />
      <InfoBlocks bulletin={bulletin} />
      <MessageCards home />
      <LiveStream />
      <section className="bg-white py-20 md:py-28">
        <div className="scroll-reveal mx-auto max-w-6xl px-4 lg:max-w-[1360px] lg:px-6">
          <FeaturedSermons />
        </div>
      </section>
      <ChurchSchool />
      <ChurchNews />
      <WorshipTimes />
    </>
  )
}
