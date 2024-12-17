import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/hooks/use-auth';

interface HeaderProps {
  rightContent?: React.ReactNode;
}

export function Header({ rightContent }: HeaderProps) {
  const { handleLogout } = useAuth();

  return (
    <header className="bg-white/5 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[65px] flex items-center justify-between">
        <div className="flex-1"></div>
        <h1 className="text-xl font-bold text-white absolute left-1/2 -translate-x-1/2">
          Cuenta<span className="text-[#0f172a] text-[1.05em] font-black tracking-tight">T</span>
        </h1>
        <div className="flex-1 flex justify-end items-center space-x-4">
          {rightContent}
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="text-white hover:bg-white/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Salir
          </Button>
        </div>
      </div>
    </header>
  );
}