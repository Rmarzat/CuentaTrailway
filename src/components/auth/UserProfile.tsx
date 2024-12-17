import { useAuth } from '@/lib/hooks/use-auth';

export function UserProfile() {
  const { user } = useAuth();

  if (!user) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-medium">
        {getInitials(user.name)}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-sm font-medium text-white/90 truncate">
          {user.name}
        </span>
        <span className="text-xs text-white/50 truncate">
          {user.role === 'admin' ? 'Administrador' : 'Usuario'}
        </span>
      </div>
    </div>
  );
}