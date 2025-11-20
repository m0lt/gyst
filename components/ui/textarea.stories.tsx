import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './textarea';
import { Label } from './label';

const meta = {
  title: 'UI/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Type your message here...',
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="message">Your message</Label>
      <Textarea id="message" placeholder="Type your message here..." />
    </div>
  ),
};

export const WithHelperText: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="bio">Bio</Label>
      <Textarea id="bio" placeholder="Tell us about yourself..." />
      <p className="text-xs text-muted-foreground">
        You can use up to 500 characters.
      </p>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    placeholder: 'This textarea is disabled',
    disabled: true,
  },
};

export const WithDefaultValue: Story = {
  args: {
    defaultValue: 'This is some default text in the textarea.',
  },
};

export const LargeHeight: Story = {
  args: {
    className: 'min-h-[200px]',
    placeholder: 'Larger textarea for longer content...',
  },
};

export const TaskDescription: Story = {
  render: () => (
    <div className="grid w-full max-w-md items-center gap-1.5">
      <Label htmlFor="task-description">Task Description</Label>
      <Textarea
        id="task-description"
        placeholder="Describe what needs to be done, any specific requirements, or notes about this task..."
        className="min-h-[120px]"
      />
      <p className="text-xs text-muted-foreground">
        Optional: Add more details about this task
      </p>
    </div>
  ),
};

export const ReflectionEntry: Story = {
  render: () => (
    <div className="grid w-full max-w-md items-center gap-1.5 p-6 bg-card rounded-lg border">
      <div className="space-y-2">
        <Label htmlFor="reflection" className="heading-4">
          Daily Reflection
        </Label>
        <p className="text-sm text-muted-foreground">
          How did today go? What are you grateful for?
        </p>
      </div>
      <Textarea
        id="reflection"
        placeholder="I felt proud of..."
        className="min-h-[180px]"
      />
    </div>
  ),
};

export const NotesSection: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-4 p-6 bg-card rounded-lg border">
      <div className="space-y-2">
        <h3 className="heading-4">Task Notes</h3>
        <p className="text-sm text-muted-foreground">
          Add any additional information or reminders
        </p>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          placeholder="Add notes, links, or reminders here..."
          className="min-h-[100px]"
        />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="motivation">Motivation</Label>
        <Textarea
          id="motivation"
          placeholder="Why is this task important to you?"
          className="min-h-[100px]"
        />
      </div>
    </div>
  ),
};

export const AllStates: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-4">
      <div className="grid gap-1.5">
        <Label>Default</Label>
        <Textarea placeholder="Default textarea" />
      </div>

      <div className="grid gap-1.5">
        <Label>With Content</Label>
        <Textarea defaultValue="This textarea has some default content that you can edit." />
      </div>

      <div className="grid gap-1.5">
        <Label>Disabled</Label>
        <Textarea placeholder="Disabled textarea" disabled />
      </div>

      <div className="grid gap-1.5">
        <Label>Large Height</Label>
        <Textarea
          className="min-h-[200px]"
          placeholder="Larger textarea for more content"
        />
      </div>
    </div>
  ),
};
