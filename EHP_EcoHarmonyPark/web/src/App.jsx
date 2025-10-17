import React, { useEffect, useMemo, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { FaLeaf, FaCheckCircle, FaExclamationTriangle, FaPlus, FaMinus } from 'react-icons/fa'

const schema = z.object({
  activityId: z.string().min(1, 'Elegí una actividad'),
  slotId: z.string().min(1, 'Elegí un horario'),
  termsAccepted: z.boolean().refine(v => v, { message: 'Debes aceptar TyC' }),
  participants: z.array(z.object({
    name: z.string().min(1, 'Nombre requerido'),
    dni: z.string().min(1, 'DNI requerido'),
    age: z.coerce.number().int().min(0, 'Edad inválida'),
    size: z.string().optional()
  })).min(1, 'Agregá al menos una persona')
})

export default function App() {
  const [activities, setActivities] = useState([])
  const [slots, setSlots] = useState([])
  const [serverResult, setServerResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  const { register, handleSubmit, control, watch, setValue, formState: { errors, isSubmitting }, reset } =
    useForm({ resolver: zodResolver(schema), defaultValues: {
      activityId: '', slotId: '', termsAccepted: false,
      participants: [{ name:'', dni:'', age:'', size:'' }]
    }})

  const { fields, append, remove } = useFieldArray({ control, name:'participants' })

  const activityId = watch('activityId')
  const slotId = watch('slotId')

  const selectedActivity = useMemo(
    () => activities.find(a => String(a.id) === String(activityId)),
    [activities, activityId]
  )
  const requiresSize = !!selectedActivity?.requiresSize

  useEffect(() => { fetch('/api/activities').then(r=>r.json()).then(setActivities) }, [])

  useEffect(() => {
    setValue('slotId','')
    if (!activityId) { setSlots([]); return }
    fetch(`/api/activities/${activityId}/slots`).then(r=>r.json()).then(setSlots)
  }, [activityId, setValue])

  useEffect(() => {
    if (!requiresSize) fields.forEach((_, i) => setValue(`participants.${i}.size`, ''))
  }, [requiresSize, fields, setValue])

  const onSubmit = async (form) => {
    setApiError(''); setServerResult(null); setLoading(true)
    try {
      if (requiresSize && form.participants.some(p => !p.size)) {
        setLoading(false); return setApiError('La actividad seleccionada requiere talle para todos los participantes.')
      }
      const payload = {
        activityId: Number(form.activityId),
        slotId: form.slotId,
        participants: form.participants.map(p => ({
          name: p.name, dni: p.dni, age: Number(p.age), size: p.size || undefined
        })),
        termsAccepted: form.termsAccepted
      }
      const r = await fetch('/api/enroll', {
        method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload)
      })
      const data = await r.json()
      setServerResult(data)

      // Refetch slots para ver cupos actualizados
      if (form.activityId) {
        const newSlots = await fetch(`/api/activities/${form.activityId}/slots`).then(x=>x.json())
        setSlots(newSlots)
      }

      if (data.ok) {
        reset({
          activityId: form.activityId,
          slotId: form.slotId,
          termsAccepted: false,
          participants: [{ name:'', dni:'', age:'', size:'' }]
        })
      }
    } catch {
      setApiError('Error de red o servidor. Probá nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container">
      <header className="header">
        <div className="brand">
          <FaLeaf className="leaf" aria-hidden />
          <h1>EcoHarmonyPark — Inscribirme a actividad</h1>
        </div>
      </header>

      <form className="card" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid">
          <label>
            Actividad
            <select {...register('activityId')}>
              <option value="">Elegí actividad</option>
              {activities.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
            {errors.activityId && <span className="err">{errors.activityId.message}</span>}
          </label>

          <label>
            Horario
            <select {...register('slotId')} disabled={!activityId}>
              <option value="">Elegí horario</option>
              {slots.map(s =>
                <option key={s.id} value={s.id} disabled={!s.enabled}>
                  {s.id} {s.enabled ? `(cupos ${s.remaining})` : '(no disponible)'}
                </option>
              )}
            </select>
            {errors.slotId && <span className="err">{errors.slotId.message}</span>}
          </label>
        </div>

        <div className="participantsHeader">
          <div>Participantes ({fields.length})</div>
          <div className="actions">
            <button type="button" className="iconBtn" onClick={() => append({ name:'', dni:'', age:'', size:'' })}>
              <FaPlus /> Agregar
            </button>
            {fields.length > 1 && (
              <button type="button" className="iconBtn" onClick={() => remove(fields.length - 1)}>
                <FaMinus /> Quitar
              </button>
            )}
          </div>
        </div>

        {fields.map((f, idx) => (
          <fieldset key={f.id} className="fieldset">
            <legend>Participante #{idx + 1}</legend>
            <div className="grid">
              <label>
                Nombre
                <input type="text" {...register(`participants.${idx}.name`)} />
                {errors.participants?.[idx]?.name && <span className="err">{errors.participants[idx].name.message}</span>}
              </label>
              <label>
                DNI
                <input type="text" {...register(`participants.${idx}.dni`)} />
                {errors.participants?.[idx]?.dni && <span className="err">{errors.participants[idx].dni.message}</span>}
              </label>
              <label>
                Edad
                <input type="number" min="0" {...register(`participants.${idx}.age`)} />
                {errors.participants?.[idx]?.age && <span className="err">{errors.participants[idx].age.message}</span>}
              </label>
              {requiresSize && (
                <label>
                  Talle
                  <input type="text" placeholder="S / M / L / XL" {...register(`participants.${idx}.size`)} />
                </label>
              )}
            </div>
          </fieldset>
        ))}

        <label className="tyc">
          <input type="checkbox" {...register('termsAccepted')} />
          Acepto términos y condiciones de la actividad
        </label>
        {errors.termsAccepted && <span className="err">{errors.termsAccepted.message}</span>}

        {apiError && (
          <div className="alert error">
            <FaExclamationTriangle /> {apiError}
          </div>
        )}
        {serverResult && (
          <div className={`alert ${serverResult.ok ? 'ok' : 'error'}`}>
            {serverResult.ok
              ? (<><FaCheckCircle /> ¡Listo! Código de reserva: <strong>{serverResult.code}</strong></>)
              : (<><FaExclamationTriangle /> Errores: {serverResult.errors?.join(' · ')}</>)}
          </div>
        )}

        <button type="submit" disabled={isSubmitting || loading || !activityId || !slotId}>
          {loading ? 'Enviando...' : 'Inscribirme'}
        </button>
      </form>

      <footer className="footer">
        <FaLeaf /> EcoHarmonyPark
      </footer>

      <style>{css}</style>
    </main>
  )
}

const css = `
  :root {
    /* Paleta verdosa */
    --bg:#f3f7f4;
    --text:#0f1e14;
    --muted:#5d7666;
    --card:#ffffff;
    --primary:#2e7d32;   /* verde principal */
    --primary-600:#276a2a;
    --primary-50:#e8f5e9;
    --accent:#66bb6a;    /* acento verde claro */
    --err:#b00020;
    --ok:#1b8c45;
    --ring:#b9e2c0;      /* focus ring */
  }

  * { box-sizing: border-box }
  body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; background: var(--bg); margin:0; color: var(--text); }
  .container { max-width: 920px; margin: 24px auto; padding: 0 16px; }

  .header { display:flex; align-items:center; justify-content:space-between; margin: 4px 0 16px; }
  .brand { display:flex; align-items:center; gap:10px; }
  .brand .leaf { color: var(--primary); font-size: 1.6rem; }
  h1 { margin: 0; font-size: clamp(1.4rem, 2.4vw, 2rem); }

  .card { background: var(--card); border: 1px solid #eaf0ec; border-radius: 16px; padding: 16px; box-shadow: 0 8px 28px rgba(0,0,0,.05); }
  .grid { display: grid; gap: 12px; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
  label { display: grid; gap: 6px; font-size: .95rem; color: var(--text); }
  input, select, button { padding: 10px 12px; border-radius: 12px; border: 1px solid #dbe7df; font-size: 1rem; background:#fff; color: var(--text); }
  input:focus, select:focus { outline: 3px solid var(--ring); border-color: var(--accent); }
  select option[disabled] { color:#aaa; }

  .fieldset { border: 1px dashed #d7e5db; border-radius: 12px; padding: 10px 12px; margin-top: 8px; background: #fbfdfc; }
  legend { padding: 0 6px; color: var(--muted); }

  .participantsHeader { display:flex; justify-content: space-between; align-items:center; margin-top: 12px; }
  .actions { display:flex; gap:8px; }
  .iconBtn { display:flex; align-items:center; gap:6px; background:#eaf6ed; border:1px solid #d4ebda; color: var(--primary-600); }
  .iconBtn:hover { background:#e2f0e7; }

  .tyc { display:flex; align-items:center; gap:8px; margin-top:10px; }
  .err { color: var(--err); font-size: .85rem; }

  .alert { margin-top:12px; padding:10px; border-radius:12px; display:flex; align-items:center; gap:8px; }
  .alert.ok { background:#e9f7ef; color:var(--ok); border:1px solid #cdebd9;}
  .alert.error { background:#fff1f2; color:var(--err); border:1px solid #ffd4d8;}

  button[type="submit"] { background: var(--primary); color:#fff; border: none; cursor: pointer; margin-top:10px; transition: transform .03s ease, background .15s ease; }
  button[type="submit"]:hover { background: var(--primary-600); }
  button[type="submit"]:active { transform: translateY(1px); }
  button[disabled] { opacity: .7; cursor: not-allowed; }

  .footer { display:flex; align-items:center; gap:6px; color: var(--muted); font-size: .9rem; margin: 14px 4px; }
`
