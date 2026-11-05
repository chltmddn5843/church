import { Hero } from "@/components/home/hero"
import { WorshipTimes } from "@/components/home/worship-times"
import { FeaturedSermons } from "@/components/home/featured-sermons"
import { ChurchNews } from "@/components/home/church-news"
import { InfoBlocks } from "@/components/home/info-blocks"
import { ChurchSchool } from "@/components/home/church-school"
import { PopupModal } from "@/components/popup-modal"
import { getActivePopups, getLatestBulletin, getSiteContent } from "@/lib/queries"
import { applyDepartments, applyHeroSlides } from "@/lib/site-content"
import { SocialFloat } from "@/components/home/social-float"
import { MessageCards } from "@/components/message-cards"

export default async function HomePage() {
  const [popups, bulletin, c] = await Promise.all([getActivePopups(), getLatestBulletin(), getSiteContent()])

  return (
    <>
      <SocialFloat />
      <PopupModal popups={popups} />
      <Hero slides={applyHeroSlides(c)} />
      <InfoBlocks bulletin={bulletin} />
      <MessageCards home />
      <section className="bg-white py-20 md:py-28">
        <div className="scroll-reveal mx-auto max-w-6xl px-4 lg:max-w-[1360px] lg:px-6">
          <FeaturedSermons />
        </div>
      </section>
      <ChurchSchool title={c["home.school.title"]} departments={applyDepartments(c)} />
      <ChurchNews />
      <WorshipTimes />
    </>
  )
}
