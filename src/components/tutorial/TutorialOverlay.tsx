import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Play,
  CheckCircle,
  Circle
} from "lucide-react";

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  target: string; // CSS selector for the element to highlight
  position: 'top' | 'bottom' | 'left' | 'right';
  action?: 'click' | 'hover' | 'none';
}

interface TutorialOverlayProps {
  isActive: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to hashboard',
    description: 'Your AI-powered Digital Twin Project Management platform. Let\'s take a quick tour of the key features.',
    target: '.dashboard-header',
    position: 'bottom'
  },
  {
    id: 'project-timer',
    title: 'Project Timeline',
    description: 'Keep track of your project deadlines with the real-time countdown timer. Red badges indicate urgent deadlines.',
    target: '.project-timer',
    position: 'bottom'
  },
  {
    id: 'agents-status',
    title: 'AI Agents Status',
    description: 'Monitor your intelligent agents in real-time. These AI assistants work continuously to optimize your project.',
    target: '.agents-status',
    position: 'bottom'
  },
  {
    id: 'digital-twin',
    title: '3D Digital Twin',
    description: 'This is your project\'s digital twin - a live 3D visualization showing task dependencies, progress, and bottlenecks.',
    target: '.digital-twin-container',
    position: 'top',
    action: 'click'
  },
  {
    id: 'agent-cards',
    title: 'Agent Management',
    description: 'Each agent specializes in different aspects: Dependencies, Risk Assessment, Resource Allocation, and Team Communication.',
    target: '.agent-cards',
    position: 'top'
  },
  {
    id: 'simulation-controls',
    title: 'What-If Simulation',
    description: 'Run simulations to predict project outcomes. Change variables like budget or timeline to see instant results.',
    target: '.simulation-controls',
    position: 'top'
  },
  {
    id: 'alerts-panel',
    title: 'Smart Alerts',
    description: 'AI-powered alerts notify you of potential issues before they become problems. Stay ahead of risks automatically.',
    target: '.alerts-panel',
    position: 'left'
  }
];

export function TutorialOverlay({ isActive, onClose, onComplete }: TutorialOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const currentStepData = tutorialSteps[currentStep];
  const progress = ((currentStep + 1) / tutorialSteps.length) * 100;

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCompletedSteps(prev => [...prev, currentStepData.id]);
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    setCompletedSteps(prev => [...prev, currentStepData.id]);
    
    // Send notification about tutorial completion
    const event = new CustomEvent('show-notification', {
      detail: { 
        type: 'success', 
        title: 'Tutorial Complete!',
        message: 'You\'ve completed the hashboard tutorial. You\'re ready to manage your projects!' 
      }
    });
    window.dispatchEvent(event);
    
    onComplete();
    onClose();
  };

  const handleSkip = () => {
    onClose();
  };

  useEffect(() => {
    if (!isActive) {
      setCurrentStep(0);
      setCompletedSteps([]);
    }
  }, [isActive]);

  if (!isActive) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50">
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Tutorial Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.4 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          <Card className="w-[500px] max-w-[90vw] glass">
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <Play className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Interactive Tutorial</h3>
                    <p className="text-sm text-muted-foreground">
                      Step {currentStep + 1} of {tutorialSteps.length}
                    </p>
                  </div>
                </div>

                <Button onClick={onClose} variant="ghost" size="icon-sm">
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Step Indicators */}
              <div className="flex items-center gap-2 mb-6 overflow-x-auto">
                {tutorialSteps.map((step, index) => (
                  <div
                    key={step.id}
                    className="flex items-center gap-2 flex-shrink-0"
                  >
                    <div className="flex items-center gap-1">
                      {completedSteps.includes(step.id) ? (
                        <CheckCircle className="w-4 h-4 text-success" />
                      ) : index === currentStep ? (
                        <div className="w-4 h-4 bg-primary rounded-full animate-pulse" />
                      ) : (
                        <Circle className="w-4 h-4 text-muted-foreground" />
                      )}
                      <span className={`text-xs ${
                        index === currentStep ? 'text-primary font-medium' : 
                        completedSteps.includes(step.id) ? 'text-success' : 'text-muted-foreground'
                      }`}>
                        {step.title.split(' ')[0]}
                      </span>
                    </div>
                    {index < tutorialSteps.length - 1 && (
                      <div className="w-4 h-px bg-border" />
                    )}
                  </div>
                ))}
              </div>

              {/* Content */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-2">{currentStepData.title}</h4>
                <p className="text-muted-foreground">{currentStepData.description}</p>

                {currentStepData.action && (
                  <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-primary/20 text-primary">
                        Action Required
                      </Badge>
                      <span className="text-sm">
                        {currentStepData.action === 'click' && 'Click the highlighted element'}
                        {currentStepData.action === 'hover' && 'Hover over the highlighted element'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handlePrevious}
                    variant="outline"
                    size="sm"
                    disabled={currentStep === 0}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  
                  <Button onClick={handleSkip} variant="ghost" size="sm">
                    Skip Tutorial
                  </Button>
                </div>

                <Button onClick={handleNext} size="sm">
                  {currentStep === tutorialSteps.length - 1 ? 'Complete' : 'Next'}
                  {currentStep < tutorialSteps.length - 1 && (
                    <ArrowRight className="w-4 h-4 ml-2" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Spotlight Effect */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="absolute inset-0 pointer-events-none"
        >
          {/* This would typically use the target selector to position a highlight */}
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-64 h-16 bg-white/10 rounded-lg border-2 border-primary animate-pulse" />
        </motion.div>
      </div>
    </AnimatePresence>
  );
}