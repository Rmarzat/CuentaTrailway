import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileSpreadsheet, Upload, Table as TableIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { read, utils } from 'xlsx';

export function DGIModule() {
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const [view, setView] = useState<'upload' | 'table'>('upload');

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const buffer = await file.arrayBuffer();
    const workbook = read(buffer);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = utils.sheet_to_json(worksheet);
    
    if (jsonData.length > 0) {
      const cols = Object.keys(jsonData[0]).map(key => ({
        accessorKey: key,
        header: key
      }));
      setColumns(cols);
      setData(jsonData);
      setView('table');
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileSpreadsheet className="w-6 h-6 text-white" />
          <h2 className="text-xl font-semibold text-white">
            Asientos desde archivo DGI
          </h2>
        </div>
        {data.length > 0 && (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setView('upload')}
              className={view === 'upload' ? 'bg-white/10' : ''}
            >
              <Upload className="w-4 h-4 mr-2" />
              Cargar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setView('table')}
              className={view === 'table' ? 'bg-white/10' : ''}
            >
              <TableIcon className="w-4 h-4 mr-2" />
              Datos
            </Button>
          </div>
        )}
      </div>

      {view === 'upload' ? (
        <Card
          {...getRootProps()}
          className={`
            border-2 border-dashed p-8 text-center cursor-pointer
            transition-colors bg-transparent
            ${isDragActive ? 'border-white/40 bg-white/5' : 'border-white/20'}
          `}
        >
          <input {...getInputProps()} />
          <FileSpreadsheet className="w-12 h-12 mx-auto mb-4 text-white/60" />
          <p className="text-white/80 mb-2">
            {isDragActive
              ? 'Suelta el archivo aquí...'
              : 'Arrastra y suelta un archivo Excel o CSV, o haz clic para seleccionar'}
          </p>
          <p className="text-sm text-white/60">
            Formatos soportados: .xlsx, .xls, .csv
          </p>
        </Card>
      ) : (
        <Card className="bg-transparent border-white/10">
          <DataTable
            columns={columns}
            data={data}
            className="bg-transparent"
          />
        </Card>
      )}
    </div>
  );
}