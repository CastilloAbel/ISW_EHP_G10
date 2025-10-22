```markdown
# TP Integrador – Unidad 4: Aseguramiento de Calidad (TDD) – TESTS Node.js

## Evolución del Proyecto: De TDD con Mocks a Tests de Integración

Este documento describe la implementación completa de tests para la User Story "Inscribirme a actividad" en EcoHarmony Park.

**Evolución:**
1. ✅ **Fase 1 - TDD Inicial**: Tests unitarios con datos moqueados (Red-Green-Refactor)
2. ✅ **Fase 2 - Integración Real**: Tests de integración usando el backend real con Express y SQLite

---

## 15) Tests de Integración con Backend Real

Los tests fueron evolucionados para utilizar **integración completa** con el sistema real en lugar de mocks.

### 15.1. package.json (raíz del proyecto)

```json
{
  "name": "ecoharmony-park",
  "version": "1.0.0",
  "description": "Sistema de inscripción para EcoHarmony Park",
  "type": "module",
  "scripts": {
    "test": "node --experimental-vm-modules node_modules/jest/bin/jest.js --watchAll=false",
    "test:watch": "node --experimental-vm-modules node_modules/jest/bin/jest.js --watch",
    "dev:backend": "cd backend && npm run dev",
    "dev:frontend": "cd frontend && npm run dev",
    "install:all": "npm install && cd backend && npm install && cd ../frontend && npm install"
  },
  "devDependencies": {
    "jest": "^29.7.0",
    "supertest": "^6.3.3",
    "@jest/globals": "^29.7.0"
  },
  "dependencies": {
    "sqlite3": "^5.1.7"
  }
}
```

### 15.2. jest.config.js

```javascript
export default {
  testEnvironment: 'node',
  transform: {},
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js'
  ],
  testTimeout: 10000
};
```

**Nota importante**: Se eliminó `extensionsToTreatAsEsm` ya que causa conflictos con módulos ES cuando se usa `type: "module"` en package.json.

### 15.2. jest.config.js

```javascript
export default {
  testEnvironment: 'node',
  transform: {},
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js'
  ],
  testTimeout: 10000
};
```

**Nota importante**: Se eliminó `extensionsToTreatAsEsm` ya que causa conflictos con módulos ES cuando se usa `type: "module"` en package.json.

### 15.3. Estructura del proyecto

```
/ (raíz)
├── package.json
├── jest.config.js
├── TESTS_README.md (documentación detallada)
├── src/
│   └── enrollmentService.js (legacy - lógica con mocks, no se usa en tests actuales)
├── __tests__/
│   └── enrollment.test.js (tests de integración con backend real)
└── backend/
    ├── server.js (Express app - modificado para exportar app)
    ├── app.js (NO EXISTE - todo en server.js)
    ├── config/
    │   ├── database.js
    │   └── EHP_database.db (SQLite)
    ├── controllers/
    │   └── inscripciones.controller.js
    ├── services/
    │   └── inscripciones.service.js
    └── repositories/
        └── inscripciones.repository.js
```

### 15.4. backend/server.js (Modificación para Tests)

El archivo `server.js` fue modificado **únicamente** para exportar la app de Express sin crear archivos intermediarios:

```javascript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import actividadesRoutes from './routes/actividades.routes.js';
import inscripcionesRoutes from './routes/inscripciones.routes.js';
import { sendSuccess } from './utils/response.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/actividades', actividadesRoutes);
app.use('/api/inscripciones', inscripcionesRoutes);

// Health check
app.get('/api/health', (req, res) => {
  sendSuccess(res, { status: 'ok' }, 'EcoHarmony Park API is running');
});

// Solo iniciar el servidor si no estamos en modo test
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🌳 EcoHarmony Park Server running on http://localhost:${PORT}`);
  });
}

// Exportar app para tests
export default app;
```

**Cambios realizados:**
- Se agregó `export default app;` al final
- El `app.listen()` solo se ejecuta si `NODE_ENV !== 'test'`
- **NO se creó ningún archivo nuevo** (todo en server.js)

**Cambios realizados:**
- Se agregó `export default app;` al final
- El `app.listen()` solo se ejecuta si `NODE_ENV !== 'test'`
- **NO se creó ningún archivo nuevo** (todo en server.js)

### 15.5. __tests__/enrollment.test.js (Tests de Integración)

Los tests ahora utilizan **supertest** para hacer peticiones HTTP reales al backend:

```javascript
import request from 'supertest';
import app from '../backend/server.js';
import { queryOne, execute, queryAll } from '../backend/config/database.js';

