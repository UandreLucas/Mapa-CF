'use client'

import Script from 'next/script'
import { Suspense, useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { META_PIXEL_ID, trackContact, trackPageView } from '@/lib/analytics'

/**
 * Loads the Meta Pixel and tracks the two conversions that matter:
 *
 * - Contact — any click on a WhatsApp link. Caught by delegation on the
 *   document, so it covers the floating button, the header, the footer,
 *   the property card and the server-rendered pages alike, without each
 *   of them needing a handler.
 * - Lead — fired by the forms themselves, on a successful submission.
 *
 * Only mounted in the public layout, so admin activity is never tracked.
 */
function PixelEvents() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // The base snippet already fires PageView on load, so only client-side
  // navigation after that needs one — otherwise the first view counts twice.
  const firstRender = useRef(true)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    trackPageView()
  }, [pathname, searchParams])

  // Contact: any click that lands on a WhatsApp link.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      const link = target?.closest?.('a[href*="wa.me"]')
      if (!link) return
      trackContact({ content_name: pathname })
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [pathname])

  return null
}

export function MetaPixel() {
  if (!META_PIXEL_ID) return null

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${META_PIXEL_ID}');
fbq('track','PageView');`}
      </Script>

      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          alt=""
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>

      {/* useSearchParams needs a Suspense boundary in the app router. */}
      <Suspense fallback={null}>
        <PixelEvents />
      </Suspense>
    </>
  )
}
