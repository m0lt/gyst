import type { Meta, StoryObj } from '@storybook/react';
import { SubtaskList } from './subtask-list';
import { useState } from 'react';

const meta = {
  title: 'Tasks/SubtaskList',
  component: SubtaskList,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SubtaskList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    initialSubtasks: [],
    readonly: false,
  },
};

export const WithSubtasks: Story = {
  args: {
    initialSubtasks: [
      {
        id: '1',
        title: 'Warm up for 5 minutes',
        is_required: true,
        sort_order: 0,
      },
      {
        id: '2',
        title: 'Complete main workout',
        is_required: true,
        sort_order: 1,
      },
      {
        id: '3',
        title: 'Cool down stretches',
        is_required: false,
        sort_order: 2,
      },
      {
        id: '4',
        title: 'Log workout in app',
        is_required: false,
        sort_order: 3,
      },
    ],
    readonly: false,
  },
};

export const ReadonlyMode: Story = {
  args: {
    initialSubtasks: [
      {
        id: '1',
        title: 'Review meeting notes',
        is_required: true,
        sort_order: 0,
      },
      {
        id: '2',
        title: 'Send follow-up emails',
        is_required: true,
        sort_order: 1,
      },
      {
        id: '3',
        title: 'Update project timeline',
        is_required: false,
        sort_order: 2,
      },
    ],
    readonly: true,
  },
};

export const ManySubtasks: Story = {
  args: {
    initialSubtasks: [
      { id: '1', title: 'Morning meditation - 10 minutes', is_required: true, sort_order: 0 },
      { id: '2', title: 'Drink a glass of water', is_required: true, sort_order: 1 },
      { id: '3', title: 'Light stretching routine', is_required: false, sort_order: 2 },
      { id: '4', title: 'Review daily goals', is_required: true, sort_order: 3 },
      { id: '5', title: 'Prepare healthy breakfast', is_required: false, sort_order: 4 },
      { id: '6', title: 'Check calendar for the day', is_required: true, sort_order: 5 },
      { id: '7', title: 'Set three main priorities', is_required: true, sort_order: 6 },
      { id: '8', title: 'Journal 5 minutes', is_required: false, sort_order: 7 },
    ],
    readonly: false,
  },
};

export const InteractiveExample: Story = {
  render: () => {
    const [subtasks, setSubtasks] = useState([
      {
        id: '1',
        title: 'Wake up at 6:00 AM',
        is_required: true,
        sort_order: 0,
      },
      {
        id: '2',
        title: 'Drink water',
        is_required: true,
        sort_order: 1,
      },
      {
        id: '3',
        title: 'Morning journaling',
        is_required: false,
        sort_order: 2,
      },
    ]);

    return (
      <div className="w-[500px]">
        <SubtaskList
          initialSubtasks={subtasks}
          onChange={(updated) => {
            setSubtasks(updated);
            console.log('Subtasks updated:', updated);
          }}
        />
        <div className="mt-6 p-4 rounded-lg border bg-muted/30">
          <h3 className="text-sm font-medium mb-2">Current State:</h3>
          <pre className="text-xs overflow-auto">
            {JSON.stringify(subtasks, null, 2)}
          </pre>
        </div>
      </div>
    );
  },
};

export const InTaskForm: Story = {
  render: () => (
    <div className="w-[600px] rounded-lg border bg-card p-6">
      <div className="space-y-6">
        <div>
          <h2 className="heading-4 mb-2">Create Morning Routine Task</h2>
          <p className="text-sm text-muted-foreground">
            Break down your routine into smaller steps
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Task Title</label>
            <input
              type="text"
              placeholder="Morning Routine"
              className="mt-1 w-full px-3 py-2 rounded-lg border bg-background"
              defaultValue="Morning Routine"
            />
          </div>

          <SubtaskList
            initialSubtasks={[
              {
                id: '1',
                title: 'Meditation - 10 minutes',
                is_required: true,
                sort_order: 0,
              },
              {
                id: '2',
                title: 'Stretching exercises',
                is_required: false,
                sort_order: 1,
              },
            ]}
          />

          <div className="flex gap-2 pt-4">
            <button className="px-4 py-2 rounded-lg border hover:bg-accent">
              Cancel
            </button>
            <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90">
              Create Task
            </button>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const AllRequired: Story = {
  args: {
    initialSubtasks: [
      {
        id: '1',
        title: 'Complete task A',
        is_required: true,
        sort_order: 0,
      },
      {
        id: '2',
        title: 'Complete task B',
        is_required: true,
        sort_order: 1,
      },
      {
        id: '3',
        title: 'Complete task C',
        is_required: true,
        sort_order: 2,
      },
    ],
    readonly: false,
  },
};

export const NoRequired: Story = {
  args: {
    initialSubtasks: [
      {
        id: '1',
        title: 'Optional step 1',
        is_required: false,
        sort_order: 0,
      },
      {
        id: '2',
        title: 'Optional step 2',
        is_required: false,
        sort_order: 1,
      },
      {
        id: '3',
        title: 'Optional step 3',
        is_required: false,
        sort_order: 2,
      },
    ],
    readonly: false,
  },
};
