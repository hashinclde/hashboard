import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Building2, Mail, Shield, Users, Zap } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: (provider: 'google' | 'microsoft') => void;
}

export function AuthModal({ isOpen, onClose, onSignIn }: AuthModalProps) {
  const [isLoading, setIsLoading] = useState<'google' | 'microsoft' | null>(null);

  const handleSignIn = async (provider: 'google' | 'microsoft') => {
    setIsLoading(provider);
    // Simulate loading
    setTimeout(() => {
      setIsLoading(null);
      onSignIn(provider);
      onClose();
    }, 2000);
  };

  const features = [
    { icon: Building2, title: "Interactive Dashboards", desc: "Beautiful, real-time data visualization" },
    { icon: Users, title: "Team Collaboration", desc: "Share insights and work together seamlessly" },
    { icon: Zap, title: "Smart Analytics", desc: "AI-powered insights and recommendations" },
    { icon: Shield, title: "Enterprise Security", desc: "Bank-level data protection and privacy" }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 gap-0 overflow-hidden">
        <div className="grid md:grid-cols-2 min-h-[600px]">
          {/* Left Side - Branding & Features */}
          <div className="bg-gradient-primary p-8 text-primary-foreground relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" />
            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center relative overflow-hidden backdrop-blur-sm">
                    <span className="text-xl font-bold font-display">#</span>
                    <div className="absolute inset-0 bg-white/10"></div>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold font-display">hashboard</h1>
                    <p className="text-white/80 text-sm">Smart Analytics Dashboard</p>
                  </div>
                </div>

                <h2 className="text-3xl font-bold mb-4 font-display">
                  Beautiful Analytics Made Simple
                </h2>
                <p className="text-white/90 mb-8 text-lg">
                  Transform your data into stunning insights with our elegant analytics platform. 
                  Powerful visualizations, intelligent automation, and seamless collaboration.
                </p>

                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <feature.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{feature.title}</h3>
                        <p className="text-white/80 text-sm">{feature.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-xl" />
            <div className="absolute -bottom-16 -left-16 w-60 h-60 bg-white/5 rounded-full blur-2xl" />
          </div>

          {/* Right Side - Authentication */}
          <div className="p-8 bg-background">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="h-full flex flex-col justify-center"
            >
              <DialogHeader className="text-center mb-8">
                <DialogTitle className="text-2xl font-bold font-display">Welcome to hashboard</DialogTitle>
                <p className="text-muted-foreground">
                  Sign in to access your analytics workspace
                </p>
              </DialogHeader>

              <div className="space-y-4">
                <Button
                  onClick={() => handleSignIn('google')}
                  variant="outline"
                  size="lg"
                  className="w-full h-12 relative hover:scale-[1.02] transition-all duration-300"
                  disabled={isLoading !== null}
                >
                  {isLoading === 'google' ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      <Mail className="w-5 h-5 mr-3" />
                      Continue with Google
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => handleSignIn('microsoft')}
                  variant="outline"
                  size="lg"
                  className="w-full h-12 hover:scale-[1.02] transition-all duration-300"
                  disabled={isLoading !== null}
                >
                  {isLoading === 'microsoft' ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      <Building2 className="w-5 h-5 mr-3" />
                      Continue with Microsoft
                    </>
                  )}
                </Button>
              </div>

              <Separator className="my-6" />

              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  By signing in, you agree to our Terms of Service and Privacy Policy
                </p>
                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    SOC 2 Compliant
                  </span>
                  <span>•</span>
                  <span>GDPR Ready</span>
                  <span>•</span>
                  <span>Enterprise Grade</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}