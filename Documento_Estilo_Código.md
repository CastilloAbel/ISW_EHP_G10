# Documento de Estilo de Código - EcoHarmony Park

Este documento establece normas y convenciones de buenas prácticas y estilos que deben seguirse para mantener consistencia en el código del proyecto "EcoHarmony Park".

**Stack Tecnológico:**
- **Frontend**: React 18 + TypeScript + Vite + TailwindCSS + HeroUI
- **Backend**: Node.js + Express + SQLite
- **Testing**: Jest + Supertest
- **Estilo**: ESLint + Prettier

---

## Índice

| Sección                                    | Página |
| ------------------------------------------ | ------ |
| 1. Estructura del Proyecto                 | 1      |
| 2. Nomenclatura                            | 2      |
| 3. Formato y Espaciado                     | 3      |
| 4. Comentarios y Documentación             | 4      |
| 5. JavaScript/TypeScript (Backend)         | 5      |
| 6. TypeScript/React (Frontend)             | 6      |
| 7. CSS y TailwindCSS                       | 7      |
| 8. Testing                                 | 8      |
| 9. Git y Control de Versiones             | 9      |
| 10. Arquitectura y Organización            | 10     |

---
---

## 1. Estructura del Proyecto

### 1.1. Organización de Directorios

```
/ISW_EHP_G10
│
├── /frontend/                    # Aplicación React + TypeScript
│   ├── /public/                  # Archivos estáticos
│   ├── /src/
│   │   ├── /assets/              # Imágenes, íconos
│   │   ├── /components/          # Componentes React reutilizables
│   │   │   └── /enrollment/      # Componentes específicos de inscripción
│   │   ├── /config/              # Configuraciones (site.ts)
│   │   ├── /styles/              # Estilos globales CSS
│   │   ├── /types/               # Definiciones TypeScript
│   │   ├── /utils/               # Funciones auxiliares
│   │   ├── App.tsx               # Componente raíz
│   │   ├── main.tsx              # Punto de entrada
│   │   └── provider.tsx          # Providers (HeroUI, Router)
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json             # Configuración TypeScript
│   ├── vite.config.ts            # Configuración Vite
│   ├── tailwind.config.js        # Configuración Tailwind
│   └── eslint.config.mjs         # Configuración ESLint
│
├── /backend/                     # API REST con Express
│   ├── /config/
│   │   ├── database.js           # Conexión SQLite
│   │   └── EHP_database.db       # Base de datos
│   ├── /controllers/             # Controladores de rutas
│   ├── /services/                # Lógica de negocio
│   ├── /repositories/            # Acceso a datos (queries)
│   ├── /routes/                  # Definición de endpoints
│   ├── /utils/                   # Utilidades (response.js)
│   ├── server.js                 # Punto de entrada
│   ├── package.json
│   └── API_DOCUMENTATION.md      # Documentación de API
│
├── /__tests__/                   # Tests de integración
│   └── enrollment.test.js
│
├── /src/                         # Código legacy (TDD inicial)
│   └── enrollmentService.js
│
├── package.json                  # Configuración raíz
├── jest.config.js                # Configuración Jest
├── .gitignore
├── README.md
├── Documento_Estilo_Código.md    # Este documento
├── TESTS_README.md               # Documentación de tests
└── Tp_U4_Entrega_Final_*.md      # Documentación del TP
```

### 1.2. Reglas de Organización

✅ **HACER:**
- Agrupar archivos relacionados en carpetas específicas
- Separar lógica de presentación (controllers vs services)
- Un archivo por componente/clase/servicio
- Usar nombres de archivo descriptivos en kebab-case o PascalCase según el tipo

❌ **EVITAR:**
- Archivos con múltiples responsabilidades
- Mezclar código de frontend y backend
- Duplicación de código entre módulos
- Carpetas con más de 10 archivos sin subcarpetas

---

---

## 2. Nomenclatura

### 2.1. Convenciones Generales

| Tipo                          | Convención   | Ejemplo                          |
| ----------------------------- | ------------ | -------------------------------- |
| **Variables y Funciones**     | camelCase    | `cantidadParticipantes`, `crearInscripcion()` |
| **Constantes**                | UPPER_SNAKE  | `ERROR_SIN_CUPO`, `API_URL`      |
| **Clases y Componentes React**| PascalCase   | `InscripcionesService`, `EnrollmentForm` |
| **Interfaces TypeScript**     | PascalCase   | `Participante`, `FormData`       |
| **Archivos Componentes**      | PascalCase   | `EnrollmentForm.tsx`             |
| **Archivos Servicios/Utils**  | camelCase    | `inscripciones.service.js`       |
| **Carpetas**                  | kebab-case   | `enrollment/`, `tipos-actividades/` |
| **Rutas API**                 | kebab-case   | `/api/inscripciones`             |
| **Variables de BD**           | snake_case   | `id_horario`, `cupos_disponibles`|

