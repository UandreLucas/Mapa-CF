/**
 * Meta (Facebook) Pixel helpers.
 *
 * Every call is a no-op when fbq has not loaded — an ad blocker, a bot, or
 * a missing pixel id must never break a form submission or a link.
 */

export const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID || '1174428701074029'

type FbqParams = Record<string, string | number | undefined>

declare global {
  interface Window {
    fbq?: (
      command: 'track' | 'trackCustom' | 'init',
      event: string,
      params?: FbqParams
    ) => void
  }
}

function track(event: string, params?: FbqParams) {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return
  try {
    window.fbq('track', event, params)
  } catch {
    // Never let analytics break the page.
  }
}

/** Someone opened a conversation on WhatsApp. */
export function trackContact(params?: FbqParams) {
  track('Contact', params)
}

/** Someone submitted a form and became a lead. */
export function trackLead(params?: FbqParams) {
  track('Lead', params)
}

/** Route change in the app router (the base snippet only fires once). */
export function trackPageView() {
  track('PageView')
}
