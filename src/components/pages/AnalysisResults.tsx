import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Globe, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Download,
  Share,
  TrendingUp,
  Zap,
  Image,
  FileText,
  Link,
  Clock,
  Shield,
  Target,
  Eye
} from 'lucide-react'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts'
import type { SEOAnalysisResult } from '@/services/seoAnalyzer'

interface AnalysisResultsProps {
  data: SEOAnalysisResult | null
}

export function AnalysisResults({ data }: AnalysisResultsProps) {
  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">No analysis data available</p>
      </div>
    )
  }

  const radarData = [
    { subject: 'On-Page', score: data.metrics.onPage, fullMark: 100 },
    { subject: 'Technical', score: data.metrics.technical, fullMark: 100 },
    { subject: 'Content', score: data.metrics.content, fullMark: 100 },
    { subject: 'Performance', score: data.metrics.performance, fullMark: 100 },
    { subject: 'Mobile', score: data.metrics.mobile, fullMark: 100 },
    { subject: 'Security', score: data.metrics.security, fullMark: 100 },
    { subject: 'Local SEO', score: data.metrics.localSEO, fullMark: 100 },
    { subject: 'Schema', score: data.metrics.schema, fullMark: 100 },
  ]

  const barData = [
    { name: 'On-Page SEO', score: data.metrics.onPage },
    { name: 'Technical SEO', score: data.metrics.technical },
    { name: 'Content Quality', score: data.metrics.content },
    { name: 'Performance', score: data.metrics.performance },
    { name: 'Mobile Optimization', score: data.metrics.mobile },
    { name: 'Security', score: data.metrics.security },
    { name: 'Local SEO', score: data.metrics.localSEO },
    { name: 'Schema Markup', score: data.metrics.schema },
    { name: 'Accessibility', score: data.metrics.accessibility },
    { name: 'Best Practices', score: data.metrics.bestPractices },
  ]

  const coreWebVitalsData = data.coreWebVitals ? [
    { name: 'LCP', value: data.coreWebVitals.lcp, threshold: 2.5, unit: 's' },
    { name: 'FID', value: data.coreWebVitals.fid, threshold: 100, unit: 'ms' },
    { name: 'CLS', value: data.coreWebVitals.cls, threshold: 0.1, unit: '' },
    { name: 'FCP', value: data.coreWebVitals.fcp, threshold: 1.8, unit: 's' },
    { name: 'TTFB', value: data.coreWebVitals.ttfb, threshold: 600, unit: 'ms' },
  ] : []

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default'
    if (score >= 60) return 'secondary'
    return 'destructive'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">SEO Analysis Results</h1>
          <p className="text-muted-foreground flex items-center gap-2 mt-1">
            <Globe className="h-4 w-4" />
            {data.url}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overall Score */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold mb-2">Overall SEO Score</h2>
              <div className="flex items-center gap-4">
                <div className={`text-4xl font-bold ${getScoreColor(data.score)}`}>
                  {data.score}
                </div>
                <div className="flex-1">
                  <Progress value={data.score} className="h-3 mb-2" />
                  <Badge variant={getScoreBadgeVariant(data.score)}>
                    {data.score >= 80 ? 'Excellent' : data.score >= 60 ? 'Good' : 'Needs Improvement'}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Analyzed on</p>
              <p className="font-medium">{new Date(data.timestamp).toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>SEO Metrics Overview</CardTitle>
            <CardDescription>Performance across different SEO categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Breakdown</CardTitle>
            <CardDescription>Individual category scores</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Comprehensive Analysis Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-9">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="technical">Technical</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="mobile">Mobile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="local">Local SEO</TabsTrigger>
          <TabsTrigger value="competitors">Competitors</TabsTrigger>
          <TabsTrigger value="issues">Issues</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Issues Found */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Issues Found
                </CardTitle>
                <CardDescription>
                  {data.issues.length} issues detected that need attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {data.issues.slice(0, 5).map((issue, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="mt-0.5">
                        {issue.type === 'error' && <AlertTriangle className="h-4 w-4 text-red-500" />}
                        {issue.type === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                        {issue.type === 'info' && <Info className="h-4 w-4 text-blue-500" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{issue.message}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {issue.type}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {issue.impact} impact
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                  {data.issues.length > 5 && (
                    <p className="text-sm text-muted-foreground text-center">
                      +{data.issues.length - 5} more issues
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Suggestions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Improvement Suggestions
                </CardTitle>
                <CardDescription>
                  Recommended actions to boost your SEO score
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {data.suggestions.slice(0, 5).map((suggestion, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{suggestion.message}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {suggestion.priority} priority
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {suggestion.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                  {data.suggestions.length > 5 && (
                    <p className="text-sm text-muted-foreground text-center">
                      +{data.suggestions.length - 5} more suggestions
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="technical" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Meta Tags Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Title</span>
                      <Badge variant={data.technicalDetails.metaTags.title ? "default" : "destructive"}>
                        {data.technicalDetails.metaTags.title ? "Present" : "Missing"}
                      </Badge>
                    </div>
                    {data.technicalDetails.metaTags.title && (
                      <p className="text-xs text-muted-foreground bg-muted p-2 rounded">
                        {data.technicalDetails.metaTags.title}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Description</span>
                      <Badge variant={data.technicalDetails.metaTags.description ? "default" : "destructive"}>
                        {data.technicalDetails.metaTags.description ? "Present" : "Missing"}
                      </Badge>
                    </div>
                    {data.technicalDetails.metaTags.description && (
                      <p className="text-xs text-muted-foreground bg-muted p-2 rounded">
                        {data.technicalDetails.metaTags.description}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Open Graph</span>
                      <Badge variant={data.technicalDetails.metaTags.ogTitle ? "default" : "secondary"}>
                        {data.technicalDetails.metaTags.ogTitle ? "Configured" : "Partial"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link className="h-5 w-5 text-primary" />
                  Link Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Internal Links</span>
                    <span className="text-sm font-medium">{data.technicalDetails.links.internal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">External Links</span>
                    <span className="text-sm font-medium">{data.technicalDetails.links.external}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Broken Links</span>
                    <span className={`text-sm font-medium ${data.technicalDetails.links.broken > 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {data.technicalDetails.links.broken}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Schema Markup
                </CardTitle>
                <CardDescription>
                  Structured data implementation for better search results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Structured Data</span>
                    <Badge variant={data.technicalDetails.schema.hasStructuredData ? "default" : "destructive"}>
                      {data.technicalDetails.schema.hasStructuredData ? "Present" : "Missing"}
                    </Badge>
                  </div>
                  
                  {data.technicalDetails.schema.hasStructuredData && (
                    <div className="space-y-2">
                      <span className="text-sm font-medium">Schema Types:</span>
                      <div className="flex flex-wrap gap-1">
                        {data.technicalDetails.schema.types.map((type, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {data.technicalDetails.schema.errors.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-sm font-medium text-red-600">Errors:</span>
                      {data.technicalDetails.schema.errors.map((error, index) => (
                        <div key={index} className="text-xs text-red-600 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {error}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium">Schema Score:</span>
                      <Badge variant={getScoreBadgeVariant(data.metrics.schema)}>
                        {data.metrics.schema}/100
                      </Badge>
                    </div>
                    <Progress value={data.metrics.schema} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary" />
                  Accessibility
                </CardTitle>
                <CardDescription>
                  Website accessibility for users with disabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`text-3xl font-bold ${getScoreColor(data.technicalDetails.accessibility.score)}`}>
                    {data.technicalDetails.accessibility.score}
                  </div>
                  <div className="flex-1">
                    <Progress value={data.technicalDetails.accessibility.score} className="h-2 mb-2" />
                    <Badge variant={getScoreBadgeVariant(data.technicalDetails.accessibility.score)}>
                      {data.technicalDetails.accessibility.score >= 90 ? 'Excellent' : 
                       data.technicalDetails.accessibility.score >= 80 ? 'Good' : 'Needs Work'}
                    </Badge>
                  </div>
                </div>
                
                {data.technicalDetails.accessibility.issues.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Common Issues:</h4>
                    {data.technicalDetails.accessibility.issues.map((issue, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs">
                        <AlertTriangle className="h-3 w-3 text-yellow-500" />
                        {issue}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Heading Structure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.technicalDetails.headings.map((heading, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">H{heading.level}</Badge>
                        <span className="text-sm font-medium truncate max-w-48">
                          {heading.text}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {heading.count} found
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5 text-primary" />
                  Image Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Total Images</span>
                    <span className="text-sm font-medium">{data.technicalDetails.images.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">With Alt Text</span>
                    <span className="text-sm font-medium text-green-500">{data.technicalDetails.images.withAlt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Missing Alt Text</span>
                    <span className={`text-sm font-medium ${data.technicalDetails.images.withoutAlt > 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {data.technicalDetails.images.withoutAlt}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Oversized Images</span>
                    <span className={`text-sm font-medium ${data.technicalDetails.images.oversized > 0 ? 'text-yellow-500' : 'text-green-500'}`}>
                      {data.technicalDetails.images.oversized}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {data.coreWebVitals && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Core Web Vitals
                </CardTitle>
                <CardDescription>
                  Key performance metrics that affect user experience and SEO
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {coreWebVitalsData.map((vital, index) => (
                    <div key={index} className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold mb-1">
                        {vital.value.toFixed(vital.name === 'CLS' ? 3 : vital.name === 'LCP' || vital.name === 'FCP' ? 1 : 0)}
                        <span className="text-sm text-muted-foreground ml-1">{vital.unit}</span>
                      </div>
                      <div className="text-sm font-medium mb-2">{vital.name}</div>
                      <Badge variant={vital.value <= vital.threshold ? "default" : "destructive"} className="text-xs">
                        {vital.value <= vital.threshold ? "Good" : "Needs Work"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {data.technicalDetails.performance.loadTime.toFixed(1)}s
                  </div>
                  <div className="text-sm text-muted-foreground">Load Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {data.technicalDetails.performance.pageSize}KB
                  </div>
                  <div className="text-sm text-muted-foreground">Page Size</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {data.technicalDetails.performance.requests}
                  </div>
                  <div className="text-sm text-muted-foreground">HTTP Requests</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mobile" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Mobile Optimization Score
                </CardTitle>
                <CardDescription>
                  How well your website performs on mobile devices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-6">
                  <div className={`text-4xl font-bold ${getScoreColor(data.metrics.mobile)}`}>
                    {data.metrics.mobile}
                  </div>
                  <div className="flex-1">
                    <Progress value={data.metrics.mobile} className="h-3 mb-2" />
                    <Badge variant={getScoreBadgeVariant(data.metrics.mobile)}>
                      {data.metrics.mobile >= 80 ? 'Excellent' : 
                       data.metrics.mobile >= 60 ? 'Good' : 'Needs Improvement'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Mobile Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Viewport Meta Tag</span>
                    <Badge variant={data.technicalDetails.mobile.hasViewportMeta ? "default" : "destructive"}>
                      {data.technicalDetails.mobile.hasViewportMeta ? "Present" : "Missing"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Responsive Design</span>
                    <Badge variant={data.technicalDetails.mobile.isResponsive ? "default" : "destructive"}>
                      {data.technicalDetails.mobile.isResponsive ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Touch Friendly</span>
                    <Badge variant={data.technicalDetails.mobile.touchFriendly ? "default" : "secondary"}>
                      {data.technicalDetails.mobile.touchFriendly ? "Yes" : "Needs Work"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Mobile Speed Score</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{data.technicalDetails.mobile.mobileSpeed}</span>
                      <Progress value={data.technicalDetails.mobile.mobileSpeed} className="w-16 h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Security Score
                </CardTitle>
                <CardDescription>
                  Website security and HTTPS implementation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-6">
                  <div className={`text-4xl font-bold ${getScoreColor(data.metrics.security)}`}>
                    {data.metrics.security}
                  </div>
                  <div className="flex-1">
                    <Progress value={data.metrics.security} className="h-3 mb-2" />
                    <Badge variant={getScoreBadgeVariant(data.metrics.security)}>
                      {data.metrics.security >= 80 ? 'Secure' : 
                       data.metrics.security >= 60 ? 'Moderate' : 'Vulnerable'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Security Checks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">HTTPS Enabled</span>
                    <Badge variant={data.technicalDetails.security.hasHTTPS ? "default" : "destructive"}>
                      {data.technicalDetails.security.hasHTTPS ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Security Headers</span>
                    <Badge variant={data.technicalDetails.security.hasSecurityHeaders ? "default" : "secondary"}>
                      {data.technicalDetails.security.hasSecurityHeaders ? "Present" : "Missing"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Mixed Content</span>
                    <Badge variant={data.technicalDetails.security.mixedContent ? "destructive" : "default"}>
                      {data.technicalDetails.security.mixedContent ? "Detected" : "None"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">SSL Certificate</span>
                    <Badge variant={data.technicalDetails.security.certificateValid ? "default" : "destructive"}>
                      {data.technicalDetails.security.certificateValid ? "Valid" : "Invalid"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="local" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Local SEO Score
                </CardTitle>
                <CardDescription>
                  Local search optimization and business visibility
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-6">
                  <div className={`text-4xl font-bold ${getScoreColor(data.metrics.localSEO)}`}>
                    {data.metrics.localSEO}
                  </div>
                  <div className="flex-1">
                    <Progress value={data.metrics.localSEO} className="h-3 mb-2" />
                    <Badge variant={getScoreBadgeVariant(data.metrics.localSEO)}>
                      {data.metrics.localSEO >= 80 ? 'Excellent' : 
                       data.metrics.localSEO >= 60 ? 'Good' : 'Needs Work'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Local SEO Factors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">NAP Information</span>
                    <Badge variant={data.technicalDetails.localSEO.hasNAP ? "default" : "secondary"}>
                      {data.technicalDetails.localSEO.hasNAP ? "Present" : "Missing"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Google My Business</span>
                    <Badge variant={data.technicalDetails.localSEO.hasGoogleMyBusiness ? "default" : "secondary"}>
                      {data.technicalDetails.localSEO.hasGoogleMyBusiness ? "Claimed" : "Not Claimed"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Local Schema</span>
                    <Badge variant={data.technicalDetails.localSEO.hasLocalSchema ? "default" : "secondary"}>
                      {data.technicalDetails.localSEO.hasLocalSchema ? "Present" : "Missing"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Local Keywords</span>
                    <span className="text-sm font-medium">{data.technicalDetails.localSEO.localKeywords} found</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="competitors" className="space-y-6">
          {data.competitors && data.competitors.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Competitor Analysis
                </CardTitle>
                <CardDescription>
                  How your website compares to top competitors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {data.competitors.map((competitor, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-medium">{competitor.title}</h4>
                          <p className="text-sm text-muted-foreground">{competitor.url}</p>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${getScoreColor(competitor.score)}`}>
                            {competitor.score}
                          </div>
                          <Badge variant={getScoreBadgeVariant(competitor.score)} className="text-xs">
                            {competitor.score >= 80 ? 'Strong' : competitor.score >= 60 ? 'Average' : 'Weak'}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-lg font-semibold">{competitor.metrics.onPage}</div>
                          <div className="text-xs text-muted-foreground">On-Page</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold">{competitor.metrics.technical}</div>
                          <div className="text-xs text-muted-foreground">Technical</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold">{competitor.metrics.content}</div>
                          <div className="text-xs text-muted-foreground">Content</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold">{competitor.metrics.performance}</div>
                          <div className="text-xs text-muted-foreground">Performance</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-medium text-sm mb-2 text-green-600">Key Strengths</h5>
                          <ul className="space-y-1">
                            {competitor.keyStrengths.map((strength, idx) => (
                              <li key={idx} className="text-xs flex items-center gap-1">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                {strength}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium text-sm mb-2 text-orange-600">Opportunities</h5>
                          <ul className="space-y-1">
                            {competitor.opportunities.map((opportunity, idx) => (
                              <li key={idx} className="text-xs flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3 text-orange-500" />
                                {opportunity}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="issues" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                All Issues & Suggestions
              </CardTitle>
              <CardDescription>
                Complete list of detected issues and improvement recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    Issues ({data.issues.length})
                  </h3>
                  <div className="space-y-3">
                    {data.issues.map((issue, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 border rounded-lg">
                        <div className="mt-0.5">
                          {issue.type === 'error' && <AlertTriangle className="h-4 w-4 text-red-500" />}
                          {issue.type === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                          {issue.type === 'info' && <Info className="h-4 w-4 text-blue-500" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{issue.message}</p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {issue.category}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {issue.impact} impact
                            </Badge>
                            {issue.element && (
                              <Badge variant="outline" className="text-xs font-mono">
                                {issue.element}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Suggestions ({data.suggestions.length})
                  </h3>
                  <div className="space-y-3">
                    {data.suggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 border rounded-lg">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{suggestion.message}</p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {suggestion.category}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {suggestion.priority} priority
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{suggestion.impact}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}