### 2.2. Nombres Descriptivos

✅ **BUENOS EJEMPLOS:**
```javascript
// Backend
const cantidadParticipantes = participantes.length;
async function crearInscripcion(data) { }
class InscripcionesService { }

// Frontend
const [horarios, setHorarios] = useState<Horario[]>([]);
function formatDateTime(dateString: string) { }
interface TipoActividad { }
```

❌ **MALOS EJEMPLOS:**
```javascript
const n = participantes.length;           // Muy corto
const p = data.participantes;             // No descriptivo
function crear(d) { }                     // Ambiguo
class IS { }                              // Abreviación confusa
```

### 2.3. Prefijos y Sufijos

**Backend (JavaScript):**
- Controllers: `*Controller` → `inscripcionesController`
- Services: `*Service` → `InscripcionesService`
- Repositories: `*Repository` → `actividadesRepository`
- Utilities: Descriptivo → `response.js`, `database.js`

**Frontend (TypeScript/React):**
- Componentes: Sustantivo → `EnrollmentForm`, `SuccessModal`
- Hooks: `use*` → `useState`, `useEffect`
- Handlers: `handle*` → `handleSuccess`, `handleCloseModal`
- Funciones auxiliares: Verbo → `formatDateTime`, `getActivityAvatar`

**Tests:**
- Archivos: `*.test.js` → `enrollment.test.js`
- Describes: Descriptivo → `'US: Inscribirme a actividad'`
- Tests: `CP*` → `'CP1: Inscripción exitosa con talla'`

---

---

## 3. Formato y Espaciado

### 3.1. Indentación

- **Tamaño**: 2 espacios (NO tabs)
- **Configuración**: Definida en `.editorconfig` y ESLint
- **Aplicar en**: Todos los archivos (.js, .ts, .tsx, .json, .md)

```javascript
// ✅ Correcto
function crearInscripcion(data) {
  const { horarioId, participantes } = data;
  
  if (!participantes) {
    return null;
  }
  
  return resultado;
}

// ❌ Incorrecto (4 espacios o tabs)
function crearInscripcion(data) {
    const { horarioId, participantes } = data;
    
    if (!participantes) {
        return null;
    }
}
```

### 3.2. Longitud de Línea

- **Máximo recomendado**: 100 caracteres
- **Máximo absoluto**: 120 caracteres
- **Romper líneas largas** en parámetros, imports, o cadenas

```javascript
// ✅ Bien
import { 
  queryAll, 
  queryOne, 
  execute 
} from '../config/database.js';

// ✅ Bien
const mensaje = 
  'Este es un mensaje muy largo que debe ser dividido ' +
  'para mantener la legibilidad del código';

// ❌ Evitar
import { queryAll, queryOne, execute, getDatabase, beginTransaction, commitTransaction } from '../config/database.js';
```

### 3.3. Espacios en Blanco

**Entre bloques de código:**
```javascript
// ✅ Correcto
const data = req.body;

const result = await service.crear(data);

return sendSuccess(res, result);

// ❌ Sin espaciado
const data = req.body;
const result = await service.crear(data);
return sendSuccess(res, result);
```

**En expresiones:**
```javascript
// ✅ Correcto
if (condition) {
  doSomething();
}

const sum = a + b;
const array = [1, 2, 3];
const obj = { key: 'value' };

// ❌ Incorrecto
if(condition){
  doSomething();
}

const sum=a+b;
const array=[1,2,3];
const obj={key:'value'};
```

### 3.4. Punto y Coma

**Backend (JavaScript):**
- ✅ **USAR** punto y coma al final de cada declaración
- Configurado en ESLint como obligatorio

```javascript
// ✅ Correcto
const app = express();
const PORT = 3000;
export default app;

// ❌ Incorrecto
const app = express()
const PORT = 3000
export default app
```

**Frontend (TypeScript):**
- ✅ **USAR** punto y coma (consistencia con backend)
- Configurado en ESLint/Prettier

### 3.5. Comillas

**Backend:** Comillas simples (`'`)
```javascript
const mensaje = 'Inscripción realizada con éxito';
import express from 'express';
```

**Frontend:** Comillas dobles (`"`) - Estándar TypeScript/React
```typescript
const mensaje = "Inscripción realizada con éxito";
import { useState } from "react";
```

