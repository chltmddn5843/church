import Image from "next/image"
import { resetHeroImage, saveHeroImage } from "@/app/actions/hero"
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button"
import { Button } from "@/components/ui/button"
import { heroSlides } from "@/lib/church"
import { getHeroImages } from "@/lib/queries"

export default async function AdminHeroPage() {
  const images = await getHeroImages()

  return (
    <>
      <h1 className="text-3xl font-bold">메인 이미지 관리</h1>
      <p className="mt-2 break-keep text-muted-foreground">
        메인 페이지 맨 위에서 넘어가는 큰 사진을 바꿉니다. 화면 전체에 꽉 차게 표시되니 <strong className="font-semibold text-foreground">가로로 긴 사진</strong>(예: 1920×1080)을 올려 주세요. JPG·PNG·WEBP, 20MB 이하.
      </p>
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {heroSlides.map((slide, slot) => {
          const custom = images[slot]
          return (
            <section key={slide.title} className="border bg-card">
              <div className="relative aspect-video bg-muted">
                <Image src={custom ?? slide.src} alt={`${slide.title} 슬라이드 현재 이미지`} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
              </div>
              <div className="grid gap-4 p-5">
                <div>
                  <h2 className="font-bold">{slot + 1}. {slide.title}</h2>
                  <p className="text-sm text-muted-foreground">{slide.subtitle} · {custom ? "교체한 이미지" : "기본 이미지"}</p>
                </div>
                <form action={saveHeroImage.bind(null, slot)} className="grid gap-3">
                  <label className="grid gap-2 text-sm font-medium">
                    새 이미지
                    <input name="image" type="file" required accept="image/jpeg,image/png,image/webp" className="text-sm font-normal" />
                  </label>
                  <Button type="submit" className="h-10 w-fit px-4">이미지 바꾸기</Button>
                </form>
                {custom && (
                  <form action={resetHeroImage.bind(null, slot)}>
                    <ConfirmDeleteButton label="기본 이미지로 되돌리기" confirmMessage={`'${slide.title}' 슬라이드를 기본 이미지로 되돌릴까요?`} />
                  </form>
                )}
              </div>
            </section>
          )
        })}
      </div>
    </>
  )
}
