"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { ImagePlus, Upload, X } from "lucide-react"
import { createPopup } from "@/app/actions/popups"
import { Button } from "@/components/ui/button"

export function PopupForm() {
  const [preview, setPreview] = useState<string | null>(null)
  const [fileName, setFileName] = useState("")

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview) }, [preview])

  function selectFile(file?: File) {
    if (preview) URL.revokeObjectURL(preview)
    setPreview(file ? URL.createObjectURL(file) : null)
    setFileName(file?.name ?? "")
  }

  return (
    <form action={createPopup} className="mt-8 border-t-2 border-[#333] pt-7">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(220px,1fr)]">
        <label className="grid gap-2 text-sm font-medium">
          제목
          <input name="title" required placeholder="팝업 제목을 입력해 주세요" className="h-12 border border-[#d8d8d8] bg-white px-4 outline-none focus:border-[#555]" />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          연결 주소 <span className="font-normal text-[#999]">(선택)</span>
          <input name="linkUrl" type="url" placeholder="https://" className="h-12 border border-[#d8d8d8] bg-white px-4 outline-none focus:border-[#555]" />
        </label>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <label className="grid gap-2 text-sm font-medium">
          팝업 너비(px)
          <input name="width" type="number" min={280} max={760} defaultValue={420} className="h-12 border border-[#d8d8d8] bg-white px-4 outline-none focus:border-[#555]" />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          이미지 높이(px)
          <input name="height" type="number" min={320} max={900} defaultValue={540} className="h-12 border border-[#d8d8d8] bg-white px-4 outline-none focus:border-[#555]" />
        </label>
        <label className="mt-7 flex items-center gap-2 text-sm">
          <input type="checkbox" name="active" defaultChecked className="size-4" />
          바로 활성화
        </label>
      </div>

      <p className="mt-7 text-sm font-medium">팝업 이미지</p>
      <label className="relative mt-2 flex min-h-[340px] cursor-pointer items-center justify-center overflow-hidden border border-dashed border-[#bbb] bg-[#fafafa] transition hover:bg-[#f5f5f5]">
        <input name="image" type="file" accept="image/jpeg,image/png,image/webp,image/gif" required className="sr-only" onChange={(event) => selectFile(event.target.files?.[0])} />
        {preview ? (
          <Image src={preview} alt="선택한 팝업 이미지 미리보기" fill unoptimized className="object-contain p-5" />
        ) : (
          <span className="flex flex-col items-center text-center text-[#777]">
            <span className="mb-4 flex size-14 items-center justify-center rounded-full bg-white shadow-sm"><ImagePlus className="size-6" /></span>
            <strong className="text-sm text-[#333]">이미지를 선택하거나 끌어다 놓아 주세요</strong>
            <span className="mt-2 text-xs">JPG, PNG, WEBP, GIF · 최대 5MB</span>
          </span>
        )}
      </label>

      {fileName && (
        <div className="flex items-center justify-between border border-t-0 bg-[#fafafa] px-4 py-3 text-sm">
          <span className="truncate">{fileName}</span>
          <button type="button" aria-label="선택 취소" onClick={() => selectFile()}><X className="size-4" /></button>
        </div>
      )}

      <label className="mt-7 grid gap-2 text-sm font-medium">
        팝업 설명 <span className="font-normal text-[#999]">(선택)</span>
        <textarea name="content" rows={3} placeholder="이미지 아래에 표시할 간단한 설명" className="resize-y border border-[#d8d8d8] p-4 outline-none focus:border-[#555]" />
      </label>
      <Button type="submit" className="mt-6 h-11 px-6"><Upload className="size-4" /> 이미지 업로드 및 등록</Button>
    </form>
  )
}