**Template literals:** Cuando se necesita interpolación
```javascript
const codigo = `${actividadCode}-${horarioId}-${inscripcionId}`;
console.log(`Usuario: ${nombre}, Edad: ${edad}`);
```

### 3.6. Llaves

**Siempre usar llaves**, incluso en bloques de una línea:

```javascript
// ✅ Correcto
if (condition) {
  doSomething();
}

// ❌ Evitar
if (condition) doSomething();
```

**Estilo K&R (llave en misma línea):**
```javascript
// ✅ Correcto
function example() {
  if (condition) {
    return true;
  }
}

// ❌ Evitar (Allman style)
function example() 
{
  if (condition) 
  {
    return true;
  }
}
```

---

---

## 4. Comentarios y Documentación

### 4.1. Comentarios de Bloque (JSDoc)

**Obligatorio para:**
- Funciones públicas/exportadas
- Clases y métodos
- Funciones de API

```javascript
/**
 * Crea una nueva inscripción para uno o más participantes
 * @param {Object} data - Datos de la inscripción
 * @param {number} data.horarioId - ID del horario seleccionado
 * @param {Array<Object>} data.participantes - Lista de participantes
 * @param {boolean} data.terminosAceptados - Si acepta términos
 * @returns {Promise<Object>} Código de reserva e IDs de inscripciones
 * @throws {Error} Si no hay cupos o datos inválidos
 */
async function crearInscripcion(data) {
  // Implementación
}
```

**TypeScript (TSDoc):**
```typescript
/**
 * Formatea una fecha a string legible
 * @param dateString - Fecha en formato ISO
 * @returns Fecha formateada en español
 */
export const formatDateTime = (dateString: string): string => {
  // Implementación
};
```

### 4.2. Comentarios de Línea

**Usar para:**
- Explicar lógica compleja
- Documentar decisiones de diseño
- Marcar TODOs o FIXMEs

```javascript
// Validar que hay cupos disponibles
const cuposDisponibles = horario.cupos_horario - horario.inscriptos_horario;

// TODO: Implementar límite de inscripciones por usuario
// FIXME: Validar formato de DNI argentino

// Transacción necesaria para garantizar atomicidad
await this.beginTransaction(db);
```

### 4.3. Comentarios en Componentes React

```tsx
// Componente principal de inscripción
function EnrollmentForm({ onSuccess }: EnrollmentFormProps) {
  // Estado para controlar modal de términos
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  
  // Efecto para cargar tipos de actividades al montar
  useEffect(() => {
    fetchTiposActividades();
  }, []);
  
  // Handler para éxito de inscripción
  const handleSuccess = (code: string) => {
    setReservationCode(code);
    setShowSuccess(true);
  };
}
```

### 4.4. Comentarios de Sección

```javascript
// ==========================================
// Validaciones
// ==========================================

validateInscripcion(data);
validateCuposDisponibles(horario, cantidad);
validateTallas(horario, participantes);

// ==========================================
// Transacción de Base de Datos
// ==========================================

await beginTransaction(db);
// ...
await commitTransaction(db);
```

### 4.5. Qué NO Comentar

❌ **NO comentar código obvio:**
```javascript
// ❌ Mal
// Incrementar i en 1
i++;

// Obtener el nombre
const nombre = user.nombre;

// ✅ Bien (sin comentario innecesario)
i++;
const nombre = user.nombre;
```

❌ **NO dejar código comentado:**
```javascript
// ❌ Mal - eliminar código muerto
// const oldFunction = () => {
//   return 'deprecated';
// };

// ✅ Bien - usar git para historial
// (código eliminado completamente)
```

### 4.6. Comentarios en Archivos

**Encabezado de archivo (opcional pero recomendado):**
```javascript
/**
 * Servicio para la lógica de negocio de Inscripciones
 * 
 * Maneja validaciones, transacciones y creación de inscripciones
 * para actividades del parque EcoHarmony.
 * 
 * @module services/inscripciones
 */

class InscripcionesService {
  // ...
}
```

---

---

## 5. JavaScript/TypeScript (Backend)

### 5.1. Módulos ES6

✅ **USAR:**
```javascript
// Imports
import express from 'express';
import { queryOne, queryAll } from '../config/database.js';

// Exports
export default class InscripcionesService { }
export const sendSuccess = (res, data) => { };
```

❌ **NO USAR** CommonJS:
```javascript
// ❌ Evitar
const express = require('express');
module.exports = InscripcionesService;
```

