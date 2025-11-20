import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card';
import { Button } from './button';
import { Badge } from './badge';

const meta = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
    </Card>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Task Card</CardTitle>
        <CardDescription>Complete this task today</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is an example of a task card with footer actions.</p>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="default">Complete</Button>
        <Button variant="outline">Skip</Button>
      </CardFooter>
    </Card>
  ),
};

export const ArtNouveauCard: Story = {
  render: () => (
    <Card className="w-[400px] card-art-nouveau">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="heading-3">Morning Routine</CardTitle>
          <Badge>Daily</Badge>
        </div>
        <CardDescription>
          Your wellness routine to start the day right
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-sm">Health & Wellness</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Take 10 minutes to meditate and set your intentions for the day.
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-xs text-muted-foreground">
          🔥 7 day streak
        </div>
        <Button size="sm">Mark Complete</Button>
      </CardFooter>
    </Card>
  ),
};

export const SimpleCard: Story = {
  render: () => (
    <Card className="w-[300px]">
      <CardContent className="pt-6">
        <p>Simple card with just content, no header or footer.</p>
      </CardContent>
    </Card>
  ),
};

export const MultipleCards: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 max-w-4xl">
      <Card className="card-art-nouveau">
        <CardHeader>
          <CardTitle>Task 1</CardTitle>
          <CardDescription>High priority</CardDescription>
        </CardHeader>
        <CardContent>
          <Badge variant="destructive">Urgent</Badge>
        </CardContent>
      </Card>
      <Card className="card-art-nouveau">
        <CardHeader>
          <CardTitle>Task 2</CardTitle>
          <CardDescription>Medium priority</CardDescription>
        </CardHeader>
        <CardContent>
          <Badge variant="default">Normal</Badge>
        </CardContent>
      </Card>
      <Card className="card-art-nouveau">
        <CardHeader>
          <CardTitle>Task 3</CardTitle>
          <CardDescription>Low priority</CardDescription>
        </CardHeader>
        <CardContent>
          <Badge variant="secondary">Optional</Badge>
        </CardContent>
      </Card>
      <Card className="card-art-nouveau">
        <CardHeader>
          <CardTitle>Task 4</CardTitle>
          <CardDescription>Completed</CardDescription>
        </CardHeader>
        <CardContent>
          <Badge variant="outline">Done</Badge>
        </CardContent>
      </Card>
    </div>
  ),
};
