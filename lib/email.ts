import "server-only"

export async function sendEmail(to: string, subject: string, text: string) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.EMAIL_FROM
  if (!apiKey || !from) throw new Error("이메일 발송 설정이 없습니다.")
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
    body: JSON.stringify({ from, to: [to], subject, text }),
  })
  if (!response.ok) throw new Error(`이메일 발송 실패 (${response.status})`)
}