**Nota:** Siempre incluir extensión `.js` en imports relativos.

### 5.2. Variables

**Orden de preferencia:**
1. `const` - Para valores que no cambian
2. `let` - Para valores que cambian
3. ❌ **NUNCA** `var`

```javascript
// ✅ Correcto
const API_URL = 'http://localhost:3000';
const participantes = data.participantes;

let contador = 0;
contador++;

// ❌ Incorrecto
var nombre = 'Juan';  // NO usar var
```

### 5.3. Funciones

**Preferir arrow functions para callbacks:**
```javascript
// ✅ Bien
const numeros = [1, 2, 3];
const dobles = numeros.map(n => n * 2);

// ✅ Bien para métodos de clase
class InscripcionesService {
  async crearInscripcion(data) {
    // Usar function tradicional en métodos
  }
}

// ✅ Bien para funciones auxiliares
export const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};
```

### 5.4. Async/Await

**Preferir async/await sobre Promises:**
```javascript
// ✅ Correcto
async function crearInscripcion(data) {
  try {
    const result = await service.crear(data);
    return result;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// ❌ Evitar (except when needed)
function crearInscripcion(data) {
  return service.crear(data)
    .then(result => result)
    .catch(error => console.error(error));
}
```

### 5.5. Destructuring

**Usar destructuring cuando sea apropiado:**
```javascript
// ✅ Correcto
const { horarioId, participantes, terminosAceptados } = data;
const [first, second, ...rest] = array;

// En parámetros
function crearInscripcion({ horarioId, participantes }) {
  // ...
}

// ❌ Evitar cuando no mejora legibilidad
const h = data.horarioId;
const p = data.participantes;
```

### 5.6. Template Literals

**Para concatenación de strings:**
```javascript
// ✅ Correcto
const codigo = `${actividadCode}-${horarioId}-${inscripcionId}`;
console.log(`🌳 Server running on http://localhost:${PORT}`);

// ❌ Evitar
const codigo = actividadCode + '-' + horarioId + '-' + inscripcionId;
```

### 5.7. Manejo de Errores

**Throw objects con status y message:**
```javascript
// ✅ Correcto
if (!terminosAceptados) {
  throw { status: 400, message: 'Debe aceptar términos y condiciones' };
}

if (!horario) {
  throw { status: 404, message: 'Horario no disponible' };
}

// En controllers
try {
  const result = await service.crearInscripcion(req.body);
  return sendSuccess(res, result, 'Éxito', 201);
} catch (error) {
  console.error('Error:', error);
  const statusCode = error.status || 500;
  const message = error.message || 'Error en el servidor';
  return sendError(res, message, statusCode);
}
```

### 5.8. Comparaciones

```javascript
// ✅ Usar === y !== (estricto)
if (value === null) { }
if (array.length !== 0) { }

// ❌ Evitar == y != (coerción)
if (value == null) { }  // Puede causar bugs
```

### 5.9. Clases

```javascript
/**
 * Clase para manejar inscripciones
 */
class InscripcionesService {
  /**
   * Constructor (si es necesario)
   */
  constructor() {
    // Inicialización
  }

  /**
   * Método público
   */
  async crearInscripcion(data) {
    // Lógica
  }

  /**
   * Método privado (convención con _)
   */
  _validateData(data) {
    // Validación interna
  }
}

// Exportar instancia única (Singleton)
export default new InscripcionesService();
```

### 5.10. Imports Organizados

```javascript
// 1. Externos (third-party)
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// 2. Internos del proyecto
import actividadesRoutes from './routes/actividades.routes.js';
import inscripcionesRoutes from './routes/inscripciones.routes.js';

// 3. Utilidades
import { sendSuccess, sendError } from './utils/response.js';
```

---

---

## 8. Testing

### 8.1. Estructura de Tests

**Ubicación:**
- Tests de integración: `__tests__/`
- Nombre: `*.test.js`

**Estructura con Jest:**
```javascript
import request from 'supertest';
import app from '../backend/server.js';
import { queryOne, queryAll } from '../backend/config/database.js';

