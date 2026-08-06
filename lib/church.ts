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
    { name: "주일 1부 예배", time: "오전 08:00", place: "비전홀" },
    { name: "주일 2부 예배", time: "오전 10:00", place: "비전홀" },
    { name: "주일 3부 예배", time: "오후 12:00", place: "비전홀" },
    { name: "주일 청년부 예배", time: "오후 02:00", place: "비전홀" },
    { name: "금요 예배", time: "저녁 09:00", place: "비전홀" },
    { name: "새벽 기도회", time: "새벽 05:00", place: "비전홀 (화~금)" },
  ],
  nav: [
    {
      title: "교회소개",
      href: "/about",
      children: [
        { title: "인사말", href: "/about#greeting" },
        { title: "섬기는 사람들", href: "/about#staff" },
        { title: "교회발자취", href: "/about#history" },
        { title: "비전·사명", href: "/about#vision" },
        { title: "예배안내", href: "/#worship" },
        { title: "선교", href: "/about#mission" },
        { title: "오시는 길", href: "/about#location" },
      ],
    },
    {
      title: "말씀과 찬양",
      href: "/sermons",
      children: [
        { title: "주일2부예배", href: "/sermons?category=주일예배" },
        { title: "금요예배", href: "/sermons?category=금요예배" },
        { title: "새벽예배", href: "/sermons?category=새벽예배" },
        { title: "할렐루야 찬양대", href: "/sermons?category=찬양대" },
        { title: "특별예배·행사", href: "/sermons?category=특별예배" },
      ],
    },
    {
      title: "제자훈련",
      href: "/discipleship",
      children: [
        { title: "새가족반", href: "/discipleship#courses" },
        { title: "양육반", href: "/discipleship#courses" },
        { title: "제자반", href: "/discipleship#courses" },
        { title: "사역반", href: "/discipleship#courses" },
        { title: "성경 교육", href: "/discipleship#courses" },
      ],
    },
    {
      title: "다음세대",
      href: "/next-generation",
      children: [
        { title: "유아부", href: "/next-generation#toddler" },
        { title: "유치부", href: "/next-generation#kindergarten" },
        { title: "초등부", href: "/next-generation#elementary" },
        { title: "중등부", href: "/next-generation#middle" },
        { title: "고등부", href: "/next-generation#high" },
        { title: "청년부", href: "/next-generation#young-adult" },
        { title: "영어예배부", href: "/next-generation#english" },
        { title: "어와나(AWANA)", href: "/next-generation#awana" },
      ],
    },
    {
      title: "커뮤니티",
      href: "/community",
      children: [
        { title: "공지사항", href: "/community?category=공지사항" },
        { title: "교회소식", href: "/community?category=교회소식" },
        { title: "새가족소개", href: "/community?category=새가족소개" },
        { title: "가정예배순서지", href: "/community?category=가정예배순서지" },
        { title: "갤러리", href: "/gallery" },
      ],
    },
  ],
} as const

export type NavItem = (typeof church.nav)[number]
