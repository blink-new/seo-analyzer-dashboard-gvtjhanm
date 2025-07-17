import { blink } from '@/blink/client'

export interface Integration {
  id: string
  name: string
  description: string
  status: 'connected' | 'disconnected' | 'error'
  category: 'analytics' | 'cms' | 'api'
  config?: Record<string, any>
  lastSync?: string
}

export interface GoogleSearchConsoleData {
  queries: Array<{
    query: string
    clicks: number
    impressions: number
    ctr: number
    position: number
  }>
  pages: Array<{
    page: string
    clicks: number
    impressions: number
    ctr: number
    position: number
  }>
  devices: Array<{
    device: string
    clicks: number
    impressions: number
  }>
  countries: Array<{
    country: string
    clicks: number
    impressions: number
  }>
}

export interface GoogleAnalyticsData {
  sessions: number
  users: number
  pageviews: number
  bounceRate: number
  avgSessionDuration: number
  topPages: Array<{
    page: string
    pageviews: number
    uniquePageviews: number
    avgTimeOnPage: number
    bounceRate: number
  }>
  trafficSources: Array<{
    source: string
    sessions: number
    percentage: number
  }>
  conversions: Array<{
    goal: string
    completions: number
    conversionRate: number
    value: number
  }>
}

export interface WordPressPluginData {
  version: string
  isActive: boolean
  lastScan: string
  autoScanEnabled: boolean
  notificationsEnabled: boolean
  performanceMonitoring: boolean
  criticalIssues: number
  warnings: number
  suggestions: number
}

class IntegrationsService {
  async getIntegrations(): Promise<Integration[]> {
    try {
      // Use localStorage for now since database is at limit
      const user = await blink.auth.me()
      const stored = localStorage.getItem(`integrations_${user.id}`)
      
      if (stored) {
        return JSON.parse(stored)
      }
      
      // Return default integrations
      const defaultIntegrations = [
        {
          id: 'google-search-console',
          name: 'Google Search Console',
          description: 'Import search performance data and indexing status',
          status: 'disconnected' as const,
          category: 'analytics' as const
        },
        {
          id: 'google-analytics',
          name: 'Google Analytics',
          description: 'Track user behavior and conversion metrics',
          status: 'disconnected' as const,
          category: 'analytics' as const
        },
        {
          id: 'wordpress',
          name: 'WordPress Plugin',
          description: 'Direct integration with WordPress sites',
          status: 'disconnected' as const,
          category: 'cms' as const
        }
      ]
      
      // Store defaults
      localStorage.setItem(`integrations_${user.id}`, JSON.stringify(defaultIntegrations))
      return defaultIntegrations
    } catch (error) {
      console.error('Failed to fetch integrations:', error)
      return []
    }
  }

  async connectIntegration(integrationId: string, config: Record<string, any> = {}): Promise<void> {
    try {
      const user = await blink.auth.me()
      
      // Log analytics event
      blink.analytics.log('integration_connected', {
        integrationId,
        timestamp: new Date().toISOString()
      })

      // Update integration in localStorage
      const integrations = await this.getIntegrations()
      const updatedIntegrations = integrations.map(integration => 
        integration.id === integrationId 
          ? { 
              ...integration, 
              status: 'connected' as const, 
              config,
              lastSync: new Date().toISOString()
            }
          : integration
      )
      
      localStorage.setItem(`integrations_${user.id}`, JSON.stringify(updatedIntegrations))

      // Perform initial sync based on integration type
      switch (integrationId) {
        case 'google-search-console':
          await this.syncGoogleSearchConsole(config)
          break
        case 'google-analytics':
          await this.syncGoogleAnalytics(config)
          break
        case 'wordpress':
          await this.syncWordPress(config)
          break
      }
    } catch (error) {
      console.error(`Failed to connect integration ${integrationId}:`, error)
      throw new Error(`Failed to connect ${integrationId}`)
    }
  }

  async disconnectIntegration(integrationId: string): Promise<void> {
    try {
      const user = await blink.auth.me()
      
      // Log analytics event
      blink.analytics.log('integration_disconnected', {
        integrationId,
        timestamp: new Date().toISOString()
      })

      // Update integration in localStorage
      const integrations = await this.getIntegrations()
      const updatedIntegrations = integrations.map(integration => 
        integration.id === integrationId 
          ? { ...integration, status: 'disconnected' as const }
          : integration
      )
      
      localStorage.setItem(`integrations_${user.id}`, JSON.stringify(updatedIntegrations))
    } catch (error) {
      console.error(`Failed to disconnect integration ${integrationId}:`, error)
      throw new Error(`Failed to disconnect ${integrationId}`)
    }
  }

