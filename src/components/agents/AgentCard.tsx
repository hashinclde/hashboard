import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  MessageSquare, 
  Users, 
  TrendingUp,
  Settings,
  Pause,
  Play,
  MoreHorizontal
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface Agent {
  id: string;
  name: string;
  type: 'dependency' | 'risk' | 'resource' | 'communication';
  status: 'active' | 'idle' | 'processing' | 'error';
  performance: number;
  lastAction: string;
  alertsCount: number;
  description: string;
  metrics: {
    tasksProcessed: number;
    accuracy: number;
    avgResponseTime: string;
  };
}

interface AgentCardProps {
  agent: Agent;
  onToggleAgent: (id: string) => void;
  onConfigureAgent: (id: string) => void;
  onViewDetails: (id: string) => void;
}

const agentIcons = {
  dependency: Activity,
  risk: AlertTriangle,
  resource: Users,
  communication: MessageSquare,
};

const agentColors = {
  dependency: "text-blue-500",
  risk: "text-orange-500", 
  resource: "text-green-500",
  communication: "text-purple-500",
};

const statusColors = {
  active: "default",
  idle: "secondary", 
  processing: "outline",
  error: "destructive",
} as const;

export function AgentCard({ agent, onToggleAgent, onConfigureAgent, onViewDetails }: AgentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = agentIcons[agent.type];
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="glass hover:shadow-medium transition-all duration-300 cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg bg-card flex items-center justify-center ${agentColors[agent.type]}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg">{agent.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{agent.description}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant={statusColors[agent.status]}>
                {agent.status}
              </Badge>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onToggleAgent(agent.id)}>
                    {agent.status === 'active' ? (
                      <>
                        <Pause className="w-4 h-4 mr-2" />
                        Pause Agent
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Activate Agent
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onConfigureAgent(agent.id)}>
                    <Settings className="w-4 h-4 mr-2" />
                    Configure
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onViewDetails(agent.id)}>
                    <TrendingUp className="w-4 h-4 mr-2" />
                    View Analytics
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Performance Bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Performance</span>
              <span className="text-sm text-muted-foreground">{agent.performance}%</span>
            </div>
            <Progress value={agent.performance} className="h-2" />
          </div>

          {/* Alerts */}
          {agent.alertsCount > 0 && (
            <div className="flex items-center gap-2 mb-4 p-2 bg-warning/10 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-warning" />
              <span className="text-sm text-warning font-medium">
                {agent.alertsCount} alert{agent.alertsCount > 1 ? 's' : ''} requiring attention
              </span>
            </div>
          )}

          {/* Last Action */}
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">Last Action:</p>
            <p className="text-sm font-medium">{agent.lastAction}</p>
          </div>

          {/* Expandable Metrics */}
          <Button
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full justify-between p-0 h-auto"
          >
            <span className="text-sm">View Metrics</span>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <TrendingUp className="w-4 h-4" />
            </motion.div>
          </Button>

          <motion.div
            initial={false}
            animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {isExpanded && (
              <div className="pt-4 space-y-3 border-t mt-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Tasks Processed</p>
                    <p className="font-semibold">{agent.metrics.tasksProcessed}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Accuracy</p>
                    <p className="font-semibold">{agent.metrics.accuracy}%</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Avg Response Time</p>
                    <p className="font-semibold">{agent.metrics.avgResponseTime}</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}