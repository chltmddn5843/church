// Pure (no server-only) so lib/site-content.test.ts can run under plain node.
import { departments, heroSlides, sundayWorship, trainingCourses, visionMessages } from "./church.ts"

export type ContentField = { key: string; label: string; kind: "line" | "text" | "image"; value: string }
export type ContentGroup = { id: string; title: string; fields: ContentField[] }

const line = (key: string, label: string, value: string): ContentField => ({ key, label, kind: "line", value })
const text = (key: string, label: string, value: string): ContentField => ({ key, label, kind: "text", value })
const image = (key: string, value: string): ContentField => ({ key, label: "사진", kind: "image", value })

// Everything the admin can edit. A key is stored only once it differs from the value here.
// 메뉴에도 나오는 부서·과정 이름은 메뉴와 어긋나지 않도록 뺐다.
export const editablePages = [
  {
    id: "home",
    title: "메인 페이지",
    href: "/",
    groups: [
      ...heroSlides.map((slide, i): ContentGroup => ({
        id: `hero-${i}`,
        title: `맨 위 슬라이드 ${i + 1}`,
        fields: [image(`hero.${i}.image`, slide.src), line(`hero.${i}.title`, "작은 제목", slide.title), line(`hero.${i}.subtitle`, "큰 문구", slide.subtitle)],
      })),
      {
        id: "home-titles",
        title: "구역 제목",
        fields: [
          line("home.vision.title", "비전과 사명", "비전과 사명"),
          line("home.sermons.title", "말씀 다시보기", "말씀 다시보기"),
          line("home.school.title", "교회학교", "교회학교"),
          line("home.news.title", "최근 소식", "최근 소식"),
          line("home.album.title", "교회 앨범", "교회 앨범"),
        ],
      },
      ...visionMessages.map((message, i): ContentGroup => ({
        id: `vision-${i}`,
        title: `비전과 사명 ${i + 1}`,
        fields: [image(`vision.${i}.image`, message.image), line(`vision.${i}.label`, "제목", message.label), text(`vision.${i}.line`, "내용", message.line)],
      })),
      {
        id: "home-worship",
        title: "주일예배 시간 배경",
        fields: [image("home.worship.image", "/images/wd-main.jpg"), line("home.worship.title", "구역 제목", "주일예배 시간")],
      },
      ...sundayWorship.map((worship, i): ContentGroup => ({
        id: `worship-${i}`,
        title: worship.name,
        fields: [line(`worship.${i}.day`, "요일", worship.day), line(`worship.${i}.time`, "시간", worship.time), line(`worship.${i}.place`, "장소", worship.place)],
      })),
    ],
  },
  {
    id: "discipleship",
    title: "제자훈련",
    href: "/discipleship",
    groups: [
      {
        id: "discipleship-banner",
        title: "맨 위 배너",
        fields: [image("discipleship.banner.image", "/images/discipleship/newfamily-sanctuary.jpg"), line("discipleship.banner.subtitle", "문구", "배워서 남 주는 제자, 예수님을 닮아가는 훈련")],
      },
      {
        id: "discipleship-intro",
        title: "제자훈련 안내",
        fields: [
          image("discipleship.intro.image", "/images/discipleship/newfamily-graduation.jpg"),
          line("discipleship.intro.title", "제목", "제자훈련 안내"),
          text(
            "discipleship.intro.body",
            "내용 (빈 줄을 넣으면 문단이 나뉩니다)",
            "원당교회 제자훈련은 한 사람이 예수 그리스도의 온전한 제자로 세워지는 것을 목표로 합니다.\n말씀과 기도, 그리고 공동체 훈련을 통해 신앙이 삶으로 이어지도록 돕습니다.\n\n단계별 양육 과정을 통해 신앙의 기초부터 사역자로 성장하는 여정을 함께 걸어갑니다.",
          ),
        ],
      },
      {
        id: "discipleship-courses",
        title: "훈련 과정 제목",
        fields: [line("discipleship.courses.title", "제목", "훈련 과정"), line("discipleship.courses.description", "설명", "단계별로 성장하는 양육 시스템")],
      },
      ...trainingCourses.map((course, i): ContentGroup => ({
        id: `course-${i}`,
        title: course.title,
        fields: [line(`course.${i}.period`, "기간", course.period), text(`course.${i}.desc`, "설명", course.desc)],
      })),
      {
        id: "discipleship-graduates",
        title: "수료자 사진 제목",
        fields: [line("discipleship.graduates.title", "제목", "전체 수료자 사진"), line("discipleship.graduates.description", "설명", "새가족반, 양육반, 제자반, 사역반 수료 사진을 통합해 볼 수 있습니다.")],
      },
    ],
  },
  {
    id: "next-generation",
    title: "다음세대",
    href: "/next-generation",
    groups: [
      {
        id: "next-banner",
        title: "맨 위 배너",
        fields: [image("next.banner.image", "/images/next-generation.jpg"), line("next.banner.subtitle", "문구", "믿음의 다음세대를 함께 세워갑니다")],
      },
      {
        id: "next-heading",
        title: "교육부서 안내 제목",
        fields: [line("next.heading.title", "제목", "교육부서 안내"), line("next.heading.description", "설명", "연령별 맞춤 신앙 교육으로 자라나는 다음세대")],
      },
      ...departments.map((d): ContentGroup => ({
        id: `dept-${d.id}`,
        title: d.name,
        fields: [
          image(`dept.${d.id}.image`, d.image),
          line(`dept.${d.id}.age`, "대상", d.age),
          line(`dept.${d.id}.time`, "시간", d.time),
          line(`dept.${d.id}.place`, "장소", d.place),
          text(`dept.${d.id}.desc`, "소개", d.desc),
        ],
      })),
    ],
  },
]

const allGroups = editablePages.flatMap((page) => page.groups.map((group) => ({ page, group })))
export const findContentGroup = (id: string) => allGroups.find(({ group }) => group.id === id)
export const findContentField = (key: string) => allGroups.flatMap(({ page, group }) => group.fields.map((field) => ({ page, field }))).find(({ field }) => field.key === key)

export type SiteContent = Record<string, string>

export function mergeContent(rows: { key: string; value: string }[]): SiteContent {
  const content: SiteContent = {}
  for (const { group } of allGroups) for (const field of group.fields) content[field.key] = field.value
  // Rows for keys no longer listed above are ignored rather than trusted.
  for (const row of rows) if (row.key in content) content[row.key] = row.value
  return content
}

export const applyHeroSlides = (c: SiteContent) =>
  heroSlides.map((_, i) => ({ src: c[`hero.${i}.image`], title: c[`hero.${i}.title`], subtitle: c[`hero.${i}.subtitle`] }))

export const applyVisionMessages = (c: SiteContent) =>
  visionMessages.map((_, i) => ({ label: c[`vision.${i}.label`], line: c[`vision.${i}.line`], image: c[`vision.${i}.image`] }))

export const applySundayWorship = (c: SiteContent) =>
  sundayWorship.map((worship, i) => ({ name: worship.name, day: c[`worship.${i}.day`], time: c[`worship.${i}.time`], place: c[`worship.${i}.place`] }))

export const applyCourses = (c: SiteContent) =>
  trainingCourses.map((course, i) => ({ ...course, period: c[`course.${i}.period`], desc: c[`course.${i}.desc`] }))

export const applyDepartments = (c: SiteContent) =>
  departments.map((d) => ({ ...d, image: c[`dept.${d.id}.image`], age: c[`dept.${d.id}.age`], time: c[`dept.${d.id}.time`], place: c[`dept.${d.id}.place`], desc: c[`dept.${d.id}.desc`] }))