describe('US: Inscribirme a actividad – Tests de Integración', () => {
  let horarioTirolesa;

  // Setup antes de todos los tests
  beforeAll(async () => {
    horarioTirolesa = await obtenerHorarioDisponible('TIROLESA');
  });

  // Test individual
  test('CP1: Inscripción exitosa con talla (Tirolesa)', async () => {
    const solicitud = {
      horarioId: horarioTirolesa.id_horario,
      terminosAceptados: true,
      participantes: [
        { nombre: 'Test', dni: generarDNI(), edad: 25, talla: 'M' }
      ]
    };

    const response = await request(app)
      .post('/api/inscripciones')
      .send(solicitud)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.codigoReserva).toBeDefined();
  });
});
```

### 8.2. Nombres Descriptivos

```javascript
// ✅ Correcto - Describe el escenario
test('CP1: Inscripción exitosa con talla (Tirolesa)', async () => {});
test('CP2: Falla cuando no hay cupos disponibles', async () => {});
test('CP5: Falla sin aceptar términos y condiciones', async () => {});

// ❌ Evitar nombres vagos
test('test 1', () => {});
test('funciona', () => {});
```

### 8.3. Assertions

```javascript
// ✅ Específicas y claras
expect(response.body.success).toBe(true);
expect(response.body.data.cantidadParticipantes).toBe(3);
expect(response.body.error).toContain('Sin cupo disponible');

// ✅ Verificar cambios en BD
const cuposDespues = await queryOne('SELECT cupos_horario FROM Horarios WHERE id = ?', [id]);
expect(cuposDespues).toBe(cuposAntes - 1);
```

### 8.4. Datos de Test

```javascript
// ✅ Generar datos únicos
function generarDNI() {
  return `${Date.now()}${Math.floor(Math.random() * 1000)}`;
}

// ✅ Usar datos realistas
const participante = {
  nombre: 'Camila Test',
  dni: generarDNI(),
  edad: 25,
  talla: 'M'
};

// ❌ Evitar datos hardcoded que causan conflictos
const participante = {
  dni: '12345678'  // Puede fallar si existe
};
```

### 8.5. Tests de Integración vs Unitarios

**Integración (actual):**
```javascript
// ✅ Prueba el flujo completo
test('CP1: Inscripción exitosa', async () => {
  const response = await request(app)
    .post('/api/inscripciones')
    .send(solicitud)
    .expect(201);
  
  // Verifica BD real
  const inscripcion = await queryOne('SELECT * FROM Inscripciones WHERE id = ?', [id]);
  expect(inscripcion).toBeDefined();
});
```

**Unitarios (legacy en /src):**
```javascript
// Tests aislados con mocks
function inscribir(solicitud, catalog) {
  // Lógica moqueada
}
```

### 8.6. Manejo de Errores en Tests

```javascript
// ✅ Testear errores esperados
test('CP2: Falla cuando no hay cupos', async () => {
  const response = await request(app)
    .post('/api/inscripciones')
    .send(solicitudSinCupos)
    .expect(400);  // Espera error 400

  expect(response.body.success).toBe(false);
  expect(response.body.error).toContain('Sin cupo disponible');
});

// ✅ Verificar que NO se modificó la BD
const cuposDespues = await queryOne('SELECT * FROM Horarios WHERE id = ?', [id]);
expect(cuposDespues.cupos_horario).toBe(cuposAntes);
```

### 8.7. Configuración Jest

```javascript
// jest.config.js
export default {
  testEnvironment: 'node',
  transform: {},
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testMatch: ['**/__tests__/**/*.test.js'],
  testTimeout: 10000,  // Tiempo suficiente para BD
};
```

---

---

## 7. CSS y TailwindCSS

### 7.1. TailwindCSS - Uso Principal

**Preferir Tailwind sobre CSS custom:**
```tsx
// ✅ Correcto - Usar clases de Tailwind
<div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
  <div className="max-w-4xl mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold text-green-800">
      Título
    </h1>
  </div>
</div>

// ❌ Evitar CSS inline
<div style={{ minHeight: '100vh', background: 'linear-gradient...' }}>
```

### 7.2. Clases Condicionales

```tsx
// ✅ Usando template literals
<Button
  className={`px-6 py-2 rounded ${
    isActive ? "bg-green-600" : "bg-gray-400"
  }`}
>
  Enviar
</Button>

// ✅ Con arrays y join
<div className={[
  "flex items-center",
  isLarge && "text-lg",
  hasError && "border-red-500"
].filter(Boolean).join(" ")}>
```

### 7.3. Organización de Clases

**Orden lógico:**
1. Layout (flex, grid, display)
2. Posicionamiento (relative, absolute)
3. Tamaño (w-, h-, max-w-)
4. Espaciado (p-, m-, gap-)
5. Tipografía (text-, font-)
6. Colores (bg-, text-, border-)
7. Efectos (shadow-, opacity-)
8. Animaciones (transition-, animate-)

```tsx
// ✅ Bien organizado
<Card className="
  flex flex-col
  relative
  w-full max-w-md
  p-6 gap-4
  text-center
  bg-white
  shadow-lg rounded-xl
  transition-all hover:shadow-2xl
