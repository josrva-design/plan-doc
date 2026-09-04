import React, { useCallback } from 'react';
import { useAppContext } from '../context/AppContext.tsx';
import Input from './ui/Input.tsx';
import Select from './ui/Select.tsx';
import EditableSelect from './ui/EditableSelect.tsx';
import TagInput from './ui/TagInput.tsx';
import { calcularEdad } from '../utils/summaryHelpers.ts';

import { User, Phone, Clock, Heart, Cigarette, Dumbbell, Utensils, Target, Wallet } from 'lucide-react';

const isValidEmail = (val: string) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
const isValidPhone = (val: string) => !val || /^[0-9+\-() ]{7,15}$/.test(val);
const isValidFecha = (val: string) => !val || /^\d{2}\/\d{2}\/\d{4}$/.test(val);

export default function PerfilClinico() {
  const { data, setters } = useAppContext();
  const { person } = data;
  const { setPerson } = setters;
  const d = person || {};
  const fechaConsulta = data.fechaConsulta || '';
  const edadCalculada = calcularEdad(d.fechaNacimiento || '', fechaConsulta);

  const update = useCallback((key, val) => {
    if (setPerson) {
      setPerson(prev => {
        const oldValue = prev?.[key];
        if (oldValue === val) return prev;

        const entry = {
          field: key,
          oldValue: String(oldValue || ''),
          newValue: String(val || ''),
          timestamp: new Date().toISOString(),
        };
        if (setters.setProfileHistory) {
          setters.setProfileHistory((prevHistory) => [...prevHistory, entry]);
        }
        return { ...(prev || {}), [key]: val };
      });
    }
  }, [setPerson, setters]);

  const inputCls = (invalid = false) =>
    `premium-table-input w-full bg-transparent outline-none border-b border-transparent focus:border-[var(--color-primary)] input-placeholder ${invalid ? 'border-red-400' : ''}`;

  const selectCls = (invalid = false) =>
    `premium-table-input w-full bg-[var(--color-bg-elevated)] outline-none border-b border-transparent focus:border-[var(--color-primary)] input-placeholder cursor-pointer ${invalid ? 'border-red-400' : ''}`;

  const card = (label: string, children: React.ReactNode) => (
    <div className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-2xl p-4">
      <p className="typo-label">{label}</p>
      <div className="typo-value-md mt-1">{children}</div>
    </div>
  );

  const sectionHeader = (icon: React.ReactNode, title: string, description: string) => (
    <div className="mt-8 md:mt-10">
      <h2 className="typo-label flex items-center gap-2">
        {icon}
        {title}
      </h2>
      <p className="typo-muted-sm mt-1">{description}</p>
    </div>
  );

  return (
    <div className="w-full bg-transparent text-[var(--color-text-primary)] p-3 md:p-4 font-body">
      <div className="mb-6">
        <h1 className="premium-page-title">
          <span className="mr-2 inline-flex items-center justify-center text-[var(--color-primary)]"><User size={24} /></span>
          PERFIL CLÍNICO
        </h1>
        <p className="premium-subtitle">Datos del paciente, antecedentes y hábitos</p>
      </div>

      {/* ==================== 1. IDENTIFICACIÓN ==================== */}
      {sectionHeader(<User size={16} />, 'Identificación', 'Datos básicos de la persona.')}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 mt-4">
        {card('Nombre', <Input value={d.nombre} onChange={e => update('nombre', e.target.value)} placeholder="Nombre completo" className={inputCls()} />)}
        {card('Sexo', <EditableSelect value={d.sexo} onChange={val => update('sexo', val)} options={['Hombre', 'Mujer', 'Prefiero no decir', 'Otro']} placeholder="Sexo" className={selectCls()} />)}
        {card('F. Nacimiento', <Input value={d.fechaNacimiento} onChange={e => update('fechaNacimiento', e.target.value)} placeholder="DD/MM/AAAA" type="date" className={inputCls(!isValidFecha(d.fechaNacimiento))} />)}
        {card('Edad', <Input value={d.edad || edadCalculada} onChange={e => update('edad', e.target.value)} placeholder="Edad" type="number" className={inputCls()} title={d.edad ? 'Valor manual' : `Calculado de ${d.fechaNacimiento || 'fecha de nacimiento'}`} />)}
        {card('Ocupación', <EditableSelect value={d.ocupacion} onChange={val => update('ocupacion', val)} options={['Director', 'Gerente', 'Empleado', 'Estudiante', 'Retirado', 'Independiente', 'Profesionista', 'Comerciante', 'Docente', 'Técnico']} placeholder="Ocupación" className={selectCls()} />)}
      </div>

      {/* ==================== 2. CONTACTO ==================== */}
      {sectionHeader(<Phone size={16} />, 'Contacto', 'Medios para comunicarse con el paciente.')}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 mt-4">
        {card('Cel/WhatsApp', <Input value={d.celular} onChange={e => update('celular', e.target.value)} placeholder="55XXXXXXXXX" type="tel" className={inputCls(!isValidPhone(d.celular))} />)}
        {card('Email', <Input value={d.email} onChange={e => update('email', e.target.value)} placeholder="correo@ejemplo.com" type="email" className={inputCls(!isValidEmail(d.email))} />)}
        {card('Instagram', <Input value={d.instagram} onChange={e => update('instagram', e.target.value)} placeholder="@usuario" className={inputCls()} />)}
        {card('País/Región', <EditableSelect value={d.pais} onChange={val => update('pais', val)} options={['México', 'Estados Unidos', 'España', 'Colombia', 'Argentina', 'Chile', 'Perú', 'Ecuador', 'Venezuela']} placeholder="País" className={selectCls()} />)}
        {card('Estado', <Input value={d.estado} onChange={e => update('estado', e.target.value)} placeholder="Ciudad, Estado" className={inputCls()} />)}
      </div>

      {/* ==================== 3. RUTINA DIARIA ==================== */}
      {sectionHeader(<Clock size={16} />, 'Rutina diaria', 'Horarios de sueño, trabajo y comidas para adaptar el plan.')}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 mt-4">
        {card('Despertar', <Input value={d.despertar} onChange={e => update('despertar', e.target.value)} placeholder="07:00" className={inputCls()} />)}
        {card('Dormir', <Input value={d.dormir} onChange={e => update('dormir', e.target.value)} placeholder="23:00" className={inputCls()} />)}
        {card('Inicio trabajo', <Input value={d.inicioTrabajo} onChange={e => update('inicioTrabajo', e.target.value)} placeholder="09:00" className={inputCls()} />)}
        {card('Término trabajo', <Input value={d.terminoTrabajo} onChange={e => update('terminoTrabajo', e.target.value)} placeholder="18:00" className={inputCls()} />)}
        {card('Receso trabajo', <Input value={d.recesoTrabajo} onChange={e => update('recesoTrabajo', e.target.value)} placeholder="13:00" className={inputCls()} />)}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2.5">
        {card('Tiempos de comida', <TagInput value={d.tiemposComida} onChange={val => update('tiemposComida', val)} placeholder="07:30, 12:30, 19:30..." />)}
      </div>

      {/* ==================== 4. HISTORIAL MÉDICO ==================== */}
      {sectionHeader(<Heart size={16} />, 'Historial médico', 'Antecedentes y condiciones de salud actuales.')}
      <div className="border border-[var(--color-border)] rounded-2xl overflow-hidden mt-4">
        <div className={`grid grid-cols-1 md:grid-cols-[1fr_1fr_2fr] gap-2 md:gap-4 px-4 py-3 md:py-3.5 bg-[var(--color-bg-elevated)] border-b border-[var(--color-border)]`}>
          <p className="typo-label md:col-span-2">Condición médica</p>
          <div className="typo-muted-sm md:col-span-3"><TagInput value={d.condicionMedica} onChange={val => update('condicionMedica', val)} placeholder="Hipertensión, Diabetes, Asma..." /></div>
        </div>
        {[
          ["Antecedentes Patológicos Personales", "app", ['Ninguno', 'Diabetes', 'Hipertensión', 'Asma', 'Cardiopatía', 'Cáncer', 'Enfermedad renal', 'Otro']],
          ["Antecedentes Familiares", "af", ['Ninguno', 'Diabetes', 'Hipertensión', 'Cáncer', 'Cardiopatía', 'Enfermedad mental', 'Otro']],
          ["Medicación Actual", "med", ['Ninguna', 'Antihipertensivos', 'Antidiabéticos', 'Analgésicos', 'Antidepresivos', 'Antihistamínicos', 'Otro']],
          ["Alergias", "alergias", ['Ninguna', 'Alimentos', 'Medicamentos', 'Polen', 'Polvo', 'Animales', 'Latex', 'Otro']],
          ["Cirugías (incluyendo estéticas)", "cirugias", ['Ninguna', 'Apendicectomía', 'Cesárea', 'Ortopedia', 'Laparoscópica', 'Estética', 'Otro']],
          ["Intolerancias", "intolerancias", ['Ninguna', 'Lactosa', 'Gluten', 'Fructosa', 'Sacarosa', 'Histamina', 'Otro']],
          ["Lesiones o Discapacidades Actuales", "lesiones", ['Ninguna', 'Esguince', 'Fractura', 'Tendinitis', 'Hernia discal', 'Artritis', 'Otro']],
          ["Laboratorios Recientes", "labs", ['Ninguno', 'Sangre', 'Orina', 'Heces', 'Imagen (rayos X)', 'Resonancia', 'Otro']],
        ].map(([label,key,opts],i)=>(
          <div key={label} className={`grid grid-cols-1 md:grid-cols-[1fr_1fr_2fr] gap-2 md:gap-4 px-4 py-3 md:py-3.5 ${i%2===0? 'bg-[var(--color-bg-elevated)]' : 'bg-[var(--color-bg-base)]'} border-b last:border-0 border-[var(--color-border)]`}>
            <p className="typo-label">{label}</p>
            <div className="typo-value-md"><Select value={d[key]} onChange={val => update(key, val)} options={opts} placeholder="No especificado" className={selectCls()} /></div>
            <div className="typo-muted-sm"><Input value={d[key+'Obs']} onChange={e => update(key+'Obs', e.target.value)} placeholder="Observaciones..." className={inputCls()} /></div>
          </div>
        ))}
      </div>

      {/* ==================== 5. HÁBITOS ==================== */}
      {sectionHeader(<Cigarette size={16} />, 'Hábitos', 'Consumo de sustancias y estilo de vida.')}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 mt-4">
        {[
          ["Tabaquismo", "tabaco"],
          ["Alcohol", "alcohol"],
          ["Café", "cafe"],
          ["Bebidas Azucaradas", "azucar"],
          ["Drogas/Med", "drogas"],
          ["Anabólicos / EAAs", "ana"],
          ["Pre-Entreno", "pre"],
          ["Energéticas", "energ"],
        ].map(([l,k])=>(
          <div key={l} className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-2xl p-4 text-center flex flex-col justify-center items-center">
            <p className="typo-label">{l}</p>
            <div className="typo-value-md mt-1 w-full"><EditableSelect value={d[k]} onChange={val => update(k, val)} options={['NO', 'DIARIO', 'SEMANAL', 'OCASIONAL']} placeholder="Frecuencia" className={selectCls()} /></div>
          </div>
        ))}
      </div>

      {/* ==================== 6. ACTIVIDAD FÍSICA ==================== */}
      {sectionHeader(<Dumbbell size={16} />, 'Actividad física', 'Ejercicio actual, disponibilidad de horario y nivel de condición.')}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 mt-4">
        {[
          ["Actividad 1", "act1", "Tipo", true],
          ["Actividad 2", "act2", "Tipo", true],
          ["Horario", "horario", "19:00", false],
          ["Sesiones", "sesiones", "3", false],
          ["Duración", "duracion", "55 min", false],
          ["Pasos", "pasos", "8000", false],
          ["Nivel", "nivel", "", false],
        ].map(([l,k,ph,isAct])=>(
          <div key={l} className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-2xl p-4 text-center flex flex-col justify-center items-center">
            <p className="typo-label">{l}</p>
            <div className="typo-value-md mt-1 w-full">
              {isAct ? (
                <EditableSelect value={d[k]} onChange={val => update(k, val)} options={['Correr', 'Caminar', 'Ciclismo', 'Natación', 'Gimnasio', 'Yoga', 'Crossfit']} placeholder={ph||"Tipo"} className={selectCls()} />
              ) : k === 'nivel' ? (
                <Select value={d.nivel} onChange={val => update('nivel', val)} options={['Sedentario - poco o ningún ejercicio', 'Ligero - ejercicio 1-3 días/semana', 'Moderado - ejercicio 3-5 días/semana', 'Activo - ejercicio 6-7 días/semana', 'Muy activo - trabajo físico + ejercicio diario']} placeholder="Selecciona tu nivel" className={selectCls()} />
              ) : (
                <Input value={d[k]} onChange={e => update(k, e.target.value)} placeholder={ph} className={`${inputCls()} text-center`} />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ==================== 7. PREFERENCIAS NUTRICIONALES ==================== */}
      {sectionHeader(<Utensils size={16} />, 'Preferencias nutricionales', 'Experiencia previa y preferencias alimentarias formales.')}
      <div className="border border-[var(--color-border)] rounded-2xl overflow-hidden mt-4">
        {[
          ["Plan previo nutrición/entreno", "planPrevio", "¿Tuvo plan previo?", ['SÍ', 'NO', 'VARIABLE'], "Describe tu experiencia..."],
          ["Resultados obtenidos", "resultadosPrevios", "Resultados", ['Excelentes', 'Buenos', 'Regulares', 'Malos', 'Sin resultados'], "Describe los resultados..."],
          ["Qué no te gustó", "queNoTeGusta", "Motivo", ['Sabor', 'Precio', 'Tiempo', 'Complejidad', 'Otro'], "Describe qué no te gustó..."],
          ["Tipo de plan preferido", "tipoPlan", "Tipo de plan", ['Omnívoro', 'Vegetariano', 'Vegano', 'Paleo', 'Keto', 'Mediterráneo', 'Otro'], "Describe tu preferencia..."],
          ["Característica más importante", "caracteristica", "Característica", ['Sabor', 'Precio', 'Salud', 'Conveniencia', 'Otro'], "Describe la característica..."],
          ["Interés en suplementos", "interesSup", "¿Interés?", ['SÍ', 'NO'], "Describe tu interés..."],
          ["Suplementación actual", "supActual", "Suplementación", ['SÍ', 'NO', 'VARIABLE'], "Describe tu suplementación..."],
        ].map(([l,k,v,opts,obsPh],i)=>(
          <div key={l} className={`grid grid-cols-1 md:grid-cols-[1fr_1fr_2fr] gap-2 md:gap-4 px-4 py-3 md:py-3.5 ${i%2===0? 'bg-[var(--color-bg-elevated)]' : 'bg-[var(--color-bg-base)]'} border-b last:border-0 border-[var(--color-border)]`}>
            <p className="typo-label uppercase">{l}</p>
            <div className="typo-value-md"><Select value={d[k]} onChange={val => update(k, val)} options={opts} placeholder={v} className={selectCls()} /></div>
            <div className="typo-muted-sm"><Input value={d[k+'Obs']} onChange={e => update(k+'Obs', e.target.value)} placeholder={obsPh} className={inputCls()} /></div>
          </div>
        ))}
      </div>

      {/* ==================== 8. GUSTOS ALIMENTICIOS ==================== */}
      {sectionHeader(<Utensils size={16} />, 'Gustos alimenticios', 'Preferencias y aversiones de comida del paciente.')}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mt-4">
        {card('Gustos generales', <TagInput value={d.gustos} onChange={val => update('gustos', val)} placeholder="Escribe y presiona Enter..." />)}
        {card('Le gusta', <TagInput value={d.leGusta} onChange={val => update('leGusta', val)} placeholder="Pollo, salmón, aguacate..." />)}
        {card('No le gusta', <TagInput value={d.noLeGusta} onChange={val => update('noLeGusta', val)} placeholder="Sopas, comida picante..." />)}
        {card('Quién cocina', <Input value={d.quienCocina} onChange={e => update('quienCocina', e.target.value)} placeholder="Yo / Familia / Nadie" className={inputCls()} />)}
      </div>

      {/* ==================== 9. OBJETIVO ==================== */}
      {sectionHeader(<Target size={16} />, 'Objetivo', 'Hacia dónde va el paciente con su plan.')}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 mt-4">
        <div className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-2xl p-4">
          <p className="typo-label">Objetivo principal</p>
          <div className="typo-value-md mt-1">
            <Select value={d.objetivo} onChange={val => update('objetivo', val)} options={['Mejorar mi salud', 'Prevención enfermedades', 'Salud mental', 'Estilo vida', 'Longevidad/Antiedad', 'Estética corporal', 'Incremento de fuerza', 'Alto Rendimiento', 'Competitivo', 'Otro']} placeholder="Selecciona objetivo" className={selectCls()} />
          </div>
        </div>
        <div className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-2xl p-4 sm:col-span-2">
          <p className="typo-label">Objetivo específico</p>
          <div className="typo-value-md mt-1">
            <Input value={d.objetivoEspecifico || ''} onChange={e => update('objetivoEspecifico', e.target.value)} placeholder="Ej: Bajar 5kg en 3 meses, ganar masa muscular, mantener..." className={inputCls()} />
          </div>
        </div>
      </div>

      {/* ==================== 10. RECURSOS ==================== */}
      {sectionHeader(<Wallet size={16} />, 'Recursos', 'Limitantes económicas, equipo disponible y calidad de sueño.')}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 mt-4">
        <div className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-2xl p-4">
          <p className="typo-label">Presupuesto alimenticio</p>
          <div className="typo-value-md mt-1">
            <Select value={d.presupuesto} onChange={val => update('presupuesto', val)} options={['Bajo (~$200-400/semana)', 'Medio (~$500-800/semana)', 'Alto (~$900-1500/semana)', 'Sin límite']} placeholder="Selecciona rango" className={selectCls()} />
          </div>
        </div>
        <div className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-2xl p-4">
          <p className="typo-label">Equipo disponible</p>
          <div className="typo-value-md mt-1">
            <Select value={d.equipo} onChange={val => update('equipo', val)} options={['Gimnasio completo', 'Casa (bandas/mancuernas)', 'Parque', 'Ninguno', 'Mixto']} placeholder="Selecciona equipo" className={selectCls()} />
          </div>
        </div>
        <div className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-2xl p-4">
          <p className="typo-label">Calidad de sueño</p>
          <div className="typo-value-md mt-1">
            <Select value={d.calidadSueño} onChange={val => update('calidadSueño', val)} options={['7-8h sin interrupciones', '7-8h con interrupciones', '5-6h fragmented', '<5h', 'Variable']} placeholder="Selecciona" className={selectCls()} />
          </div>
        </div>
      </div>

      {/* ==================== HISTORIAL DE CAMBIOS ==================== */}
      {data?.profileHistory?.length > 0 && (
        <div className="mt-8 md:mt-10">
          <h2 className="typo-label">Historial de cambios</h2>
          <p className="typo-muted-sm mb-4">Registro automático de modificaciones en el perfil.</p>
          <div className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-2xl overflow-hidden">
            <div className="max-h-60 overflow-y-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[var(--color-bg-subtle)]">
                  <tr>
                    <th className="px-4 py-2 text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Campo</th>
                    <th className="px-4 py-2 text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Anterior</th>
                    <th className="px-4 py-2 text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Nuevo</th>
                    <th className="px-4 py-2 text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {[...data.profileHistory].reverse().slice(0, 20).map((entry, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-2 font-medium text-[var(--color-text-primary)]">{entry.field}</td>
                      <td className="px-4 py-2 text-[var(--color-text-secondary)]">{entry.oldValue}</td>
                      <td className="px-4 py-2 text-[var(--color-text-primary)]">{entry.newValue}</td>
                      <td className="px-4 py-2 text-[var(--color-text-secondary)]">
                        {new Date(entry.timestamp).toLocaleString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
