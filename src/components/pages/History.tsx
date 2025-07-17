import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { 
  Search, 
  Globe, 
  Calendar,
  TrendingUp,
  TrendingDown,
  Eye,
  Download
} from 'lucide-react'

const mockHistory = [
  {
    id: 1,
    url: 'https://example.com',
    score: 85,
    previousScore: 78,
    date: '2024-01-15',
    status: 'completed'
  },
  {
    id: 2,
    url: 'https://mystore.com',
    score: 72,
    previousScore: 75,
    date: '2024-01-14',
    status: 'completed'
  },
  {
    id: 3,
    url: 'https://blog.example.com',
    score: 91,
    previousScore: 89,
    date: '2024-01-13',
    status: 'completed'
  },
  {
    id: 4,
    url: 'https://portfolio.dev',
    score: 68,
    previousScore: 65,
    date: '2024-01-12',
    status: 'completed'
  },
  {
    id: 5,
    url: 'https://startup.io',
    score: 79,
    previousScore: 82,
    date: '2024-01-11',
    status: 'completed'
  },
  {
    id: 6,
    url: 'https://agency.com',
    score: 88,
    previousScore: 84,
    date: '2024-01-10',
    status: 'completed'
  }
]

export function History() {
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

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="h-4 w-4 text-green-500" />
    if (current < previous) return <TrendingDown className="h-4 w-4 text-red-500" />
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analysis History</h1>
          <p className="text-muted-foreground">View and manage your previous SEO analyses</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export All
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by URL..."
                className="h-10"
              />
            </div>
            <Button variant="outline">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* History List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Recent Analyses
          </CardTitle>
          <CardDescription>
            Your SEO analysis history with score trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockHistory.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{item.url}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      {new Date(item.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Current Score</p>
                    <div className="flex items-center gap-2">
                      <span className={`text-lg font-bold ${getScoreColor(item.score)}`}>
                        {item.score}
                      </span>
                      {getTrendIcon(item.score, item.previousScore)}
                    </div>
                  </div>
                  
                  <div className="w-24">
                    <Progress value={item.score} className="h-2" />
                  </div>
                  
                  <Badge variant={getScoreBadgeVariant(item.score)}>
                    {item.score >= 80 ? 'Excellent' : item.score >= 60 ? 'Good' : 'Poor'}
                  </Badge>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Analyses</p>
                <p className="text-2xl font-bold">{mockHistory.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-4">
              <Badge variant="secondary" className="text-xs">
                This month
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Score</p>
                <p className="text-2xl font-bold">
                  {Math.round(mockHistory.reduce((acc, item) => acc + item.score, 0) / mockHistory.length)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
            <div className="mt-4">
              <Progress 
                value={Math.round(mockHistory.reduce((acc, item) => acc + item.score, 0) / mockHistory.length)} 
                className="h-2" 
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Best Score</p>
                <p className="text-2xl font-bold text-green-600">
                  {Math.max(...mockHistory.map(item => item.score))}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
            <div className="mt-4">
              <Badge variant="default" className="text-xs">
                blog.example.com
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}