  async syncGoogleSearchConsole(config: Record<string, any>): Promise<GoogleSearchConsoleData> {
    try {
      // In a real implementation, this would use Google Search Console API
      // For now, we'll simulate the data
      const data: GoogleSearchConsoleData = {
        queries: [
          { query: 'seo tools', clicks: 1250, impressions: 15000, ctr: 8.33, position: 3.2 },
          { query: 'website analysis', clicks: 890, impressions: 12000, ctr: 7.42, position: 4.1 },
          { query: 'seo checker', clicks: 650, impressions: 8500, ctr: 7.65, position: 2.8 },
          { query: 'page speed test', clicks: 420, impressions: 6200, ctr: 6.77, position: 5.2 },
          { query: 'meta tags analyzer', clicks: 380, impressions: 5800, ctr: 6.55, position: 3.9 }
        ],
        pages: [
          { page: '/', clicks: 2100, impressions: 25000, ctr: 8.4, position: 3.1 },
          { page: '/tools/seo-checker', clicks: 1800, impressions: 22000, ctr: 8.18, position: 2.9 },
          { page: '/blog/seo-guide', clicks: 950, impressions: 15000, ctr: 6.33, position: 4.2 },
          { page: '/pricing', clicks: 420, impressions: 8000, ctr: 5.25, position: 6.1 },
          { page: '/about', clicks: 320, impressions: 5500, ctr: 5.82, position: 5.8 }
        ],
        devices: [
          { device: 'desktop', clicks: 3200, impressions: 45000 },
          { device: 'mobile', clicks: 2400, impressions: 30000 },
          { device: 'tablet', clicks: 400, impressions: 5000 }
        ],
        countries: [
          { country: 'United States', clicks: 2800, impressions: 40000 },
          { country: 'United Kingdom', clicks: 1200, impressions: 18000 },
          { country: 'Canada', clicks: 800, impressions: 12000 },
          { country: 'Australia', clicks: 600, impressions: 10000 }
        ]
      }

      // Store the data in localStorage
      const user = await blink.auth.me()
      localStorage.setItem(`gsc_data_${user.id}`, JSON.stringify({
        data,
        syncedAt: new Date().toISOString()
      }))

      return data
    } catch (error) {
      console.error('Failed to sync Google Search Console:', error)
      throw new Error('Failed to sync Google Search Console data')
    }
  }

  async syncGoogleAnalytics(config: Record<string, any>): Promise<GoogleAnalyticsData> {
    try {
      // In a real implementation, this would use Google Analytics API
      // For now, we'll simulate the data
      const data: GoogleAnalyticsData = {
        sessions: 15420,
        users: 12350,
        pageviews: 45680,
        bounceRate: 42.5,
        avgSessionDuration: 185, // seconds
        topPages: [
          { page: '/', pageviews: 12500, uniquePageviews: 10200, avgTimeOnPage: 120, bounceRate: 35.2 },
          { page: '/tools/seo-checker', pageviews: 8900, uniquePageviews: 7800, avgTimeOnPage: 240, bounceRate: 28.5 },
          { page: '/blog/seo-guide', pageviews: 6200, uniquePageviews: 5800, avgTimeOnPage: 320, bounceRate: 22.1 },
          { page: '/pricing', pageviews: 4100, uniquePageviews: 3900, avgTimeOnPage: 95, bounceRate: 55.8 },
          { page: '/contact', pageviews: 2800, uniquePageviews: 2600, avgTimeOnPage: 85, bounceRate: 48.2 }
        ],
        trafficSources: [
          { source: 'Organic Search', sessions: 8500, percentage: 55.1 },
          { source: 'Direct', sessions: 3200, percentage: 20.8 },
          { source: 'Social Media', sessions: 2100, percentage: 13.6 },
          { source: 'Referral', sessions: 1200, percentage: 7.8 },
          { source: 'Email', sessions: 420, percentage: 2.7 }
        ],
        conversions: [
          { goal: 'Newsletter Signup', completions: 850, conversionRate: 5.5, value: 0 },
          { goal: 'Free Trial', completions: 320, conversionRate: 2.1, value: 0 },
          { goal: 'Purchase', completions: 125, conversionRate: 0.8, value: 12500 },
          { goal: 'Contact Form', completions: 280, conversionRate: 1.8, value: 0 }
        ]
      }

      // Store the data in localStorage
      const user = await blink.auth.me()
      localStorage.setItem(`ga_data_${user.id}`, JSON.stringify({
        data,
        syncedAt: new Date().toISOString()
      }))

      return data
    } catch (error) {
      console.error('Failed to sync Google Analytics:', error)
      throw new Error('Failed to sync Google Analytics data')
    }
  }

