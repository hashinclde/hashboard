import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Zap, 
  TrendingUp, 
  AlertTriangle, 
  FileText, 
  Download,
  CheckCircle,
  Clock,
  Users
} from "lucide-react";

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  status: 'idle' | 'loading' | 'success' | 'error';
  progress?: number;
  result?: string;
}

export function QuickActions() {
  const [actions, setActions] = useState<QuickAction[]>([
    {
      id: 'performance',
      title: 'Generate Performance Report',
      description: 'AI analysis of current project metrics',
      icon: <TrendingUp className="w-4 h-4" />,
      action: () => runAction('performance'),
      status: 'idle'
    },
    {
      id: 'risks',
      title: 'Risk Assessment',
      description: 'Identify potential project bottlenecks',
      icon: <AlertTriangle className="w-4 h-4" />,
      action: () => runAction('risks'),
      status: 'idle'
    },
    {
      id: 'timeline',
      title: 'Optimize Timeline',
      description: 'AI-powered schedule optimization',
      icon: <Clock className="w-4 h-4" />,
      action: () => runAction('timeline'),
      status: 'idle'
    },
    {
      id: 'export',
      title: 'Export Dashboard',
      description: 'Download comprehensive project data',
      icon: <Download className="w-4 h-4" />,
      action: () => runAction('export'),
      status: 'idle'
    }
  ]);

  const runAction = (actionId: string) => {
    setActions(prev => prev.map(action => 
      action.id === actionId 
        ? { ...action, status: 'loading' as const, progress: 0 }
        : action
    ));

    // Simulate AI processing with progress
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(progressInterval);
        
        // Complete the action
        setTimeout(() => {
          setActions(prev => prev.map(action => {
            if (action.id === actionId) {
              const results = {
                'performance': 'Project is 15% ahead of schedule with 94% task completion rate',
                'risks': 'Found 2 potential bottlenecks in task dependencies - auto-optimized',
                'timeline': 'Timeline optimized - 3 days saved through parallel task execution',
                'export': 'Dashboard data exported successfully (PDF + JSON formats)'
              };
              
              return {
                ...action,
                status: 'success' as const,
                progress: 100,
                result: results[actionId as keyof typeof results]
              };
            }
            return action;
          }));

          // Send notification
          const event = new CustomEvent('show-notification', {
            detail: { 
              type: 'success', 
              message: `${actions.find(a => a.id === actionId)?.title} completed successfully!` 
            }
          });
          window.dispatchEvent(event);

          // Reset after 5 seconds
          setTimeout(() => {
            setActions(prev => prev.map(action => 
              action.id === actionId 
                ? { ...action, status: 'idle' as const, progress: undefined, result: undefined }
                : action
            ));
          }, 5000);
        }, 500);
      } else {
        setActions(prev => prev.map(action => 
          action.id === actionId 
            ? { ...action, progress }
            : action
        ));
      }
    }, 150);
  };

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action, index) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Button
              onClick={action.action}
              variant="outline"
              className="w-full justify-start h-auto p-4"
              disabled={action.status === 'loading'}
            >
              <div className="flex items-start gap-3 w-full">
                <div className="flex-shrink-0 mt-0.5">
                  {action.status === 'loading' ? (
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  ) : action.status === 'success' ? (
                    <CheckCircle className="w-4 h-4 text-success" />
                  ) : (
                    action.icon
                  )}
                </div>
                
                <div className="flex-1 text-left space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{action.title}</span>
                    {action.status === 'success' && (
                      <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                        Done
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    {action.description}
                  </p>
                  
                  {action.status === 'loading' && typeof action.progress === 'number' && (
                    <div className="space-y-1">
                      <Progress value={action.progress} className="h-1" />
                      <span className="text-xs text-muted-foreground">
                        Processing... {Math.round(action.progress)}%
                      </span>
                    </div>
                  )}
                  
                  {action.result && (
                    <div className="p-2 bg-success/5 border border-success/20 rounded text-xs text-success">
                      {action.result}
                    </div>
                  )}
                </div>
              </div>
            </Button>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}