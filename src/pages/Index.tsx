import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MainDashboard } from "@/components/dashboard/MainDashboard";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
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
              Loading your dashboard...
            </p>
          </div>
          <div className="loading-shimmer w-64 h-2 rounded mx-auto" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-background flex items-center justify-center">
        <div className="text-center space-y-6 animate-fade-in">
          <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto relative overflow-hidden shadow-lg shadow-primary/20">
            <div className="text-4xl font-black text-primary-foreground font-display tracking-tighter">#</div>
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="absolute inset-0 border border-white/20 rounded-2xl"></div>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gradient mb-2 font-display">hashboard</h1>
            <p className="text-xl text-muted-foreground mb-6">
              Smart Analytics Dashboard
            </p>
            <Button onClick={() => navigate("/auth")}>
              Sign In to Continue
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <MainDashboard />;
};

export default Index;
