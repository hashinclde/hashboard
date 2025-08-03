import { useState, useEffect } from "react";
import { AuthModal } from "@/components/auth/AuthModal";
import { MainDashboard } from "@/components/dashboard/MainDashboard";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(true);

  // Check if user is already authenticated (you can replace this with real auth logic)
  useEffect(() => {
    const authStatus = localStorage.getItem('twinflow_auth');
    if (authStatus === 'authenticated') {
      setIsAuthenticated(true);
      setShowAuthModal(false);
    }
  }, []);

  const handleSignIn = (provider: 'google' | 'microsoft') => {
    // Here you would integrate with real authentication
    console.log(`Signing in with ${provider}`);
    
    // Simulate authentication
    localStorage.setItem('twinflow_auth', 'authenticated');
    localStorage.setItem('twinflow_provider', provider);
    setIsAuthenticated(true);
    setShowAuthModal(false);
  };

  if (!isAuthenticated) {
    return (
      <>
        <div className="min-h-screen bg-gradient-background flex items-center justify-center">
          <div className="text-center space-y-6 animate-fade-in">
            <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto relative overflow-hidden shadow-lg shadow-primary/20">
              <div className="text-4xl font-black text-primary-foreground font-display tracking-tighter">#</div>
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
              <div className="absolute inset-0 border border-white/20 rounded-2xl"></div>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gradient mb-2 font-display">hashboard</h1>
              <p className="text-xl text-muted-foreground">
                Smart Analytics Dashboard
              </p>
            </div>
            <div className="loading-shimmer w-64 h-2 rounded mx-auto" />
          </div>
        </div>
        
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSignIn={handleSignIn}
        />
      </>
    );
  }

  return <MainDashboard />;
};

export default Index;
