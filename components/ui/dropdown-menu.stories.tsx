import type { Meta, StoryObj } from '@storybook/react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { Button } from './button';
import { MoreHorizontal, User, Settings, LogOut, Plus, Edit, Trash } from 'lucide-react';

const meta = {
  title: 'UI/DropdownMenu',
  component: DropdownMenu,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open Menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Item 1</DropdownMenuItem>
        <DropdownMenuItem>Item 2</DropdownMenuItem>
        <DropdownMenuItem>Item 3</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Account</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const WithShortcuts: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Options</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Plus />
          New Task
          <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Edit />
          Edit
          <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Trash />
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const TaskActions: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Task Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <span>✓</span>
          Mark Complete
        </DropdownMenuItem>
        <DropdownMenuItem>
          <span>✏️</span>
          Edit Task
        </DropdownMenuItem>
        <DropdownMenuItem>
          <span>📋</span>
          Duplicate Task
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <span>🔗</span>
          Copy Link
        </DropdownMenuItem>
        <DropdownMenuItem>
          <span>📤</span>
          Share
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive">
          <span>🗑️</span>
          Delete Task
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const WithCheckboxes: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">View Options</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Display Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked>
          Show Completed
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked>
          Show Categories
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem>
          Show Streaks
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem>
          Compact View
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const WithRadioGroup: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Sort By</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Sort Tasks</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value="priority">
          <DropdownMenuRadioItem value="priority">
            Priority
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="date">
            Due Date
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="name">
            Name
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="category">
            Category
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const WithSubmenu: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">More Options</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <span>✓</span>
          Complete Task
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <span>🏷️</span>
            Change Category
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Health & Wellness</DropdownMenuItem>
              <DropdownMenuItem>Productivity</DropdownMenuItem>
              <DropdownMenuItem>Personal Growth</DropdownMenuItem>
              <DropdownMenuItem>Social</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <span>🎯</span>
            Set Priority
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem>High Priority</DropdownMenuItem>
              <DropdownMenuItem>Medium Priority</DropdownMenuItem>
              <DropdownMenuItem>Low Priority</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive">
          <span>🗑️</span>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const CategoryFilter: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Categories</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked>
          All Categories
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem>
          <span className="mr-2">❤️</span>
          Health & Wellness
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked>
          <span className="mr-2">💼</span>
          Productivity
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem>
          <span className="mr-2">🌱</span>
          Personal Growth
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem>
          <span className="mr-2">👥</span>
          Social
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem>
          <span className="mr-2">🎨</span>
          Creative
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const UserMenu: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">John Doe</p>
            <p className="text-xs text-muted-foreground">john@example.com</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User />
            Profile
            <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span>📊</span>
            Statistics
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span>🏆</span>
            Achievements
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Settings />
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span>❓</span>
            Help & Support
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut />
          Log out
          <DropdownMenuShortcut>⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const QuickActions: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Create New</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <span>✓</span>
          Task
          <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <span>🏷️</span>
          Category
        </DropdownMenuItem>
        <DropdownMenuItem>
          <span>📝</span>
          Note
        </DropdownMenuItem>
        <DropdownMenuItem>
          <span>🎯</span>
          Goal
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <span>📋</span>
          Template
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};
