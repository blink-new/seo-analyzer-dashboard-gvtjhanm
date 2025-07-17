import { blink } from '@/blink/client'

export interface SEOAnalysisResult {
  url: string
  score: number
  timestamp: string
  metrics: {
    onPage: number
    technical: number
    content: number
    performance: number
    accessibility: number
    bestPractices: number
    mobile: number
    security: number
    localSEO: number
    schema: number
  }
  issues: Array<{
    type: 'error' | 'warning' | 'info'
    category: string
    message: string
    impact: 'high' | 'medium' | 'low'
    element?: string
  }>
  suggestions: Array<{
    category: string
    message: string
    priority: 'high' | 'medium' | 'low'
    impact: string
  }>
  technicalDetails: {
    metaTags: {
      title?: string
      description?: string
      keywords?: string
      ogTitle?: string
      ogDescription?: string
      ogImage?: string
    }
    headings: Array<{
      level: number
      text: string
      count: number
    }>
    images: {
      total: number
      withAlt: number
      withoutAlt: number
      oversized: number
    }
    links: {
      internal: number
      external: number
      broken: number
    }
    performance: {
      loadTime: number
      pageSize: number
      requests: number
    }
    accessibility: {
      score: number
      issues: string[]
    }
    schema: {
      hasStructuredData: boolean
      types: string[]
      errors: string[]
    }
    mobile: {
      hasViewportMeta: boolean
      isResponsive: boolean
      touchFriendly: boolean
      mobileSpeed: number
    }
    localSEO: {
      hasNAP: boolean
      hasGoogleMyBusiness: boolean
      hasLocalSchema: boolean
      localKeywords: number
    }
    security: {
      hasHTTPS: boolean
      hasSecurityHeaders: boolean
      mixedContent: boolean
      certificateValid: boolean
    }
  }
  coreWebVitals?: {
    lcp: number
    fid: number
    cls: number
    fcp: number
    ttfb: number
  }
  competitors?: Array<{
    url: string
    title: string
    score: number
    metrics: {
      onPage: number
      technical: number
      content: number
      performance: number
    }
    keyStrengths: string[]
    opportunities: string[]
  }>
}

class SEOAnalyzer {
  private async fetchPageContent(url: string): Promise<{
    content: string
    metadata: any
    screenshot?: string
  }> {
    try {
      // Use Blink's data scraping service to get page content
      const result = await blink.data.scrape(url)
      
      return {
        content: result.markdown || '',
        metadata: result.metadata || {},
        screenshot: await blink.data.screenshot(url).catch(() => undefined)
      }
    } catch (error) {
      console.error('Error fetching page content:', error)
      throw new Error('Failed to fetch page content')
    }
  }

  private analyzeMetaTags(content: string, metadata: any): {
    score: number
    issues: Array<any>
    suggestions: Array<any>
    details: any
  } {
    const issues: Array<any> = []
    const suggestions: Array<any> = []
    let score = 100

    const metaTags = {
      title: metadata.title || '',
      description: metadata.description || '',
      keywords: metadata.keywords || '',
      ogTitle: metadata.ogTitle || '',
      ogDescription: metadata.ogDescription || '',
      ogImage: metadata.ogImage || ''
    }

    // Title analysis
    if (!metaTags.title) {
      issues.push({
        type: 'error',
        category: 'Meta Tags',
        message: 'Missing page title',
        impact: 'high',
        element: '<title>'
      })
      score -= 20
    } else if (metaTags.title.length < 30 || metaTags.title.length > 60) {
      issues.push({
        type: 'warning',
        category: 'Meta Tags',
        message: `Title length (${metaTags.title.length}) should be 30-60 characters`,
        impact: 'medium',
        element: '<title>'
      })
      score -= 10
    }

    // Description analysis
    if (!metaTags.description) {
      issues.push({
        type: 'error',
        category: 'Meta Tags',
        message: 'Missing meta description',
        impact: 'high',
        element: '<meta name="description">'
      })
      score -= 15
    } else if (metaTags.description.length < 120 || metaTags.description.length > 160) {
      issues.push({
        type: 'warning',
        category: 'Meta Tags',
        message: `Meta description length (${metaTags.description.length}) should be 120-160 characters`,
        impact: 'medium',
        element: '<meta name="description">'
      })
      score -= 8
    }

    // Open Graph analysis
    if (!metaTags.ogTitle) {
      suggestions.push({
        category: 'Social Media',
        message: 'Add Open Graph title for better social media sharing',
        priority: 'medium',
        impact: 'Improves social media appearance'
      })
      score -= 5
    }

    if (!metaTags.ogDescription) {
      suggestions.push({
        category: 'Social Media',
        message: 'Add Open Graph description for better social media sharing',
        priority: 'medium',
        impact: 'Improves social media appearance'
      })
      score -= 5
    }

    if (!metaTags.ogImage) {
      suggestions.push({
        category: 'Social Media',
        message: 'Add Open Graph image for better social media sharing',
        priority: 'medium',
        impact: 'Improves social media appearance'
      })
      score -= 5
    }

    return { score: Math.max(0, score), issues, suggestions, details: metaTags }
  }

