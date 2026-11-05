import Image from "next/image"
import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { resetContentImage, saveContent } from "@/app/actions/content"
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button"
import { SubmitButton } from "@/components/admin/submit-button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { getSiteContent } from "@/lib/queries"
import { editablePages } from "@/lib/site-content"
import { cn } from "@/lib/utils"

export default async function AdminContentPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page: pageId } = await searchParams
  const page = editablePages.find((item) => item.id === pageId) ?? editablePages[0]
  const content = await getSiteContent()

  return (
    <>
      <h1 className="text-3xl font-bold">홈페이지 내용 관리</h1>
      <p className="mt-2 break-keep text-muted-foreground">
        글과 사진을 고치고 항목마다 저장을 누르면 홈페이지에 반영됩니다. 글칸을 비우고 저장하면 처음 문구로 돌아갑니다. 사진은 JPG·PNG·WEBP, 20MB 이하.
      </p>

      <nav aria-label="페이지 선택" className="mt-6 flex flex-wrap items-center gap-2">
        {editablePages.map((item) => (
          <Link
            key={item.id}
            href={`/admin/content?page=${item.id}`}
            aria-current={item.id === page.id ? "page" : undefined}
            className={cn("flex h-11 items-center border px-4 text-sm font-semibold", item.id === page.id ? "border-primary bg-primary text-white" : "border-border bg-card hover:bg-muted")}
          >
            {item.title}
          </Link>
        ))}
        <Link href={page.href} target="_blank" className="ml-auto flex h-11 items-center gap-1.5 text-sm font-medium text-primary hover:underline">
          {page.title} 보기 <ExternalLink aria-hidden className="size-4" />
        </Link>
      </nav>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {page.groups.map((group) => {
          const imageField = group.fields.find((field) => field.kind === "image")
          return (
            <section key={group.id} id={group.id} className="scroll-mt-6 border bg-card">
              <h2 className="px-5 pt-5 font-bold">{group.title}</h2>
              <form action={saveContent.bind(null, group.id)} className="grid gap-4 p-5">
                {group.fields.map((field) =>
                  field.kind === "image" ? (
                    <div key={field.key} className="grid gap-2">
                      <div className="relative aspect-video bg-muted">
                        <Image src={content[field.key]} alt={`${group.title} 현재 사진`} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
                      </div>
                      <label className="grid gap-1.5 text-sm font-medium">
                        사진 바꾸기
                        <input name={field.key} type="file" accept="image/jpeg,image/png,image/webp" className="text-sm font-normal" />
                      </label>
                    </div>
                  ) : (
                    <label key={field.key} className="grid gap-1.5 text-sm font-medium">
                      {field.label}
                      {field.kind === "text" ? (
                        <Textarea name={field.key} rows={field.value.length > 120 ? 7 : 3} defaultValue={content[field.key]} placeholder={field.value} className="rounded-none font-normal" />
                      ) : (
                        <Input name={field.key} defaultValue={content[field.key]} placeholder={field.value} className="h-10 rounded-none font-normal" />
                      )}
                    </label>
                  ),
                )}
                <SubmitButton pendingLabel="저장 중..." className="h-10 w-fit px-4">저장</SubmitButton>
              </form>
              {imageField && content[imageField.key] !== imageField.value && (
                <form action={resetContentImage.bind(null, imageField.key)} className="px-5 pb-5">
                  <ConfirmDeleteButton label="처음 사진으로 되돌리기" confirmMessage={`'${group.title}' 사진을 처음 사진으로 되돌릴까요?`} />
                </form>
              )}
            </section>
          )
        })}
      </div>
    </>
  )
}
