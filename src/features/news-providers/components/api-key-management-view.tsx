'use client';

import { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import {
  IconKey,
  IconTrash,
  IconChevronLeft,
  IconPlus,
  IconCircleCheck,
  IconClock,
  IconActivity
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import {
  Pencil,
  Info,
  MoreHorizontal,
  Eye,
  EyeOff,
  Copy,
  Check
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
  createApiKeyAction,
  deleteApiKeyAction,
  updateApiKeyAction,
  getProviderKeysAction
} from '../actions/provider-actions';
import {
  ProviderConfig,
  ProviderApiKey
} from '../services/news-providers.service';
import { AlertModal } from '@/components/modal/alert-modal';

interface ApiKeyManagementViewProps {
  provider: ProviderConfig & { provider_api_keys: ProviderApiKey[] };
}

function ApiKeyCell({ apiKey }: { apiKey: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    toast.success('API Key copied to clipboard');
  };

  return (
    <div className='flex items-center gap-2'>
      <code className='bg-muted relative min-w-[200px] rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold'>
        {isVisible ? apiKey : '•'.repeat(24)}
      </code>
      <Button
        variant='ghost'
        size='icon'
        className='h-8 w-8'
        onClick={() => setIsVisible(!isVisible)}
      >
        {isVisible ? (
          <EyeOff className='h-4 w-4' />
        ) : (
          <Eye className='h-4 w-4' />
        )}
        <span className='sr-only'>Toggle visibility</span>
      </Button>
      <Button
        variant='ghost'
        size='icon'
        className='h-8 w-8'
        onClick={handleCopy}
      >
        {isCopied ? (
          <Check className='h-4 w-4 text-green-500' />
        ) : (
          <Copy className='h-4 w-4' />
        )}
        <span className='sr-only'>Copy key</span>
      </Button>
    </div>
  );
}

export function ApiKeyManagementView({ provider }: ApiKeyManagementViewProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [localKeys, setLocalKeys] = useState<ProviderApiKey[]>(
    provider.provider_api_keys
  );
  const [editingKey, setEditingKey] = useState<ProviderApiKey | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Alert Modal State
  const [alertOpen, setAlertOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    setLocalKeys(provider.provider_api_keys);
  }, [provider.provider_api_keys]);

  // Compute Stats
  const stats = useMemo(() => {
    const activeCount = localKeys.filter((k) => k.enabled).length;
    const cooldownCount = localKeys.filter(
      (k) => k.cooldown_until && new Date(k.cooldown_until) > new Date()
    ).length;
    const totalUsage = localKeys.reduce(
      (acc, k) => acc + (k.usage_count || 0),
      0
    );
    return { activeCount, cooldownCount, totalUsage };
  }, [localKeys]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const providerNameFromForm = formData.get('provider_name') as string;

    let result;

    if (editingKey) {
      if (!formData.get('enabled')) {
        formData.append('enabled', 'false');
      }

      result = await updateApiKeyAction(editingKey.id, formData);

      if (result.success) {
        toast.success(result.message);
        setEditingKey(null);
        setIsSheetOpen(false);
        (e.target as HTMLFormElement).reset();
        getProviderKeysAction(provider.id).then((res) => {
          if (res.success && res.keys) setLocalKeys(res.keys);
        });
      } else {
        toast.error(result.message);
      }
    } else {
      result = await createApiKeyAction(
        provider.id,
        providerNameFromForm || provider.name,
        formData
      );

      if (result.success) {
        toast.success(result.message);
        setIsSheetOpen(false);
        (e.target as HTMLFormElement).reset();
        getProviderKeysAction(provider.id).then((res) => {
          if (res.success && res.keys) setLocalKeys(res.keys);
        });
      } else {
        toast.error(result.message);
      }
    }

    setLoading(false);
  };

  const startEdit = (key: ProviderApiKey) => {
    setEditingKey(key);
    setIsSheetOpen(true);
  };

  const handleOpenSheet = (open: boolean) => {
    setIsSheetOpen(open);
    if (!open) setEditingKey(null);
  };

  // Trigger Delete Confirmation
  const handleDelete = (id: string) => {
    setDeletingId(id);
    setAlertOpen(true);
  };

  // Confirm Delete Action
  const onConfirmDelete = async () => {
    if (!deletingId) return;

    setLoading(true);
    const result = await deleteApiKeyAction(deletingId);

    if (result.success) {
      toast.success(result.message);
      setLocalKeys((prev) => prev.filter((k) => k.id !== deletingId));
    } else {
      toast.error(result.message);
    }

    setLoading(false);
    setAlertOpen(false);
    setDeletingId(null);
  };

  const formatDate = (date: Date | null | undefined, compact = false) => {
    if (!date) return '-';
    return format(
      new Date(date),
      compact ? 'MMM dd, HH:mm' : 'MMM dd, yyyy HH:mm:ss'
    );
  };

  return (
    <div className='flex flex-col gap-6'>
      {/* Header */}
      <div className='flex flex-col justify-between gap-4 md:flex-row md:items-center'>
        <div className='flex items-center gap-4'>
          <Button
            variant='outline'
            size='icon'
            onClick={() => router.back()}
            className='h-9 w-9'
          >
            <IconChevronLeft className='h-5 w-5' />
          </Button>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>Manage Keys</h1>
            <p className='text-muted-foreground text-sm'>
              Manage API keys for {provider.name}
            </p>
          </div>
        </div>

        <Sheet open={isSheetOpen} onOpenChange={handleOpenSheet}>
          <SheetTrigger asChild>
            <Button>
              <IconPlus className='mr-2 h-4 w-4' />
              Add New Key
            </Button>
          </SheetTrigger>
          <SheetContent className='gap-0 p-0 sm:max-w-[540px]'>
            <SheetHeader className='px-6 pt-6 pb-2'>
              <SheetTitle>
                {editingKey ? 'Edit API Key' : 'Add API Key'}
              </SheetTitle>
              <SheetDescription>
                {editingKey
                  ? 'Update the API key details below.'
                  : 'Add a new API key for this provider.'}
              </SheetDescription>
            </SheetHeader>

            <form
              key={editingKey ? editingKey.id : 'new'}
              onSubmit={handleSubmit}
              className='space-y-6 px-6 pb-6'
            >
              <div className='space-y-4'>
                <div className='grid gap-2'>
                  <Label htmlFor='provider_name'>Name</Label>
                  <Input
                    id='provider_name'
                    name='provider_name'
                    placeholder='e.g. Master Key'
                    required
                    defaultValue={editingKey?.provider_name || provider.name}
                  />
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='api_key'>API Key</Label>
                  <Input
                    id='api_key'
                    name='api_key'
                    placeholder='Enter API key...'
                    required
                    defaultValue={editingKey?.api_key || ''}
                    className='font-mono'
                  />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div className='grid gap-2'>
                    <Label htmlFor='usage_count'>Usage Count</Label>
                    <Input
                      id='usage_count'
                      name='usage_count'
                      type='number'
                      defaultValue={editingKey?.usage_count || 0}
                    />
                  </div>
                  <div className='grid gap-2'>
                    <Label htmlFor='rate_limit'>Rate Limit</Label>
                    <Input
                      id='rate_limit'
                      name='rate_limit'
                      type='number'
                      placeholder='0 for unlimited'
                      defaultValue={editingKey?.rate_limit || 0}
                    />
                  </div>
                </div>

                <div className='grid gap-2'>
                  <Label htmlFor='cooldown_until'>Cooldown Until</Label>
                  <div className='flex flex-col gap-2'>
                    <Input
                      id='cooldown_until'
                      name='cooldown_until'
                      type='datetime-local'
                      defaultValue={
                        editingKey?.cooldown_until
                          ? new Date(editingKey.cooldown_until)
                              .toISOString()
                              .slice(0, 16)
                          : ''
                      }
                    />
                    <p className='text-muted-foreground flex items-center gap-1.5 text-[0.8rem]'>
                      <Info className='h-3 w-3' /> The key will be inactive
                      until this time.
                    </p>
                  </div>
                </div>

                <div className='flex items-center justify-between rounded-lg border p-4'>
                  <div className='space-y-0.5'>
                    <Label className='text-base'>Active Status</Label>
                    <div className='text-muted-foreground text-[0.8rem]'>
                      Enable or disable this API key
                    </div>
                  </div>
                  <Switch
                    id='enabled'
                    name='enabled'
                    value='true'
                    defaultChecked={editingKey ? editingKey.enabled : true}
                  />
                </div>
              </div>

              <div className='flex justify-end gap-2 pt-4'>
                <Button
                  variant='outline'
                  type='button'
                  onClick={() => handleOpenSheet(false)}
                >
                  Cancel
                </Button>
                <Button type='submit' disabled={loading}>
                  {loading
                    ? 'Saving...'
                    : editingKey
                      ? 'Save Changes'
                      : 'Create Key'}
                </Button>
              </div>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      {/* Stats Section */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Keys</CardTitle>
            <IconKey className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{localKeys.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Active Keys</CardTitle>
            <IconCircleCheck className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.activeCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Cooling Down</CardTitle>
            <IconClock className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.cooldownCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Usage</CardTitle>
            <IconActivity className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.totalUsage}</div>
          </CardContent>
        </Card>
      </div>

      {/* Table Section */}
      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>
            A list of all API keys configured for this provider.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className='h-[600px] w-full'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name / API Key</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Cooldown</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {localKeys.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className='text-muted-foreground h-24 text-center'
                    >
                      No API keys found.
                    </TableCell>
                  </TableRow>
                ) : (
                  localKeys.map((key) => {
                    const isCooldown =
                      key.cooldown_until &&
                      new Date(key.cooldown_until) > new Date();
                    return (
                      <TableRow key={key.id}>
                        <TableCell className='font-medium'>
                          <div className='flex flex-col gap-1'>
                            <span>{key.provider_name}</span>
                            <ApiKeyCell apiKey={key.api_key} />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={key.enabled ? 'default' : 'secondary'}
                          >
                            {key.enabled ? 'Active' : 'Disabled'}
                          </Badge>
                        </TableCell>
                        <TableCell>{key.usage_count}</TableCell>
                        <TableCell>
                          {isCooldown ? (
                            <Badge
                              variant='outline'
                              className='border-orange-200 bg-orange-50 text-orange-500 dark:border-orange-900 dark:bg-orange-950/20'
                            >
                              Until {formatDate(key.cooldown_until, true)}
                            </Badge>
                          ) : (
                            <span className='text-muted-foreground text-sm'>
                              -
                            </span>
                          )}
                        </TableCell>
                        <TableCell className='text-right'>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant='ghost' className='h-8 w-8 p-0'>
                                <span className='sr-only'>Open menu</span>
                                <MoreHorizontal className='h-4 w-4' />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => startEdit(key)}>
                                <Pencil className='mr-2 h-4 w-4' />
                                Edit Key
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className='text-red-600 focus:bg-red-50 focus:text-red-600'
                                onClick={() => handleDelete(key.id)}
                              >
                                <IconTrash className='mr-2 h-4 w-4' />
                                Delete Key
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      <AlertModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        onConfirm={onConfirmDelete}
        loading={loading}
        title='Are you sure?'
        description='This action cannot be undone. This will permanently delete the API key.'
      />
    </div>
  );
}