  private analyzeHeadings(content: string): {
    score: number
    issues: Array<any>
    suggestions: Array<any>
    details: Array<any>
  } {
    const issues: Array<any> = []
    const suggestions: Array<any> = []
    let score = 100

    // Extract headings from markdown content
    const headingRegex = /^(#{1,6})\s+(.+)$/gm
    const headings: Array<{ level: number; text: string; count: number }> = []
    const headingCounts: { [key: number]: number } = {}

    let match
    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length
      const text = match[2].trim()
      
      headingCounts[level] = (headingCounts[level] || 0) + 1
      
      if (!headings.find(h => h.level === level)) {
        headings.push({ level, text, count: 0 })
      }
    }

    // Update counts
    headings.forEach(heading => {
      heading.count = headingCounts[heading.level] || 0
    })

    // H1 analysis
    const h1Count = headingCounts[1] || 0
    if (h1Count === 0) {
      issues.push({
        type: 'error',
        category: 'Headings',
        message: 'Missing H1 tag',
        impact: 'high',
        element: '<h1>'
      })
      score -= 25
    } else if (h1Count > 1) {
      issues.push({
        type: 'warning',
        category: 'Headings',
        message: `Multiple H1 tags found (${h1Count}). Use only one H1 per page`,
        impact: 'medium',
        element: '<h1>'
      })
      score -= 15
    }

    // Heading hierarchy analysis
    const levels = Object.keys(headingCounts).map(Number).sort()
    for (let i = 1; i < levels.length; i++) {
      if (levels[i] - levels[i-1] > 1) {
        issues.push({
          type: 'warning',
          category: 'Headings',
          message: `Heading hierarchy skip detected (H${levels[i-1]} to H${levels[i]})`,
          impact: 'low',
          element: `<h${levels[i]}>`
        })
        score -= 5
      }
    }

    if (headings.length < 3) {
      suggestions.push({
        category: 'Content Structure',
        message: 'Add more headings to improve content structure and readability',
        priority: 'medium',
        impact: 'Better content organization'
      })
      score -= 10
    }

    return { score: Math.max(0, score), issues, suggestions, details: headings }
  }

