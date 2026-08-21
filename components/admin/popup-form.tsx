"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { ImagePlus, Save, Upload, X } from "lucide-react"
import { createPopup, updatePopup } from "@/app/actions/popups"
import { Button } from "@/components/ui/button"

type PopupFormProps = {
  popup?: {
    id: number
    title: string
    imageUrl: string | null
    linkUrl: string | null
    content: string | null
    width: number
    height: number
    active: boolean
  }
  compact?: boolean
}

export function PopupForm({ popup, compact = false }: PopupFormProps) {
  const [preview, setPreview] = useState<string | null>(popup?.imageUrl ?? null)
  const [objectUrl, setObjectUrl] = useState<string | null>(null)
  const [fileName, setFileName] = useState("")

  useEffect(() => () => { if (objectUrl) URL.revokeObjectURL(objectUrl) }, [objectUrl])

  function selectFile(file?: File) {
    if (objectUrl) URL.revokeObjectURL(objectUrl)

    if (!file) {
      setObjectUrl(null)
      setPreview(popup?.imageUrl ?? null)
      setFileName("")
      return
    }

    const nextUrl = URL.createObjectURL(file)
    setObjectUrl(nextUrl)
    setPreview(nextUrl)
    setFileName(file.name)
  }

  return (
    <form
      action={popup ? updatePopup.bind(null, popup.id) : createPopup}
      className={compact ? "grid gap-4" : "mt-8 rounded-lg border border-[#d7e5ee] bg-white p-6 shadow-sm"}
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(220px,1fr)]">
        <label className="grid gap-2 text-sm font-medium text-[#183247]">
          제목
          <input
            name="title"
            required
            defaultValue={popup?.title}
            placeholder="팝업 제목을 입력해 주세요"
            className="h-11 rounded-md border border-[#cbd9e3] bg-white px-3 outline-none transition focus:border-[#2F5D8A] focus:ring-2 focus:ring-[#9CC7E6]/40"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-[#183247]">
          연결 주소 <span className="font-normal text-[#6d7f8c]">선택</span>
          <input
            name="linkUrl"
            type="url"
            defaultValue={popup?.linkUrl ?? ""}
            placeholder="https://"
            className="h-11 rounded-md border border-[#cbd9e3] bg-white px-3 outline-none transition focus:border-[#2F5D8A] focus:ring-2 focus:ring-[#9CC7E6]/40"
          />
        </label>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <label className="grid gap-2 text-sm font-medium text-[#183247]">
          너비(px)
          <input
            name="width"
            type="number"
            min={280}
            max={760}
            defaultValue={popup?.width ?? 420}
            className="h-11 rounded-md border border-[#cbd9e3] bg-white px-3 outline-none transition focus:border-[#2F5D8A] focus:ring-2 focus:ring-[#9CC7E6]/40"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-[#183247]">
          높이(px)
          <input
            name="height"
            type="number"
            min={320}
            max={900}
            defaultValue={popup?.height ?? 540}
            className="h-11 rounded-md border border-[#cbd9e3] bg-white px-3 outline-none transition focus:border-[#2F5D8A] focus:ring-2 focus:ring-[#9CC7E6]/40"
          />
        </label>
        <label className="mt-7 flex h-11 items-center gap-2 rounded-md border border-[#cbd9e3] px-3 text-sm text-[#183247]">
          <input type="checkbox" name="active" defaultChecked={popup?.active ?? true} className="size-4" />
          바로 노출
        </label>
      </div>

      <div className="mt-5">
        <p className="text-sm font-medium text-[#183247]">팝업 이미지</p>
        <label className="relative mt-2 flex min-h-[220px] cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed border-[#9fb5c5] bg-[#f8fbfd] transition hover:bg-[#edf4f8]">
          <input
            name="image"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            required={!popup}
            className="sr-only"
            onChange={(event) => selectFile(event.target.files?.[0])}
          />
          {preview ? (
            <Image src={preview} alt="팝업 이미지 미리보기" fill unoptimized className="object-contain p-4" />
          ) : (
            <span className="flex flex-col items-center text-center text-[#526a7d]">
              <span className="mb-3 flex size-12 items-center justify-center rounded-full bg-white shadow-sm">
                <ImagePlus className="size-5" />
              </span>
              <strong className="text-sm text-[#183247]">이미지를 선택해 주세요</strong>
              <span className="mt-1 text-xs">JPG, PNG, WEBP, GIF / 최대 5MB</span>
            </span>
          )}
        </label>
        {fileName && (
          <div className="flex items-center justify-between rounded-b-lg border border-t-0 border-[#d7e5ee] bg-[#f8fbfd] px-4 py-3 text-sm">
            <span className="truncate">{fileName}</span>
            <button type="button" aria-label="선택 취소" onClick={() => selectFile()}>
              <X className="size-4" />
            </button>
          </div>
        )}
      </div>

      <label className="mt-5 grid gap-2 text-sm font-medium text-[#183247]">
        팝업 설명 <span className="font-normal text-[#6d7f8c]">선택</span>
        <textarea
          name="content"
          rows={3}
          defaultValue={popup?.content ?? ""}
          placeholder="이미지 아래에 표시할 간단한 설명"
          className="resize-y rounded-md border border-[#cbd9e3] p-3 outline-none transition focus:border-[#2F5D8A] focus:ring-2 focus:ring-[#9CC7E6]/40"
        />
      </label>

      <Button type="submit" className="mt-5 h-10 w-fit px-4">
        {popup ? <Save className="size-4" /> : <Upload className="size-4" />}
        {popup ? "수정 저장" : "팝업 등록"}
      </Button>
    </form>
  )
}
