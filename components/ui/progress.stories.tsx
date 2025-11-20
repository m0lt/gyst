import type { Meta, StoryObj } from '@storybook/react';
import { Progress } from './progress';
import { Label } from './label';
import { useState, useEffect } from 'react';

const meta = {
  title: 'UI/Progress',
  component: Progress,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
    },
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 50,
    className: 'w-[300px]',
  },
};

export const Empty: Story = {
  args: {
    value: 0,
    className: 'w-[300px]',
  },
};

export const Complete: Story = {
  args: {
    value: 100,
    className: 'w-[300px]',
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="w-[300px] space-y-2">
      <div className="flex items-center justify-between">
        <Label>Progress</Label>
        <span className="text-sm text-muted-foreground">50%</span>
      </div>
      <Progress value={50} />
    </div>
  ),
};

export const TaskCompletion: Story = {
  render: () => (
    <div className="w-[400px] p-6 bg-card rounded-lg border space-y-4">
      <div className="space-y-2">
        <h3 className="heading-4">Daily Tasks Progress</h3>
        <p className="text-sm text-muted-foreground">
          Complete all tasks to maintain your streak
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Completed</Label>
          <span className="text-sm font-semibold text-primary">7/10 tasks</span>
        </div>
        <Progress value={70} />
      </div>
    </div>
  ),
};

export const GoalProgress: Story = {
  render: () => (
    <div className="w-[400px] p-6 bg-card rounded-lg border space-y-6">
      <div className="space-y-2">
        <h3 className="heading-4">Monthly Goals</h3>
        <p className="text-sm text-muted-foreground">
          Track your progress towards this month's goals
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Exercise 20 days</Label>
            <span className="text-sm text-muted-foreground">15/20</span>
          </div>
          <Progress value={75} />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Read 5 books</Label>
            <span className="text-sm text-muted-foreground">3/5</span>
          </div>
          <Progress value={60} />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Meditate daily</Label>
            <span className="text-sm text-muted-foreground">28/30</span>
          </div>
          <Progress value={93} />
        </div>
      </div>
    </div>
  ),
};

export const LoadingAnimation: Story = {
  render: () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) return 0;
          return prev + 10;
        });
      }, 500);

      return () => clearInterval(timer);
    }, []);

    return (
      <div className="w-[300px] space-y-2">
        <div className="flex items-center justify-between">
          <Label>Loading...</Label>
          <span className="text-sm text-muted-foreground">{progress}%</span>
        </div>
        <Progress value={progress} />
      </div>
    );
  },
};

export const StreakProgress: Story = {
  render: () => (
    <div className="w-[400px] p-6 bg-card rounded-lg border space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="heading-4">Current Streak</h3>
          <p className="text-sm text-muted-foreground">
            6 days towards 7-day milestone
          </p>
        </div>
        <div className="text-3xl">🔥</div>
      </div>

      <div className="space-y-2">
        <Progress value={86} />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Start</span>
          <span>7-Day Streak 🏆</span>
        </div>
      </div>
    </div>
  ),
};

export const ProfileCompletion: Story = {
  render: () => (
    <div className="w-[400px] p-6 bg-card rounded-lg border space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="heading-4">Profile Completion</h3>
          <span className="text-sm font-semibold text-primary">60%</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Complete your profile to unlock all features
        </p>
      </div>

      <Progress value={60} />

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-green-500">✓</span>
          <span>Add profile picture</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-green-500">✓</span>
          <span>Set username</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-green-500">✓</span>
          <span>Add bio</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">○</span>
          <span className="text-muted-foreground">Connect calendar</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">○</span>
          <span className="text-muted-foreground">Set preferences</span>
        </div>
      </div>
    </div>
  ),
};

export const MultipleProgress: Story = {
  render: () => (
    <div className="w-[400px] space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>0%</span>
          <span>Empty</span>
        </div>
        <Progress value={0} />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>25%</span>
          <span>Quarter</span>
        </div>
        <Progress value={25} />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>50%</span>
          <span>Half</span>
        </div>
        <Progress value={50} />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>75%</span>
          <span>Three Quarters</span>
        </div>
        <Progress value={75} />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>100%</span>
          <span>Complete</span>
        </div>
        <Progress value={100} />
      </div>
    </div>
  ),
};
