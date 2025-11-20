import type { Meta, StoryObj } from '@storybook/react';
import { Slider } from './slider';
import { Label } from './label';
import { useState } from 'react';

const meta = {
  title: 'UI/Slider',
  component: Slider,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
    },
    min: {
      control: 'number',
    },
    max: {
      control: 'number',
    },
    step: {
      control: 'number',
    },
  },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultValue: [50],
    max: 100,
    step: 1,
    className: 'w-[300px]',
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="w-[300px] space-y-3">
      <Label>Volume</Label>
      <Slider defaultValue={[50]} max={100} step={1} />
    </div>
  ),
};

export const WithValue: Story = {
  render: () => {
    const [value, setValue] = useState([50]);
    return (
      <div className="w-[300px] space-y-3">
        <div className="flex items-center justify-between">
          <Label>Volume</Label>
          <span className="text-sm text-muted-foreground">{value[0]}%</span>
        </div>
        <Slider
          value={value}
          onValueChange={setValue}
          max={100}
          step={1}
        />
      </div>
    );
  },
};

export const TaskDurationSlider: Story = {
  render: () => {
    const [duration, setDuration] = useState([30]);
    return (
      <div className="w-full max-w-md p-6 bg-card rounded-lg border space-y-4">
        <div className="space-y-2">
          <h3 className="heading-4">Set Task Duration</h3>
          <p className="text-sm text-muted-foreground">
            How long will this task take?
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Duration</Label>
            <span className="text-lg font-semibold text-primary">
              {duration[0]} min
            </span>
          </div>
          <Slider
            value={duration}
            onValueChange={setDuration}
            max={120}
            step={5}
            min={5}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>5 min</span>
            <span>120 min</span>
          </div>
        </div>
      </div>
    );
  },
};

export const DifficultySlider: Story = {
  render: () => {
    const [difficulty, setDifficulty] = useState([3]);
    const getDifficultyLabel = (value: number) => {
      if (value === 1) return 'Very Easy';
      if (value === 2) return 'Easy';
      if (value === 3) return 'Medium';
      if (value === 4) return 'Hard';
      return 'Very Hard';
    };

    return (
      <div className="w-full max-w-md p-6 bg-card rounded-lg border space-y-4">
        <div className="space-y-2">
          <h3 className="heading-4">Task Difficulty</h3>
          <p className="text-sm text-muted-foreground">
            Rate how challenging this task is
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Difficulty</Label>
            <span className="text-sm font-medium text-primary">
              {getDifficultyLabel(difficulty[0])}
            </span>
          </div>
          <Slider
            value={difficulty}
            onValueChange={setDifficulty}
            max={5}
            min={1}
            step={1}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Very Easy</span>
            <span>Very Hard</span>
          </div>
        </div>
      </div>
    );
  },
};

export const MultipleSliders: Story = {
  render: () => {
    const [health, setHealth] = useState([70]);
    const [productivity, setProductivity] = useState([50]);
    const [social, setSocial] = useState([80]);

    return (
      <div className="w-full max-w-md p-6 bg-card rounded-lg border space-y-6">
        <div className="space-y-2">
          <h3 className="heading-4">Today's Focus Areas</h3>
          <p className="text-sm text-muted-foreground">
            Allocate your energy across different areas
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Health & Wellness</Label>
              <span className="text-sm text-muted-foreground">{health[0]}%</span>
            </div>
            <Slider
              value={health}
              onValueChange={setHealth}
              max={100}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Productivity</Label>
              <span className="text-sm text-muted-foreground">{productivity[0]}%</span>
            </div>
            <Slider
              value={productivity}
              onValueChange={setProductivity}
              max={100}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Social & Relationships</Label>
              <span className="text-sm text-muted-foreground">{social[0]}%</span>
            </div>
            <Slider
              value={social}
              onValueChange={setSocial}
              max={100}
              step={1}
            />
          </div>
        </div>
      </div>
    );
  },
};

export const PrioritySlider: Story = {
  render: () => {
    const [priority, setPriority] = useState([2]);
    const getPriorityColor = (value: number) => {
      if (value === 1) return 'text-muted-foreground';
      if (value === 2) return 'text-primary';
      return 'text-destructive';
    };
    const getPriorityLabel = (value: number) => {
      if (value === 1) return 'Low Priority';
      if (value === 2) return 'Medium Priority';
      return 'High Priority';
    };

    return (
      <div className="w-full max-w-md p-6 bg-card rounded-lg border space-y-4">
        <div className="space-y-2">
          <h3 className="heading-4">Set Priority</h3>
          <p className="text-sm text-muted-foreground">
            How important is this task?
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Priority Level</Label>
            <span className={`text-sm font-semibold ${getPriorityColor(priority[0])}`}>
              {getPriorityLabel(priority[0])}
            </span>
          </div>
          <Slider
            value={priority}
            onValueChange={setPriority}
            max={3}
            min={1}
            step={1}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Low</span>
            <span>Medium</span>
            <span>High</span>
          </div>
        </div>
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <div className="w-[300px] space-y-3">
      <Label>Disabled Slider</Label>
      <Slider defaultValue={[50]} max={100} step={1} disabled />
    </div>
  ),
};

export const SmallStep: Story = {
  render: () => {
    const [value, setValue] = useState([2.5]);
    return (
      <div className="w-[300px] space-y-3">
        <div className="flex items-center justify-between">
          <Label>Precision Slider</Label>
          <span className="text-sm text-muted-foreground">{value[0].toFixed(1)}</span>
        </div>
        <Slider
          value={value}
          onValueChange={setValue}
          max={5}
          min={0}
          step={0.1}
        />
      </div>
    );
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="w-[300px] space-y-6">
      <div className="space-y-2">
        <Label>Default (50%)</Label>
        <Slider defaultValue={[50]} max={100} step={1} />
      </div>

      <div className="space-y-2">
        <Label>Low Value (25%)</Label>
        <Slider defaultValue={[25]} max={100} step={1} />
      </div>

      <div className="space-y-2">
        <Label>High Value (75%)</Label>
        <Slider defaultValue={[75]} max={100} step={1} />
      </div>

      <div className="space-y-2">
        <Label>Disabled</Label>
        <Slider defaultValue={[50]} max={100} step={1} disabled />
      </div>
    </div>
  ),
};
