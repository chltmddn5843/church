import { Hero } from "@/components/home/hero"
import { WorshipTimes } from "@/components/home/worship-times"
import { QuickLinks } from "@/components/home/quick-links"
import { LatestSermons } from "@/components/home/latest-sermons"
import { GalleryPreview } from "@/components/home/gallery-preview"
import { PopupModal } from "@/components/popup-modal"
import { getActivePopups } from "@/lib/queries"

export default async function HomePage() {
  const popups = await getActivePopups()

  return (
    <>
      <PopupModal popups={popups} />
      <Hero />
      <WorshipTimes />
      <QuickLinks />
      <LatestSermons />
      <GalleryPreview />
    </>
  )
}
