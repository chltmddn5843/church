import { clearLiveStream, saveLiveStream } from "@/app/actions/live-stream"
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button"
import { Button } from "@/components/ui/button"
import { getDb } from "@/lib/db"
import { liveStream } from "@/lib/db/schema"

export default async function AdminLivePage() {
  const current = await getDb().select().from(liveStream).limit(1).get()
  return (
    <>
      <h1 className="text-3xl font-bold">예배 영상 관리</h1>
      <p className="mt-2 break-keep text-muted-foreground">
        YouTube 생방송이나 예배 영상 주소를 저장하면 메인 페이지 &lsquo;원당교회 생방송&rsquo; 섹션에 표시됩니다. 예배가 끝나면 아래 버튼으로 내려 주세요.
      </p>
      <form action={saveLiveStream} className="mt-8 grid gap-4 border bg-card p-6">
        <label className="grid gap-2 font-medium">
          YouTube 영상 주소
          <input
            name="url"
            required
            inputMode="url"
            defaultValue={current ? `https://www.youtube.com/watch?v=${current.youtubeId}` : ""}
            placeholder="https://www.youtube.com/live/..."
            aria-describedby="live-url-help"
            className="h-12 border bg-background px-4 font-normal"
          />
        </label>
        <p id="live-url-help" className="-mt-2 text-sm text-muted-foreground">
          YouTube에서 &lsquo;공유&rsquo;로 복사한 주소를 그대로 붙여넣으면 됩니다. (live, youtu.be, watch 주소 모두 가능)
        </p>
        <Button type="submit" className="h-11 w-fit px-5">메인 생방송 저장</Button>
      </form>
      {current ? (
        <section className="mt-8">
          <p className="text-sm text-muted-foreground">
            지금 메인 페이지에 표시 중 · 마지막 저장 {new Date(current.updatedAt).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}
          </p>
          <div className="mt-3 aspect-video overflow-hidden bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${current.youtubeId}`}
              title="현재 생방송 미리보기"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
          <form action={clearLiveStream} className="mt-4">
            <ConfirmDeleteButton label="메인 페이지에서 생방송 섹션 내리기" confirmMessage="메인 페이지의 생방송 섹션을 내릴까요?" className="h-11 px-5" />
          </form>
        </section>
      ) : (
        <p className="mt-8 border bg-card p-6 text-muted-foreground">지금은 메인 페이지에 생방송 섹션이 표시되지 않습니다.</p>
      )}
    </>
  )
}
