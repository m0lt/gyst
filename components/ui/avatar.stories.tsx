import type { Meta, StoryObj } from '@storybook/react';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';

const meta = {
  title: 'UI/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="User" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
};

export const WithFallback: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="/nonexistent.jpg" alt="User" />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
};

export const FallbackOnly: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>AB</AvatarFallback>
    </Avatar>
  ),
};

export const DifferentSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar className="h-8 w-8">
        <AvatarImage src="https://github.com/shadcn.png" alt="Small" />
        <AvatarFallback className="text-xs">SM</AvatarFallback>
      </Avatar>

      <Avatar className="h-10 w-10">
        <AvatarImage src="https://github.com/shadcn.png" alt="Default" />
        <AvatarFallback>MD</AvatarFallback>
      </Avatar>

      <Avatar className="h-16 w-16">
        <AvatarImage src="https://github.com/shadcn.png" alt="Large" />
        <AvatarFallback className="text-lg">LG</AvatarFallback>
      </Avatar>

      <Avatar className="h-24 w-24">
        <AvatarImage src="https://github.com/shadcn.png" alt="Extra Large" />
        <AvatarFallback className="text-2xl">XL</AvatarFallback>
      </Avatar>
    </div>
  ),
};

export const UserList: Story = {
  render: () => (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="John Doe" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">John Doe</p>
          <p className="text-xs text-muted-foreground">john@example.com</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarFallback>AS</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">Alice Smith</p>
          <p className="text-xs text-muted-foreground">alice@example.com</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarFallback>BJ</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">Bob Johnson</p>
          <p className="text-xs text-muted-foreground">bob@example.com</p>
        </div>
      </div>
    </div>
  ),
};

export const AvatarGroup: Story = {
  render: () => (
    <div className="flex -space-x-2">
      <Avatar className="border-2 border-background">
        <AvatarImage src="https://github.com/shadcn.png" alt="User 1" />
        <AvatarFallback>U1</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-background">
        <AvatarFallback>U2</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-background">
        <AvatarFallback>U3</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-background">
        <AvatarFallback>U4</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-background">
        <AvatarFallback className="text-xs">+5</AvatarFallback>
      </Avatar>
    </div>
  ),
};

export const WithStatus: Story = {
  render: () => (
    <div className="flex gap-4">
      <div className="relative">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="Online" />
          <AvatarFallback>ON</AvatarFallback>
        </Avatar>
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
      </div>

      <div className="relative">
        <Avatar>
          <AvatarFallback>AW</AvatarFallback>
        </Avatar>
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-amber-500 border-2 border-background" />
      </div>

      <div className="relative">
        <Avatar>
          <AvatarFallback>OF</AvatarFallback>
        </Avatar>
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-gray-400 border-2 border-background" />
      </div>
    </div>
  ),
};

export const ColoredFallbacks: Story = {
  render: () => (
    <div className="flex gap-3">
      <Avatar>
        <AvatarFallback className="bg-red-500 text-white">JD</AvatarFallback>
      </Avatar>

      <Avatar>
        <AvatarFallback className="bg-blue-500 text-white">AS</AvatarFallback>
      </Avatar>

      <Avatar>
        <AvatarFallback className="bg-green-500 text-white">BJ</AvatarFallback>
      </Avatar>

      <Avatar>
        <AvatarFallback className="bg-purple-500 text-white">MK</AvatarFallback>
      </Avatar>

      <Avatar>
        <AvatarFallback className="bg-amber-500 text-white">LT</AvatarFallback>
      </Avatar>
    </div>
  ),
};

export const ProfileHeader: Story = {
  render: () => (
    <div className="w-[400px] p-6 bg-card rounded-lg border">
      <div className="flex items-start gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src="https://github.com/shadcn.png" alt="John Doe" />
          <AvatarFallback className="text-lg">JD</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="heading-4">John Doe</h3>
          <p className="text-sm text-muted-foreground">@johndoe</p>
          <div className="flex gap-2 mt-2">
            <div className="text-xs">
              <span className="font-semibold">125</span>
              <span className="text-muted-foreground"> tasks</span>
            </div>
            <div className="text-xs">
              <span className="font-semibold">🔥 42</span>
              <span className="text-muted-foreground"> streak</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const CommentThread: Story = {
  render: () => (
    <div className="w-[500px] space-y-4">
      <div className="flex gap-3">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="John" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div className="flex-1 rounded-lg border p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold">John Doe</span>
            <span className="text-xs text-muted-foreground">2 hours ago</span>
          </div>
          <p className="text-sm">Great progress on your tasks today!</p>
        </div>
      </div>

      <div className="flex gap-3">
        <Avatar>
          <AvatarFallback>AS</AvatarFallback>
        </Avatar>
        <div className="flex-1 rounded-lg border p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold">Alice Smith</span>
            <span className="text-xs text-muted-foreground">1 hour ago</span>
          </div>
          <p className="text-sm">Thanks! Keeping up the streak 🔥</p>
        </div>
      </div>
    </div>
  ),
};
