export const church = {
  name: "원당교회",
  nameEn: "Wondang Church",
  denomination: "대한예수교장로회",
  pastor: "정승천",
  pastorTitle: "담임목사",
  slogan: "제자 삼고 제자 되는 교회",
  subSlogan: "예배로 하나님께, 사랑으로 이웃에게 나아가는 원당교회입니다.",
  address: "인천광역시 검단구 이음1로 320 (원당동 1088)",
  addressShort: "인천광역시 검단구 이음1로 320",
  tel: "032-563-4943",
  fax: "032-563-1425",
  email: "wdchurch@wdchurch.com",
  map: {
    lat: 37.5943,
    lng: 126.6712,
  },
  nav: [
    {
      title: "교회소개",
      href: "/about",
      children: [
        { title: "인사말", href: "/about#greeting" },
        { title: "섬기는 분들", href: "/about#staff" },
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
        { title: "특별예배 및 행사", href: "/sermons?category=특별예배" },
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
        { title: "전체 수료자", href: "/discipleship#graduates" },
      ],
    },
    {
      title: "다음세대",
      href: "/next-generation",
      children: [
        { title: "유아부", href: "/next-generation#toddler" },
        { title: "유치부", href: "/next-generation#kindergarten" },
        { title: "유년부", href: "/next-generation#elementary" },
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
        { title: "봉사 섬김이", href: "/community?category=봉사%20섬김이" },
        { title: "갤러리", href: "/gallery" },
      ],
    },
  ],
} as const

export type NavItem = (typeof church.nav)[number]