">
```

### 7.4. Responsive Design

```tsx
// ✅ Mobile-first approach
<div className="
  w-full          /* Mobile */
  md:w-1/2        /* Tablet */
  lg:w-1/3        /* Desktop */
  xl:w-1/4        /* Large screens */
">
```

**Breakpoints en Tailwind:**
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### 7.5. CSS Global (globals.css)

**Solo para:**
- Variables CSS
- Resets globales
- Estilos base de HTML
- Directivas de Tailwind

```css
/* ✅ globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-primary: #10b981;
  --color-secondary: #059669;
}

body {
  @apply bg-gray-50 text-gray-900;
}

/* Estilos de componentes reutilizables */
@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700;
  }
}
```

### 7.6. Configuración Tailwind

```javascript
// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Extensiones personalizadas
      colors: {
        primary: '#10b981',
      }
    },
  },
  darkMode: "class",
  plugins: [heroui()],
}
```

### 7.7. Evitar CSS Modules

❌ **NO usar CSS Modules en este proyecto:**
```tsx
// ❌ Evitar
import styles from './Component.module.css';

<div className={styles.container}>
```

✅ **Usar Tailwind o globals.css:**
```tsx
// ✅ Preferir
<div className="container mx-auto px-4">
```

---

---

## 6. TypeScript/React (Frontend)

### 6.1. TypeScript - Tipos

**Definir interfaces para objetos de datos:**
```typescript
// ✅ Correcto
export interface Participante {
  nombre: string;
  dni: string;
  edad: string;
  talla?: string;  // Opcional
}

export interface FormData {
  tipoActividad: string;
  actividad: string;
  horarioId: string;
  cantidadPersonas: number;
  participantes: Participante[];
  terminosAceptados: boolean;
}

// Uso
const [formData, setFormData] = useState<FormData>({
  tipoActividad: "",
  actividad: "",
  // ...
});
```

**Type vs Interface:**
```typescript
// ✅ Interface para objetos
export interface TipoActividad {
  id: number;
  codigo: string;
  nombre: string;
}

// ✅ Type para unions, aliases
export type Status = "pending" | "success" | "error";
export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};
```

**Evitar `any`:**
```typescript
// ❌ Malo
const data: any = fetchData();

// ✅ Bien
const data: TipoActividad[] = await fetchData();

// ✅ Si realmente no sabes el tipo
const data: unknown = fetchData();
```

### 6.2. Componentes React

**Componentes Funcionales SIEMPRE:**
```tsx
// ✅ Correcto
interface EnrollmentFormProps {
  onSuccess: (code: string) => void;
}

function EnrollmentForm({ onSuccess }: EnrollmentFormProps) {
  const [loading, setLoading] = useState(false);
  
  return (
    <div>
      {/* JSX */}
    </div>
  );
}

export default EnrollmentForm;
```

**Arrow function components (para pequeños componentes):**
```tsx
// ✅ Bien para componentes simples
export const ParticipantCard = ({ 
  participante, 
  index, 
  onChange 
}: ParticipantCardProps) => (
  <Card>
    {/* JSX */}
  </Card>
);
```

❌ **NO usar Class Components:**
```tsx
// ❌ Evitar
class EnrollmentForm extends React.Component {
  // NO usar
}
```

### 6.3. Hooks

**useState:**
```typescript
// ✅ Con tipo explícito
const [horarios, setHorarios] = useState<Horario[]>([]);
const [loading, setLoading] = useState<boolean>(false);
const [error, setError] = useState<string>("");

// ✅ Con inferencia
const [count, setCount] = useState(0);  // number inferido
const [name, setName] = useState("");   // string inferido
```

**useEffect:**
```typescript
// ✅ Con dependencias
useEffect(() => {
  fetchTiposActividades();
}, []);  // Solo al montar

useEffect(() => {
  if (formData.tipoActividad) {
    fetchActividadesByTipo(formData.tipoActividad);
  }
}, [formData.tipoActividad]);  // Cuando cambia

// ❌ Sin array de dependencias (ejecuta en cada render)
useEffect(() => {
  fetchData();
});  // PELIGROSO
```

**Custom Hooks:**
```typescript
// ✅ Nombrar con 'use' prefix
function useFormValidation(formData: FormData) {
  const [errors, setErrors] = useState<string[]>([]);
  
  // Lógica
  
  return { errors, validate };
}
```

### 6.4. Props y Event Handlers

```tsx
// ✅ Definir tipos de props
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  variant?: "primary" | "secondary";
}

