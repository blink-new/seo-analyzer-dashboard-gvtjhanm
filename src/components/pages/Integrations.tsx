import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { 
  Search,
  BarChart3,
  Globe as WordpressIcon,
  Code,
  Link,
  CheckCircle,
  AlertCircle,
  Copy,
  Download,
  Settings,
  Key,
  Globe,
  Zap,
  ExternalLink,
  RefreshCw
} from 'lucide-react'

interface Integration {
  id: string
  name: string
  description: string
  icon: any
  status: 'connected' | 'disconnected' | 'error'
  category: 'analytics' | 'cms' | 'api'
}

export function Integrations() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'google-search-console',
      name: 'Google Search Console',
      description: 'Import search performance data and indexing status',
      icon: Search,
      status: 'disconnected',
      category: 'analytics'
    },
    {
      id: 'google-analytics',
      name: 'Google Analytics',
      description: 'Track user behavior and conversion metrics',
      icon: BarChart3,
      status: 'connected',
      category: 'analytics'
    },
    {
      id: 'wordpress',
      name: 'WordPress Plugin',
      description: 'Direct integration with WordPress sites',
      icon: WordpressIcon,
      status: 'disconnected',
      category: 'cms'
    }
  ])

  const [apiKeys, setApiKeys] = useState({
    searchConsole: '',
    analytics: 'ga_1234567890_abcdef',
    wordpress: ''
  })

  const [generatedApiKeys, setGeneratedApiKeys] = useState<Array<{
    id: string
    name: string
    key: string
    createdAt: string
    lastUsed: string | null
    isActive: boolean
  }>>([])

  const [apiEndpoint] = useState('https://api.seoanalyzer.com/v1')
  const [webhookUrl, setWebhookUrl] = useState('')
  const [newKeyName, setNewKeyName] = useState('')
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false)
  const { toast } = useToast()

  const handleConnect = (integrationId: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === integrationId 
        ? { ...integration, status: 'connected' }
        : integration
    ))
    
    toast({
      title: "Integration Connected",
      description: `Successfully connected to ${integrations.find(i => i.id === integrationId)?.name}`,
    })
  }

  const handleDisconnect = (integrationId: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === integrationId 
        ? { ...integration, status: 'disconnected' }
        : integration
    ))
    
    toast({
      title: "Integration Disconnected",
      description: `Disconnected from ${integrations.find(i => i.id === integrationId)?.name}`,
    })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "Text has been copied to your clipboard",
    })
  }

  // Load API keys from localStorage on component mount
  useEffect(() => {
    const loadApiKeys = () => {
      try {
        const stored = localStorage.getItem('seo_analyzer_api_keys')
        if (stored) {
          const keys = JSON.parse(stored)
          setGeneratedApiKeys(keys.filter((key: any) => key.isActive))
        } else {
          // Create default keys if none exist
          const defaultKeys = [
            {
              id: 'key_' + Date.now(),
              name: 'WordPress Plugin Key',
              key: 'seo_wp_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
              createdAt: new Date().toISOString(),
              lastUsed: null,
              isActive: true
            }
          ]
          setGeneratedApiKeys(defaultKeys)
          localStorage.setItem('seo_analyzer_api_keys', JSON.stringify(defaultKeys))
        }
      } catch (error) {
        console.error('Failed to load API keys:', error)
      }
    }
    
    loadApiKeys()
  }, [])

  const generateApiKey = (name: string = 'New API Key') => {
    const newKey = {
      id: 'key_' + Date.now(),
      name,
      key: 'seo_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      createdAt: new Date().toISOString(),
      lastUsed: null,
      isActive: true
    }
    
    const updatedKeys = [...generatedApiKeys, newKey]
    setGeneratedApiKeys(updatedKeys)
    
    // Save to localStorage
    const allKeys = JSON.parse(localStorage.getItem('seo_analyzer_api_keys') || '[]')
    allKeys.push(newKey)
    localStorage.setItem('seo_analyzer_api_keys', JSON.stringify(allKeys))
    
    toast({
      title: "API Key Generated",
      description: `New API key "${name}" has been generated successfully`,
    })
    
    return newKey.key
  }

  const handleGenerateNewKey = () => {
    if (!newKeyName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for the API key",
        variant: "destructive"
      })
      return
    }
    
    generateApiKey(newKeyName.trim())
    setNewKeyName('')
    setIsGenerateDialogOpen(false)
  }

  const revokeApiKey = (keyId: string) => {
    const updatedKeys = generatedApiKeys.filter(key => key.id !== keyId)
    setGeneratedApiKeys(updatedKeys)
    
    // Update localStorage
    const allKeys = JSON.parse(localStorage.getItem('seo_analyzer_api_keys') || '[]')
    const updatedAllKeys = allKeys.map((key: any) => 
      key.id === keyId ? { ...key, isActive: false, revokedAt: new Date().toISOString() } : key
    )
    localStorage.setItem('seo_analyzer_api_keys', JSON.stringify(updatedAllKeys))
    
    toast({
      title: "API Key Revoked",
      description: "API key has been revoked successfully",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle className="h-3 w-3 mr-1" />Connected</Badge>
      case 'error':
        return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Error</Badge>
      default:
        return <Badge variant="outline">Disconnected</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Integrations</h1>
        <p className="text-muted-foreground">Connect your SEO tools and platforms for enhanced analysis</p>
      </div>

      <Tabs defaultValue="services" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="wordpress">WordPress</TabsTrigger>
          <TabsTrigger value="api">API Access</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        </TabsList>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-6">
          {/* Google Services */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Google Services
              </CardTitle>
              <CardDescription>
                Connect your Google accounts for comprehensive SEO data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Google Search Console */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                    <Search className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Google Search Console</h3>
                    <p className="text-sm text-muted-foreground">Import search performance and indexing data</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(integrations.find(i => i.id === 'google-search-console')?.status || 'disconnected')}
                  {integrations.find(i => i.id === 'google-search-console')?.status === 'connected' ? (
                    <Button variant="outline" size="sm" onClick={() => handleDisconnect('google-search-console')}>
                      Disconnect
                    </Button>
                  ) : (
                    <Button size="sm" onClick={() => handleConnect('google-search-console')}>
                      Connect
                    </Button>
                  )}
                </div>
              </div>

              {/* Google Analytics */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
                    <BarChart3 className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Google Analytics</h3>
                    <p className="text-sm text-muted-foreground">Track user behavior and conversion metrics</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(integrations.find(i => i.id === 'google-analytics')?.status || 'disconnected')}
                  {integrations.find(i => i.id === 'google-analytics')?.status === 'connected' ? (
                    <Button variant="outline" size="sm" onClick={() => handleDisconnect('google-analytics')}>
                      Disconnect
                    </Button>
                  ) : (
                    <Button size="sm" onClick={() => handleConnect('google-analytics')}>
                      Connect
                    </Button>
                  )}
                </div>
              </div>

              {integrations.find(i => i.id === 'google-search-console')?.status === 'connected' && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Google Search Console is connected. You can now import search performance data and monitor indexing status directly in your SEO reports.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Other Analytics Tools */}
          <Card>
            <CardHeader>
              <CardTitle>Other Analytics Tools</CardTitle>
              <CardDescription>
                Connect additional analytics and SEO tools
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'SEMrush', icon: '🔍', status: 'Coming Soon' },
                  { name: 'Ahrefs', icon: '📊', status: 'Coming Soon' },
                  { name: 'Moz', icon: '🎯', status: 'Coming Soon' },
                  { name: 'Screaming Frog', icon: '🐸', status: 'Coming Soon' }
                ].map((tool, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg opacity-60">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{tool.icon}</span>
                      <span className="font-medium">{tool.name}</span>
                    </div>
                    <Badge variant="outline">{tool.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* WordPress Tab */}
        <TabsContent value="wordpress" className="space-y-6">
          {/* API Key Instructions */}
          <Alert>
            <Key className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> You need an API key from the "API Access" tab to connect your WordPress plugin. 
              The API key allows secure communication between your WordPress site and the SEOSE Analyzer.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <WordpressIcon className="h-5 w-5 text-primary" />
                WordPress Plugin
              </CardTitle>
              <CardDescription>
                Install our WordPress plugin for seamless SEO monitoring
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Plugin Download */}
              <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
                    <WordpressIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">SEOSE Analyzer WordPress Plugin</h3>
                    <p className="text-muted-foreground mb-4">
                      Monitor your WordPress site's SEO performance directly from your dashboard. 
                      Get real-time alerts, automated audits, and detailed reports.
                    </p>
                    <div className="flex gap-3">
                      <Button>
                        <Download className="h-4 w-4 mr-2" />
                        Download Plugin
                      </Button>
                      <Button variant="outline">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Documentation
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Installation Instructions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Installation Instructions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">1</div>
                      <p>Download the plugin file from the button above</p>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">2</div>
                      <p>Go to your WordPress admin panel → Plugins → Add New → Upload Plugin</p>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">3</div>
                      <p>Upload the downloaded file and activate the plugin</p>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">4</div>
                      <p>Enter your API key in the plugin settings to connect</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Plugin Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Plugin Configuration</CardTitle>
                  <CardDescription>
                    Configure the plugin settings for your WordPress site
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="wp-api-key">API Key</Label>
                    {generatedApiKeys.length > 0 ? (
                      <div className="space-y-3">
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Key className="h-4 w-4 text-blue-600" />
                            <span className="font-medium text-blue-900">WordPress Plugin API Key</span>
                          </div>
                          <div className="flex gap-2">
                            <Input 
                              value={generatedApiKeys.find(key => key.name.includes('WordPress'))?.key || generatedApiKeys[0].key}
                              readOnly
                              className="font-mono text-sm bg-white"
                            />
                            <Button 
                              variant="outline" 
                              onClick={() => copyToClipboard(generatedApiKeys.find(key => key.name.includes('WordPress'))?.key || generatedApiKeys[0].key)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-blue-700 mt-2">
                            Copy this API key and paste it into your WordPress plugin settings.
                          </p>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => generateApiKey('WordPress Plugin Key')}
                          >
                            <Key className="h-4 w-4 mr-2" />
                            Generate New WordPress Key
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 border border-dashed rounded-lg text-center">
                        <Key className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-3">
                          No API key available. Generate one first.
                        </p>
                        <Button onClick={() => generateApiKey('WordPress Plugin Key')}>
                          <Key className="h-4 w-4 mr-2" />
                          Generate WordPress API Key
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="webhook-url-wp">Webhook URL (Optional)</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="webhook-url-wp"
                        value={webhookUrl || 'https://your-wordpress-site.com/wp-json/seose/v1/webhook'}
                        onChange={(e) => setWebhookUrl(e.target.value)}
                        placeholder="https://your-wordpress-site.com/wp-json/seose/v1/webhook"
                        className="font-mono text-sm"
                      />
                      <Button variant="outline" onClick={() => copyToClipboard(webhookUrl || 'https://your-wordpress-site.com/wp-json/seose/v1/webhook')}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Enter the webhook URL that should receive notifications when analysis is complete. This is automatically configured by the plugin.
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Automatic Scanning</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically scan your site daily for SEO issues
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified when critical SEO issues are found
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Performance Monitoring</Label>
                        <p className="text-sm text-muted-foreground">
                          Monitor Core Web Vitals and page speed
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </div>

                  <Button className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Save Configuration
                  </Button>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Access Tab */}
        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5 text-primary" />
                API Access
              </CardTitle>
              <CardDescription>
                Integrate SEOSE Analyzer with your applications using our REST API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* API Endpoint */}
              <div className="space-y-2">
                <Label>API Endpoint</Label>
                <div className="flex gap-2">
                  <Input value={apiEndpoint} readOnly className="font-mono" />
                  <Button variant="outline" onClick={() => copyToClipboard(apiEndpoint)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* API Keys Management */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>API Keys</Label>
                  <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Key className="h-4 w-4 mr-2" />
                        Generate New Key
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Generate New API Key</DialogTitle>
                        <DialogDescription>
                          Create a new API key for accessing the SEOSE Analyzer API. Give it a descriptive name to help you identify its purpose.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="key-name">API Key Name</Label>
                          <Input
                            id="key-name"
                            placeholder="e.g., WordPress Plugin, Production App, Development"
                            value={newKeyName}
                            onChange={(e) => setNewKeyName(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleGenerateNewKey()}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsGenerateDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleGenerateNewKey}>
                          <Key className="h-4 w-4 mr-2" />
                          Generate Key
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                {generatedApiKeys.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Key className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No API keys generated yet</p>
                    <p className="text-sm">Generate your first API key to start using the API</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {generatedApiKeys.map((apiKey) => (
                      <div key={apiKey.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">{apiKey.name}</p>
                          <p className="text-sm text-muted-foreground font-mono truncate">{apiKey.key}</p>
                          <p className="text-xs text-muted-foreground">
                            Created: {new Date(apiKey.createdAt).toLocaleDateString()} • 
                            Last used: {apiKey.lastUsed ? new Date(apiKey.lastUsed).toLocaleDateString() : 'Never'}
                          </p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button variant="outline" size="sm" onClick={() => copyToClipboard(apiKey.key)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => revokeApiKey(apiKey.id)}>
                            Revoke
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* API Documentation */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Start</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Example Request</Label>
                    <div className="p-4 bg-gray-50 rounded-lg font-mono text-sm overflow-x-auto">
                      <pre>{`curl -X POST "${apiEndpoint}/analyze" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com",
    "options": {
      "includeCompetitors": true,
      "includeCoreWebVitals": true
    }
  }'`}</pre>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Response Format</Label>
                    <div className="p-4 bg-gray-50 rounded-lg font-mono text-sm overflow-x-auto">
                      <pre>{`{
  "success": true,
  "data": {
    "url": "https://example.com",
    "score": 85,
    "metrics": {
      "onPage": 90,
      "technical": 80,
      "performance": 85
    },
    "issues": [...],
    "suggestions": [...]
  }
}`}</pre>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Full API Documentation
                  </Button>
                </CardContent>
              </Card>

              {/* Rate Limits */}
              <Alert>
                <Zap className="h-4 w-4" />
                <AlertDescription>
                  <strong>Rate Limits:</strong> 1000 requests per hour for production keys, 100 requests per hour for development keys.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Webhooks Tab */}
        <TabsContent value="webhooks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="h-5 w-5 text-primary" />
                Webhooks
              </CardTitle>
              <CardDescription>
                Receive real-time notifications when analysis is complete
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Webhook Configuration */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="webhook-url">Webhook URL</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="webhook-url"
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      placeholder="https://your-app.com/webhooks/seo-analyzer"
                    />
                    <Button>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Test
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Events to Subscribe</Label>
                  <div className="space-y-3">
                    {[
                      { event: 'analysis.completed', description: 'When SEO analysis is finished' },
                      { event: 'analysis.failed', description: 'When SEO analysis fails' },
                      { event: 'competitor.updated', description: 'When competitor data is refreshed' },
                      { event: 'alert.critical', description: 'When critical SEO issues are detected' }
                    ].map((webhook, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium font-mono text-sm">{webhook.event}</p>
                          <p className="text-sm text-muted-foreground">{webhook.description}</p>
                        </div>
                        <Switch defaultChecked={index < 2} />
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="w-full">
                  Save Webhook Configuration
                </Button>
              </div>

              {/* Webhook Logs */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Webhook Deliveries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { event: 'analysis.completed', status: 'success', timestamp: '2 minutes ago', response: '200 OK' },
                      { event: 'analysis.completed', status: 'success', timestamp: '1 hour ago', response: '200 OK' },
                      { event: 'analysis.failed', status: 'failed', timestamp: '3 hours ago', response: '404 Not Found' },
                      { event: 'competitor.updated', status: 'success', timestamp: '1 day ago', response: '200 OK' }
                    ].map((log, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`h-2 w-2 rounded-full ${log.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
                          <div>
                            <p className="font-medium font-mono text-sm">{log.event}</p>
                            <p className="text-xs text-muted-foreground">{log.timestamp}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{log.response}</p>
                          <p className={`text-xs ${log.status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                            {log.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Webhook Payload Example */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Webhook Payload Example</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-gray-50 rounded-lg font-mono text-sm overflow-x-auto">
                    <pre>{`{
  "event": "analysis.completed",
  "timestamp": "2024-01-16T10:30:00Z",
  "data": {
    "analysisId": "analysis_abc123",
    "url": "https://example.com",
    "score": 85,
    "status": "completed",
    "metrics": {
      "onPage": 90,
      "technical": 80,
      "performance": 85
    },
    "reportUrl": "https://app.seoanalyzer.com/reports/abc123"
  }
}`}</pre>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}