import { useState } from 'react';
import { useEnterpriseStore } from '@/lib/store/enterprise';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function EnterpriseGrid() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    rut: '',
    logo: ''
  });

  const { enterprises, addEnterprise, selectEnterprise, getUserEnterprises } = useEnterpriseStore();
  const userEnterprises = getUserEnterprises();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const enterprise = addEnterprise(formData.name, formData.rut, formData.logo);
      setFormData({ name: '', rut: '', logo: '' });
      setIsOpen(false);
      selectEnterprise(enterprise.id);
      
      toast({
        title: "Empresa creada",
        description: "La empresa se ha creado correctamente",
        className: "bg-emerald-500/90 text-white border-none"
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'Error al crear la empresa',
        variant: "destructive"
      });
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4.5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "El logo no puede superar los 4.5MB",
          variant: "destructive"
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, logo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Card className="p-4 border-dashed border-2 border-white/20 hover:border-white/40 transition-colors cursor-pointer flex flex-col items-center justify-center text-white/60 hover:text-white/80 h-[120px] bg-transparent">
              <Plus className="w-6 h-6 mb-2" />
              <p className="text-base font-medium">Agregar Empresa</p>
            </Card>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-[#1e293b] border-white/10">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-white">
                Nueva Empresa
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">
                  Nombre de la Empresa
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="bg-white/5 border-white/10 text-white"
                  placeholder="Ingrese el nombre de la empresa"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rut" className="text-white">
                  RUT
                </Label>
                <Input
                  id="rut"
                  value={formData.rut}
                  onChange={(e) => setFormData(prev => ({ ...prev, rut: e.target.value }))}
                  required
                  className="bg-white/5 border-white/10 text-white"
                  placeholder="Ingrese el RUT"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo" className="text-white">
                  Logo
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="bg-white/5 border-white/10 text-white"
                  />
                  {formData.logo && (
                    <img
                      src={formData.logo}
                      alt="Preview"
                      className="w-10 h-10 object-cover rounded"
                    />
                  )}
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-white/20 hover:bg-white/30 text-white"
              >
                Crear Empresa
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {userEnterprises.map((enterprise) => (
          <Card
            key={enterprise.id}
            className="p-4 hover:bg-white/5 transition-colors cursor-pointer bg-transparent border-white/10 h-[120px]"
            onClick={() => selectEnterprise(enterprise.id)}
          >
            <div className="flex items-center space-x-4">
              {enterprise.logo ? (
                <img
                  src={enterprise.logo}
                  alt={enterprise.name}
                  className="w-10 h-10 rounded object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white/60" />
                </div>
              )}
              <div>
                <h3 className="text-base font-medium text-white">
                  {enterprise.name}
                </h3>
                <p className="text-sm text-white/60">
                  RUT: {enterprise.rut}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}