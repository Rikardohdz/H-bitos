import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  PenTool,
  Dumbbell,
  BookOpen,
  Music,
  CheckCircle2,
  CalendarDays,
  LayoutGrid,
  BarChart3,
  ClipboardList,
  Check,
  TrendingUp,
  Plus,
  Trash2,
  Utensils,
  Settings as SettingsIcon,
  Download,
  Upload,
  X,
  Edit2,
  Heart,
  Coffee,
  Brain,
  Bike,
  Droplet,
  Moon,
  Apple,
  Target,
  AlertCircle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  FolderKanban,
  BarChart2,
  Lightbulb,
} from 'lucide-react';

const ICON_MAP = {
  pen: PenTool,
  dumbbell: Dumbbell,
  book: BookOpen,
  music: Music,
  heart: Heart,
  coffee: Coffee,
  brain: Brain,
  bike: Bike,
  water: Droplet,
  sleep: Moon,
  food: Apple,
  meal: Utensils,
};
const ICON_LIST = Object.keys(ICON_MAP);

const COLOR_MAP = {
  indigo: 'bg-indigo-100 text-indigo-600',
  blue: 'bg-blue-100 text-blue-600',
  orange: 'bg-orange-100 text-orange-600',
  purple: 'bg-purple-100 text-purple-600',
  emerald: 'bg-emerald-100 text-emerald-600',
  pink: 'bg-pink-100 text-pink-600',
  amber: 'bg-amber-100 text-amber-600',
  cyan: 'bg-cyan-100 text-cyan-600',
  rose: 'bg-rose-100 text-rose-600',
  teal: 'bg-teal-100 text-teal-600',
};
const COLOR_LIST = Object.keys(COLOR_MAP);

// Días: 1=Lun, 2=Mar, 3=Mié, 4=Jue, 5=Vie, 6=Sáb, 7=Dom
const DEFAULT_HABITS = [
  {
    id: 'h1',
    label: 'Escribir',
    desc: 'Practicar la escritura.',
    icon: 'pen',
    color: 'blue',
    days: [1, 2, 3, 4, 5],
  },
  {
    id: 'h2',
    label: 'Cardio',
    desc: 'Ejercicio cardiovascular.',
    icon: 'bike',
    color: 'orange',
    days: [1, 3, 5],
  },
  {
    id: 'h3',
    label: 'Pesas',
    desc: 'Entrenamiento de fuerza.',
    icon: 'dumbbell',
    color: 'rose',
    days: [2, 4, 6],
  },
  {
    id: 'h4',
    label: 'Leer',
    desc: 'Cultivar el hábito.',
    icon: 'book',
    color: 'purple',
    days: [1, 2, 3, 4, 5],
  },
  {
    id: 'h5',
    label: 'Guitarra',
    desc: 'Practicar canciones.',
    icon: 'music',
    color: 'emerald',
    days: [1, 2, 3, 4, 5],
  },
];

const DEFAULT_MEAL_PLAN = {
  mealsPerDay: 4,
  sections: [
    {
      id: 's1',
      title: 'Desayuno',
      items: [{ id: 'i1', name: 'Huevos', amount: '5 (2 yemas)' }],
    },
    {
      id: 's2',
      title: '3 Comidas',
      items: [
        { id: 'i2', name: 'Proteína', amount: '150 gr.' },
        { id: 'i3', name: 'Vegetales', amount: '250 gr.' },
      ],
    },
    {
      id: 's3',
      title: 'Elegir 1 Carbohidrato',
      items: [
        { id: 'i4', name: 'Tostadas', amount: '3 uds.' },
        { id: 'i5', name: 'Arroz integral', amount: '100 gr.' },
        { id: 'i6', name: 'Papa', amount: '150 gr.' },
      ],
    },
    {
      id: 's4',
      title: 'Solo para el café',
      items: [{ id: 'i7', name: 'Leche', amount: '100 ml.' }],
    },
  ],
};

// ── Proyectos de notas ──
const PROJECTS = [
  { id: 'clicmetric', name: 'ClicMetric', icon: 'chart', color: 'cyan' },
  { id: 'dante', name: 'Dante', icon: 'lightbulb', color: 'amber' },
];

const PROJECT_ICON_MAP = {
  chart: BarChart2,
  lightbulb: Lightbulb,
};

const PROJECT_COLOR_MAP = {
  cyan: 'bg-cyan-100 text-cyan-600',
  amber: 'bg-amber-100 text-amber-600',
};

const MONTHS = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];
const MONTHS_SHORT = [
  'Ene',
  'Feb',
  'Mar',
  'Abr',
  'May',
  'Jun',
  'Jul',
  'Ago',
  'Sep',
  'Oct',
  'Nov',
  'Dic',
];

const formatDateKey = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    '0'
  )}-${String(d.getDate()).padStart(2, '0')}`;
};

const formatDateReadable = (str) => {
  if (!str) return '';
  const [y, m, d] = str.split('-');
  return `${parseInt(d, 10)} ${MONTHS_SHORT[parseInt(m, 10) - 1]} ${y}`;
};

const getWeekNumber = (date) => {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
};

const getDaysInWeek = (date) => {
  const week = [],
    d = new Date(date),
    day = d.getDay();
  d.setDate(d.getDate() - day + (day === 0 ? -6 : 1));
  for (let i = 0; i < 7; i++) {
    week.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return week;
};

const isSameDay = (a, b) => formatDateKey(a) === formatDateKey(b);

// ── Días de la semana ──
// Convierte getDay() (0=Dom, 1=Lun...) a nuestro formato (1=Lun, ..., 7=Dom)
const dayOfWeek = (date) => {
  const d = date.getDay();
  return d === 0 ? 7 : d;
};

// ¿El hábito aplica en esta fecha?
const habitAppliesOn = (habit, date) => {
  // Si no tiene días configurados, aplica siempre (retrocompatible)
  if (!habit.days || habit.days.length === 0) return true;
  return habit.days.includes(dayOfWeek(date));
};

const DAY_LETTERS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

const genId = () =>
  `id_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