const ERROR_SIN_CUPO = 'Sin cupo disponible para el horario seleccionado';
const ERROR_HORARIO = 'Horario no disponible';
const ERROR_TYC = 'Debe aceptar términos y condiciones';
const ERROR_TALLE = 'Falta talle de vestimenta';

// Función para generar DNI único (evita conflictos de UNIQUE constraint)
function generarDNI() {
  return `${Date.now()}${Math.floor(Math.random() * 1000)}`;
}

describe('US: Inscribirme a actividad – Tests de Integración', () => {
  let horarioTirolesa;
  let horarioSafari;
  let horarioPalestra;
  let horarioJardineria;

  beforeAll(async () => {
    // Obtener horarios reales de la base de datos con cupos disponibles
    const horariosTirolesa = await queryAll(`
      SELECT h.* FROM Horarios h
      INNER JOIN Actividades a ON h.id_actividad = a.id
      INNER JOIN TiposActividades t ON a.tipo_id = t.id
      WHERE t.codigo = 'TIROLESA' 
        AND (h.cupos_horario - h.inscriptos_horario) > 0
        AND h.fecha_fin > datetime('now')
      LIMIT 1
    `);
    horarioTirolesa = horariosTirolesa[0];

    // Similar para Safari, Palestra, Jardinería...
  });

  test('CP1: Inscripción exitosa con talla (Tirolesa)', async () => {
    if (!horarioTirolesa) {
      console.warn('No hay horarios de Tirolesa disponibles, saltando test');
      return;
    }

    const cuposAntesQuery = await queryOne(
      'SELECT cupos_horario, inscriptos_horario FROM Horarios WHERE id_horario = ?',
      [horarioTirolesa.id_horario]
    );
    const cuposAntes = cuposAntesQuery.cupos_horario - cuposAntesQuery.inscriptos_horario;

    const solicitud = {
      horarioId: horarioTirolesa.id_horario,
      terminosAceptados: true,
      participantes: [
        {
          nombre: 'Camila Test',
          dni: generarDNI(), // DNI único
          edad: 25,
          talla: 'M'
        }
      ]
    };

    // Petición HTTP real a la API
    const response = await request(app)
      .post('/api/inscripciones')
      .send(solicitud)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.codigoReserva).toBeDefined();
    expect(response.body.data.cantidadParticipantes).toBe(1);
    expect(response.body.data.inscripcionIds).toHaveLength(1);

    // Verificar que los cupos disminuyeron en la base de datos
    const cuposDespuesQuery = await queryOne(
      'SELECT cupos_horario, inscriptos_horario FROM Horarios WHERE id_horario = ?',
      [horarioTirolesa.id_horario]
    );
    const cuposDespues = cuposDespuesQuery.cupos_horario - cuposDespuesQuery.inscriptos_horario;
    expect(cuposDespues).toBe(cuposAntes - 1);
  });

  test('CP2: Falla cuando no hay cupos disponibles', async () => {
    // Obtener cupos actuales
    const horarioQuery = await queryOne(
      'SELECT cupos_horario, inscriptos_horario FROM Horarios WHERE id_horario = ?',
      [horarioTirolesa.id_horario]
    );
    const cuposDisponibles = horarioQuery.cupos_horario - horarioQuery.inscriptos_horario;

    // Intentar inscribir más personas de las que hay cupos
    const participantes = [];
    for (let i = 0; i < cuposDisponibles + 1; i++) {
      participantes.push({
        nombre: `Persona ${i}`,
        dni: generarDNI(),
        edad: 25,
        talla: 'M'
      });
    }

    const solicitud = {
      horarioId: horarioTirolesa.id_horario,
      terminosAceptados: true,
      participantes
    };

    const response = await request(app)
      .post('/api/inscripciones')
      .send(solicitud)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toContain(ERROR_SIN_CUPO);
  });

  test('CP3: Inscripción exitosa sin talla cuando no es requerida (Safari)', async () => {
    const solicitud = {
      horarioId: horarioSafari.id_horario,
      terminosAceptados: true,
      participantes: [
        {
          nombre: 'Alex Test',
          dni: generarDNI(),
          edad: 30
          // Sin talla porque Safari no lo requiere
        }
      ]
    };

    const response = await request(app)
      .post('/api/inscripciones')
      .send(solicitud)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.codigoReserva).toBeDefined();
  });

  test('CP4: Falla con horario no disponible o inexistente', async () => {
    const horarioInexistente = 999999;

    const solicitud = {
      horarioId: horarioInexistente,
      terminosAceptados: true,
      participantes: [
        {
          nombre: 'Test User',
          dni: generarDNI(),
          edad: 25,
          talla: 'M'
        }
      ]
    };

    const response = await request(app)
      .post('/api/inscripciones')
      .send(solicitud)
      .expect(404);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toContain(ERROR_HORARIO);
  });

  test('CP5: Falla sin aceptar términos y condiciones', async () => {
    const solicitud = {
      horarioId: horarioTirolesa.id_horario,
      terminosAceptados: false, // No acepta términos
      participantes: [
        {
          nombre: 'Test User',
          dni: generarDNI(),
          edad: 25,
          talla: 'M'
        }
      ]
    };

    const response = await request(app)
      .post('/api/inscripciones')
      .send(solicitud)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toContain(ERROR_TYC);
  });

  test('CP6: Falla cuando falta talle en actividad que lo requiere (Tirolesa)', async () => {
    const solicitud = {
      horarioId: horarioTirolesa.id_horario,
      terminosAceptados: true,
      participantes: [
        {
          nombre: 'Test User',
          dni: generarDNI(),
          edad: 25
          // Falta talla y Tirolesa lo requiere
        }
      ]
    };

    const response = await request(app)
      .post('/api/inscripciones')
      .send(solicitud)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toContain(ERROR_TALLE);
  });

  test('CP Extra: Inscripción exitosa con múltiples participantes', async () => {
    const solicitud = {
      horarioId: horarioSafari.id_horario,
      terminosAceptados: true,
      participantes: [
        { nombre: 'Participante 1', dni: generarDNI(), edad: 28 },
        { nombre: 'Participante 2', dni: generarDNI(), edad: 32 },
        { nombre: 'Participante 3', dni: generarDNI(), edad: 25 }
      ]
    };

    const response = await request(app)
      .post('/api/inscripciones')
      .send(solicitud)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.cantidadParticipantes).toBe(3);
    expect(response.body.data.inscripcionIds).toHaveLength(3);
  });
});
```
});
```

