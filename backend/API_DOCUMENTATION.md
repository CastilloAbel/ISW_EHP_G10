# API EcoHarmony Park - Documentación de Endpoints

## Cambios Realizados

Se ha actualizado la estructura de base de datos para separar las entidades en tablas distintas:
- **TiposActividades**: Tipos fijos de actividades (Tirolesa, Safari, Palestra, Jardinería)
- **Actividades**: Actividades específicas asociadas a un tipo
- **Horarios**: Horarios disponibles para cada actividad
- **Visitantes**: Información de los visitantes
- **Inscripciones**: Registro de inscripciones de visitantes a horarios

## Endpoints Disponibles

### Tipos de Actividades

#### GET `/api/actividades/tipos`
Obtiene todos los tipos de actividades disponibles.

**Respuesta:**
```json
{
  "success": true,
  "message": "Tipos de actividades obtenidos exitosamente",
  "data": [
    {
      "id": 1,
      "codigo": "TIROLESA",
      "nombre": "Tirolesa",
      "descripcion": "Actividades de tirolesa y canopy..."
    },
    ...
  ]
}
```

---

### Actividades

#### GET `/api/actividades`
Obtiene todas las actividades disponibles. Opcionalmente puede filtrar por tipo.

**Query Parameters:**
- `tipoId` (opcional): ID del tipo de actividad para filtrar

**Ejemplos:**
- `/api/actividades` - Obtiene todas las actividades
- `/api/actividades?tipoId=1` - Obtiene solo actividades de tirolesa

**Respuesta:**
```json
{
  "success": true,
  "message": "Actividades obtenidas exitosamente",
  "data": [
    {
      "id": 1,
      "nombre": "Tirolesa Extrema",
      "descripcion": "Recorrido de tirolesa de alta velocidad...",
      "requiere_talla": 1,
      "cupos": 20,
      "tipo_id": 1,
      "tipo_nombre": "Tirolesa",
      "tipo_codigo": "TIROLESA"
    },
    ...
  ]
}
```

---

#### GET `/api/actividades/:id/horarios`
Obtiene los horarios disponibles (no finalizados y con cupos) para una actividad específica.

**Parámetros:**
- `id`: ID de la actividad

**Respuesta:**
```json
{
  "success": true,
  "message": "Horarios obtenidos exitosamente",
  "data": [
    {
      "id_horario": 1,
      "fecha_inicio": "2025-10-25 09:00:00",
      "fecha_fin": "2025-10-25 11:00:00",
      "cuidador_nombre": "Carlos Mendoza",
      "cupos_horario": 20,
      "inscriptos_horario": 0,
      "cupos_disponibles": 20,
      "actividad_nombre": "Tirolesa Extrema",
      "requiere_talla": 1
    },
    ...
  ]
}
```

---

### Horarios

#### GET `/api/actividades/horarios/:id`
Obtiene información detallada de un horario específico.

**Parámetros:**
- `id`: ID del horario

**Respuesta:**
```json
{
  "success": true,
  "message": "Horario obtenido exitosamente",
  "data": {
    "id_horario": 1,
    "id_actividad": 1,
    "fecha_inicio": "2025-10-25 09:00:00",
    "fecha_fin": "2025-10-25 11:00:00",
    "cuidador_nombre": "Carlos Mendoza",
    "cupos_horario": 20,
    "inscriptos_horario": 5,
    "cupos_disponibles": 15,
    "actividad_nombre": "Tirolesa Extrema",
    "actividad_descripcion": "Recorrido de tirolesa...",
    "requiere_talla": 1,
    "actividad_cupos": 20,
    "tipo_nombre": "Tirolesa"
  }
}
```

---

#### GET `/api/actividades/tipos/:tipoId/horarios`
Obtiene todos los horarios disponibles (no finalizados y con cupos) de actividades de un tipo específico.

**Parámetros:**
- `tipoId`: ID del tipo de actividad

**Ejemplo:**
- `/api/actividades/tipos/1/horarios` - Obtiene todos los horarios de tirolesa

**Respuesta:**
```json
{
  "success": true,
  "message": "Horarios por tipo obtenidos exitosamente",
  "data": [
    {
      "id_horario": 1,
      "fecha_inicio": "2025-10-25 09:00:00",
      "fecha_fin": "2025-10-25 11:00:00",
      "cuidador_nombre": "Carlos Mendoza",
      "cupos_horario": 20,
      "inscriptos_horario": 0,
      "cupos_disponibles": 20,
      "actividad_id": 1,
      "actividad_nombre": "Tirolesa Extrema",
      "actividad_descripcion": "Recorrido de tirolesa...",
      "requiere_talla": 1,
      "tipo_nombre": "Tirolesa",
      "tipo_codigo": "TIROLESA"
    },
    ...
  ]
}
```

---

### Inscripciones

#### POST `/api/inscripciones`
Crea una nueva inscripción para uno o más participantes en un horario.

**Body:**
```json
{
  "horarioId": 1,
  "terminosAceptados": true,
  "participantes": [
    {
      "nombre": "Juan Pérez",
      "dni": "12345678",
      "edad": 30,
      "talla": "M",
      "email": "juan@email.com",
      "telefono": "555-1234"
    },
    ...
  ]
}
```

**Validaciones:**
- Si la actividad requiere talla, todos los participantes deben incluir la talla
- Debe haber cupos disponibles suficientes
- Los términos deben estar aceptados
- Debe incluir al menos un participante

**Respuesta:**
```json
{
  "success": true,
  "message": "Inscripción realizada con éxito",
  "data": {
    "codigoReserva": "TIR-1-123-ABC123",
    "inscripcionIds": [1, 2],
    "cantidadParticipantes": 2
  }
}
```

---

#### GET `/api/inscripciones/:codigoReserva`
Obtiene información de una inscripción por su código de reserva.

**Parámetros:**
- `codigoReserva`: Código único de la reserva

**Respuesta:**
```json
{
  "success": true,
  "message": "Consulte con este código en recepción",
  "data": {
    "codigoReserva": "TIR-1-123-ABC123"
  }
}
```

---

## Inicializar Base de Datos

Para crear las tablas y datos de ejemplo, ejecuta el script SQL:

```bash
sqlite3 EHP_database.db < database_init.sql
```

O desde Node.js puedes usar el archivo `database_init.sql` que contiene toda la estructura.

---

## Notas Importantes

1. **Fechas**: Los endpoints de horarios solo devuelven aquellos que aún no han finalizado (fecha_fin > fecha_actual)
2. **Cupos**: Solo se muestran horarios con cupos disponibles (cupos_horario - inscriptos_horario > 0)
3. **Tallas**: Las actividades de tipo Tirolesa y Palestra requieren talla obligatoriamente
4. **Transacciones**: Las inscripciones utilizan transacciones para garantizar consistencia
5. **Códigos de Reserva**: Se generan automáticamente al crear una inscripción

