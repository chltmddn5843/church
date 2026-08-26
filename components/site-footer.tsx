import Link from "next/link"
import Image from "next/image"
import { church } from "@/lib/church"
import { MapPin, Phone, Printer, Mail } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-sidebar text-sidebar-foreground">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Church identity */}
          <div>
            <Image src="/images/wd-footer-logo.png" alt={`${church.name} 로고`} width={310} height={40} className="h-10 w-auto brightness-0 invert" />
            <p className="mt-4 text-sm leading-relaxed opacity-80">
              {church.denomination}
              <br />
              {church.slogan}
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 font-semibold">교회 안내</h3>
            <ul className="space-y-2 text-sm opacity-90">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sidebar-primary" />
                <span>{church.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-sidebar-primary" />
                <span>Tel. {church.tel}</span>
              </li>
              <li className="flex items-center gap-2">
                <Printer className="h-4 w-4 shrink-0 text-sidebar-primary" />
                <span>Fax. {church.fax}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-sidebar-primary" />
                <span>{church.email}</span>
              </li>
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="mb-4 font-semibold">바로가기</h3>
            <ul className="grid grid-cols-2 gap-2 text-sm opacity-90">
              {church.nav.map((item) => (
                <li key={item.title}>
                  <Link href={item.href} className="transition-colors hover:text-sidebar-primary">
                    {item.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/gallery" className="transition-colors hover:text-sidebar-primary">
                  갤러리
                </Link>
              </li>
              <li>
                <Link href="/offering" className="transition-colors hover:text-sidebar-primary">
                  스마트 헌금
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-sidebar-border pt-6 text-center text-xs opacity-60">
          <p>
            {church.pastorTitle} {church.pastor} · © {new Date().getFullYear()} {church.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
