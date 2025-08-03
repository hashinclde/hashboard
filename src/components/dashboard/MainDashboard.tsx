import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "./DashboardHeader";
import { QuickActions } from "./QuickActions";
import { AgentCard, type Agent } from "@/components/agents/AgentCard";
import { DigitalTwin } from "@/components/3d/DigitalTwin";
import { TutorialOverlay } from "@/components/tutorial/TutorialOverlay";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Activity, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle,
  Clock,
  Zap,
  Brain,
  BarChart3
} from "lucide-react";

export function MainDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme_preference');
    return saved === 'dark';
  });
  const [isTutorialActive, setIsTutorialActive] = useState(false);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);

  const handleToggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme_preference', newTheme ? 'dark' : 'light');
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Load project settings from localStorage
  const [projectSettings, setProjectSettings] = useState(() => {
    const saved = localStorage.getItem('project_settings');
    return saved ? JSON.parse(saved) : null;
  });

  // Mock data
  const [agents] = useState<Agent[]>([
    {
      id: 'dep-1',
      name: 'Dependency Agent',
      type: 'dependency',
      status: 'active',
      performance: 94,
      lastAction: 'Identified 3 critical path dependencies',
      alertsCount: 1,
      description: 'Tracks task dependencies and critical paths',
      metrics: {
        tasksProcessed: 156,
        accuracy: 97,
        avgResponseTime: '1.2s'
      }
    },
    {
      id: 'risk-1',
      name: 'Risk Assessment Agent',
      type: 'risk',
      status: 'processing',
      performance: 87,
      lastAction: 'Analyzing potential budget overrun in Phase 2',
      alertsCount: 3,
      description: 'Predicts risks and suggests mitigation strategies',
      metrics: {
        tasksProcessed: 89,
        accuracy: 91,
        avgResponseTime: '2.1s'
      }
    },
    {
      id: 'res-1',
      name: 'Resource Optimizer',
      type: 'resource',
      status: 'active',
      performance: 91,
      lastAction: 'Reallocated 2 developers to critical tasks',
      alertsCount: 0,
      description: 'Optimizes resource allocation across tasks',
      metrics: {
        tasksProcessed: 134,
        accuracy: 94,
        avgResponseTime: '0.8s'
      }
    },
    {
      id: 'com-1',
      name: 'Communication Hub',
      type: 'communication',
      status: 'active',
      performance: 96,
      lastAction: 'Sent deadline reminder to Team Alpha',
      alertsCount: 2,
      description: 'Coordinates team communication and notifications',
      metrics: {
        tasksProcessed: 278,
        accuracy: 98,
        avgResponseTime: '0.3s'
      }
    }
  ]);

  const projectData = [
    { id: '1', name: 'Planning', position: [-2, 0, -2] as [number, number, number], status: 'completed' as const, completion: 100, dependencies: [] },
    { id: '2', name: 'Design', position: [0, 0, -2] as [number, number, number], status: 'completed' as const, completion: 100, dependencies: ['1'] },
    { id: '3', name: 'Development', position: [2, 0, -2] as [number, number, number], status: 'in-progress' as const, completion: 65, dependencies: ['2'] },
    { id: '4', name: 'Testing', position: [4, 0, -2] as [number, number, number], status: 'pending' as const, completion: 15, dependencies: ['3'] },
    { id: '5', name: 'Frontend', position: [0, 0, 0] as [number, number, number], status: 'in-progress' as const, completion: 80, dependencies: ['2'] },
    { id: '6', name: 'Backend', position: [2, 0, 0] as [number, number, number], status: 'at-risk' as const, completion: 45, dependencies: ['2'] },
    { id: '7', name: 'Integration', position: [4, 0, 0] as [number, number, number], status: 'pending' as const, completion: 5, dependencies: ['5', '6'] },
    { id: '8', name: 'Deployment', position: [6, 0, 0] as [number, number, number], status: 'pending' as const, completion: 0, dependencies: ['4', '7'] }
  ];

  const projectDueDate = projectSettings?.dueDate ? 
    new Date(projectSettings.dueDate) : 
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

  useEffect(() => {
    // Apply saved theme on mount
    const savedTheme = localStorage.getItem('theme_preference');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }
  }, []);

  const handleAgentToggle = (id: string) => {
    toast({
      title: "Agent Status Changed",
      description: `Agent ${id} has been toggled.`,
    });
  };

  const handleAgentConfigure = (id: string) => {
    toast({
      title: "Agent Configuration",
      description: `Opening configuration for agent ${id}...`,
    });
  };

  const handleAgentDetails = (id: string) => {
    toast({
      title: "Agent Details",
      description: `Viewing detailed metrics for agent ${id}...`,
    });
  };

  const handleNodeClick = (nodeId: string) => {
    toast({
      title: "Task Selected",
      description: `Viewing details for task: ${nodeId}`,
    });
  };

  const handleGenerateReport = () => {
    toast({
      title: "Report Generated",
      description: "Project report has been generated and will be available shortly.",
    });
  };

  const handleScheduleReview = () => {
    toast({
      title: "Review Scheduled",
      description: "A project review meeting has been scheduled for next week.",
    });
  };

  const handleRiskAnalysis = () => {
    toast({
      title: "Risk Analysis Started",
      description: "Running comprehensive risk analysis on all project components...",
    });
  };

  // If no project settings, redirect to settings
  const handleSetupProject = () => {
    navigate('/settings');
  };

  const activeAgents = agents.filter(a => a.status === 'active').length;
  const totalAlerts = agents.reduce((sum, a) => sum + a.alertsCount, 0);
  const avgPerformance = Math.round(agents.reduce((sum, a) => sum + a.performance, 0) / agents.length);

  return (
    <div className="min-h-screen bg-gradient-background">
      <DashboardHeader
        isDark={isDark}
        onThemeToggle={handleToggleTheme}
        onStartTutorial={() => setIsTutorialActive(true)}
        projectDueDate={projectDueDate}
      />

      <main className="p-6">
        {/* Project Setup Warning */}
        {!projectSettings && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="border-warning bg-warning/5">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-warning" />
                    <div>
                      <p className="font-medium">Project Setup Required</p>
                      <p className="text-sm text-muted-foreground">
                        Configure your project settings to get personalized insights
                      </p>
                    </div>
                  </div>
                  <Button onClick={handleSetupProject} variant="outline">
                    Setup Project
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Key Metrics Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="glass">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Agents</p>
                  <p className="text-2xl font-bold">{activeAgents}/4</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-warning/20 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Alerts</p>
                  <p className="text-2xl font-bold">{totalAlerts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-success/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Performance</p>
                  <p className="text-2xl font-bold">{avgPerformance}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tasks Complete</p>
                  <p className="text-2xl font-bold">23/32</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - 3D Digital Twin */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="xl:col-span-2 digital-twin-container"
          >
            <DigitalTwin
              projectData={projectData}
              isSimulationRunning={isSimulationRunning}
              onToggleSimulation={() => setIsSimulationRunning(!isSimulationRunning)}
              onNodeClick={handleNodeClick}
            />
          </motion.div>

          {/* Right Column - Control Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Simulation Controls */}
            <Card className="glass simulation-controls">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  What-If Simulation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Simulation Status</span>
                    <Badge variant={isSimulationRunning ? "default" : "secondary"}>
                      {isSimulationRunning ? 'Running' : 'Paused'}
                    </Badge>
                  </div>
                  <Button
                    onClick={() => setIsSimulationRunning(!isSimulationRunning)}
                    variant="gradient"
                    className="w-full"
                  >
                    {isSimulationRunning ? 'Pause Simulation' : 'Start Simulation'}
                  </Button>
                  <div className="text-xs text-muted-foreground">
                    Run predictive scenarios to optimize project outcomes
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <QuickActions />
          </motion.div>
        </div>

        {/* Agents Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">AI Agent Coordination</h2>
              <p className="text-muted-foreground">
                Intelligent agents working together to optimize your project
              </p>
            </div>
            <Badge variant="outline" className="bg-primary/10 text-primary">
              Multi-Agent System
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 agent-cards">
            {agents.map((agent, index) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <AgentCard
                  agent={agent}
                  onToggleAgent={handleAgentToggle}
                  onConfigureAgent={handleAgentConfigure}
                  onViewDetails={handleAgentDetails}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>

      {/* Tutorial Overlay */}
      <TutorialOverlay
        isActive={isTutorialActive}
        onClose={() => setIsTutorialActive(false)}
        onComplete={() => {
          console.log('Tutorial completed!');
          toast({
            title: "Tutorial Completed!",
            description: "You're now ready to manage your projects with hashboard.",
          });
        }}
      />
    </div>
  );
}
