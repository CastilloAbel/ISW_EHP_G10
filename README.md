# 🌳 EcoHarmony Park - Sistema de Inscripción

Aplicación web responsive para la gestión de inscripciones a actividades del parque de atracciones EcoHarmony Park.

## 📋 Descripción del Proyecto

Sistema desarrollado con arquitectura cliente-servidor que permite a los visitantes inscribirse a diferentes actividades del parque (Tirolesa, Safari, Palestra, Jardinería) cumpliendo con criterios de validación específicos.

### User Story Implementada

**Como** visitante  
**Quiero** inscribirme a una actividad  
**Para** reservar mi lugar en la misma

## 🏗️ Arquitectura

- **Frontend**: Vite.js + React
- **Backend**: Node.js + Express
- **Base de Datos**: SQLite
- **Testing**: Jest (TDD)

## 📁 Estructura del Proyecto

```
/EHP
├── backend/              # Servidor Express
│   ├── config/          # Configuración de BD
│   ├── routes/          # Rutas API
│   ├── controllers/     # Controladores
│   ├── services/        # Servicios
│   ├── repositories/    # Repositorios
│   ├── utils/           # Funciones auxiliares
│   ├── server.js        # Punto de entrada
│   ├── EHP_database.db  # Base de datos SQLite
│   └── package.json
├── frontend/            # Aplicación React
│   ├── src/
│   │   ├── assets/      # Imagenes que se usan
│   │   ├── components/  # Componentes React
│   │   ├── config/      # Componentes React
│   │   ├── styles/      # Componentes React
│   │   ├── types/       # Componentes React
│   │   ├── utils/       # Componentes React
│   │   ├── App.tsx
│   │   └── main.tsx
│   │   └── provider.tsx
│   └── package.json
├── src/                 # Lógica de negocio TDD
│   └── enrollmentService.js
├── __tests__/           # Tests Jest
│   └── enrollment.test.js
└── package.json         # Scripts raíz
```

## 🚀 Instalación

### Requisitos Previos

- Node.js v22.20.0 o superior
- npm v10.9.3 o superior

### Pasos de Instalación

1. **Clonar el repositorio** (si aplica)
   ```bash
   git clone <url-repositorio>
   cd EHP
   ```

2. **Instalar todas las dependencias**
   ```bash
   npm run install:all
   ```
   
   O instalar manualmente:
   ```bash
   # Dependencias raíz (Jest)
   npm install

   # Backend
   cd backend
   npm install
   cd ..

   # Frontend
   cd frontend
   npm install
   cd ..
   ```

## 🧪 Testing (TDD)

El proyecto sigue el enfoque **Test-Driven Development (TDD)**.