  async syncWordPress(config: Record<string, any>): Promise<WordPressPluginData> {
    try {
      // In a real implementation, this would communicate with the WordPress plugin
      // For now, we'll simulate the data
      const data: WordPressPluginData = {
        version: '2.1.0',
        isActive: true,
        lastScan: new Date().toISOString(),
        autoScanEnabled: config.autoScan || true,
        notificationsEnabled: config.notifications || true,
        performanceMonitoring: config.performance || false,
        criticalIssues: Math.floor(Math.random() * 5),
        warnings: Math.floor(Math.random() * 15),
        suggestions: Math.floor(Math.random() * 25)
      }

      // Store the data in localStorage
      const user = await blink.auth.me()
      localStorage.setItem(`wp_data_${user.id}`, JSON.stringify({
        data,
        syncedAt: new Date().toISOString()
      }))

      return data
    } catch (error) {
      console.error('Failed to sync WordPress:', error)
      throw new Error('Failed to sync WordPress plugin data')
    }
  }

  async generateApiKey(name: string): Promise<string> {
    try {
      const user = await blink.auth.me()
      const apiKey = `seo_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
      
      // Store API key in localStorage
      const existingKeys = JSON.parse(localStorage.getItem(`api_keys_${user.id}`) || '[]')
      const newKey = {
        id: `key_${Date.now()}`,
        name,
        key: apiKey,
        createdAt: new Date().toISOString(),
        lastUsed: null,
        isActive: true
      }
      
      existingKeys.push(newKey)
      localStorage.setItem(`api_keys_${user.id}`, JSON.stringify(existingKeys))

      // Log analytics event
      blink.analytics.log('api_key_generated', {
        keyName: name,
        timestamp: new Date().toISOString()
      })

      return apiKey
    } catch (error) {
      console.error('Failed to generate API key:', error)
      throw new Error('Failed to generate API key')
    }
  }

  async revokeApiKey(keyId: string): Promise<void> {
    try {
      const user = await blink.auth.me()
      const existingKeys = JSON.parse(localStorage.getItem(`api_keys_${user.id}`) || '[]')
      
      const updatedKeys = existingKeys.map((key: any) => 
        key.id === keyId 
          ? { ...key, isActive: false, revokedAt: new Date().toISOString() }
          : key
      )
      
      localStorage.setItem(`api_keys_${user.id}`, JSON.stringify(updatedKeys))

      // Log analytics event
      blink.analytics.log('api_key_revoked', {
        keyId,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Failed to revoke API key:', error)
      throw new Error('Failed to revoke API key')
    }
  }

  async getApiKeys(): Promise<Array<{
    id: string
    name: string
    key: string
    createdAt: string
    lastUsed: string | null
    isActive: boolean
  }>> {
    try {
      const user = await blink.auth.me()
      const keys = JSON.parse(localStorage.getItem(`api_keys_${user.id}`) || '[]')
      
      return keys.filter((key: any) => key.isActive)
    } catch (error) {
      console.error('Failed to fetch API keys:', error)
      return []
    }
  }

  async configureWebhook(url: string, events: string[]): Promise<void> {
    try {
      const user = await blink.auth.me()
      
      const webhookConfig = {
        url,
        events,
        isActive: true,
        createdAt: new Date().toISOString()
      }
      
      localStorage.setItem(`webhook_${user.id}`, JSON.stringify(webhookConfig))

      // Log analytics event
      blink.analytics.log('webhook_configured', {
        url,
        events: events.length,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Failed to configure webhook:', error)
      throw new Error('Failed to configure webhook')
    }
  }

  async testWebhook(url: string): Promise<boolean> {
    try {
      // Test webhook by sending a test payload
      const testPayload = {
        event: 'webhook.test',
        timestamp: new Date().toISOString(),
        data: {
          message: 'This is a test webhook from SEOSE Analyzer'
        }
      }

      const response = await blink.data.fetch({
        url,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'SEOSE-Analyzer-Webhook/1.0'
        },
        body: testPayload
      })

      return response.status >= 200 && response.status < 300
    } catch (error) {
      console.error('Webhook test failed:', error)
      return false
    }
  }
}

export const integrationsService = new IntegrationsService()