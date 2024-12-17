import { useState } from 'react';
import { Database, Upload, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/ui/data-table';
import { useDropzone } from 'react-dropzone';

export function DigitalModule() {
  const [files, setFiles] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    { accessorKey: 'name', header: 'Nombre' },
    { accessorKey: 'type', header: 'Tipo' },
    { accessorKey: 'size', header: 'Tamaño' },
    { accessorKey: 'uploadedAt', header: 'Fecha' }
  ];

  const onDrop = (acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      id: crypto.randomUUID(),
      name: file.name,
      type: file.type,
      size: `${(file.size / 1024).toFixed(2)} KB`,
      uploadedAt: new Date().toLocaleDateString()
    }));
    setFiles(prev => [...prev, ...newFiles]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    }
  });

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Database className="w-6 h-6 text-white" />
          <h2 className="text-xl font-semibold text-white">
            Archivo Digital
          </h2>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card
          {...getRootProps()}
          className={`
            border-2 border-dashed p-8 text-center cursor-pointer
            transition-colors bg-transparent
            ${isDragActive ? 'border-white/40 bg-white/5' : 'border-white/20'}
          `}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 mx-auto mb-4 text-white/60" />
          <p className="text-white/80 mb-2">
            {isDragActive
              ? 'Suelta los archivos aquí...'
              : 'Arrastra y suelta archivos, o haz clic para seleccionar'}
          </p>
          <p className="text-sm text-white/60">
            PDF, Imágenes, Excel, CSV
          </p>
        </Card>

        <Card className="p-6 bg-transparent border-white/10">
          <h3 className="text-lg font-medium text-white mb-4">
            Búsqueda Rápida
          </h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
            <Input
              type="text"
              placeholder="Buscar archivos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white"
            />
          </div>
        </Card>
      </div>

      <Card className="bg-transparent border-white/10">
        <DataTable
          columns={columns}
          data={filteredFiles}
          className="bg-transparent"
        />
      </Card>
    </div>
  );
}