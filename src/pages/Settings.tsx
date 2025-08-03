import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { CalendarIcon, Plus, X, ArrowLeft, Trash2, Save, Users, User, Palette } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ProjectSettings {
  projectName: string;
  description: string;
  budget: number;
  dueDate: Date;
  priority: string;
}

interface UserPreferences {
  project_name?: string;
  project_description?: string;
  project_budget?: number;
  project_due_date?: string;
  project_priority?: string;
  theme_preference?: string;
  team_members?: any[];
}

const Settings = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState<UserPreferences>({});
  const [isDark, setIsDark] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [teamMembers, setTeamMembers] = useState<Array<{ id: string; name: string; email: string; role: string }>>([]);
  const [newMember, setNewMember] = useState({ name: '', email: '', role: 'Member' });
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<ProjectSettings>({
    defaultValues: {
      projectName: '',
      description: '',
      budget: 0,
      priority: 'medium',
    }
  });

  // Check authentication
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  // Load user preferences
  useEffect(() => {
    const loadPreferences = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading preferences:', error);
        return;
      }

      if (data) {
        setPreferences({
          project_name: data.project_name,
          project_description: data.project_description,
          project_budget: data.project_budget,
          project_due_date: data.project_due_date,
          project_priority: data.project_priority,
          theme_preference: data.theme_preference,
          team_members: Array.isArray(data.team_members) ? data.team_members : []
        });
        setValue('projectName', data.project_name || '');
        setValue('description', data.project_description || '');
        setValue('budget', data.project_budget || 0);
        setValue('priority', data.project_priority || 'medium');
        setIsDark(data.theme_preference === 'dark');
        setTeamMembers(Array.isArray(data.team_members) ? data.team_members as Array<{ id: string; name: string; email: string; role: string }> : []);
        
        if (data.project_due_date) {
          setSelectedDate(new Date(data.project_due_date));
        }
      }
    };

    loadPreferences();
  }, [user, setValue]);

  const onSubmit = async (data: ProjectSettings) => {
    if (!user) return;
    
    setIsLoading(true);
    
    const updatedPreferences = {
      user_id: user.id,
      project_name: data.projectName,
      project_description: data.description,
      project_budget: data.budget,
      project_priority: data.priority,
      project_due_date: selectedDate?.toISOString().split('T')[0] || null,
      theme_preference: isDark ? 'dark' : 'light',
      team_members: teamMembers,
    };

    const { error } = await supabase
      .from('user_preferences')
      .upsert(updatedPreferences);

    if (error) {
      toast({
        title: "Error saving settings",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setPreferences(updatedPreferences);
      toast({
        title: "Settings saved",
        description: "Your project settings have been saved successfully.",
      });
    }
    
    setIsLoading(false);
  };

  const addTeamMember = () => {
    if (newMember.name && newMember.email) {
      const member = {
        id: Date.now().toString(),
        ...newMember
      };
      setTeamMembers([...teamMembers, member]);
      setNewMember({ name: '', email: '', role: 'Member' });
      
      toast({
        title: "Team member added",
        description: `${newMember.name} has been added to the team.`,
      });
    }
  };

  const saveThemePreference = async () => {
    if (!user) return;
    
    const theme = isDark ? 'dark' : 'light';
    
    // Apply theme to document
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const { error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: user.id,
        theme_preference: theme,
      });

    if (error) {
      toast({
        title: "Error saving theme",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Theme saved",
        description: `Theme preference set to ${theme} mode.`,
      });
    }
  };

  const removeTeamMember = (id: string) => {
    setTeamMembers(teamMembers.filter(member => member.id !== id));
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      navigate("/auth");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-background flex items-center justify-center">
        <div className="text-center">
          <div className="loading-shimmer w-64 h-8 rounded mx-auto mb-4" />
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                className="hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gradient">Settings</h1>
                <p className="text-muted-foreground">Manage your project and account preferences</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>

          {/* Settings Tabs */}
          <Tabs defaultValue="project" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 glassmorphism">
              <TabsTrigger value="project" className="flex items-center space-x-2">
                <Save className="w-4 h-4" />
                <span>Project</span>
              </TabsTrigger>
              <TabsTrigger value="team" className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Team</span>
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center space-x-2">
                <Palette className="w-4 h-4" />
                <span>Preferences</span>
              </TabsTrigger>
            </TabsList>

            {/* Project Settings */}
            <TabsContent value="project">
              <Card className="glassmorphism border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Save className="w-5 h-5" />
                    <span>Project Settings</span>
                  </CardTitle>
                  <CardDescription>
                    Configure your project details and timeline
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="projectName">Project Name</Label>
                        <Input
                          id="projectName"
                          {...register("projectName", { required: "Project name is required" })}
                          className="bg-white/5 border-white/10"
                        />
                        {errors.projectName && (
                          <p className="text-sm text-destructive">{errors.projectName.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="budget">Budget ($)</Label>
                        <Input
                          id="budget"
                          type="number"
                          {...register("budget", { required: "Budget is required", min: 0 })}
                          className="bg-white/5 border-white/10"
                        />
                        {errors.budget && (
                          <p className="text-sm text-destructive">{errors.budget.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        {...register("description")}
                        className="bg-white/5 border-white/10 min-h-[100px]"
                        placeholder="Describe your project..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Due Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal bg-white/5 border-white/10",
                                !selectedDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={selectedDate}
                              onSelect={setSelectedDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select {...register("priority")}>
                          <SelectTrigger className="bg-white/5 border-white/10">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      <Save className="w-4 h-4 mr-2" />
                      {isLoading ? "Saving..." : "Save Project Settings"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Team Settings */}
            <TabsContent value="team">
              <Card className="glassmorphism border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>Team Management</span>
                  </CardTitle>
                  <CardDescription>
                    Add and manage team members for your project
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Add New Member */}
                  <div className="space-y-4 p-4 rounded-lg bg-white/5 border border-white/10">
                    <h3 className="font-semibold">Add Team Member</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        placeholder="Full Name"
                        value={newMember.name}
                        onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                        className="bg-white/5 border-white/10"
                      />
                      <Input
                        placeholder="Email Address"
                        type="email"
                        value={newMember.email}
                        onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                        className="bg-white/5 border-white/10"
                      />
                      <div className="flex space-x-2">
                        <Select
                          value={newMember.role}
                          onValueChange={(value) => setNewMember({ ...newMember, role: value })}
                        >
                          <SelectTrigger className="bg-white/5 border-white/10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Admin">Admin</SelectItem>
                            <SelectItem value="Member">Member</SelectItem>
                            <SelectItem value="Viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button onClick={addTeamMember} size="icon">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Team Members List */}
                  <div className="space-y-3">
                    <h3 className="font-semibold">Current Team Members</h3>
                    {teamMembers.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">
                        No team members added yet. Add your first team member above.
                      </p>
                    ) : (
                      teamMembers.map((member) => (
                        <div key={member.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                              <User className="w-5 h-5 text-primary-foreground" />
                            </div>
                            <div>
                              <p className="font-medium">{member.name}</p>
                              <p className="text-sm text-muted-foreground">{member.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm px-2 py-1 rounded bg-primary/20 text-primary">
                              {member.role}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeTeamMember(member.id)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <Button onClick={handleSubmit(onSubmit)} className="w-full" disabled={isLoading}>
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? "Saving..." : "Save Team Settings"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences */}
            <TabsContent value="preferences">
              <Card className="glassmorphism border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Palette className="w-5 h-5" />
                    <span>Application Preferences</span>
                  </CardTitle>
                  <CardDescription>
                    Customize your application experience
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="space-y-1">
                        <h3 className="font-medium">Dark Mode</h3>
                        <p className="text-sm text-muted-foreground">
                          Switch between light and dark themes
                        </p>
                      </div>
                      <Switch
                        checked={isDark}
                        onCheckedChange={setIsDark}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="space-y-1">
                        <h3 className="font-medium">User Account</h3>
                        <p className="text-sm text-muted-foreground">
                          Signed in as: {user?.email}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" onClick={handleSignOut}>
                        Sign Out
                      </Button>
                    </div>
                  </div>

                  <Button onClick={saveThemePreference} className="w-full">
                    <Save className="w-4 h-4 mr-2" />
                    Save Preferences
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;