// ✅ Handlers con 'handle' prefix
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  // Lógica
};

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
};

// ✅ Pasar funciones sin invocar
<Button onClick={handleSubmit} />

// ❌ No hacer
<Button onClick={handleSubmit()} />  // Se ejecuta inmediatamente
```

### 6.5. Conditional Rendering

```tsx
// ✅ Operador ternario para if/else
{loading ? (
  <Spinner />
) : (
  <Content />
)}

// ✅ && para mostrar/ocultar
{error && (
  <Alert>{error}</Alert>
)}

// ✅ Múltiples condiciones
{status === "loading" && <Spinner />}
{status === "error" && <ErrorMessage />}
{status === "success" && <SuccessContent />}

// ❌ Evitar lógica compleja en JSX
{/* Mover a función helper */}
```

### 6.6. Lists y Keys

```tsx
// ✅ Usar key única
{participantes.map((p, index) => (
  <ParticipantCard 
    key={index}  // OK si no hay ID único
    participante={p}
    index={index}
  />
))}

// ✅ Mejor con ID único
{horarios.map((horario) => (
  <HorarioCard 
    key={horario.id_horario}  // Preferible
    horario={horario}
  />
))}
```

### 6.7. Imports en React

```tsx
// 1. React y hooks
import { useState, useEffect } from "react";

// 2. Librerías externas
import { motion } from "framer-motion";
import { Button, Card } from "@heroui/react";
import { AlertCircle, CheckCircle2 } from "lucide-react";

// 3. Types locales
import type { Participante, FormData } from "../types";

// 4. Componentes locales
import TermsModal from "./TermsModal";
import { ActivitySelector } from "./enrollment/ActivitySelector";

// 5. Utilidades y configuración
import { formatDateTime } from "../utils/activityHelpers";
```

### 6.8. Actualizaciones de Estado

```tsx
// ✅ Actualizar objetos inmutablemente
setFormData(prev => ({
  ...prev,
  horarioId: newHorarioId
}));

// ✅ Actualizar arrays
setParticipantes(prev => [
  ...prev,
  { nombre: "", dni: "", edad: "", talla: "" }
]);

// ✅ Filtrar array
setParticipantes(prev => 
  prev.filter((_, idx) => idx !== indexToRemove)
);

// ❌ NO mutar directamente
formData.horarioId = newHorarioId;  // MAL
participantes.push(newParticipante);  // MAL
```

---

## 9. Git y Control de Versiones

### 9.1. Commits

**Mensajes descriptivos en español:**
```bash
# ✅ Buenos mensajes
git commit -m "Agregar validación de tallas en inscripciones"
git commit -m "Corregir error de cupos en horarios"
git commit -m "Implementar tests de integración con backend"

# ❌ Malos mensajes
git commit -m "fix"
git commit -m "cambios"
git commit -m "asdf"
```

**Formato recomendado:**
```
[Tipo] Descripción breve

Detalles adicionales si es necesario
```

**Tipos:**
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `refactor`: Refactorización
- `test`: Agregar/modificar tests
- `docs`: Documentación
- `style`: Formato de código
- `chore`: Tareas de mantenimiento

### 9.2. Branches

**Nombrar con prefijos:**
```bash
# Funcionalidades
feature/inscripcion-multiple
feature/modal-confirmacion

# Correcciones
fix/validacion-dni
fix/cupos-negativos

# Experimentales
experiment/nueva-arquitectura
```

### 9.3. .gitignore

**Incluir:**
```
# Dependencies
node_modules/
package-lock.json

# Build
dist/
build/
.next/

# Environment
.env
.env.local

# IDE
.vscode/
.idea/
*.swp

# OS
.DS_Store
Thumbs.db

