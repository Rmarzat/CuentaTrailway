import { useState } from 'react';
import { FileText, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function ItemsModule() {
  const [items, setItems] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    amount: '',
    category: ''
  });

  const columns = [
    { accessorKey: 'code', header: 'Código' },
    { accessorKey: 'description', header: 'Descripción' },
    { accessorKey: 'amount', header: 'Monto' },
    { accessorKey: 'category', header: 'Categoría' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setItems(prev => [...prev, { ...formData, id: crypto.randomUUID() }]);
    setFormData({ code: '', description: '', amount: '', category: '' });
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileText className="w-6 h-6 text-white" />
          <h2 className="text-xl font-semibold text-white">
            Asientos por Items
          </h2>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-white/10 hover:bg-white/20">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Item
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#0f172a] border-white/10">
            <DialogHeader>
              <DialogTitle className="text-white">Nuevo Item</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code" className="text-white">Código</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={e => setFormData(prev => ({ ...prev, code: e.target.value }))}
                  className="bg-white/5 border-white/10 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">Descripción</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-white/5 border-white/10 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-white">Monto</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={e => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  className="bg-white/5 border-white/10 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className="text-white">Categoría</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="bg-white/5 border-white/10 text-white"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-white/10 hover:bg-white/20">
                Guardar Item
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-transparent border-white/10">
        <DataTable
          columns={columns}
          data={items}
          className="bg-transparent"
        />
      </Card>
    </div>
  );
}