### 15.6. Resultados de Ejecución

Al ejecutar `npm test`, se obtiene:

```
PASS  __tests__/enrollment.test.js
  US: Inscribirme a actividad – Tests de Integración
    ✓ CP1: Inscripción exitosa con talla (Tirolesa) (219 ms)
    ✓ CP2: Falla cuando no hay cupos disponibles (41 ms)
    ✓ CP3: Inscripción exitosa sin talla cuando no es requerida (Safari) (113 ms)
    ✓ CP4: Falla con horario no disponible o inexistente (18 ms)
    ✓ CP5: Falla sin aceptar términos y condiciones (11 ms)
    ✓ CP6: Falla cuando falta talle en actividad que lo requiere (Tirolesa) (13 ms)
    ✓ CP Extra: Inscripción exitosa con múltiples participantes (102 ms)

Test Suites: 1 passed, 1 total
Tests:       7 passed, 7 total
Snapshots:   0 total
Time:        2.108 s
```

---

## 16) Diferencias: TDD con Mocks vs Tests de Integración

### TDD con Mocks (Fase Inicial)
- ✅ **Ventaja**: Rápido, aislado, no necesita infraestructura
- ❌ **Desventaja**: No prueba integración real, puede tener bugs ocultos
- 📝 **Archivo**: `src/enrollmentService.js` (lógica moqueada)

### Tests de Integración (Implementación Final)
- ✅ **Ventaja**: Prueba el sistema completo (Express + SQLite)
- ✅ **Ventaja**: Detecta bugs reales de integración
- ✅ **Ventaja**: Valida transacciones de base de datos
- ❌ **Desventaja**: Más lento, modifica base de datos real
- 📝 **Archivos**: Backend completo + base de datos SQLite

---

## 17) Arquitectura del Sistema Testeado

```
Tests (__tests__/enrollment.test.js)
    ↓ (HTTP Request con supertest)
backend/server.js (Express App)
    ↓
controllers/inscripciones.controller.js
    ↓
services/inscripciones.service.js (Lógica de negocio + Validaciones)
    ↓
repositories/inscripciones.repository.js (Queries SQL)
    ↓
config/database.js (Conexión SQLite)
    ↓
config/EHP_database.db (Base de datos SQLite)
```

---

## 18) Validaciones Implementadas en el Backend

Todas las validaciones están en `backend/services/inscripciones.service.js`:

1. **Términos y Condiciones**: `validateInscripcion()`
   - Error: "Debe aceptar términos y condiciones"

2. **Cupos Disponibles**: `validateCuposDisponibles()`
   - Error: "Sin cupo disponible para el horario seleccionado"

3. **Tallas Requeridas**: `validateTallas()`
   - Error: "Falta talle de vestimenta"
   - Solo aplica para actividades: TIROLESA y PALESTRA

