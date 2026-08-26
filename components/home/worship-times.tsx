const worshipRows = [
  { name: "주일예배 1부", day: "주일 오전", time: "09:00 ~ 10:00", place: "믿음관/비전홀(1층)" },
  { name: "주일예배 2부", day: "주일 오전", time: "11:00 ~ 12:20", place: "믿음관/비전홀(1층)" },
  { name: "주일셀모임", day: "주일 오후", time: "01:30 ~ 03:30", place: "각 홀에서 진행" },
  { name: "금요예배", day: "금요일 저녁", time: "09:00 ~ 11:00", place: "믿음관/비전홀(1층)" },
  { name: "새벽예배", day: "월~금 오전", time: "05:00 ~ 05:30", place: "믿음관/비전홀(1층)" },
  { name: "유아부", day: "주일 오전", time: "09:50 ~ 10:50", place: "소망관/사무엘홀(1층)" },
  { name: "유치부", day: "주일 오전", time: "11:00 ~ 12:20", place: "소망관/다윗홀(2층)" },
  { name: "유년부", day: "주일 오전", time: "10:50 ~ 12:20", place: "소망관/요셉홀(2층)" },
  { name: "초등부", day: "주일 오전", time: "10:55 ~ 12:20", place: "사랑관/드림홀(2층)" },
  { name: "중등부", day: "주일 오전", time: "11:00 ~ 12:20", place: "사랑관/디모데홀(3층)" },
  { name: "고등부", day: "주일 오전", time: "11:00 ~ 12:20", place: "소망관/다니엘홀(2층)" },
  { name: "어와나(AWANA)", day: "주일/토요일", time: "주일 13:30 ~ 15:00, 토요 10:00 ~ 12:00", place: "사랑관 드림홀(2층)/만나홀(1층)" },
  { name: "영어예배부", day: "주일 오전", time: "09:00 ~ 10:10", place: "사랑관/드림홀(2층)" },
  { name: "청년부", day: "주일 오후", time: "01:50 ~ 03:00", place: "사랑관/디모데홀(3층)" },
]

export function WorshipTimes() {
  return (
    <section id="worship" className="scroll-mt-24 bg-secondary py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Worship</p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-foreground md:text-4xl">예배 안내</h2>
          <p className="mt-3 text-muted-foreground">원당교회 예배시간 안내입니다.</p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-primary text-primary-foreground">
              <tr>
                <th className="px-5 py-4 font-semibold">예배</th>
                <th className="px-5 py-4 font-semibold">요일</th>
                <th className="px-5 py-4 font-semibold">시간</th>
                <th className="px-5 py-4 font-semibold">장소</th>
              </tr>
            </thead>
            <tbody>
              {worshipRows.map((row) => (
                <tr key={row.name} className="border-t border-border">
                  <td className="px-5 py-4 font-semibold text-foreground">{row.name}</td>
                  <td className="px-5 py-4 text-muted-foreground">{row.day}</td>
                  <td className="px-5 py-4 text-foreground">{row.time}</td>
                  <td className="px-5 py-4 text-muted-foreground">{row.place}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
