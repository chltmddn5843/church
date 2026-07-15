// 원당교회 실제 정보 (참고: https://www.wdchurch.com)
export const church = {
  name: "원당교회",
  nameEn: "Wondang Church",
  denomination: "대한예수교장로회",
  pastor: "양승철",
  pastorTitle: "담임목사",
  slogan: "말씀 위에 세워지는 건강한 교회",
  subSlogan: "예배로 하나님께 영광을, 사랑으로 이웃을 섬기는 원당교회입니다.",
  address: "인천광역시 서구 이음1로 320 (원당동 1088)",
  addressShort: "인천광역시 서구 이음1로 320",
  tel: "032-563-4943",
  fax: "032-563-1425",
  email: "wdchurch@wdchurch.com",
  // 지도 좌표 (원당동 인근)
  map: {
    lat: 37.5943,
    lng: 126.6712,
  },
  worship: [
    { name: "주일 1부 예배", time: "오전 09:00", place: "본당" },
    { name: "주일 2부 예배", time: "오전 11:00", place: "본당" },
    { name: "주일 오후 예배", time: "오후 02:00", place: "본당" },
    { name: "수요 기도회", time: "저녁 07:30", place: "본당" },
    { name: "금요 철야기도", time: "저녁 09:00", place: "본당" },
    { name: "새벽 기도회", time: "새벽 05:30", place: "본당 (화~토)" },
  ],
  nav: [
    {
      title: "교회소개",
      href: "/about",
      children: [
        { title: "인사말", href: "/about#greeting" },
        { title: "교회비전", href: "/about#vision" },
        { title: "섬기는 사람들", href: "/about#staff" },
        { title: "오시는 길", href: "/about#location" },
      ],
    },
    {
      title: "말씀과 찬양",
      href: "/sermons",
      children: [
        { title: "주일예배 설교", href: "/sermons?category=주일예배" },
        { title: "수요예배 설교", href: "/sermons?category=수요예배" },
        { title: "새벽기도 말씀", href: "/sermons?category=새벽기도" },
      ],
    },
    {
      title: "제자훈련",
      href: "/discipleship",
      children: [
        { title: "제자훈련 안내", href: "/discipleship#intro" },
        { title: "훈련 과정", href: "/discipleship#courses" },
      ],
    },
    {
      title: "다음세대",
      href: "/next-generation",
      children: [
        { title: "영유아·유치부", href: "/next-generation#kids" },
        { title: "아동부", href: "/next-generation#children" },
        { title: "청소년부", href: "/next-generation#youth" },
        { title: "청년부", href: "/next-generation#young-adult" },
      ],
    },
    {
      title: "커뮤니티",
      href: "/community",
      children: [
        { title: "교회소식", href: "/community?category=교회소식" },
        { title: "공지사항", href: "/community?category=공지사항" },
        { title: "갤러리", href: "/gallery" },
      ],
    },
  ],
} as const

export type NavItem = (typeof church.nav)[number]
