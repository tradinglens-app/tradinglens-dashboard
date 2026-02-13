import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { RecentUser } from '../services/recent-users.service';

interface RecentRegistrationsProps {
  users: RecentUser[];
}

export function RecentRegistrations({ users }: RecentRegistrationsProps) {
  return (
    <Card className='h-full'>
      <CardHeader>
        <CardTitle>Recent Registrations</CardTitle>
        <CardDescription>Latest users joined the platform.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-8'>
          {users.map((user) => (
            <div key={user.id} className='flex items-center'>
              <Avatar className='h-9 w-9'>
                <AvatarImage src={user.profile_pic || ''} alt={user.name} />
                <AvatarFallback>
                  {user.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className='ml-4 space-y-1'>
                <p className='text-sm leading-none font-medium'>{user.name}</p>
                <p className='text-muted-foreground text-sm'>{user.email}</p>
              </div>
              <div className='ml-auto text-sm font-medium'>
                {new Date(user.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
          {users.length === 0 && (
            <div className='text-muted-foreground text-center text-sm'>
              No recent registrations found.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
