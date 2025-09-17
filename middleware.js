import { NextResponse } from "next/server"
import { default_locale } from "@/app/lib/i18n_config"

export function middleware(request) {
    const pathname = request.nextUrl.pathname

    if (pathname === "/") {
        return NextResponse.redirect(new URL(`/${default_locale}`, request.url))
    }
}

export const config = {
    matcher: "/"
}
