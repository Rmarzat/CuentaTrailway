# CuentaT - Sistema de Gestión Contable

## Descripción
Sistema de gestión contable con módulos para manejo de tipos de cambio, asientos contables y archivo digital.

## Características
- Autenticación de usuarios
- Panel de administración
- Gestión de tipos de cambio
- Importación de datos desde Excel
- Interfaz moderna y responsive

## Tecnologías
- React
- TypeScript
- Tailwind CSS
- Express
- PostgreSQL
- Railway (Backend)
- Netlify (Frontend)

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/tu-usuario/cuenta-t.git
cd cuenta-t
```

2. Instalar dependencias:
```bash
npm install
```

3. Crear archivo .env:
```bash
cp .env.example .env
```

4. Iniciar en desarrollo:
```bash
npm run dev
```

## Estructura del Proyecto
```
cuenta-t/
├── src/
│   ├── components/     # Componentes React
│   ├── lib/           # Utilidades y hooks
│   └── server/        # Backend Express
├── public/            # Archivos estáticos
└── netlify/          # Funciones serverless
```

## Despliegue

### Frontend (Netlify)
1. Conectar repositorio en Netlify
2. Configurar variables de entorno
3. Desplegar con `npm run build`

### Backend (Railway)
1. Conectar repositorio en Railway
2. Configurar variables de entorno
3. Railway detectará automáticamente la configuración

## Licencia
MIT