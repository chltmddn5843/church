import { Hero } from "@/components/home/hero"
import { QuickLinks } from "@/components/home/quick-links"
import { LatestSermons } from "@/components/home/latest-sermons"
import { GalleryPreview } from "@/components/home/gallery-preview"
import { PopupModal } from "@/components/popup-modal"
import { getActivePopups } from "@/lib/queries"
import { LiveStream } from "@/components/home/live-stream"
import { SmartOfferingFloat } from "@/components/home/smart-offering-float"

export default async function HomePage() {
  const popups = await getActivePopups()

  return (
    <>
      <SmartOfferingFloat />
      <PopupModal popups={popups} />
      <Hero />
      <div className="scroll-reveal"><LiveStream /></div>
      <div className="scroll-reveal"><LatestSermons /></div>
      <div className="scroll-reveal"><QuickLinks /></div>
      <div className="scroll-reveal"><GalleryPreview /></div>
    </>
  )
}
