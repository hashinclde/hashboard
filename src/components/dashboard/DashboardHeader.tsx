
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Bell, 
  Settings, 
  LogOut, 
  Moon, 
  Sun, 
  HelpCircle,
  Building2,
  Clock,
  Users,
  Activity
} from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import hashboardLogo from "@/assets/hashboard-logo.png";

interface DashboardHeaderProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  onThemeToggle: () => void;
  isDark: boolean;
  onStartTutorial: () => void;
  projectDueDate: Date;
}

export function DashboardHeader({ 
  user,
  onThemeToggle, 
  isDark,
  onStartTutorial,
  projectDueDate 
}: DashboardHeaderProps) {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  
  // Get user email from localStorage if not provided
  const userEmail = user?.email || localStorage.getItem('user_email') || 'user@hashboard.com';
  const userName = user?.name || 'User';

  const timeUntilDue = Math.ceil((projectDueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const isUrgent = timeUntilDue <= 7;

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  const handleSignOut = () => {
    localStorage.removeItem('twinflow_auth');
    localStorage.removeItem('twinflow_provider');
    window.location.reload();
  };

  return (
    <header className="glass border-b sticky top-0 z-50 h-16">
      <div className="flex items-center justify-between px-6 h-full">
        {/* Left Section - Logo & Project Status */}
        <div className="flex items-center gap-6">
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden">
              <img 
                src={hashboardLogo} 
                alt="hashboard" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient">hashboard</h1>
              <p className="text-xs text-muted-foreground">AI Project Dashboard</p>
            </div>
          </motion.div>

          {/* Project Timer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center gap-2"
          >
            <Clock className="w-4 h-4 text-muted-foreground" />
            <div className="text-sm">
              <span className="text-muted-foreground">Due in </span>
              <Badge variant={isUrgent ? "destructive" : "secondary"} className="font-medium">
                {timeUntilDue} days
              </Badge>
            </div>
          </motion.div>

          {/* Active Agents Indicator */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center gap-2"
          >
            <Activity className="w-4 h-4 text-success" />
            <div className="text-sm">
              <span className="text-muted-foreground">Agents </span>
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                4 Active
              </Badge>
            </div>
          </motion.div>
        </div>

        {/* Right Section - Actions & User */}
        <div className="flex items-center gap-4">
          {/* Tutorial Button */}
          <Button
            onClick={onStartTutorial}
            variant="ghost"
            size="icon-sm"
            className="relative"
          >
            <HelpCircle className="w-4 h-4" />
          </Button>

          {/* Theme Toggle */}
          <Button
            onClick={onThemeToggle}
            variant="ghost"
            size="icon-sm"
            className="relative"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" className="relative">
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-danger text-white text-xs rounded-full flex items-center justify-center"
                  >
                    {unreadCount}
                  </motion.div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="flex items-center justify-between p-2">
                <span className="font-medium">Notifications</span>
                {unreadCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={markAllAsRead}
                    className="text-xs"
                  >
                    Mark all read
                  </Button>
                )}
              </div>
              <DropdownMenuSeparator />
              <div className="max-h-64 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.slice(0, 5).map((notification) => (
                    <DropdownMenuItem key={notification.id} className="p-3 flex-col items-start">
                      <div className="flex items-center gap-2 w-full">
                        <div className={`w-2 h-2 rounded-full ${
                          notification.type === 'success' ? 'bg-success' :
                          notification.type === 'error' ? 'bg-destructive' :
                          notification.type === 'warning' ? 'bg-warning' :
                          'bg-primary'
                        }`} />
                        <span className="font-medium text-sm">{notification.title}</span>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-primary rounded-full ml-auto" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <div className="p-3 text-center text-muted-foreground text-sm">
                    No notifications
                  </div>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-3 px-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {userName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="text-sm font-medium">{userName}</p>
                  <p className="text-xs text-muted-foreground">{userEmail}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>
                <Users className="w-4 h-4 mr-2" />
                Team Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSettingsClick}>
                <Settings className="w-4 h-4 mr-2" />
                Preferences
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