# Database (dependiendo del proyecto)
*.db
```

---

## 10. Arquitectura y Organización

### 10.1. Patrón de Arquitectura

**Backend: Layered Architecture (Capas)**

```
Request → Controller → Service → Repository → Database
```

**Responsabilidades:**

1. **Controllers** (`/controllers`)
   - Recibir peticiones HTTP
   - Validar entrada básica
   - Llamar a servicios
   - Devolver respuestas estandarizadas

```javascript
// ✅ Controller - Solo orquestación
async crearInscripcion(req, res) {
  try {
    const result = await inscripcionService.crearInscripcion(req.body);
    return sendSuccess(res, result, 'Éxito', 201);
  } catch (error) {
    return sendError(res, error.message, error.status || 500);
  }
}
```

2. **Services** (`/services`)
   - Lógica de negocio
   - Validaciones complejas
   - Transacciones
   - Coordinación entre repositorios

```javascript
// ✅ Service - Lógica de negocio
async crearInscripcion(data) {
  this.validateInscripcion(data);
  const horario = await actividadRepository.findHorarioById(data.horarioId);
  this.validateCuposDisponibles(horario, data.participantes.length);
  // Transacción...
}
```

3. **Repositories** (`/repositories`)
   - Queries a base de datos
   - CRUD operations
   - NO lógica de negocio

```javascript
// ✅ Repository - Solo acceso a datos
async create(db, inscripcion) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO Inscripciones (id_visitante, id_horario, ...) VALUES (?, ?, ...)`,
      [inscripcion.id_visitante, inscripcion.id_horario, ...],
      function(err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID });
      }
    );
  });
}
```

4. **Routes** (`/routes`)
   - Definir endpoints
   - Vincular con controllers

```javascript
// ✅ Routes - Solo definición de rutas
const router = express.Router();
router.post('/', inscripcionController.crearInscripcion.bind(inscripcionController));
router.get('/:codigo', inscripcionController.getByCodigoReserva.bind(inscripcionController));
export default router;
```

### 10.2. Frontend: Component-Based

**Organización:**
```
/components
├── EnrollmentForm.tsx        # Componente principal
├── SuccessModal.tsx          # Modales
├── TermsModal.tsx
└── /enrollment               # Subcomponentes específicos
    ├── ActivitySelector.tsx
    └── ParticipantCard.tsx
```

**Principios:**
- **Single Responsibility**: Un componente = una responsabilidad
- **Composición**: Componentes pequeños que se combinan
- **Reusabilidad**: Diseñar para reutilizar
- **Props Down, Events Up**: Datos bajan, eventos suben

### 10.3. Principios SOLID

**S - Single Responsibility:**
```javascript
// ✅ Cada clase tiene una responsabilidad
class InscripcionesService {
  // Solo lógica de inscripciones
}

class VisitantesService {
  // Solo lógica de visitantes
}
```

**D - Dependency Inversion:**
```javascript
// ✅ Depender de abstracciones
class InscripcionesService {
  constructor() {
    // Inyectar dependencias si es necesario
  }
}
```

### 10.4. DRY (Don't Repeat Yourself)

```javascript
// ❌ Repetición
function formatFecha1(fecha) {
  return new Date(fecha).toLocaleDateString();
}

function formatFecha2(fecha) {
  return new Date(fecha).toLocaleDateString();
}

// ✅ Reutilización
export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-AR');
};
```

---

## 11. Resumen de Reglas Críticas

### ✅ SIEMPRE:

1. **Usar módulos ES6** (`import`/`export`)
2. **Preferir `const` sobre `let`**, nunca `var`
3. **Usar TypeScript en frontend** con tipos definidos
4. **Componentes funcionales** en React, nunca clases
5. **async/await** para código asíncrono
6. **Destructuring** cuando mejore legibilidad
7. **Template literals** para strings con interpolación
8. **Comentarios JSDoc** en funciones públicas
9. **Nombres descriptivos** en español
10. **Tests** para cada funcionalidad

### ❌ NUNCA:

1. **NO usar `var`**
2. **NO usar `any` en TypeScript** (usar `unknown` si es necesario)
3. **NO Class Components** en React
4. **NO comentar código**, eliminarlo
5. **NO dejar `console.log` en producción**
6. **NO hardcodear valores**, usar constantes
7. **NO mutar estado** directamente en React
8. **NO hacer commits** sin mensaje descriptivo
9. **NO duplicar código**, aplicar DRY
10. **NO mezclar lógica de negocio** en controllers

---

## 12. Herramientas y Linters

### ESLint (Frontend)
```bash
npm run lint       # Ver errores
npm run lint:fix   # Corregir automáticamente
```

### Prettier (Ambos)
```bash
npm run format     # Formatear código
```

### Jest (Tests)
```bash
npm test           # Ejecutar tests
npm run test:watch # Modo watch
```

---

## 13. Referencias

- **React Docs**: https://react.dev
- **TypeScript**: https://www.typescriptlang.org
- **TailwindCSS**: https://tailwindcss.com
- **Express**: https://expressjs.com
- **Jest**: https://jestjs.io
- **ESLint**: https://eslint.org

---

**Versión**: 2.0  
**Última actualización**: Octubre 2025  
**Proyecto**: EcoHarmony Park  
**Repositorio**: ISW_EHP_G10

---
