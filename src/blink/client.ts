import { createClient } from '@blinkdotnew/sdk'

export const blink = createClient({
  projectId: 'seo-analyzer-dashboard-gvtjhanm',
  authRequired: true
})

// Export individual services for convenience
export const { auth, db, storage, ai, data, analytics, realtime, notifications } = blink