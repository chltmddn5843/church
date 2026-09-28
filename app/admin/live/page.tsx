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
        교회 YouTube 채널에서 생방송이 시작되면(또는 2시간 안에 시작 예정이면) 메인 페이지 &lsquo;말씀 다시보기&rsquo; 큰 영상 자리에 <strong className="font-semibold text-foreground">자동으로</strong> 표시되고, 끝나면 저절로 내려갑니다. 자동으로 뜨지 않거나 다른 영상을 보여줘야 할 때만 아래에 주소를 넣어 주세요. 직접 넣은 영상은 자동 감지보다 우선하니, 예배가 끝나면 꼭 해제해 주세요.
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
        <Button type="submit" className="h-11 w-fit px-5">직접 지정해서 저장</Button>
      </form>
      {current ? (
        <section className="mt-8">
          <p className="text-sm text-muted-foreground">
            직접 지정한 영상이 메인 페이지에 표시 중 · 마지막 저장 {new Date(current.updatedAt).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}
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
            <ConfirmDeleteButton label="직접 지정 해제 (자동 감지로 돌아가기)" confirmMessage="직접 지정한 영상을 내리고 자동 감지로 돌아갈까요?" className="h-11 px-5" />
          </form>
        </section>
      ) : (
        <p className="mt-8 border bg-card p-6 text-muted-foreground">직접 지정한 영상이 없어요. 생방송은 YouTube에서 자동으로 찾아 표시합니다.</p>
      )}
    </>
  )
}
