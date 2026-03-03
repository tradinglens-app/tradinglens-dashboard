'use client';

import { useState, useTransition } from 'react';
import { Post } from '../services/posts.service';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter
} from '@/components/ui/sheet';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  updateBotPostAction,
  deleteBotPostAction
} from '../actions/bot-posts-actions';
import { toast } from 'sonner';
import { Loader2, Trash2 } from 'lucide-react';

interface BotPostEditSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: Post;
  enumValues?: Record<string, string[]>;
}

const VISIBILITY_OPTIONS = [
  { label: 'Public', value: 'public' },
  { label: 'Private', value: 'private' },
  { label: 'Followers Only', value: 'followers_only' },
  { label: 'Following Only', value: 'following_only' },
  { label: 'Followers & Following', value: 'followers_and_following_only' }
];

export function BotPostEditSheet({
  open,
  onOpenChange,
  post,
  enumValues
}: BotPostEditSheetProps) {
  const [content, setContent] = useState(post.content ?? '');
  const [visibility, setVisibility] = useState(post.visibility ?? 'public');
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const visibilityOptions = enumValues?.visibility
    ? enumValues.visibility.map((v) => ({
        label: v.replace(/_/g, ' '),
        value: v
      }))
    : VISIBILITY_OPTIONS;

  function handleSave() {
    startTransition(async () => {
      const result = await updateBotPostAction(post.id, {
        content,
        visibility
      });
      if (result.success) {
        toast.success('Post updated successfully');
        onOpenChange(false);
      } else {
        toast.error(result.error ?? 'Failed to update post');
      }
    });
  }

  function confirmDelete() {
    setIsDeleting(true);
    startTransition(async () => {
      const result = await deleteBotPostAction(post.id);
      setIsDeleting(false);
      setShowDeleteDialog(false);
      if (result.success) {
        toast.success('Post deleted successfully');
        onOpenChange(false);
      } else {
        toast.error(result.error ?? 'Failed to delete post');
      }
    });
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              post from the platform.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
              disabled={isDeleting}
              className='bg-red-600 hover:bg-red-700 focus:ring-red-600'
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <SheetContent
        className='flex w-full flex-col p-6 sm:max-w-xl'
        side='right'
      >
        <SheetHeader>
          <SheetTitle>Edit Bot Post</SheetTitle>
          <SheetDescription>
            Edit content or visibility for this post by{' '}
            <span className='font-medium'>
              @{post.user?.username ?? 'tradinglens.bot'}
            </span>
          </SheetDescription>
        </SheetHeader>

        <div className='flex flex-1 flex-col gap-6 overflow-y-auto py-6'>
          {/* Content */}
          <div className='flex flex-col gap-3'>
            <Label htmlFor='bot-post-content' className='text-base'>
              Content
            </Label>
            <Textarea
              id='bot-post-content'
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder='Post content...'
              className='min-h-[300px] resize font-mono text-sm'
              disabled={isPending || isDeleting}
            />
            <p className='text-muted-foreground text-xs'>
              Supports Markdown. {content.length} characters.
            </p>
          </div>

          {/* Visibility */}
          <div className='flex flex-col gap-3'>
            <Label htmlFor='bot-post-visibility' className='text-base'>
              Visibility
            </Label>
            <Select
              value={visibility}
              onValueChange={setVisibility}
              disabled={isPending || isDeleting}
            >
              <SelectTrigger id='bot-post-visibility' className='w-full'>
                <SelectValue placeholder='Select visibility' />
              </SelectTrigger>
              <SelectContent>
                {visibilityOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    <span className='capitalize'>{opt.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <SheetFooter className='flex-row gap-3 pt-6'>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={isPending || isDeleting}
            className='flex-1'
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isPending || isDeleting}
            className='flex-1'
          >
            {isPending && !isDeleting && (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            )}
            Save Changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
