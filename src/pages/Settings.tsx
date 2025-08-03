
import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings as SettingsIcon, 
  Calendar as CalendarIcon, 
  Users, 
  Building2,
  Save,
  Plus,
  X,
  Moon,
  Sun
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ProjectSettings {
  projectName: string;
  description: string;
  dueDate: Date;
  teamMembers: string[];
  budget: number;
  priority: 'low' | 'medium' | 'high';
}

export default function Settings() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme_preference');
    return saved === 'dark';
  });
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const saved = localStorage.getItem('project_settings');
    if (saved) {
      const settings = JSON.parse(saved);
      return settings.dueDate ? new Date(settings.dueDate) : undefined;
    }
    return undefined;
  });
  const [newMember, setNewMember] = useState("");
  const [teamMembers, setTeamMembers] = useState<string[]>(() => {
    const saved = localStorage.getItem('project_settings');
    if (saved) {
      const settings = JSON.parse(saved);
      return settings.teamMembers || [""];
    }
    return [""];
  });
  const [userEmail, setUserEmail] = useState(() => {
    const saved = localStorage.getItem('user_email');
    return saved || "";
  });

  const { register, handleSubmit, setValue, watch } = useForm<ProjectSettings>({
    defaultValues: {
      projectName: "Digital Twin Project",
      description: "AI-powered project management system",
      budget: 50000,
      priority: 'high'
    }
  });

  const onSubmit = (data: ProjectSettings) => {
    const settingsData = {
      ...data,
      dueDate: selectedDate,
      teamMembers: teamMembers.filter(member => member.trim() !== "")
    };
    console.log('Saving settings:', settingsData);
    localStorage.setItem('project_settings', JSON.stringify(settingsData));
    // Save user email separately
    if (userEmail) {
      localStorage.setItem('user_email', userEmail);
    }
    // Show success notification
    const event = new CustomEvent('show-notification', {
      detail: { type: 'success', message: 'Project settings saved successfully!' }
    });
    window.dispatchEvent(event);
  };

  const addTeamMember = () => {
    if (newMember && !teamMembers.includes(newMember)) {
      const updatedMembers = [...teamMembers.filter(m => m.trim() !== ""), newMember];
      setTeamMembers(updatedMembers);
      setNewMember("");
    }
  };

  const saveTeamSettings = () => {
    const validMembers = teamMembers.filter(member => member.trim() !== "");
    const currentSettings = JSON.parse(localStorage.getItem('project_settings') || '{}');
    const updatedSettings = { ...currentSettings, teamMembers: validMembers };
    localStorage.setItem('project_settings', JSON.stringify(updatedSettings));
    
    const event = new CustomEvent('show-notification', {
      detail: { type: 'success', message: 'Team settings saved successfully!' }
    });
    window.dispatchEvent(event);
  };

  const saveThemePreference = () => {
    localStorage.setItem('theme_preference', isDark ? 'dark' : 'light');
    // Apply theme immediately
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    const event = new CustomEvent('show-notification', {
      detail: { type: 'success', message: `${isDark ? 'Dark' : 'Light'} theme applied successfully!` }
    });
    window.dispatchEvent(event);
  };

  const removeTeamMember = (member: string) => {
    setTeamMembers(teamMembers.filter(m => m !== member));
  };

  return (
    <div className="min-h-screen bg-gradient-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-gradient">Project Settings</h1>
            <p className="text-muted-foreground">Configure your project details and preferences</p>
          </div>
          <Button
            onClick={() => window.history.back()}
            variant="outline"
          >
            Back to Dashboard
          </Button>
        </motion.div>

        {/* Settings Tabs */}
        <Tabs defaultValue="project" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="project" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Project
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Team
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <SettingsIcon className="w-4 h-4" />
              Preferences
            </TabsTrigger>
          </TabsList>

          {/* Project Settings */}
          <TabsContent value="project">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  Project Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="projectName">Project Name</Label>
                      <Input
                        id="projectName"
                        {...register("projectName", { required: true })}
                        placeholder="Enter project name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="budget">Budget ($)</Label>
                      <Input
                        id="budget"
                        type="number"
                        {...register("budget", { required: true })}
                        placeholder="50000"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Project Description</Label>
                    <Textarea
                      id="description"
                      {...register("description")}
                      placeholder="Describe your project goals and objectives"
                      rows={3}
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
                              "w-full justify-start text-left font-normal",
                              !selectedDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
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
                      <Label htmlFor="priority">Priority Level</Label>
                      <select
                        {...register("priority")}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      >
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                      </select>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" variant="gradient">
                    <Save className="w-4 h-4 mr-2" />
                    Save Project Settings
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Settings */}
          <TabsContent value="team">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Team Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="userEmail">Your Email</Label>
                  <Input
                    id="userEmail"
                    type="email"
                    placeholder="Enter your email address"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                  />
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Add team member email"
                    value={newMember}
                    onChange={(e) => setNewMember(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTeamMember()}
                  />
                  <Button onClick={addTeamMember} variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Team Members</Label>
                  <div className="flex flex-wrap gap-2">
                    {teamMembers.filter(member => member.trim() !== "").map((member, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-2">
                        {member}
                        <button
                          onClick={() => removeTeamMember(member)}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button onClick={saveTeamSettings} className="w-full" variant="gradient">
                  <Save className="w-4 h-4 mr-2" />
                  Save Team Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences */}
          <TabsContent value="preferences">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="w-5 h-5 text-primary" />
                  Application Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Theme</Label>
                    <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
                  </div>
                  <Button
                    onClick={() => setIsDark(!isDark)}
                    variant="outline"
                    size="sm"
                  >
                    {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    {isDark ? 'Light' : 'Dark'}
                  </Button>
                </div>

                <Button onClick={saveThemePreference} className="w-full" variant="gradient">
                  <Save className="w-4 h-4 mr-2" />
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