### Ejecutar Tests

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm run test:watch
```

### Casos de Prueba Implementados

- ✅ **CP1**: Inscripción exitosa con datos válidos
- ✅ **CP2**: Rechazo por falta de cupos
- ✅ **CP3**: Inscripción sin talle (cuando no es requerido)
- ✅ **CP4**: Rechazo por horario no disponible
- ✅ **CP5**: Rechazo por no aceptar términos y condiciones
- ✅ **CP6**: Rechazo por falta de talle (cuando es requerido)

## 🏃‍♂️ Ejecución

### Modo Desarrollo

Necesitas **dos terminales**:

**Terminal 1 - Backend:**
```bash
npm run dev:backend
```
El servidor estará en: http://localhost:3000

**Terminal 2 - Frontend:**
```bash
npm run dev:frontend
```
La aplicación estará en: http://localhost:5173

### Verificar Estado del Backend

```bash
curl http://localhost:3000/api/health
```

## 🎯 Funcionalidades

### Criterios de Aceptación Implementados

- ✅ Selección de actividad del catálogo (Tirolesa, Safari, Palestra, Jardinería)
- ✅ Verificación de cupos disponibles por horario
- ✅ Selección de horario dentro de los disponibles
- ✅ Indicación de cantidad de participantes
- ✅ Captura de datos de visitante: nombre, DNI, edad, talla (condicional)
- ✅ Validación de talla según tipo de actividad
- ✅ Aceptación obligatoria de términos y condiciones

### Actividades que Requieren Talla

- **Tirolesa**: Requiere talla de vestimenta
- **Palestra**: Requiere talla de vestimenta
- **Safari**: No requiere talla
- **Jardinería**: No requiere talla

## 🗄️ Esquema de Base de Datos

### Tabla: Actividades
```sql
CREATE TABLE "Actividades" (
	"id"	INTEGER,
	"tipo_id"	INTEGER NOT NULL,
	"nombre"	VARCHAR(255) NOT NULL,
	"descripcion"	TEXT,
	"requiere_talla"	TINYINT(1) DEFAULT 0,
	"cupos"	INTEGER NOT NULL CHECK("cupos" > 0),
	PRIMARY KEY("id" AUTOINCREMENT),
	CONSTRAINT "fk_actividades_tipo" FOREIGN KEY("tipo_id") REFERENCES "TiposActividades"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
```

### Tabla: Visitantes
```sql
CREATE TABLE "Visitantes" (
	"id"	INTEGER,
	"nombre"	VARCHAR(255) NOT NULL,
	"dni"	INTEGER NOT NULL UNIQUE,
	"edad"	INTEGER NOT NULL CHECK("edad" > 0),
	"talla_vestimenta"	VARCHAR(10),
	PRIMARY KEY("id" AUTOINCREMENT)
);
```

### Tabla: Inscripciones
```sql
CREATE TABLE "Inscripciones" (
	"id_inscripcion"	INTEGER,
	"id_visitante"	INTEGER NOT NULL,
	"id_horario"	INTEGER NOT NULL,
	"terminos_condicion"	TINYINT(1) NOT NULL DEFAULT 0,
	"cantidad_personas"	INTEGER NOT NULL DEFAULT 1 CHECK("cantidad_personas" > 0),
	"fecha_inscripcion"	DATETIME DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY("id_inscripcion" AUTOINCREMENT),
	UNIQUE("id_visitante","id_horario"),
	CONSTRAINT "fk_insc_horario" FOREIGN KEY("id_horario") REFERENCES "Horarios"("id_horario") ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT "fk_insc_visitante" FOREIGN KEY("id_visitante") REFERENCES "Visitantes"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
```

### Tabla: TiposActividades
```sql
CREATE TABLE "TiposActividades" (
	"id"	INTEGER,
	"codigo"	VARCHAR(50) NOT NULL UNIQUE,
	"nombre"	VARCHAR(100) NOT NULL UNIQUE,
	"descripcion"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);
```

**Tipos predefinidos en el sistema:**

| ID | Código | Nombre | Descripción |
|----|---------|---------|-------------|
| 1 | TIROLESA | Tirolesa | Actividades de tirolesa y canopy, usualmente requieren equipo y talla. |
| 2 | SAFARI | Safari | Recorridos guiados para observación de fauna y fotografía. |
| 3 | PALESTRA | Palestra | Actividades de escalada y muro de desafío; puede requerir equipo/talla. |
| 4 | JARDINERIA | Jardinería | Talleres y actividades de jardinería y educación ambiental. |


### Tabla: Horarios
```sql
CREATE TABLE "Horarios" (
	"id_horario"	INTEGER,
	"id_actividad"	INTEGER NOT NULL,
	"fecha_inicio"	DATETIME NOT NULL,
	"fecha_fin"	DATETIME NOT NULL,
	"cuidador_nombre"	VARCHAR(255),
	"cupos_horario"	INTEGER NOT NULL CHECK("cupos_horario" > 0),
	"inscriptos_horario"	INTEGER DEFAULT 0 CHECK("inscriptos_horario" >= 0),
	PRIMARY KEY("id_horario" AUTOINCREMENT),
	CONSTRAINT "fk_horarios_actividad" FOREIGN KEY("id_actividad") REFERENCES "Actividades"("id") ON DELETE CASCADE ON UPDATE CASCADE,
	CHECK("fecha_fin" > "fecha_inicio")
);
```
## 🔌 API Endpoints

### Tipos de Actividades

- `GET /api/actividades/tipos` - Obtener todos los tipos de actividades

**Ejemplo de Response:**
```json
{
  "ok": true,
  "data": [
    {
      "id": 1,
      "codigo": "TIROLESA",
      "nombre": "Tirolesa",
      "descripcion": "Actividades de tirolesa y canopy, usualmente requieren equipo y talla."
    },
    {
      "id": 2,
      "codigo": "SAFARI",
      "nombre": "Safari",
      "descripcion": "Recorridos guiados para observación de fauna y fotografía."
    },
    {
      "id": 3,
      "codigo": "PALESTRA",
      "nombre": "Palestra",
      "descripcion": "Actividades de escalada y muro de desafío; puede requerir equipo/talla."
    },
    {
      "id": 4,
      "codigo": "JARDINERIA",
      "nombre": "Jardinería",
      "descripcion": "Talleres y actividades de jardinería y educación ambiental."
    }
  ],
  "mensaje": "Tipos de actividades obtenidos exitosamente"
}
```

### Actividades

- `GET /api/actividades` - Listar todas las actividades
- `GET /api/actividades?tipoId={id}` - Listar actividades filtradas por tipo (solo actividades no finalizadas)
- `GET /api/actividades/:id/horarios` - Obtener horarios disponibles de una actividad específica
- `GET /api/actividades/tipos/:tipoId/horarios` - Obtener horarios disponibles por tipo de actividad (solo horarios no finalizados)
- `GET /api/actividades/horarios/:id` - Obtener detalle de un horario específico

**Ejemplo de Request (filtrar por tipo):**
```
GET /api/actividades?tipoId=1
```

**Ejemplo de Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Tirolesa Express",
      "descripcion": "Recorrido rápido por las alturas",
      "requiere_talla": 1,
      "cupos": 50,
      "tipo_id": 1,
      "tipo_nombre": "Tirolesa",
      "tipo_codigo": "TIROLESA"
    }
  ],
  "mensaje": "Actividades obtenidas exitosamente"
}
```

### Inscripciones

- `POST /api/inscripciones` - Crear nueva inscripción

**Ejemplo de Request:**
```json
{
  "actividad": "TIROLESA",
  "horarioId": "1",
  "participantes": [
    {
      "nombre": "Juan Pérez",
      "dni": "12345678",
      "edad": 25,
      "talla": "M"
    }
  ],
  "terminosAceptados": true
}
```

**Ejemplo de Response:**
```json
{
  "success": true,
  "data": {
    "codigoReserva": "TIR-1-147-XNOXMH5DM3IH",
    "inscripcionIds": [
      147
    ],
    "cantidadParticipantes": 1
  },
  "message": "Inscripción realizada con éxito",
  "error": null
}
```

## 📱 Responsive Design

La aplicación está optimizada para:
- 💻 Desktop (> 768px)
- 📱 Tablet (768px - 480px)
- 📱 Mobile (< 480px)

## 📝 Estilo de Código

El proyecto sigue las convenciones definidas en `Documento_Estilo_Código.md`:

- **camelCase** para variables y funciones
- **PascalCase** para componentes React
- Uso de `const` por sobre `let`
- Arrow functions cuando sea posible
- Componentes funcionales con Hooks
- Diseño responsive con Flexbox

## 👥 Equipo de Desarrollo

Proyecto desarrollado para la materia Ingeniería de Software

## 📄 Licencia

Este proyecto es parte de un trabajo práctico académico.

---

Desarrollado con 💚 para EcoHarmony Park