4. **Horario Disponible**: Validación en `crearInscripcion()`
   - Error: "Horario no disponible"

---

## 19) Aspectos Técnicos Importantes

### 19.1. DNI Único
La tabla `Visitantes` tiene constraint `UNIQUE` en DNI. Los tests generan DNIs dinámicos:

```javascript
function generarDNI() {
  return `${Date.now()}${Math.floor(Math.random() * 1000)}`;
}
```

### 19.2. Transacciones
El servicio usa transacciones para garantizar atomicidad:

```javascript
await this.beginTransaction(db);
// ... operaciones ...
await this.commitTransaction(db);
// En caso de error:
await this.rollbackTransaction(db);
```

### 19.3. Actualización de Cupos
Los cupos se actualizan automáticamente en la tabla `Horarios`:

```sql
UPDATE Horarios 
SET inscriptos_horario = inscriptos_horario + ? 
WHERE id_horario = ?
```

### 19.4. Código de Reserva
Se genera automáticamente:

```javascript
generarCodigoReserva(actividad, horarioId, inscripcionId) {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  const actividadCode = actividad.substring(0, 3).toUpperCase();
  return `${actividadCode}-${horarioId}-${inscripcionId}-${random}${timestamp}`;
}
```

Ejemplo: `TIR-1-123-ABC1K2M3N4`

---

## 20) Cómo Ejecutar los Tests

### Instalación de Dependencias
```bash
# En la raíz del proyecto
npm install

# Instalar dependencias del backend (opcional)
cd backend && npm install
```

### Ejecutar Tests
```bash
# Ejecutar todos los tests una vez
npm test

# Ejecutar en modo watch (recarga automática)
npm run test:watch
```

### Verificar Backend
```bash
# Iniciar servidor de desarrollo
npm run dev:backend

# El servidor corre en http://localhost:3000
# Prueba: http://localhost:3000/api/health
```

---

## 21) Mapeo de Casos de Prueba con Tests

| Caso de Prueba | Test Implementado | Estado |
|----------------|-------------------|--------|
| **CP1**: Inscripción exitosa con datos válidos y talla | `CP1: Inscripción exitosa con talla (Tirolesa)` | ✅ PASA |
| **CP2**: Sin cupo disponible | `CP2: Falla cuando no hay cupos disponibles` | ✅ PASA |
| **CP3**: Sin talla cuando no es requerida | `CP3: Inscripción exitosa sin talla cuando no es requerida (Safari)` | ✅ PASA |
| **CP4**: Horario no disponible | `CP4: Falla con horario no disponible o inexistente` | ✅ PASA |
| **CP5**: Sin aceptar términos y condiciones | `CP5: Falla sin aceptar términos y condiciones` | ✅ PASA |
| **CP6**: Falta talle cuando es requerido | `CP6: Falla cuando falta talle en actividad que lo requiere (Tirolesa)` | ✅ PASA |
| **Extra**: Múltiples participantes | `CP Extra: Inscripción exitosa con múltiples participantes` | ✅ PASA |

---

## 22) Conclusiones

### Evolución del Proyecto
1. **Fase TDD Inicial**: Se creó lógica básica con mocks para aprender el ciclo Red-Green-Refactor
2. **Migración a Integración**: Se evolucionó a tests reales contra el backend completo
3. **Resultado Final**: Sistema completamente funcional con tests de integración que validan el flujo completo

### Aprendizajes Clave
- ✅ Los tests de integración detectan bugs que los mocks ocultan
- ✅ La base de datos real valida constraints y transacciones
- ✅ Supertest permite probar APIs REST sin levantar servidor manualmente
- ✅ Es posible hacer TDD incluso con sistemas complejos (Express + SQLite)

### Cobertura Lograda
- **7 tests**, todos pasando
- **Cobertura de casos**: 100% de los casos de prueba definidos en la User Story
- **Validaciones**: Todas las reglas de negocio implementadas y testeadas
- **Integración**: Backend, controladores, servicios, repositorios y base de datos

---

## 23) Documentación Adicional

Para información más detallada sobre la implementación de los tests, consultar:
- `TESTS_README.md` - Guía completa de tests de integración
- `backend/API_DOCUMENTATION.md` - Documentación de endpoints
- `Documento_Estilo_Código.md` - Convenciones de código del proyecto

---

**Fecha de implementación**: Octubre 2025  
**Framework de tests**: Jest 29.7.0  
**Biblioteca HTTP**: Supertest 6.3.3  
**Base de datos**: SQLite 5.1.7  
**Node.js**: v22.20.0