// ─────────────────────────────────────────────
//  APP PRINCIPAL
// ─────────────────────────────────────────────
export default function App() {
  const [habits, setHabits] = useState(DEFAULT_HABITS);
  const [data, setData] = useState({});
  const [weightData, setWeightData] = useState([]);
  const [weightGoal, setWeightGoal] = useState('');
  const [initialWeight, setInitialWeight] = useState('');
  const [mealPlan, setMealPlan] = useState(DEFAULT_MEAL_PLAN);
  const [lastBackup, setLastBackup] = useState(null); // ISO string
  const [isLoaded, setIsLoaded] = useState(false);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState(0);

  const [newWeight, setNewWeight] = useState('');
  const [newWeightDate, setNewWeightDate] = useState(formatDateKey(new Date()));
  const [newWeightComment, setNewWeightComment] = useState('');
  const [weightHistoryShown, setWeightHistoryShown] = useState(10);

  const [showSettings, setShowSettings] = useState(false);
  const [habitEditor, setHabitEditor] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [showMealEd, setShowMealEd] = useState(false);
  const [toast, setToast] = useState(null);

  // ── Proyectos / notas ──
  const [section, setSection] = useState('personales'); // 'personales' | 'proyectos'
  const [activeProject, setActiveProject] = useState(PROJECTS[0].id);
  const [notes, setNotes] = useState({}); // { [projectId]: [{id, title, desc, done, createdAt}] }
  const [showCompleted, setShowCompleted] = useState({}); // { [projectId]: bool }
  const [noteEditor, setNoteEditor] = useState(null); // {projectId, note} | null

  // ── Cargar datos (con migración desde versión anterior) ──
  useEffect(() => {
    try {
      const sh = localStorage.getItem('h26_habits');
      if (sh) setHabits(JSON.parse(sh));

      const sd =
        localStorage.getItem('h26_data') ||
        localStorage.getItem('modern_habit_data');
      if (sd) {
        const parsed = JSON.parse(sd);
        const old = Object.values(parsed).some(
          (a) => Array.isArray(a) && a.some((v) => typeof v === 'number')
        );
        if (old) {
          const map = { 0: 'h1', 1: 'h2', 2: 'h3', 3: 'h4' };
          const mig = {};
          for (const [k, a] of Object.entries(parsed))
            mig[k] = a
              .map((v) => (typeof v === 'number' ? map[v] : v))
              .filter(Boolean);
          setData(mig);
        } else setData(parsed);
      }

      const sw =
        localStorage.getItem('h26_weight') ||
        localStorage.getItem('modern_weight_data');
      if (sw) setWeightData(JSON.parse(sw));
      const wg = localStorage.getItem('h26_goal');
      if (wg) setWeightGoal(wg);
      const mp = localStorage.getItem('h26_meal');
      if (mp) setMealPlan(JSON.parse(mp));
      const lb = localStorage.getItem('h26_lastBackup');
      if (lb) setLastBackup(lb);
      const iw = localStorage.getItem('h26_initialWeight');
      if (iw) setInitialWeight(iw);
      const sn = localStorage.getItem('h26_notes');
      if (sn) setNotes(JSON.parse(sn));
    } catch (e) {
      console.error(e);
    }
    setIsLoaded(true);
  }, []);

  // ── Guardar automáticamente ──
  useEffect(() => {
    if (isLoaded) localStorage.setItem('h26_habits', JSON.stringify(habits));
  }, [habits, isLoaded]);
  useEffect(() => {
    if (isLoaded) localStorage.setItem('h26_data', JSON.stringify(data));
  }, [data, isLoaded]);
  useEffect(() => {
    if (isLoaded)
      localStorage.setItem('h26_weight', JSON.stringify(weightData));
  }, [weightData, isLoaded]);
  useEffect(() => {
    if (isLoaded) localStorage.setItem('h26_goal', weightGoal);
  }, [weightGoal, isLoaded]);
  useEffect(() => {
    if (isLoaded) localStorage.setItem('h26_meal', JSON.stringify(mealPlan));
  }, [mealPlan, isLoaded]);
  useEffect(() => {
    if (isLoaded && lastBackup)
      localStorage.setItem('h26_lastBackup', lastBackup);
  }, [lastBackup, isLoaded]);
  useEffect(() => {
    if (isLoaded) localStorage.setItem('h26_initialWeight', initialWeight);
  }, [initialWeight, isLoaded]);
  useEffect(() => {
    if (isLoaded) localStorage.setItem('h26_notes', JSON.stringify(notes));
  }, [notes, isLoaded]);

  const showToast = (msg, type = 'ok') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  // ── Hábitos ──
  const toggleHabit = (key, id) => {
    setData((prev) => {
      const arr = prev[key] || [];
      return {
        ...prev,
        [key]: arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id],
      };
    });
  };

  const saveHabit = (habit) => {
    if (habit.id) {
      setHabits((p) => p.map((h) => (h.id === habit.id ? habit : h)));
      showToast('Hábito actualizado');
    } else {
      setHabits((p) => [...p, { ...habit, id: genId() }]);
      showToast('Hábito creado');
    }
    setHabitEditor(null);
  };

  const askDeleteHabit = (id) => {
    const h = habits.find((x) => x.id === id);
    setConfirm({
      title: `Eliminar "${h?.label}"`,
      msg: 'Se borrará el hábito y su historial. ¿Continuar?',
      btn: 'Eliminar',
      action: () => {
        setHabits((p) => p.filter((h) => h.id !== id));
        setData((p) => {
          const c = {};
          for (const [k, a] of Object.entries(p)) {
            const f = a.filter((x) => x !== id);
            if (f.length) c[k] = f;
          }
          return c;
        });
        setConfirm(null);
        showToast('Hábito eliminado');
      },
    });
  };

  // ── Peso ──
  const addWeight = () => {
    if (!newWeight || isNaN(newWeight)) return;
    const r = {
      id: genId(),
      date: newWeightDate,
      weight: parseFloat(newWeight),
      comment: newWeightComment,
    };
    setWeightData((p) =>
      [...p, r].sort((a, b) => new Date(a.date) - new Date(b.date))
    );
    setNewWeight('');
    setNewWeightComment('');
    showToast('Registro guardado');
  };

  const askDeleteWeight = (id) => {
    const r = weightData.find((x) => x.id === id);
    setConfirm({
      title: 'Eliminar registro',
      msg: `¿Eliminar ${r?.weight} kg del ${formatDateReadable(r?.date)}?`,
      btn: 'Eliminar',
      action: () => {
        setWeightData((p) => p.filter((x) => x.id !== id));
        setConfirm(null);
        showToast('Eliminado');
      },
    });
  };

  // ── Notas (proyectos) ──
  const addNote = (projectId) => {
    const newNote = {
      id: genId(),
      title: '',
      desc: '',
      done: false,
      createdAt: new Date().toISOString(),
    };
    setNotes((prev) => ({
      ...prev,
      [projectId]: [...(prev[projectId] || []), newNote],
    }));
    // Abrir directo el editor para que escriba el título
    setNoteEditor({ projectId, note: newNote, isNew: true });
  };

  const updateNote = (projectId, noteId, fields) => {
    setNotes((prev) => ({
      ...prev,
      [projectId]: (prev[projectId] || []).map((n) =>
        n.id === noteId ? { ...n, ...fields } : n
      ),
    }));
  };

  const toggleNoteDone = (projectId, noteId) => {
    setNotes((prev) => ({
      ...prev,
      [projectId]: (prev[projectId] || []).map((n) =>
        n.id === noteId ? { ...n, done: !n.done } : n
      ),
    }));
  };

  const deleteNote = (projectId, noteId) => {
    setNotes((prev) => ({
      ...prev,
      [projectId]: (prev[projectId] || []).filter((n) => n.id !== noteId),
    }));
  };

  const askDeleteNote = (projectId, noteId) => {
    const note = (notes[projectId] || []).find((n) => n.id === noteId);
    setConfirm({
      title: 'Eliminar idea',
      msg: `¿Eliminar "${note?.title || 'esta idea'}" permanentemente?`,
      btn: 'Eliminar',
      action: () => {
        deleteNote(projectId, noteId);
        setConfirm(null);
        setNoteEditor(null);
        showToast('Idea eliminada');
      },
    });
  };

  // ── Backup ──
  const doExport = () => {
    const blob = new Blob(
      [
        JSON.stringify(
          {
            version: 1,
            habits,
            habitData: data,
            weightData,
            weightGoal,
            initialWeight,
            mealPlan,
            notes,
          },
          null,
          2
        ),
      ],
      { type: 'application/json' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `habit2026-${formatDateKey(new Date())}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setLastBackup(new Date().toISOString());
    showToast('Backup descargado');
  };

  const doImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const d = JSON.parse(ev.target.result);
        if (Array.isArray(d.habits)) setHabits(d.habits);
        if (d.habitData) setData(d.habitData);
        if (Array.isArray(d.weightData)) setWeightData(d.weightData);
        if (d.weightGoal !== undefined) setWeightGoal(String(d.weightGoal));
        if (d.initialWeight !== undefined) setInitialWeight(String(d.initialWeight));
        if (d.mealPlan) setMealPlan(d.mealPlan);
        if (d.notes && typeof d.notes === 'object') setNotes(d.notes);
        showToast('Backup restaurado');
      } catch {
        showToast('Archivo inválido', 'err');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const doReset = () =>
    setConfirm({
      title: '¿Borrar TODO?',
      msg: 'Se borran hábitos, registros, peso y plan. No se puede deshacer.',
      btn: 'Sí, borrar todo',
      action: () => {
        setHabits(DEFAULT_HABITS);
        setData({});
        setWeightData([]);
        setWeightGoal('');
        setInitialWeight('');
        setMealPlan(DEFAULT_MEAL_PLAN);
        setNotes({});
        setConfirm(null);
        setShowSettings(false);
        showToast('Datos reiniciados');
      },
    });

  // ── Swipe ──
  const ts = useRef(null),
    te = useRef(null);
  const onTS = (e) => {
    if (showSettings || habitEditor || confirm || showMealEd || noteEditor || section === 'proyectos') return;
    te.current = null;
    ts.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    };
  };
  const onTM = (e) => {
    if (showSettings || habitEditor || confirm || showMealEd || noteEditor || section === 'proyectos') return;
    te.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    };
  };
  const onTE = () => {
    if (!ts.current || !te.current) return;
    const dx = ts.current.x - te.current.x,
      dy = ts.current.y - te.current.y;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (dx > 0 && viewMode < 5) setViewMode((v) => v + 1);
      else if (dx < 0 && viewMode > 0) setViewMode((v) => v - 1);
    }
  };

  // ── Navegación de fecha ──
  const changeDate = (dir) => {
    const d = new Date(currentDate);
    if (viewMode === 0) d.setDate(d.getDate() + dir);
    else if (viewMode === 1) d.setDate(d.getDate() + dir * 7);
    else if (viewMode === 2) d.setMonth(d.getMonth() + dir);
    else if (viewMode === 3) d.setFullYear(d.getFullYear() + dir);
    setCurrentDate(d);
  };

  // ── Días desde el último backup (para aviso mensual) ──
  const daysSinceBackup = (() => {
    if (!isLoaded) return 0;
    if (!lastBackup) return 999; // si nunca ha hecho backup y ya hay datos, avisar
    const diff = Date.now() - new Date(lastBackup).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  })();
  const hasAnyData =
    habits.length > 0 &&
    (Object.keys(data).length > 0 || weightData.length > 0);
  const showBackupReminder = hasAnyData && daysSinceBackup >= 30;

  // ── Progreso (cuenta solo días en que cada hábito aplica) ──
  const getProgress = (tipo) => {
    if (habits.length === 0) return 0;
    let pos = 0,
      done = 0;
    const count = (d) => {
      const k = formatDateKey(d);
      const marks = data[k] || [];
      for (const h of habits) {
        if (!habitAppliesOn(h, d)) continue; // no cuenta si no aplica
        pos++;
        if (marks.includes(h.id)) done++;
      }
    };
    if (tipo === 'day') count(currentDate);
    else if (tipo === 'week') getDaysInWeek(currentDate).forEach(count);
    else if (tipo === 'month') {
      const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      while (d.getMonth() === currentDate.getMonth()) {
        count(d);
        d.setDate(d.getDate() + 1);
      }
    } else if (tipo === 'year') {
      const y = currentDate.getFullYear();
      let d = new Date(y, 0, 1);
      while (d.getFullYear() === y) {
        count(d);
        d.setDate(d.getDate() + 1);
      }
    }
    return pos === 0 ? 0 : Math.round((done / pos) * 100);
  };
  const progress =
    viewMode >= 4
      ? 100
      : getProgress(['day', 'week', 'month', 'year'][viewMode]);

  // ── Gráfica de peso ──
  const renderChart = () => {
    if (weightData.length < 2)
      return (
        <div className="h-40 flex items-center justify-center text-gray-400 text-sm italic">
          Agrega al menos 2 registros para ver tu gráfica.
        </div>
      );
    const W = 320,
      H = 150,
      pL = 32,
      pR = 12,
      pT = 15,
      pB = 26;
    const ws = weightData.map((d) => d.weight);
    let mn = Math.min(...ws),
      mx = Math.max(...ws);
    const g = parseFloat(weightGoal);
    if (!isNaN(g)) {
      mn = Math.min(mn, g);
      mx = Math.max(mx, g);
    }
    mn = Math.floor(mn - 0.5);
    mx = Math.ceil(mx + 0.5);
    const rng = mx - mn || 1;
    const tx = (i) => pL + (i / (weightData.length - 1)) * (W - pL - pR);
    const ty = (v) => H - pB - ((v - mn) / rng) * (H - pT - pB);
    const pts = weightData.map((d, i) => `${tx(i)},${ty(d.weight)}`).join(' ');
    const lbls = [0, weightData.length - 1];
    if (weightData.length >= 4)
      lbls.splice(1, 0, Math.floor(weightData.length / 2));
    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-40 overflow-visible">
        <line
          x1={pL}
          y1={pT}
          x2={W - pR}
          y2={pT}
          stroke="#f3f4f6"
          strokeWidth="1"
          strokeDasharray="4"
        />
        <line
          x1={pL}
          y1={H - pB}
          x2={W - pR}
          y2={H - pB}
          stroke="#f3f4f6"
          strokeWidth="1"
          strokeDasharray="4"
        />
        <text x="2" y={pT + 4} fontSize="10" fill="#9ca3af">
          {mx.toFixed(1)}
        </text>
        <text x="2" y={H - pB + 4} fontSize="10" fill="#9ca3af">
          {mn.toFixed(1)}
        </text>
        {!isNaN(g) && g >= mn && g <= mx && (
          <>
            <line
              x1={pL}
              y1={ty(g)}
              x2={W - pR}
              y2={ty(g)}
              stroke="#10b981"
              strokeWidth="1.5"
              strokeDasharray="5,3"
            />
            <text
              x={W - pR}
              y={ty(g) - 4}
              fontSize="9"
              fill="#10b981"
              textAnchor="end"
            >
              Meta: {g}
            </text>
          </>
        )}
        <polyline
          points={pts}
          fill="none"
          stroke="#4f46e5"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {weightData.map((d, i) => (
          <circle
            key={d.id}
            cx={tx(i)}
            cy={ty(d.weight)}
            r="3.5"
            fill="#fff"
            stroke="#4f46e5"
            strokeWidth="2"
          />
        ))}
        {lbls.map((i) => (
          <text
            key={i}
            x={tx(i)}
            y={H - 6}
            fontSize="9"
            fill="#9ca3af"
            textAnchor={
              i === 0 ? 'start' : i === weightData.length - 1 ? 'end' : 'middle'
            }
          >
            {formatDateReadable(weightData[i].date).replace(/ \d{4}$/, '')}
          </text>
        ))}
      </svg>
    );
  };

  // ─────────────────────────────────────────────
  //  RENDER
  // ─────────────────────────────────────────────
  return (
    <div
      className="bg-gray-50 min-h-screen flex flex-col font-nunito text-gray-900 select-none"
      onTouchStart={onTS}
      onTouchMove={onTM}
      onTouchEnd={onTE}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');.font-nunito{font-family:'Nunito',sans-serif;}`}</style>

      {/* ── TABS PRINCIPALES (Personales / Proyectos) ── */}
      <div className="bg-white pt-9 px-5 pb-2 z-30 relative">
        <div className="flex gap-2 bg-gray-100 p-1 rounded-2xl">
          <button
            onClick={() => setSection('personales')}
            className={`flex-1 py-2.5 rounded-xl font-black text-sm transition-all ${
              section === 'personales'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-500'
            }`}
          >
            Personales
          </button>
          <button
            onClick={() => setSection('proyectos')}
            className={`flex-1 py-2.5 rounded-xl font-black text-sm transition-all ${
              section === 'proyectos'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-500'
            }`}
          >
            Proyectos
          </button>
        </div>
      </div>

      {/* ── HEADER ── */}
      {section === 'personales' && (
      <header className="bg-white px-6 pt-2 pb-4 shadow-sm z-20 relative">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-bold text-indigo-600 uppercase tracking-wider">
                {
                  [
                    'Mi día',
                    'Resumen semanal',
                    'Vista mensual',
                    'Progreso anual',
                    'Seguimiento',
                    'Plan de acción',
                  ][viewMode]
                }
              </p>
              {!isSameDay(currentDate, new Date()) && viewMode < 4 && (
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="text-[10px] font-black bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full hover:bg-indigo-100 active:scale-95 transition"
                >
                  HOY
                </button>
              )}
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight truncate">
              {viewMode === 0 &&
                `${currentDate.getDate()} de ${MONTHS[currentDate.getMonth()]}`}
              {viewMode === 1 && `Semana ${getWeekNumber(currentDate)}`}
              {viewMode === 2 && MONTHS[currentDate.getMonth()]}
              {viewMode === 3 && currentDate.getFullYear()}
              {viewMode === 4 && 'Control de peso'}
              {viewMode === 5 && 'Dieta y macros'}
            </h1>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            {viewMode < 4 && (
              <>
                <button
                  onClick={() => changeDate(-1)}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 active:scale-95 transition text-gray-600"
                >
                  <ChevronLeft size={22} strokeWidth={2.5} />
                </button>
                <button
                  onClick={() => changeDate(1)}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 active:scale-95 transition text-gray-600"
                >
                  <ChevronRight size={22} strokeWidth={2.5} />
                </button>
              </>
            )}
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 active:scale-95 transition text-gray-600"
            >
              <SettingsIcon size={22} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </header>
      )}

      {/* ── HEADER PROYECTOS ── */}
      {section === 'proyectos' && (
        <header className="bg-white px-6 pt-2 pb-4 shadow-sm z-20 relative">
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-1">
                Ideas de contenido
              </p>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight truncate">
                {PROJECTS.find((p) => p.id === activeProject)?.name || 'Proyecto'}
              </h1>
            </div>
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 active:scale-95 transition text-gray-600 flex-shrink-0"
            >
              <SettingsIcon size={22} strokeWidth={2.5} />
            </button>
          </div>
        </header>
      )}

      {/* ── CONTENIDO ── */}
      <main className="flex-1 overflow-y-auto px-5 py-6 pb-32">
        {/* === SECCIÓN PERSONALES === */}
        {section === 'personales' && (
          <>
        {/* Aviso de backup pendiente (mensual) */}
        {showBackupReminder && (
          <div className="mb-5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
            <div className="bg-amber-100 text-amber-600 p-2 rounded-xl flex-shrink-0">
              <AlertCircle size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-amber-900 text-sm">
                {lastBackup
                  ? `Hace ${daysSinceBackup} días sin respaldar tus datos`
                  : 'Aún no has hecho un respaldo'}
              </p>
              <p className="text-xs text-amber-800 font-semibold mb-2">
                Descarga una copia de seguridad para no perder tu progreso.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={doExport}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-black text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 active:scale-95 transition"
                >
                  <Download size={14} /> Respaldar ahora
                </button>
                <button
                  onClick={() => setLastBackup(new Date().toISOString())}
                  className="text-amber-700 font-bold text-xs px-3 py-1.5 rounded-lg hover:bg-amber-100"
                >
                  Recordar luego
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VISTA 0: DÍA */}
        {viewMode === 0 && (
          <div className="flex flex-col gap-4">
            {habits.some((h) => habitAppliesOn(h, currentDate)) && (
              <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
                <p className="text-gray-500 font-bold text-sm mb-1">
                  Progreso diario
                </p>
                <p className="text-3xl font-black text-gray-900 mb-3">
                  {progress}%
                </p>
                <div className="w-full bg-gray-100 rounded-full h-3.5 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-3.5 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3">
              {habits.length === 0 ? (
                <div className="bg-white p-6 rounded-3xl border-2 border-dashed border-gray-200 text-center">
                  <p className="text-gray-500 font-semibold">
                    Sin hábitos configurados.
                  </p>
                </div>
              ) : (
                (() => {
                  const todayHabits = habits.filter((h) =>
                    habitAppliesOn(h, currentDate)
                  );
                  if (todayHabits.length === 0) {
                    return (
                      <div className="bg-white p-6 rounded-3xl border border-gray-100 text-center shadow-sm">
                        <div className="text-4xl mb-2">🌴</div>
                        <p className="font-black text-gray-900 text-lg mb-1">
                          Día libre
                        </p>
                        <p className="text-sm text-gray-500 font-semibold">
                          No tienes hábitos programados para hoy. ¡Descansa!
                        </p>
                      </div>
                    );
                  }
                  return todayHabits.map((habit) => {
                    const key = formatDateKey(currentDate);
                    const done = data[key]?.includes(habit.id);
                    const Icon = ICON_MAP[habit.icon] || PenTool;
                    return (
                      <div
                        key={habit.id}
                        onClick={() => toggleHabit(key, habit.id)}
                        className={`flex items-center p-4 rounded-3xl cursor-pointer transition-all border ${
                          done
                            ? 'bg-indigo-50/70 border-indigo-100 shadow-sm'
                            : 'bg-white border-gray-100 shadow-sm hover:shadow-md'
                        }`}
                      >
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors ${
                            done
                              ? 'bg-indigo-600 text-white'
                              : COLOR_MAP[habit.color] || COLOR_MAP.indigo
                          }`}
                        >
                          <Icon size={22} />
                        </div>
                        <div className="ml-4 flex-1 min-w-0">
                          <h3
                            className={`font-black text-lg leading-tight truncate ${
                              done ? 'text-indigo-900' : 'text-gray-900'
                            }`}
                          >
                            {habit.label}
                          </h3>
                          <p className="text-sm text-gray-500 font-semibold truncate">
                            {habit.desc}
                          </p>
                        </div>
                        <div
                          className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-2 transition-all ${
                            done
                              ? 'bg-indigo-600 border-indigo-600'
                              : 'border-gray-300'
                          }`}
                        >
                          {done && (
                            <Check
                              size={16}
                              strokeWidth={4}
                              className="text-white"
                            />
                          )}
                        </div>
                      </div>
                    );
                  });
                })()
              )}
            </div>
          </div>
        )}

        {/* VISTA 1: SEMANA */}
        {viewMode === 1 && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <div className="grid grid-cols-8 gap-2 mb-6">
              <div className="text-[10px] font-black text-gray-400 uppercase mt-2">
                Act.
              </div>
              {getDaysInWeek(currentDate).map((d) => {
                const today = isSameDay(d, new Date());
                return (
                  <div
                    key={d.toString()}
                    className="text-center flex flex-col items-center"
                  >
                    <span
                      className={`text-xs font-black mb-1 ${
                        today ? 'text-indigo-600' : 'text-gray-400'
                      }`}
                    >
                      {
                        ['L', 'M', 'X', 'J', 'V', 'S', 'D'][
                          d.getDay() === 0 ? 6 : d.getDay() - 1
                        ]
                      }
                    </span>
                    <span
                      className={`text-sm w-7 h-7 flex items-center justify-center rounded-full ${
                        today
                          ? 'bg-indigo-600 text-white font-black'
                          : 'text-gray-700 font-bold'
                      }`}
                    >
                      {d.getDate()}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-col gap-5">
              {habits.map((habit) => (
                <div
                  key={habit.id}
                  className="grid grid-cols-8 gap-2 items-center"
                >
                  <div className="text-sm font-black text-gray-700 truncate pr-2">
                    {habit.label.substring(0, 3)}
                  </div>
                  {getDaysInWeek(currentDate).map((d) => {
                    const key = formatDateKey(d),
                      done = data[key]?.includes(habit.id);
                    const applies = habitAppliesOn(habit, d);
                    if (!applies) {
                      return (
                        <div key={key} className="flex justify-center">
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-gray-200 text-gray-400 text-xs font-black">
                            —
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div
                        key={key}
                        onClick={() => toggleHabit(key, habit.id)}
                        className="flex justify-center"
                      >
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer transition-all active:scale-90 ${
                            done
                              ? 'bg-indigo-600 shadow-md shadow-indigo-200'
                              : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                        >
                          {done && (
                            <Check
                              size={16}
                              strokeWidth={4}
                              className="text-white"
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VISTA 2: MES */}
        {viewMode === 2 && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((d) => (
                <div
                  key={d}
                  className="text-center text-xs font-black text-gray-400 uppercase"
                >
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-y-3 gap-x-2">
              {(() => {
                const days = [];
                const y = currentDate.getFullYear(),
                  m = currentDate.getMonth();
                const first = new Date(y, m, 1),
                  total = new Date(y, m + 1, 0).getDate();
                const pad = first.getDay() === 0 ? 6 : first.getDay() - 1;
                for (let i = 0; i < pad; i++) days.push(<div key={`p${i}`} />);
                for (let dd = 1; dd <= total; dd++) {
                  const date = new Date(y, m, dd),
                    key = formatDateKey(date);
                  const marks = data[key] || [];
                  const applicable = habits.filter((h) =>
                    habitAppliesOn(h, date)
                  );
                  const tot = applicable.length;
                  const cnt = applicable.filter((h) =>
                    marks.includes(h.id)
                  ).length;
                  const today = isSameDay(date, new Date());
                  const ratio = tot > 0 ? cnt / tot : 0;
                  const hasApplicable = tot > 0;

                  // Estilos según ratio
                  let bg, numColor, barColor;
                  if (!hasApplicable) {
                    // Día sin hábitos programados (ej. domingo)
                    bg = 'bg-gray-100';
                    numColor = 'text-gray-400';
                    barColor = null;
                  } else if (ratio === 0) {
                    bg = 'bg-gray-50 hover:bg-gray-100';
                    numColor = 'text-gray-600';
                    barColor = 'bg-gray-300';
                  } else if (ratio < 0.5) {
                    bg = 'bg-indigo-50 hover:bg-indigo-100';
                    numColor = 'text-indigo-700';
                    barColor = 'bg-indigo-400';
                  } else if (ratio < 0.75) {
                    bg = 'bg-indigo-100 hover:bg-indigo-200';
                    numColor = 'text-indigo-800';
                    barColor = 'bg-indigo-500';
                  } else if (ratio < 1) {
                    bg = 'bg-indigo-300';
                    numColor = 'text-white';
                    barColor = 'bg-white';
                  } else {
                    bg = 'bg-indigo-600 shadow-md shadow-indigo-200';
                    numColor = 'text-white';
                    barColor = 'bg-white';
                  }

                  days.push(
                    <div
                      key={dd}
                      onClick={() => {
                        setCurrentDate(date);
                        setViewMode(0);
                      }}
                      className={`aspect-square rounded-2xl cursor-pointer transition-all active:scale-90 relative flex flex-col items-center justify-center gap-1 p-1 ${bg} ${
                        today ? 'ring-2 ring-indigo-600 ring-offset-2' : ''
                      }`}
                    >
                      <span
                        className={`text-sm font-black leading-none ${numColor}`}
                      >
                        {dd}
                      </span>
                      {hasApplicable && barColor && (
                        <div className="w-6 h-1 rounded-full bg-black/10 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${barColor}`}
                            style={{ width: `${ratio * 100}%` }}
                          />
                        </div>
                      )}
                    </div>
                  );
                }
                return days;
              })()}
            </div>
          </div>
        )}

        {/* VISTA 3: AÑO */}
        {viewMode === 3 &&
          (() => {
            // Calculamos todos los meses una sola vez y acumulamos el total
            let yearPos = 0,
              yearDone = 0;
            const monthlyStats = MONTHS.map((m, idx) => {
              const d = new Date(currentDate.getFullYear(), idx, 1);
              let pos = 0,
                done = 0;
              while (d.getMonth() === idx) {
                const marks = data[formatDateKey(d)] || [];
                for (const h of habits) {
                  if (!habitAppliesOn(h, d)) continue;
                  pos++;
                  if (marks.includes(h.id)) done++;
                }
                d.setDate(d.getDate() + 1);
              }
              yearPos += pos;
              yearDone += done;
              return {
                name: m,
                idx,
                pos,
                done,
                pct: pos > 0 ? Math.round((done / pos) * 100) : 0,
              };
            });
            const yearPct =
              yearPos > 0 ? Math.round((yearDone / yearPos) * 100) : 0;

            return (
              <div className="grid gap-4">
                {monthlyStats.map(({ name, idx, pct }) => (
                  <div
                    key={name}
                    onClick={() => {
                      const nd = new Date(currentDate);
                      nd.setMonth(idx);
                      setCurrentDate(nd);
                      setViewMode(2);
                    }}
                    className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 cursor-pointer active:scale-[0.98] transition-all"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-black text-gray-800 text-lg">
                        {name}
                      </span>
                      <span className="text-indigo-600 font-black bg-indigo-50 px-3 py-1 rounded-xl text-sm">
                        {pct}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-indigo-600 h-3 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                ))}

                {/* TOTAL DEL AÑO */}
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-3xl shadow-lg p-6 text-white mt-2">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-indigo-200 font-bold text-xs uppercase tracking-wider mb-1">
                        Progreso anual
                      </p>
                      <p className="font-black text-2xl">
                        Total {currentDate.getFullYear()}
                      </p>
                    </div>
                    <span className="font-black bg-white/20 backdrop-blur px-4 py-2 rounded-2xl text-xl">
                      {yearPct}%
                    </span>
                  </div>
                  <div className="w-full bg-indigo-800/50 rounded-full h-3.5 overflow-hidden mb-3">
                    <div
                      className="bg-white h-3.5 rounded-full transition-all duration-700"
                      style={{ width: `${yearPct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs font-bold text-indigo-100">
                    <span>{yearDone} completados</span>
                    <span>de {yearPos} posibles</span>
                  </div>
                </div>
              </div>
            );
          })()}

        {/* VISTA 4: PESO */}
        {viewMode === 4 && (() => {
          // Cálculos de progreso
          const latest = weightData.length > 0 ? weightData[weightData.length - 1].weight : null;
          const initial = parseFloat(initialWeight);
          const goal = parseFloat(weightGoal);
          const hasInitial = !isNaN(initial);
          const hasGoal = !isNaN(goal);
          const hasLatest = latest !== null;

          let lostOrGained = null;
          let remaining = null;
          let progressPct = null;
          let isLoss = true; // true = está bajando de peso, false = está subiendo

          if (hasInitial && hasLatest) {
            lostOrGained = initial - latest; // positivo = bajó; negativo = subió
          }
          if (hasLatest && hasGoal) {
            remaining = latest - goal; // positivo = todavía pesa más que la meta
          }
          if (hasInitial && hasGoal && hasLatest) {
            isLoss = initial > goal;
            const totalChange = Math.abs(initial - goal);
            const doneChange = isLoss
              ? Math.max(0, initial - latest)
              : Math.max(0, latest - initial);
            progressPct = totalChange > 0
              ? Math.min(100, Math.round((doneChange / totalChange) * 100))
              : 0;
          }

          const shown = [...weightData].reverse().slice(0, weightHistoryShown);
          const hasMore = weightData.length > weightHistoryShown;

          return (
            <div className="flex flex-col gap-6">
              {/* 1. Añadir registro */}
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                <h2 className="font-bold text-gray-900 mb-4">Añadir registro</h2>
                <div className="flex flex-col gap-3">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="text-xs font-bold text-gray-500 mb-1 block">
                        Fecha
                      </label>
                      <input
                        type="date"
                        value={newWeightDate}
                        onChange={(e) => setNewWeightDate(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="w-1/3">
                      <label className="text-xs font-bold text-gray-500 mb-1 block">
                        Peso (kg)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="0.0"
                        value={newWeight}
                        onChange={(e) => setNewWeight(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">
                      Comentarios (opcional)
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. después de entrenar..."
                      value={newWeightComment}
                      onChange={(e) => setNewWeightComment(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <button
                    onClick={addWeight}
                    disabled={!newWeight}
                    className="mt-2 w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold py-3 rounded-xl transition-all flex justify-center items-center gap-2 active:scale-95"
                  >
                    <Plus size={20} /> Guardar peso
                  </button>
                </div>
              </div>

              {/* 2. Evolución (gráfica) */}
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 pb-4">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="font-bold text-gray-900">Evolución de peso</h2>
                  {hasGoal && (
                    <span className="text-xs font-black bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full flex items-center gap-1">
                      <Target size={12} /> Meta: {weightGoal} kg
                    </span>
                  )}
                </div>
                {renderChart()}
              </div>

              {/* 3. Control del progreso */}
              {(hasInitial || hasGoal || hasLatest) && (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                  <h2 className="font-bold text-gray-900 mb-4">Control del progreso</h2>

                  {/* Fila superior: 3 valores */}
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    <div className="bg-gray-50 rounded-2xl p-3 text-center">
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1">Inicio</p>
                      <p className="font-black text-gray-900 text-lg">
                        {hasInitial ? `${initial.toFixed(1)}` : '—'}
                      </p>
                      <p className="text-[10px] font-bold text-gray-400">kg</p>
                    </div>
                    <div className="bg-indigo-50 rounded-2xl p-3 text-center">
                      <p className="text-[10px] font-black text-indigo-500 uppercase tracking-wider mb-1">Actual</p>
                      <p className="font-black text-indigo-900 text-lg">
                        {hasLatest ? `${latest.toFixed(1)}` : '—'}
                      </p>
                      <p className="text-[10px] font-bold text-indigo-400">kg</p>
                    </div>
                    <div className="bg-emerald-50 rounded-2xl p-3 text-center">
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-wider mb-1">Meta</p>
                      <p className="font-black text-emerald-900 text-lg">
                        {hasGoal ? `${goal.toFixed(1)}` : '—'}
                      </p>
                      <p className="text-[10px] font-bold text-emerald-500">kg</p>
                    </div>
                  </div>

                  {/* Progreso total */}
                  {progressPct !== null && (
                    <div className="mb-4">
                      <div className="flex justify-between items-baseline mb-2">
                        <span className="text-sm font-bold text-gray-600">Progreso total</span>
                        <span className="text-xl font-black text-indigo-600">{progressPct}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-3 rounded-full transition-all duration-700"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Resumen numérico */}
                  <div className="flex flex-col gap-2">
                    {lostOrGained !== null && (
                      <div className="flex justify-between items-center bg-gray-50 rounded-xl px-4 py-3">
                        <span className="text-sm font-semibold text-gray-600">
                          {lostOrGained >= 0 ? 'Kilos perdidos' : 'Kilos ganados'}
                        </span>
                        <span className={`font-black ${lostOrGained >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {lostOrGained >= 0 ? '−' : '+'}{Math.abs(lostOrGained).toFixed(1)} kg
                        </span>
                      </div>
                    )}
                    {remaining !== null && hasGoal && (
                      <div className="flex justify-between items-center bg-gray-50 rounded-xl px-4 py-3">
                        <span className="text-sm font-semibold text-gray-600">
                          {(isLoss && remaining > 0) || (!isLoss && remaining < 0) ? 'Faltan' : 'Superada la meta por'}
                        </span>
                        <span className="font-black text-gray-900">
                          {Math.abs(remaining).toFixed(1)} kg
                        </span>
                      </div>
                    )}
                  </div>

                  {!hasInitial && (
                    <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
                      <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-800 font-semibold">
                        Configura tu peso inicial en ajustes ⚙️ para ver tu progreso completo.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* 4. Historial */}
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                <h2 className="font-bold text-gray-900 mb-4">Historial</h2>
                {weightData.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">
                    Sin registros aún.
                  </p>
                ) : (
                  <>
                    {shown.map((r) => (
                      <div
                        key={r.id}
                        className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl mb-3"
                      >
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="font-black text-lg text-indigo-900">
                              {r.weight} kg
                            </span>
                            <span className="text-xs font-bold text-gray-400">
                              {formatDateReadable(r.date)}
                            </span>
                          </div>
                          {r.comment && (
                            <p className="text-sm text-gray-600 mt-1">
                              {r.comment}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => askDeleteWeight(r.id)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors ml-2"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                    {hasMore && (
                      <button
                        onClick={() => setWeightHistoryShown((n) => n + 10)}
                        className="w-full mt-2 py-3 rounded-xl bg-indigo-50 text-indigo-700 font-bold hover:bg-indigo-100 transition active:scale-95"
                      >
                        Ver más ({weightData.length - weightHistoryShown} restantes)
                      </button>
                    )}
                    {!hasMore && weightData.length > 10 && (
                      <button
                        onClick={() => setWeightHistoryShown(10)}
                        className="w-full mt-2 py-2.5 rounded-xl text-gray-500 font-bold hover:bg-gray-50 text-sm transition"
                      >
                        Mostrar menos
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })()}

        {/* VISTA 5: PLAN */}
        {viewMode === 5 && (
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-start mb-5">
                <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                  <span className="bg-orange-100 p-2 rounded-xl text-orange-600">
                    <Utensils size={20} />
                  </span>
                  Plan de alimentación
                </h2>
                <button
                  onClick={() => setShowMealEd(true)}
                  className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 active:scale-95"
                >
                  <Edit2 size={18} />
                </button>
              </div>
              <div className="bg-indigo-50 text-indigo-800 p-4 rounded-2xl mb-6 flex justify-between items-center">
                <span className="font-bold">Comidas por día:</span>
                <span className="text-2xl font-black">
                  {mealPlan.mealsPerDay}
                </span>
              </div>
              <div className="space-y-4">
                {mealPlan.sections.map((s) => (
                  <div
                    key={s.id}
                    className="border border-gray-100 p-4 rounded-2xl shadow-sm"
                  >
                    <h3 className="font-black text-gray-900 mb-3">{s.title}</h3>
                    {s.items.length === 0 ? (
                      <p className="text-sm text-gray-400 italic">
                        Sin elementos.
                      </p>
                    ) : (
                      s.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between bg-gray-50 p-2 rounded-xl px-3 mb-1"
                        >
                          <span className="font-semibold text-gray-600">
                            {item.name}:
                          </span>
                          <span className="text-gray-900 font-semibold">
                            {item.amount}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
          </>
        )}

        {/* === SECCIÓN PROYECTOS === */}
        {section === 'proyectos' && (() => {
          const projectNotes = notes[activeProject] || [];
          const pending = projectNotes.filter((n) => !n.done);
          const completed = projectNotes.filter((n) => n.done);
          const isCompletedOpen = !!showCompleted[activeProject];

          return (
            <div className="flex flex-col gap-4">
              {pending.length === 0 && completed.length === 0 ? (
                <div className="bg-white p-8 rounded-3xl border-2 border-dashed border-gray-200 text-center">
                  <div className="text-4xl mb-3">💡</div>
                  <p className="font-black text-gray-900 mb-1">Sin ideas todavía</p>
                  <p className="text-sm text-gray-500 font-semibold mb-4">
                    Toca "Añadir idea" para empezar.
                  </p>
                </div>
              ) : (
                <>
                  {pending.length === 0 && (
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 text-center shadow-sm">
                      <div className="text-3xl mb-2">🎉</div>
                      <p className="font-black text-gray-900">¡Todas las ideas terminadas!</p>
                      <p className="text-sm text-gray-500 font-semibold">
                        Añade más ideas o revisa las terminadas abajo.
                      </p>
                    </div>
                  )}
                  {pending.map((note) => (
                    <div
                      key={note.id}
                      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-3 group"
                    >
                      {/* Checkbox */}
                      <button
                        onClick={() => toggleNoteDone(activeProject, note.id)}
                        className="w-6 h-6 rounded-full border-2 border-gray-300 hover:border-indigo-500 flex items-center justify-center flex-shrink-0 transition-all active:scale-90"
                        aria-label="Marcar como terminada"
                      />
                      {/* Título inline editable */}
                      <input
                        type="text"
                        value={note.title}
                        onChange={(e) =>
                          updateNote(activeProject, note.id, { title: e.target.value })
                        }
                        placeholder="Escribe tu idea..."
                        className="flex-1 min-w-0 font-bold text-gray-900 bg-transparent focus:outline-none focus:bg-gray-50 rounded-lg px-2 py-1 text-base"
                      />
                      {/* Abrir detalle */}
                      <button
                        onClick={() =>
                          setNoteEditor({ projectId: activeProject, note, isNew: false })
                        }
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg flex-shrink-0 transition-colors"
                        aria-label="Abrir detalle"
                      >
                        <ArrowRight size={18} strokeWidth={2.5} />
                      </button>
                    </div>
                  ))}
                </>
              )}

              {/* Botón añadir idea */}
              <button
                onClick={() => addNote(activeProject)}
                className="flex items-center justify-center gap-2 p-3.5 rounded-2xl border-2 border-dashed border-gray-300 text-gray-500 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/50 transition font-bold active:scale-[0.99]"
              >
                <Plus size={18} /> Añadir idea
              </button>

              {/* Sección colapsable: terminadas */}
              {completed.length > 0 && (
                <div className="mt-4">
                  <button
                    onClick={() =>
                      setShowCompleted((prev) => ({
                        ...prev,
                        [activeProject]: !prev[activeProject],
                      }))
                    }
                    className="w-full flex items-center justify-between bg-white rounded-2xl border border-gray-100 px-4 py-3 hover:bg-gray-50 transition"
                  >
                    <span className="flex items-center gap-2 font-black text-gray-700">
                      {isCompletedOpen ? (
                        <ChevronDown size={18} />
                      ) : (
                        <ChevronUp size={18} className="rotate-180" />
                      )}
                      Terminadas
                      <span className="text-xs font-black bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                        {completed.length}
                      </span>
                    </span>
                  </button>

                  {isCompletedOpen && (
                    <div className="flex flex-col gap-2 mt-3">
                      {completed.map((note) => (
                        <div
                          key={note.id}
                          className="bg-gray-50 rounded-2xl border border-gray-100 p-4 flex items-center gap-3"
                        >
                          {/* Checkbox marcado (clic para desmarcar) */}
                          <button
                            onClick={() => toggleNoteDone(activeProject, note.id)}
                            className="w-6 h-6 rounded-full bg-emerald-500 border-2 border-emerald-500 hover:bg-emerald-600 flex items-center justify-center flex-shrink-0 transition-all active:scale-90"
                            aria-label="Desmarcar"
                          >
                            <Check size={14} strokeWidth={4} className="text-white" />
                          </button>
                          <span className="flex-1 min-w-0 font-bold text-gray-500 line-through truncate text-sm">
                            {note.title || '(sin título)'}
                          </span>
                          <button
                            onClick={() =>
                              setNoteEditor({ projectId: activeProject, note, isNew: false })
                            }
                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-white rounded-lg flex-shrink-0"
                          >
                            <ArrowRight size={16} strokeWidth={2.5} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })()}
      </main>

      {/* ── BOTTOM NAV ── */}
      {section === 'personales' && (
      <nav className="fixed bottom-0 w-full bg-white/90 backdrop-blur-md border-t border-gray-100 px-2 py-3 pb-6 z-40">
        <div className="flex justify-between items-center max-w-md mx-auto">
          {[
            { m: 0, I: CheckCircle2, l: 'Día' },
            { m: 1, I: CalendarDays, l: 'Sem' },
            { m: 2, I: LayoutGrid, l: 'Mes' },
            { m: 3, I: BarChart3, l: 'Año' },
            { m: 4, I: TrendingUp, l: 'Peso' },
            { m: 5, I: ClipboardList, l: 'Plan' },
          ].map(({ m, I, l }) => (
            <button
              key={m}
              onClick={() => setViewMode(m)}
              className={`flex flex-col items-center flex-1 transition-colors ${
                viewMode === m
                  ? 'text-indigo-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div
                className={`p-1.5 rounded-2xl transition-all ${
                  viewMode === m ? 'bg-indigo-50' : 'bg-transparent'
                }`}
              >
                <I size={22} strokeWidth={viewMode === m ? 2.5 : 2} />
              </div>
              <span className="text-[9px] font-bold mt-0.5">{l}</span>
            </button>
          ))}
        </div>
      </nav>
      )}

      {/* Bottom nav: proyectos */}
      {section === 'proyectos' && (
        <nav className="fixed bottom-0 w-full bg-white/90 backdrop-blur-md border-t border-gray-100 px-3 py-3 pb-6 z-40">
          <div className="flex gap-2 max-w-md mx-auto">
            {PROJECTS.map((p) => {
              const Icon = PROJECT_ICON_MAP[p.icon] || FolderKanban;
              const active = activeProject === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setActiveProject(p.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-sm transition-all ${
                    active
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                  {p.name}
                </button>
              );
            })}
          </div>
        </nav>
      )}

      {/* ── MODALES ── */}
      {showSettings && (
        <SettingsModal
          habits={habits}
          weightGoal={weightGoal}
          setWeightGoal={setWeightGoal}
          initialWeight={initialWeight}
          setInitialWeight={setInitialWeight}
          onClose={() => setShowSettings(false)}
          onEditHabit={(h) => setHabitEditor({ habit: h })}
          onNewHabit={() => setHabitEditor({ habit: null })}
          onDeleteHabit={askDeleteHabit}
          onExport={doExport}
          onImport={doImport}
          onReset={doReset}
        />
      )}

      {habitEditor && (
        <HabitEditorModal
          habit={habitEditor.habit}
          onClose={() => setHabitEditor(null)}
          onSave={saveHabit}
        />
      )}

      {showMealEd && (
        <MealEditorModal
          plan={mealPlan}
          onClose={() => setShowMealEd(false)}
          onSave={(p) => {
            setMealPlan(p);
            setShowMealEd(false);
            showToast('Plan actualizado');
          }}
        />
      )}

      {noteEditor && (
        <NoteEditorModal
          projectId={noteEditor.projectId}
          note={noteEditor.note}
          isNew={noteEditor.isNew}
          onClose={() => {
            // Si era nueva y el título quedó vacío, eliminarla
            if (noteEditor.isNew) {
              const current = (notes[noteEditor.projectId] || []).find(
                (n) => n.id === noteEditor.note.id
              );
              if (current && !current.title.trim() && !current.desc.trim()) {
                deleteNote(noteEditor.projectId, noteEditor.note.id);
              }
            }
            setNoteEditor(null);
          }}
          onSave={(fields) => {
            updateNote(noteEditor.projectId, noteEditor.note.id, fields);
            setNoteEditor(null);
            showToast('Idea guardada');
          }}
          onDelete={() => askDeleteNote(noteEditor.projectId, noteEditor.note.id)}
          projectName={
            PROJECTS.find((p) => p.id === noteEditor.projectId)?.name || ''
          }
        />
      )}

      {confirm && (
        <ConfirmDialog
          title={confirm.title}
          msg={confirm.msg}
          btn={confirm.btn}
          onConfirm={confirm.action}
          onCancel={() => setConfirm(null)}
        />
      )}

      {toast && (
        <div
          className={`fixed bottom-24 left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-2xl shadow-lg z-[100] font-bold text-sm flex items-center gap-2 ${
            toast.type === 'err'
              ? 'bg-red-600 text-white'
              : 'bg-gray-900 text-white'
          }`}
        >
          {toast.type === 'err' ? (
            <AlertCircle size={16} />
          ) : (
            <Check size={16} strokeWidth={3} />
          )}
          {toast.msg}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
//  MODAL: Confirmación
// ─────────────────────────────────────────────
function ConfirmDialog({ title, msg, btn = 'Confirmar', onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90] flex items-end sm:items-center justify-center p-4 font-nunito">
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl">
        <h3 className="font-black text-xl text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 font-semibold mb-6">{msg}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700"
          >
            {btn}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  MODAL: Crear / Editar hábito
// ─────────────────────────────────────────────
function HabitEditorModal({ habit, onClose, onSave }) {
  const [label, setLabel] = useState(habit?.label || '');
  const [desc, setDesc] = useState(habit?.desc || '');
  const [icon, setIcon] = useState(habit?.icon || ICON_LIST[0]);
  const [color, setColor] = useState(habit?.color || COLOR_LIST[0]);

  // Días por defecto para hábitos nuevos: L-V
  const currentDays = habit?.days || [1, 2, 3, 4, 5];
  const daysText =
    currentDays.length === 7
      ? 'Todos los días'
      : currentDays.map((d) => DAY_LETTERS[d - 1]).join(' · ');

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90] flex items-end sm:items-center justify-center p-4 font-nunito">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h3 className="font-black text-xl text-gray-900">
            {habit ? 'Editar hábito' : 'Nuevo hábito'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 block">
              Nombre
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              maxLength={30}
              placeholder="Ej. Meditar"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 block">
              Descripción
            </label>
            <input
              type="text"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              maxLength={50}
              placeholder="Ej. 10 min al despertar"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Info de días aplicables (solo lectura) */}
          <div className="bg-indigo-50 rounded-xl p-3">
            <p className="text-xs font-bold text-indigo-700 uppercase tracking-wide mb-1">
              Días aplicables
            </p>
            <p className="font-black text-indigo-900">{daysText}</p>
            <p className="text-[11px] text-indigo-700/70 font-semibold mt-1">
              Para cambiar días, contacta al desarrollador.
            </p>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 mb-2 block">
              Icono
            </label>
            <div className="grid grid-cols-6 gap-2">
              {ICON_LIST.map((name) => {
                const I = ICON_MAP[name];
                return (
                  <button
                    key={name}
                    onClick={() => setIcon(name)}
                    className={`aspect-square rounded-xl flex items-center justify-center transition-all ${
                      icon === name
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <I size={22} />
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 mb-2 block">
              Color
            </label>
            <div className="grid grid-cols-5 gap-2">
              {COLOR_LIST.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`aspect-square rounded-xl flex items-center justify-center transition-all ${
                    COLOR_MAP[c]
                  } ${
                    color === c ? 'ring-2 ring-offset-2 ring-indigo-600' : ''
                  }`}
                >
                  {color === c && <Check size={18} strokeWidth={3} />}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-gray-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              if (!label.trim()) return;
              onSave({
                id: habit?.id,
                label: label.trim(),
                desc: desc.trim() || 'Sin descripción.',
                icon,
                color,
                days: currentDays,
              });
            }}
            disabled={!label.trim()}
            className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 disabled:bg-indigo-300"
          >
            {habit ? 'Guardar' : 'Crear'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  MODAL: Configuración
// ─────────────────────────────────────────────
function SettingsModal({
  habits,
  weightGoal,
  setWeightGoal,
  initialWeight,
  setInitialWeight,
  onClose,
  onEditHabit,
  onNewHabit,
  onDeleteHabit,
  onExport,
  onImport,
  onReset,
}) {
  const fileRef = useRef(null);
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[80] flex items-end sm:items-center justify-center font-nunito">
      <div className="bg-gray-50 rounded-t-3xl sm:rounded-3xl w-full max-w-md shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-white">
          <h3 className="font-black text-xl text-gray-900 flex items-center gap-2">
            <SettingsIcon size={22} /> Configuración
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex flex-col gap-5">
          {/* Hábitos */}
          <div className="bg-white rounded-2xl p-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-black text-gray-900">Mis hábitos</h4>
            </div>
            {habits.length === 0 ? (
              <p className="text-sm text-gray-400 italic">Sin hábitos.</p>
            ) : (
              habits.map((habit) => {
                const Icon = ICON_MAP[habit.icon] || PenTool;
                const days = habit.days || [1, 2, 3, 4, 5, 6, 7];
                const daysTxt =
                  days.length === 7
                    ? 'Diario'
                    : days.map((d) => DAY_LETTERS[d - 1]).join('·');
                return (
                  <div
                    key={habit.id}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 mb-1"
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        COLOR_MAP[habit.color] || COLOR_MAP.indigo
                      }`}
                    >
                      <Icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-gray-800 truncate">
                        {habit.label}
                      </p>
                      <p className="text-xs text-indigo-600 font-black truncate">
                        {daysTxt}
                      </p>
                    </div>
                    <button
                      onClick={() => onEditHabit(habit)}
                      className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => onDeleteHabit(habit.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Peso inicial */}
          <div className="bg-white rounded-2xl p-4">
            <h4 className="font-black text-gray-900 mb-3 flex items-center gap-2">
              <TrendingUp size={18} className="text-indigo-600" /> Peso inicial
            </h4>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                step="0.1"
                placeholder="Ej. 124.2"
                value={initialWeight}
                onChange={(e) => setInitialWeight(e.target.value)}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-gray-500 font-bold px-2">kg</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Tu peso cuando empezaste. Se usa para calcular tu progreso total.
            </p>
          </div>

          {/* Meta de peso */}
          <div className="bg-white rounded-2xl p-4">
            <h4 className="font-black text-gray-900 mb-3 flex items-center gap-2">
              <Target size={18} className="text-emerald-600" /> Meta de peso
            </h4>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                step="0.1"
                placeholder="Ej. 79"
                value={weightGoal}
                onChange={(e) => setWeightGoal(e.target.value)}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-gray-500 font-bold px-2">kg</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Se muestra como línea verde en tu gráfica.
            </p>
          </div>

          {/* Backup */}
          <div className="bg-white rounded-2xl p-4">
            <h4 className="font-black text-gray-900 mb-3">
              Copia de seguridad
            </h4>
            <div className="flex flex-col gap-2">
              <button
                onClick={onExport}
                className="w-full bg-indigo-50 text-indigo-700 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-100"
              >
                <Download size={18} /> Exportar mis datos
              </button>
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full bg-emerald-50 text-emerald-700 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-100"
              >
                <Upload size={18} /> Importar datos
              </button>
              <input
                ref={fileRef}
                type="file"
                accept=".json,application/json"
                onChange={onImport}
                className="hidden"
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Exporta un archivo .json para no perder tu progreso.
            </p>
          </div>

          {/* Reset */}
          <div className="bg-red-50 rounded-2xl p-4 border border-red-100">
            <h4 className="font-black text-red-900 mb-2 flex items-center gap-2">
              <AlertCircle size={18} /> Zona de peligro
            </h4>
            <button
              onClick={onReset}
              className="w-full bg-white border border-red-200 text-red-700 font-bold py-3 rounded-xl hover:bg-red-50"
            >
              Reiniciar todos los datos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  MODAL: Editor del plan de comidas
// ─────────────────────────────────────────────
function MealEditorModal({ plan, onClose, onSave }) {
  const [draft, setDraft] = useState(() => JSON.parse(JSON.stringify(plan)));

  const setMeals = (v) =>
    setDraft((d) => ({ ...d, mealsPerDay: parseInt(v) || 0 }));
  const setTitle = (sid, t) =>
    setDraft((d) => ({
      ...d,
      sections: d.sections.map((s) => (s.id === sid ? { ...s, title: t } : s)),
    }));
  const addSection = () =>
    setDraft((d) => ({
      ...d,
      sections: [
        ...d.sections,
        { id: genId(), title: 'Nueva sección', items: [] },
      ],
    }));
  const delSection = (sid) =>
    setDraft((d) => ({
      ...d,
      sections: d.sections.filter((s) => s.id !== sid),
    }));
  const addItem = (sid) =>
    setDraft((d) => ({
      ...d,
      sections: d.sections.map((s) =>
        s.id === sid
          ? { ...s, items: [...s.items, { id: genId(), name: '', amount: '' }] }
          : s
      ),
    }));
  const setItem = (sid, iid, f, v) =>
    setDraft((d) => ({
      ...d,
      sections: d.sections.map((s) =>
        s.id === sid
          ? {
              ...s,
              items: s.items.map((i) => (i.id === iid ? { ...i, [f]: v } : i)),
            }
          : s
      ),
    }));
  const delItem = (sid, iid) =>
    setDraft((d) => ({
      ...d,
      sections: d.sections.map((s) =>
        s.id === sid ? { ...s, items: s.items.filter((i) => i.id !== iid) } : s
      ),
    }));

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[80] flex items-end sm:items-center justify-center font-nunito">
      <div className="bg-gray-50 rounded-t-3xl sm:rounded-3xl w-full max-w-md shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-white">
          <h3 className="font-black text-xl text-gray-900">Editar plan</h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex flex-col gap-4">
          <div className="bg-white rounded-2xl p-4">
            <label className="text-xs font-bold text-gray-500 mb-1 block">
              Comidas por día
            </label>
            <input
              type="number"
              min="1"
              value={draft.mealsPerDay}
              onChange={(e) => setMeals(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {draft.sections.map((s) => (
            <div key={s.id} className="bg-white rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <input
                  value={s.title}
                  onChange={(e) => setTitle(s.id, e.target.value)}
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 font-black text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={() => delSection(s.id)}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {s.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <input
                      placeholder="Nombre"
                      value={item.name}
                      onChange={(e) =>
                        setItem(s.id, item.id, 'name', e.target.value)
                      }
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                      placeholder="Cantidad"
                      value={item.amount}
                      onChange={(e) =>
                        setItem(s.id, item.id, 'amount', e.target.value)
                      }
                      className="w-24 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      onClick={() => delItem(s.id, item.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addItem(s.id)}
                  className="flex items-center justify-center gap-1 py-2 rounded-lg border-2 border-dashed border-gray-200 text-gray-500 hover:border-indigo-400 hover:text-indigo-600 text-sm font-bold"
                >
                  <Plus size={14} /> Añadir item
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={addSection}
            className="flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-gray-300 text-gray-500 hover:border-indigo-400 hover:text-indigo-600 font-bold"
          >
            <Plus size={18} /> Añadir sección
          </button>
        </div>

        <div className="p-5 border-t border-gray-100 bg-white flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200"
          >
            Cancelar
          </button>
          <button
            onClick={() => onSave(draft)}
            className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700"
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  MODAL: Detalle / edición de nota
// ─────────────────────────────────────────────
function NoteEditorModal({ projectId, note, isNew, projectName, onClose, onSave, onDelete }) {
  const [title, setTitle] = useState(note.title || '');
  const [desc, setDesc] = useState(note.desc || '');
  const titleRef = useRef(null);

  useEffect(() => {
    // Si es nueva, hacer focus automático en el título
    if (isNew && titleRef.current) {
      setTimeout(() => titleRef.current?.focus(), 100);
    }
  }, [isNew]);

  const handleSave = () => {
    onSave({ title: title.trim(), desc: desc.trim() });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90] flex items-end sm:items-center justify-center p-4 font-nunito">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-wider mb-0.5">
              {projectName}
            </p>
            <h3 className="font-black text-xl text-gray-900 truncate">
              {isNew ? 'Nueva idea' : 'Editar idea'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 flex-shrink-0 ml-2"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex flex-col gap-4 flex-1">
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 block">
              Idea
            </label>
            <input
              ref={titleRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Video sobre KPIs básicos"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex-1 flex flex-col">
            <label className="text-xs font-bold text-gray-500 mb-1 block">
              Descripción / notas
            </label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Detalles, guion, referencias, links..."
              rows={8}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>
        </div>

        <div className="p-5 border-t border-gray-100 flex gap-3">
          {!isNew && (
            <button
              onClick={onDelete}
              className="p-3 rounded-xl bg-red-50 text-red-600 font-bold hover:bg-red-100 active:scale-95 transition"
              aria-label="Eliminar"
            >
              <Trash2 size={18} />
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
