import type { Meta, StoryObj } from '@storybook/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Button } from './button';

const meta = {
  title: 'UI/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="tab1" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        <TabsTrigger value="tab3">Tab 3</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <p className="text-sm text-muted-foreground">Content for Tab 1</p>
      </TabsContent>
      <TabsContent value="tab2">
        <p className="text-sm text-muted-foreground">Content for Tab 2</p>
      </TabsContent>
      <TabsContent value="tab3">
        <p className="text-sm text-muted-foreground">Content for Tab 3</p>
      </TabsContent>
    </Tabs>
  ),
};

export const TaskTabs: Story = {
  render: () => (
    <Tabs defaultValue="active" className="w-[600px]">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="completed">Completed</TabsTrigger>
        <TabsTrigger value="all">All Tasks</TabsTrigger>
      </TabsList>
      <TabsContent value="active">
        <Card>
          <CardHeader>
            <CardTitle>Active Tasks</CardTitle>
            <CardDescription>
              Tasks you're currently working on
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <span>Morning meditation</span>
              <Badge variant="default">In Progress</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <span>Read for 20 minutes</span>
              <Badge variant="secondary">Pending</Badge>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="completed">
        <Card>
          <CardHeader>
            <CardTitle>Completed Tasks</CardTitle>
            <CardDescription>
              Tasks you've finished today
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <span>Morning workout</span>
              <Badge variant="outline">✓ Done</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <span>Drink water</span>
              <Badge variant="outline">✓ Done</Badge>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="all">
        <Card>
          <CardHeader>
            <CardTitle>All Tasks</CardTitle>
            <CardDescription>
              Complete overview of your tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Showing all 12 tasks across all categories and states.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  ),
};

export const CategoryTabs: Story = {
  render: () => (
    <Tabs defaultValue="health" className="w-[600px]">
      <TabsList>
        <TabsTrigger value="health">❤️ Health</TabsTrigger>
        <TabsTrigger value="productivity">💼 Work</TabsTrigger>
        <TabsTrigger value="growth">🌱 Growth</TabsTrigger>
        <TabsTrigger value="social">👥 Social</TabsTrigger>
      </TabsList>
      <TabsContent value="health">
        <Card>
          <CardHeader>
            <CardTitle>Health & Wellness</CardTitle>
            <CardDescription>
              Tasks focused on your physical and mental health
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="p-3 rounded-lg border">
              <p className="font-medium">Morning yoga</p>
              <p className="text-sm text-muted-foreground">30 minutes • 7:00 AM</p>
            </div>
            <div className="p-3 rounded-lg border">
              <p className="font-medium">Meditation</p>
              <p className="text-sm text-muted-foreground">15 minutes • 8:00 PM</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="productivity">
        <Card>
          <CardHeader>
            <CardTitle>Productivity & Work</CardTitle>
            <CardDescription>
              Professional and productivity-focused tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Your work-related tasks and projects
            </p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="growth">
        <Card>
          <CardHeader>
            <CardTitle>Personal Growth</CardTitle>
            <CardDescription>
              Learning and self-improvement activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Tasks that help you grow and learn
            </p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="social">
        <Card>
          <CardHeader>
            <CardTitle>Social & Relationships</CardTitle>
            <CardDescription>
              Activities involving friends and family
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Social connections and relationship building
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  ),
};

export const StatsTabs: Story = {
  render: () => (
    <Tabs defaultValue="today" className="w-[600px]">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="today">Today</TabsTrigger>
        <TabsTrigger value="week">Week</TabsTrigger>
        <TabsTrigger value="month">Month</TabsTrigger>
        <TabsTrigger value="year">Year</TabsTrigger>
      </TabsList>
      <TabsContent value="today">
        <Card>
          <CardHeader>
            <CardTitle>Today's Statistics</CardTitle>
            <CardDescription>Your progress for today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Tasks Completed</span>
              <span className="text-2xl font-bold text-primary">7/10</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Time Invested</span>
              <span className="text-2xl font-bold text-primary">3.5h</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Streak</span>
              <span className="text-2xl font-bold text-primary">🔥 6</span>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="week">
        <Card>
          <CardHeader>
            <CardTitle>This Week</CardTitle>
            <CardDescription>Your weekly progress</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Weekly statistics and insights
            </p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="month">
        <Card>
          <CardHeader>
            <CardTitle>This Month</CardTitle>
            <CardDescription>Your monthly overview</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Monthly achievements and trends
            </p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="year">
        <Card>
          <CardHeader>
            <CardTitle>This Year</CardTitle>
            <CardDescription>Your yearly summary</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Annual progress and milestones
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  ),
};

export const SettingsTabs: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-[600px]">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="preferences">Preferences</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>
              Manage your account information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <p className="text-sm text-muted-foreground">john@example.com</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Username</label>
              <p className="text-sm text-muted-foreground">@johndoe</p>
            </div>
            <Button>Edit Profile</Button>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="preferences">
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>
              Customize your experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Theme, language, and display preferences
            </p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="notifications">
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>
              Control how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Email, push, and in-app notification preferences
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  ),
};

export const FullWidth: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-[700px]">
      <TabsList className="w-full">
        <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
        <TabsTrigger value="analytics" className="flex-1">Analytics</TabsTrigger>
        <TabsTrigger value="reports" className="flex-1">Reports</TabsTrigger>
        <TabsTrigger value="settings" className="flex-1">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Overview content</p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="analytics">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Analytics content</p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="reports">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Reports content</p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="settings">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Settings content</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  ),
};