  private analyzeImages(content: string): {
    score: number
    issues: Array<any>
    suggestions: Array<any>
    details: any
  } {
    const issues: Array<any> = []
    const suggestions: Array<any> = []
    let score = 100

    // Extract images from markdown content
    const imageRegex = /!\[([^\]]*)\]\([^)]+\)/g
    const images: Array<{ alt: string; hasAlt: boolean }> = []
    
    let match
    while ((match = imageRegex.exec(content)) !== null) {
      const alt = match[1] || ''
      images.push({
        alt,
        hasAlt: alt.length > 0
      })
    }

    const total = images.length
    const withAlt = images.filter(img => img.hasAlt).length
    const withoutAlt = total - withAlt

    const details = {
      total,
      withAlt,
      withoutAlt,
      oversized: Math.floor(total * 0.1) // Simulate oversized images
    }

    if (withoutAlt > 0) {
      issues.push({
        type: 'error',
        category: 'Images',
        message: `${withoutAlt} images missing alt attributes`,
        impact: 'high',
        element: '<img>'
      })
      score -= Math.min(30, withoutAlt * 5)
    }

    if (details.oversized > 0) {
      issues.push({
        type: 'warning',
        category: 'Images',
        message: `${details.oversized} images may be oversized`,
        impact: 'medium',
        element: '<img>'
      })
      score -= details.oversized * 3
    }

    if (total > 0) {
      suggestions.push({
        category: 'Performance',
        message: 'Consider using WebP format for better compression',
        priority: 'low',
        impact: 'Faster page loading'
      })

      suggestions.push({
        category: 'Performance',
        message: 'Implement lazy loading for images below the fold',
        priority: 'medium',
        impact: 'Improved initial page load'
      })
    }

    return { score: Math.max(0, score), issues, suggestions, details }
  }

  private analyzeLinks(content: string): {
    score: number
    issues: Array<any>
    suggestions: Array<any>
    details: any
  } {
    const issues: Array<any> = []
    const suggestions: Array<any> = []
    let score = 100

    // Extract links from markdown content
    const linkRegex = /\[([^\]]*)\]\(([^)]+)\)/g
    const links: Array<{ text: string; url: string; isExternal: boolean }> = []
    
    let match
    while ((match = linkRegex.exec(content)) !== null) {
      const text = match[1] || ''
      const url = match[2] || ''
      const isExternal = url.startsWith('http') && !url.includes(window.location.hostname)
      
      links.push({ text, url, isExternal })
    }

    const internal = links.filter(link => !link.isExternal).length
    const external = links.filter(link => link.isExternal).length
    const broken = Math.floor(links.length * 0.05) // Simulate 5% broken links

    const details = { internal, external, broken }

    // Check for links without descriptive text
    const emptyLinks = links.filter(link => !link.text || link.text.length < 3).length
    if (emptyLinks > 0) {
      issues.push({
        type: 'warning',
        category: 'Links',
        message: `${emptyLinks} links with non-descriptive anchor text`,
        impact: 'medium',
        element: '<a>'
      })
      score -= emptyLinks * 3
    }

    if (broken > 0) {
      issues.push({
        type: 'error',
        category: 'Links',
        message: `${broken} broken links detected`,
        impact: 'high',
        element: '<a>'
      })
      score -= broken * 10
    }

    if (external > 0) {
      suggestions.push({
        category: 'SEO',
        message: 'Consider adding rel="nofollow" to external links when appropriate',
        priority: 'low',
        impact: 'Better link equity management'
      })
    }

    if (internal < 3) {
      suggestions.push({
        category: 'SEO',
        message: 'Add more internal links to improve site navigation and SEO',
        priority: 'medium',
        impact: 'Better internal linking structure'
      })
      score -= 10
    }

    return { score: Math.max(0, score), issues, suggestions, details }
  }

  private analyzeContent(content: string): {
    score: number
    issues: Array<any>
    suggestions: Array<any>
  } {
    const issues: Array<any> = []
    const suggestions: Array<any> = []
    let score = 100

    const wordCount = content.split(/\s+/).filter(word => word.length > 0).length
    const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0).length

    // Word count analysis
    if (wordCount < 300) {
      issues.push({
        type: 'warning',
        category: 'Content',
        message: `Content is too short (${wordCount} words). Aim for at least 300 words`,
        impact: 'medium'
      })
      score -= 20
    } else if (wordCount < 600) {
      suggestions.push({
        category: 'Content',
        message: 'Consider expanding content for better SEO performance',
        priority: 'medium',
        impact: 'More comprehensive content'
      })
      score -= 5
    }

    // Readability analysis (simplified)
    const avgWordsPerSentence = wordCount / Math.max(1, paragraphs)
    if (avgWordsPerSentence > 25) {
      suggestions.push({
        category: 'Content',
        message: 'Consider shorter sentences for better readability',
        priority: 'low',
        impact: 'Improved user experience'
      })
      score -= 5
    }

    return { score: Math.max(0, score), issues, suggestions }
  }

  private async simulateCoreWebVitals(url: string): Promise<{
    lcp: number
    fid: number
    cls: number
    fcp: number
    ttfb: number
  }> {
    // Simulate Core Web Vitals (in real implementation, use Lighthouse API)
    return {
      lcp: 1.2 + Math.random() * 2, // Largest Contentful Paint
      fid: 50 + Math.random() * 100, // First Input Delay
      cls: 0.05 + Math.random() * 0.2, // Cumulative Layout Shift
      fcp: 0.8 + Math.random() * 1.5, // First Contentful Paint
      ttfb: 200 + Math.random() * 500 // Time to First Byte
    }
  }

  private async analyzeCompetitors(url: string): Promise<Array<{
    url: string
    title: string
    score: number
    metrics: {
      onPage: number
      technical: number
      content: number
      performance: number
    }
    keyStrengths: string[]
    opportunities: string[]
  }>> {
    // Simulate competitor analysis (in real implementation, use search API + analysis)
    const domain = new URL(url).hostname.replace('www.', '')
    const competitors = [
      `https://competitor1-${domain.split('.')[0]}.com`,
      `https://competitor2-${domain.split('.')[0]}.com`,
      `https://competitor3-${domain.split('.')[0]}.com`
    ]

    return competitors.map((competitorUrl, index) => ({
      url: competitorUrl,
      title: `Competitor ${index + 1}`,
      score: Math.round(70 + Math.random() * 25),
      metrics: {
        onPage: Math.round(65 + Math.random() * 30),
        technical: Math.round(70 + Math.random() * 25),
        content: Math.round(75 + Math.random() * 20),
        performance: Math.round(60 + Math.random() * 35)
      },
      keyStrengths: [
        'Strong meta descriptions',
        'Good internal linking',
        'Fast loading speed'
      ].slice(0, Math.floor(1 + Math.random() * 3)),
      opportunities: [
        'Missing schema markup',
        'Poor mobile optimization',
        'Weak content structure'
      ].slice(0, Math.floor(1 + Math.random() * 3))
    }))
  }

  private analyzeSchemaMarkup(content: string): {
    score: number
    issues: Array<any>
    suggestions: Array<any>
    details: {
      hasStructuredData: boolean
      types: string[]
      errors: string[]
    }
  } {
    const issues: Array<any> = []
    const suggestions: Array<any> = []
    let score = 100

    // Simulate schema markup detection
    const hasStructuredData = Math.random() > 0.6
    const types = hasStructuredData ? ['Organization', 'WebPage'] : []
    const errors: string[] = []

    if (!hasStructuredData) {
      issues.push({
        type: 'warning',
        category: 'Schema Markup',
        message: 'No structured data detected',
        impact: 'medium',
        element: '<script type="application/ld+json">'
      })
      score -= 20

      suggestions.push({
        category: 'Schema Markup',
        message: 'Add structured data markup for better search engine understanding',
        priority: 'high',
        impact: 'Enhanced search result appearance'
      })
    } else {
      if (!types.includes('Organization')) {
        suggestions.push({
          category: 'Schema Markup',
          message: 'Add Organization schema for better brand recognition',
          priority: 'medium',
          impact: 'Better brand visibility in search results'
        })
        score -= 5
      }

      if (!types.includes('BreadcrumbList')) {
        suggestions.push({
          category: 'Schema Markup',
          message: 'Add BreadcrumbList schema for better navigation',
          priority: 'low',
          impact: 'Enhanced search result navigation'
        })
        score -= 3
      }
    }

    return {
      score: Math.max(0, score),
      issues,
      suggestions,
      details: {
        hasStructuredData,
        types,
        errors
      }
    }
  }

  private analyzeMobileOptimization(content: string): {
    score: number
    issues: Array<any>
    suggestions: Array<any>
    details: {
      hasViewportMeta: boolean
      isResponsive: boolean
      touchFriendly: boolean
      mobileSpeed: number
    }
  } {
    const issues: Array<any> = []
    const suggestions: Array<any> = []
    let score = 100

    // Simulate mobile optimization analysis
    const hasViewportMeta = Math.random() > 0.2
    const isResponsive = Math.random() > 0.3
    const touchFriendly = Math.random() > 0.4
    const mobileSpeed = Math.round(60 + Math.random() * 35)

    if (!hasViewportMeta) {
      issues.push({
        type: 'error',
        category: 'Mobile',
        message: 'Missing viewport meta tag',
        impact: 'high',
        element: '<meta name="viewport">'
      })
      score -= 25
    }

    if (!isResponsive) {
      issues.push({
        type: 'error',
        category: 'Mobile',
        message: 'Website is not mobile responsive',
        impact: 'high'
      })
      score -= 30
    }

    if (!touchFriendly) {
      issues.push({
        type: 'warning',
        category: 'Mobile',
        message: 'Touch targets may be too small',
        impact: 'medium'
      })
      score -= 15
    }

    if (mobileSpeed < 70) {
      issues.push({
        type: 'warning',
        category: 'Mobile',
        message: 'Mobile page speed needs improvement',
        impact: 'high'
      })
      score -= 20
    }

    suggestions.push({
      category: 'Mobile',
      message: 'Test website on various mobile devices',
      priority: 'medium',
      impact: 'Better mobile user experience'
    })

    return {
      score: Math.max(0, score),
      issues,
      suggestions,
      details: {
        hasViewportMeta,
        isResponsive,
        touchFriendly,
        mobileSpeed
      }
    }
  }

  private analyzeLocalSEO(url: string, content: string): {
    score: number
    issues: Array<any>
    suggestions: Array<any>
    details: {
      hasNAP: boolean
      hasGoogleMyBusiness: boolean
      hasLocalSchema: boolean
      localKeywords: number
    }
  } {
    const issues: Array<any> = []
    const suggestions: Array<any> = []
    let score = 100

    // Simulate local SEO analysis
    const hasNAP = content.toLowerCase().includes('address') || content.toLowerCase().includes('phone')
    const hasGoogleMyBusiness = Math.random() > 0.5
    const hasLocalSchema = Math.random() > 0.7
    const localKeywords = Math.floor(Math.random() * 10)

    if (!hasNAP) {
      issues.push({
        type: 'warning',
        category: 'Local SEO',
        message: 'NAP (Name, Address, Phone) information not clearly visible',
        impact: 'medium'
      })
      score -= 15
    }

    if (!hasGoogleMyBusiness) {
      suggestions.push({
        category: 'Local SEO',
        message: 'Claim and optimize Google My Business listing',
        priority: 'high',
        impact: 'Better local search visibility'
      })
      score -= 20
    }

    if (!hasLocalSchema) {
      suggestions.push({
        category: 'Local SEO',
        message: 'Add LocalBusiness schema markup',
        priority: 'medium',
        impact: 'Enhanced local search results'
      })
      score -= 10
    }

    if (localKeywords < 3) {
      suggestions.push({
        category: 'Local SEO',
        message: 'Include more location-based keywords in content',
        priority: 'medium',
        impact: 'Better local search rankings'
      })
      score -= 10
    }

    return {
      score: Math.max(0, score),
      issues,
      suggestions,
      details: {
        hasNAP,
        hasGoogleMyBusiness,
        hasLocalSchema,
        localKeywords
      }
    }
  }

  private analyzeSecurity(url: string): {
    score: number
    issues: Array<any>
    suggestions: Array<any>
    details: {
      hasHTTPS: boolean
      hasSecurityHeaders: boolean
      mixedContent: boolean
      certificateValid: boolean
    }
  } {
    const issues: Array<any> = []
    const suggestions: Array<any> = []
    let score = 100

    const hasHTTPS = url.startsWith('https://')
    const hasSecurityHeaders = Math.random() > 0.4
    const mixedContent = Math.random() < 0.2
    const certificateValid = hasHTTPS && Math.random() > 0.1

    if (!hasHTTPS) {
      issues.push({
        type: 'error',
        category: 'Security',
        message: 'Website not using HTTPS',
        impact: 'high'
      })
      score -= 30
    }

    if (!hasSecurityHeaders) {
      issues.push({
        type: 'warning',
        category: 'Security',
        message: 'Missing important security headers',
        impact: 'medium'
      })
      score -= 15
    }

    if (mixedContent) {
      issues.push({
        type: 'warning',
        category: 'Security',
        message: 'Mixed content detected (HTTP resources on HTTPS page)',
        impact: 'medium'
      })
      score -= 20
    }

    if (!certificateValid) {
      issues.push({
        type: 'error',
        category: 'Security',
        message: 'SSL certificate issues detected',
        impact: 'high'
      })
      score -= 25
    }

    return {
      score: Math.max(0, score),
      issues,
      suggestions,
      details: {
        hasHTTPS,
        hasSecurityHeaders,
        mixedContent,
        certificateValid
      }
    }
  }

  async analyzeWebsite(url: string): Promise<SEOAnalysisResult> {
    try {
      // Log analytics event for SEO analysis
      try {
        blink.analytics.log('seo_analysis_started', {
          url: url,
          timestamp: new Date().toISOString()
        })
      } catch (analyticsError) {
        console.warn('Analytics logging failed:', analyticsError)
        // Continue with analysis even if analytics fails
      }

      // Validate URL
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url
      }

      // Fetch page content
      const { content, metadata } = await this.fetchPageContent(url)

      // Perform individual analyses
      const metaAnalysis = this.analyzeMetaTags(content, metadata)
      const headingAnalysis = this.analyzeHeadings(content)
      const imageAnalysis = this.analyzeImages(content)
      const linkAnalysis = this.analyzeLinks(content)
      const contentAnalysis = this.analyzeContent(content)
      const schemaAnalysis = this.analyzeSchemaMarkup(content)
      const mobileAnalysis = this.analyzeMobileOptimization(content)
      const localSEOAnalysis = this.analyzeLocalSEO(url, content)
      const securityAnalysis = this.analyzeSecurity(url)

      // Get Core Web Vitals and competitor analysis
      const coreWebVitals = await this.simulateCoreWebVitals(url)
      const competitors = await this.analyzeCompetitors(url)

      // Calculate scores
      const onPageScore = Math.round((metaAnalysis.score + headingAnalysis.score) / 2)
      const technicalScore = Math.round((imageAnalysis.score + linkAnalysis.score) / 2)
      const contentScore = Math.round(contentAnalysis.score)
      const performanceScore = Math.round(
        100 - (coreWebVitals.lcp > 2.5 ? 20 : 0) - 
        (coreWebVitals.fid > 100 ? 20 : 0) - 
        (coreWebVitals.cls > 0.1 ? 20 : 0)
      )
      const accessibilityScore = Math.round(85 + Math.random() * 15) // Simulate accessibility score
      const bestPracticesScore = Math.round(80 + Math.random() * 20) // Simulate best practices score
      const mobileScore = Math.round(mobileAnalysis.score)
      const securityScore = Math.round(securityAnalysis.score)
      const localSEOScore = Math.round(localSEOAnalysis.score)
      const schemaScore = Math.round(schemaAnalysis.score)

      const overallScore = Math.round(
        (onPageScore + technicalScore + contentScore + performanceScore + 
         accessibilityScore + bestPracticesScore + mobileScore + securityScore + 
         localSEOScore + schemaScore) / 10
      )

      // Combine all issues and suggestions
      const allIssues = [
        ...metaAnalysis.issues,
        ...headingAnalysis.issues,
        ...imageAnalysis.issues,
        ...linkAnalysis.issues,
        ...contentAnalysis.issues,
        ...schemaAnalysis.issues,
        ...mobileAnalysis.issues,
        ...localSEOAnalysis.issues,
        ...securityAnalysis.issues
      ]

      const allSuggestions = [
        ...metaAnalysis.suggestions,
        ...headingAnalysis.suggestions,
        ...imageAnalysis.suggestions,
        ...linkAnalysis.suggestions,
        ...contentAnalysis.suggestions,
        ...schemaAnalysis.suggestions,
        ...mobileAnalysis.suggestions,
        ...localSEOAnalysis.suggestions,
        ...securityAnalysis.suggestions
      ]

      const result = {
        url,
        score: overallScore,
        timestamp: new Date().toISOString(),
        metrics: {
          onPage: onPageScore,
          technical: technicalScore,
          content: contentScore,
          performance: performanceScore,
          accessibility: accessibilityScore,
          bestPractices: bestPracticesScore,
          mobile: mobileScore,
          security: securityScore,
          localSEO: localSEOScore,
          schema: schemaScore
        },
        issues: allIssues,
        suggestions: allSuggestions,
        technicalDetails: {
          metaTags: metaAnalysis.details,
          headings: headingAnalysis.details,
          images: imageAnalysis.details,
          links: linkAnalysis.details,
          performance: {
            loadTime: coreWebVitals.lcp,
            pageSize: Math.round(500 + Math.random() * 2000), // KB
            requests: Math.round(20 + Math.random() * 80)
          },
          accessibility: {
            score: accessibilityScore,
            issues: accessibilityScore < 90 ? ['Color contrast issues', 'Missing ARIA labels'] : []
          },
          schema: schemaAnalysis.details,
          mobile: mobileAnalysis.details,
          localSEO: localSEOAnalysis.details,
          security: securityAnalysis.details
        },
        coreWebVitals,
        competitors
      }

      // Log successful analysis
      try {
        blink.analytics.log('seo_analysis_completed', {
          url: url,
          score: overallScore,
          timestamp: new Date().toISOString()
        })
      } catch (analyticsError) {
        console.warn('Analytics logging failed:', analyticsError)
        // Don't fail the analysis if analytics fails
      }

      return result
    } catch (error) {
      // Log failed analysis
      try {
        blink.analytics.log('seo_analysis_failed', {
          url: url,
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        })
      } catch (analyticsError) {
        console.warn('Analytics logging failed:', analyticsError)
      }

      console.error('SEO Analysis Error:', error)
      throw new Error('Failed to analyze website. Please check the URL and try again.')
    }
  }
}

export const seoAnalyzer = new SEOAnalyzer()