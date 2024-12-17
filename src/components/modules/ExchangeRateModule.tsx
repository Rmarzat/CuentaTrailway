import { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { DollarSign, Upload, RefreshCw, Download, Calendar, Trash2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { writeFile, utils } from 'xlsx';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useExchangeRates } from '@/lib/hooks/use-exchange-rates';
import { exchangeRatesApi } from '@/lib/api/exchange-rates';
import { useAuthStore } from '@/lib/store/auth';
import { processExcelFile } from '@/lib/utils/excel';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function ExchangeRateModule() {
  const [rates, setRates] = useState<any[]>([]);
  const [filteredRates, setFilteredRates] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const user = useAuthStore(state => state.user);
  const isAdmin = user?.role === 'admin';
  const { toast } = useToast();
  const { loadRates, uploadRates, clearRates } = useExchangeRates();

  const fetchAndSetRates = useCallback(async () => {
    try {
      const fetchedRates = await loadRates();
      setRates(fetchedRates);
      filterRatesByMonth(fetchedRates, currentMonth);
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'Error al cargar los tipos de cambio',
        variant: "destructive"
      });
      setRates([]);
      setFilteredRates([]);
    }
  }, [loadRates, currentMonth, toast]);

  useEffect(() => {
    fetchAndSetRates();
  }, [fetchAndSetRates]);

  useEffect(() => {
    if (dateFrom || dateTo) {
      filterRatesByDateRange();
    } else {
      filterRatesByMonth(rates, currentMonth);
    }
  }, [dateFrom, dateTo, rates, currentMonth]);

  const filterRatesByMonth = (allRates: any[], month: Date) => {
    const start = startOfMonth(month);
    const end = endOfMonth(month);
    
    const filtered = allRates.filter(rate => {
      const rateDate = new Date(rate.date);
      return isWithinInterval(rateDate, { start, end });
    });
    
    setFilteredRates(filtered);
  };

  const filterRatesByDateRange = () => {
    let filtered = [...rates];

    if (dateFrom) {
      filtered = filtered.filter(rate => 
        new Date(rate.date) >= dateFrom
      );
    }

    if (dateTo) {
      filtered = filtered.filter(rate => 
        new Date(rate.date) <= dateTo
      );
    }

    setFilteredRates(filtered);
  };

  const clearFilters = () => {
    setDateFrom(undefined);
    setDateTo(undefined);
    filterRatesByMonth(rates, currentMonth);
  };

  const handlePreviousMonth = () => {
    const newMonth = subMonths(currentMonth, 1);
    setCurrentMonth(newMonth);
    filterRatesByMonth(rates, newMonth);
  };

  const handleNextMonth = () => {
    const newMonth = new Date(currentMonth.setMonth(currentMonth.getMonth() + 1));
    setCurrentMonth(newMonth);
    filterRatesByMonth(rates, newMonth);
  };

  const handleExportExcel = () => {
    const exportData = filteredRates.map(rate => ({
      'Moneda': rate.currency,
      'Fecha': format(new Date(rate.date), 'dd/MM/yyyy'),
      'TipoCambio': rate.rate
    }));

    const ws = utils.json_to_sheet(exportData);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Tipos de Cambio');

    let filename = 'Tipos de cambio';
    if (dateFrom) filename += ` desde ${format(dateFrom, 'dd/MM/yyyy')}`;
    if (dateTo) filename += ` hasta ${format(dateTo, 'dd/MM/yyyy')}`;
    filename += '.xlsx';

    writeFile(wb, filename);
  };

  const handleClearRates = async () => {
    try {
      await clearRates();
      toast({
        title: "Éxito",
        description: "Todos los tipos de cambio han sido eliminados",
        className: "bg-emerald-500/90 text-white border-none"
      });
      setRates([]);
      setFilteredRates([]);
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'Error al limpiar tipos de cambio',
        variant: "destructive"
      });
    }
  };

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (!file.name.match(/\.(xlsx|xls|csv)$/i)) {
      toast({
        title: "Error",
        description: "Formato de archivo no válido. Use Excel (.xlsx, .xls) o CSV",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);

    try {
      const processedData = await processExcelFile(file);
      if (!processedData || processedData.length === 0) {
        throw new Error('No se encontraron datos válidos en el archivo');
      }

      const result = await uploadRates(processedData, 'excel_import');
      
      toast({
        title: "Éxito",
        description: result.message || `Se importaron ${processedData.length} registros correctamente`,
        className: "bg-emerald-500/90 text-white border-none"
      });

      await fetchAndSetRates();
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'Error al procesar el archivo',
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    },
    disabled: isUploading,
    multiple: false
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <DollarSign className="w-6 h-6 text-white" />
          <h2 className="text-xl font-semibold text-white">
            Tipos de Cambio
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={fetchAndSetRates}
            variant="outline"
            size="sm"
            className="text-white hover:bg-white/10"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </Button>
          <Button
            onClick={handleExportExcel}
            variant="outline"
            size="sm"
            className="text-white hover:bg-white/10"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar Excel
          </Button>
          {isAdmin && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-300 hover:bg-red-500/10 hover:text-red-200"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Limpiar Tabla
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-[#1e293b] border-white/10">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-white">¿Estás seguro?</AlertDialogTitle>
                  <AlertDialogDescription className="text-white/70">
                    Esta acción eliminará todos los tipos de cambio almacenados. 
                    Esta acción no se puede deshacer.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-white/10 text-white hover:bg-white/20">
                    Cancelar
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleClearRates}
                    className="bg-red-500/20 text-red-300 hover:bg-red-500/30"
                  >
                    Eliminar Todo
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      {isAdmin && (
        <Card
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed p-8 text-center cursor-pointer transition-colors bg-transparent",
            isDragActive ? "border-white/40 bg-white/5" : "border-white/20",
            isUploading && "opacity-50 cursor-not-allowed"
          )}
        >
          <input {...getInputProps()} />
          {isUploading ? (
            <RefreshCw className="w-12 h-12 mx-auto mb-4 text-white/60 animate-spin" />
          ) : (
            <Upload className="w-12 h-12 mx-auto mb-4 text-white/60" />
          )}
          <p className="text-white/80 mb-2">
            {isDragActive
              ? 'Suelta el archivo aquí...'
              : isUploading
              ? 'Procesando archivo...'
              : 'Arrastra y suelta un archivo Excel o CSV, o haz clic para seleccionar'}
          </p>
          <div className="text-sm text-white/60 space-y-1">
            <p>El archivo debe tener las siguientes columnas en orden:</p>
            <ul className="list-disc list-inside">
              <li>Columna A "Moneda": Formato general (U$S)</li>
              <li>Columna B "Fecha": Formato fecha (DD/MM/YYYY)</li>
              <li>Columna C "TipoCambio": Formato número (#.###,000)</li>
            </ul>
          </div>
        </Card>
      )}

      <Card className="bg-transparent border-white/10">
        <div className="p-2 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePreviousMonth}
                className="h-7 w-7 p-0 text-white/60 hover:text-white hover:bg-white/5"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium text-white">
                {format(currentMonth, 'MMMM yyyy')}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNextMonth}
                className="h-7 w-7 p-0 text-white/60 hover:text-white hover:bg-white/5"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "h-7 w-[100px] justify-start text-left font-normal bg-white/5 border-white/10 text-white text-xs",
                      !dateFrom && "text-white/60"
                    )}
                  >
                    <Calendar className="w-3 h-3 mr-2" />
                    {dateFrom ? format(dateFrom, "dd/MM/yyyy") : "Desde"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={dateFrom}
                    onSelect={setDateFrom}
                    initialFocus
                    className="rounded-md border border-white/10 bg-[#1e293b]"
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "h-7 w-[100px] justify-start text-left font-normal bg-white/5 border-white/10 text-white text-xs",
                      !dateTo && "text-white/60"
                    )}
                  >
                    <Calendar className="w-3 h-3 mr-2" />
                    {dateTo ? format(dateTo, "dd/MM/yyyy") : "Hasta"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={dateTo}
                    onSelect={setDateTo}
                    initialFocus
                    className="rounded-md border border-white/10 bg-[#1e293b]"
                  />
                </PopoverContent>
              </Popover>

              {(dateFrom || dateTo) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-7 w-7 p-0 text-white/60 hover:text-white hover:bg-white/5"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-white/5">
                <TableHead className="text-white text-xs font-medium w-24">Moneda</TableHead>
                <TableHead className="text-white text-xs font-medium w-32">Fecha</TableHead>
                <TableHead className="text-white text-xs font-medium text-right w-32">Tipo de Cambio</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRates.length === 0 ? (
                <TableRow className="border-white/10">
                  <TableCell colSpan={3} className="text-center text-white/70 text-sm py-4">
                    No hay tipos de cambio registrados
                  </TableCell>
                </TableRow>
              ) : (
                filteredRates.map((rate) => (
                  <TableRow key={rate.id} className="border-white/10 hover:bg-white/5">
                    <TableCell className="text-white text-xs py-2">{rate.currency}</TableCell>
                    <TableCell className="text-white text-xs py-2">
                      {format(new Date(rate.date), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell className="text-white text-xs text-right py-2 tabular-nums">
                      {rate.rate.toLocaleString('es-UY', { 
                        minimumFractionDigits: 3,
                        maximumFractionDigits: 3
                      })}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}