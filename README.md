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
│   ├── server.js        # Punto de entrada
│   └── package.json
├── frontend/            # Aplicación React
│   ├── src/
│   │   ├── components/  # Componentes React
│   │   ├── App.jsx
│   │   └── App.css
│   └── package.json
├── src/                 # Lógica de negocio TDD
│   └── enrollmentService.js
├── __tests__/           # Tests Jest
│   └── enrollment.test.js
├── EHP_database.db      # Base de datos SQLite
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
CREATE TABLE Actividades (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre VARCHAR(255),
  cupos INTEGER,
  requiere_talla TINYINT(1),
  fecha_inicio DATETIME,
  fecha_fin DATETIME,
  inscriptos INTEGER
)
```

### Tabla: Visitantes
```sql
CREATE TABLE Visitantes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre VARCHAR(255),
  dni INTEGER,
  edad INTEGER,
  talla_vestimenta VARCHAR(255)
)
```

### Tabla: Inscripcion
```sql
CREATE TABLE Inscripcion (
  id_inscripcion INTEGER PRIMARY KEY AUTOINCREMENT,
  id_visitante INTEGER,
  id_actividad INTEGER,
  terminos_condicion TINYINT(1),
  fecha_inscripcion DATETIME
)
```

## 🔌 API Endpoints

### Actividades

- `GET /api/actividades` - Listar todas las actividades
- `GET /api/actividades/:nombre/horarios` - Obtener horarios disponibles
- `GET /api/actividades/:nombre/horarios/:id` - Obtener detalle de horario

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
  "ok": true,
  "codigoReserva": "TIR-1-123-ABC1234",
  "inscripcionIds": [1],
  "mensaje": "Inscripción realizada con éxito"
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

## 🎨 Paleta de Colores

```css
--primary-color: #2d6a4f    /* Verde principal */
--primary-dark: #1b4332     /* Verde oscuro */
--primary-light: #40916c    /* Verde claro */
--secondary-color: #52b788  /* Verde secundario */
--accent-color: #95d5b2     /* Acento */
```

## 👥 Equipo de Desarrollo

Proyecto desarrollado para la materia Ingeniería de Software

## 📄 Licencia

Este proyecto es parte de un trabajo práctico académico.

---

Desarrollado con 💚 para EcoHarmony Park
