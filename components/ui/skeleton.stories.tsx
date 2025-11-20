import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from './skeleton';

const meta = {
  title: 'UI/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Skeleton className="w-[200px] h-[20px]" />,
};

export const Circle: Story = {
  render: () => <Skeleton className="h-12 w-12 rounded-full" />,
};

export const Rectangle: Story = {
  render: () => <Skeleton className="h-32 w-64 rounded-lg" />,
};

export const TextLines: Story = {
  render: () => (
    <div className="space-y-2 w-[300px]">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  ),
};

export const CardSkeleton: Story = {
  render: () => (
    <div className="w-[350px] rounded-lg border bg-card p-6">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  ),
};

export const TaskCardSkeleton: Story = {
  render: () => (
    <div className="w-[400px] rounded-lg border bg-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  ),
};

export const ProfileSkeleton: Story = {
  render: () => (
    <div className="w-[400px] rounded-lg border bg-card p-6">
      <div className="flex items-start gap-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24" />
          <div className="flex gap-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>
    </div>
  ),
};

export const ListSkeleton: Story = {
  render: () => (
    <div className="w-[500px] space-y-3">
      <div className="flex items-center gap-3 p-3 rounded-lg border">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>

      <div className="flex items-center gap-3 p-3 rounded-lg border">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>

      <div className="flex items-center gap-3 p-3 rounded-lg border">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
    </div>
  ),
};

export const TableSkeleton: Story = {
  render: () => (
    <div className="w-[600px] rounded-lg border bg-card p-4">
      <div className="space-y-3">
        <div className="grid grid-cols-4 gap-4 pb-3 border-b">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>

        {[...Array(5)].map((_, i) => (
          <div key={i} className="grid grid-cols-4 gap-4 py-3 border-b last:border-0">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    </div>
  ),
};

export const DashboardSkeleton: Story = {
  render: () => (
    <div className="w-[700px] space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg border bg-card p-4 space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-16" />
        </div>
        <div className="rounded-lg border bg-card p-4 space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-16" />
        </div>
        <div className="rounded-lg border bg-card p-4 space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6 space-y-4">
        <Skeleton className="h-6 w-40" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </div>
  ),
};

export const ArticleSkeleton: Story = {
  render: () => (
    <div className="w-[600px] space-y-6">
      <div className="space-y-3">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-4/5" />
      </div>

      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>

      <Skeleton className="h-64 w-full rounded-lg" />

      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  ),
};

export const CommentsSkeleton: Story = {
  render: () => (
    <div className="w-[500px] space-y-4">
      <Skeleton className="h-6 w-32" />

      <div className="space-y-4">
        <div className="flex gap-3">
          <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-16 w-full rounded-lg" />
          </div>
        </div>

        <div className="flex gap-3">
          <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-20 w-full rounded-lg" />
          </div>
        </div>

        <div className="flex gap-3">
          <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  ),
};

export const GridSkeleton: Story = {
  render: () => (
    <div className="w-[700px] grid grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="rounded-lg border bg-card p-4 space-y-3">
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      ))}
    </div>
  ),
};

export const FormSkeleton: Story = {
  render: () => (
    <div className="w-[400px] rounded-lg border bg-card p-6 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-48" />
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-24 w-full" />
        </div>

        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </div>
  ),
};
