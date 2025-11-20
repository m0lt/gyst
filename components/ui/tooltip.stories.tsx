import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';
import { Button } from './button';
import { Info, HelpCircle, AlertCircle, Settings, Heart, Star } from 'lucide-react';

const meta = {
  title: 'UI/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>This is a tooltip</p>
      </TooltipContent>
    </Tooltip>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon">
          <Info className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Additional information</p>
      </TooltipContent>
    </Tooltip>
  ),
};

export const HelpTooltip: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon">
          <HelpCircle className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Click for help and documentation</p>
      </TooltipContent>
    </Tooltip>
  ),
};

export const TaskTooltips: Story = {
  render: () => (
    <div className="flex gap-4">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon" variant="outline">
            <Heart className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add to favorites</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon" variant="outline">
            <Star className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Set as priority</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon" variant="outline">
            <Settings className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Task settings</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};

export const LongText: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover for details</Button>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p>
          This is a longer tooltip with more detailed information about the feature
          or action that will be performed when you interact with this element.
        </p>
      </TooltipContent>
    </Tooltip>
  ),
};

export const WithDelay: Story = {
  render: () => (
    <TooltipProvider delayDuration={800}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover (800ms delay)</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>This tooltip appears after a delay</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

export const DifferentSides: Story = {
  render: () => (
    <div className="flex flex-col gap-16 items-center">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Top (default)</Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>Tooltip on top</p>
        </TooltipContent>
      </Tooltip>

      <div className="flex gap-16">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Left</Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Tooltip on left</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Right</Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Tooltip on right</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Bottom</Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Tooltip on bottom</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};

export const IconGrid: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-4">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon">
            <span>✓</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Mark complete</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon">
            <span>✏️</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Edit task</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon">
            <span>📋</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Duplicate</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon">
            <span>🗑️</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Delete task</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon">
            <span>🔔</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Set reminder</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon">
            <span>🏷️</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Change category</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon">
            <span>🎯</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Set priority</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon">
            <span>📤</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Share task</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};

export const InlineHelp: Story = {
  render: () => (
    <div className="w-[400px] p-6 bg-card rounded-lg border">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="heading-4">Task Settings</h3>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-5 w-5">
                <Info className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>Configure how this task behaves, including reminders, repeats, and priority</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Recurring Task</label>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-4 w-4">
                  <HelpCircle className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Task will repeat on a schedule</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Enable Reminders</label>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-4 w-4">
                  <HelpCircle className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Get notified before task is due</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Photo Proof Required</label>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-4 w-4">
                  <AlertCircle className="h-3 w-3 text-amber-500" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>You'll need to upload a photo to complete this task</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const StreakTooltip: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" className="text-2xl">
          🔥 7
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <div className="space-y-1">
          <p className="font-semibold">Current Streak</p>
          <p className="text-xs">You've completed tasks 7 days in a row!</p>
          <p className="text-xs text-muted-foreground">Keep going to reach 30 days 🏆</p>
        </div>
      </TooltipContent>
    </Tooltip>
  ),
};
