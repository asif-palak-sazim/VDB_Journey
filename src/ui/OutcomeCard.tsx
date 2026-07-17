import type { OutcomeNode } from '../domain/tree.types';
import { COLORS, DB_COLOR } from './ui.constants';

interface OutcomeCardProps {
  node: OutcomeNode;
  pathRecap: { prompt: string; answer: string }[];
  canUndo: boolean;
  onUndo: () => void;
  onStartOver: () => void;
}

export function OutcomeCard({
  node,
  pathRecap,
  canUndo,
  onUndo,
  onStartOver,
}: OutcomeCardProps) {
  const accent = DB_COLOR[node.database];
  return (
    <div style={styles.wrap}>
      <div style={{ ...styles.badge, background: accent }}>Recommended</div>
      <div style={styles.dbName}>
        {node.database}
        {node.qualifier ? (
          <span style={styles.qualifier}> · {node.qualifier}</span>
        ) : null}
      </div>
      <div style={styles.neutral}>{node.neutralLine}</div>

      {node.notes.length > 0 && (
        <ul style={styles.notes}>
          {node.notes.map((note, i) => (
            <li key={i} style={styles.note}>
              {note}
            </li>
          ))}
        </ul>
      )}

      <div style={styles.recapTitle}>Your path</div>
      <ol style={styles.recap}>
        {pathRecap.map((step, i) => (
          <li key={i} style={styles.recapItem}>
            <span style={styles.recapPrompt}>{step.prompt}</span>
            <span style={{ ...styles.recapAnswer, color: accent }}>
              {step.answer}
            </span>
          </li>
        ))}
      </ol>

      <div style={styles.actions}>
        <button
          onClick={onUndo}
          disabled={!canUndo}
          style={{ ...styles.btn, ...styles.undo, ...(canUndo ? null : styles.disabled) }}
        >
          ↩ Step back
        </button>
        <button
          onClick={onStartOver}
          style={{ ...styles.btn, background: accent }}
        >
          ⟳ Start over
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'min(560px, 92vw)',
    maxHeight: '82vh',
    overflowY: 'auto',
    background: COLORS.panelBg,
    color: COLORS.panelText,
    borderRadius: 20,
    padding: '28px 30px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.45)',
    zIndex: 15,
  },
  badge: {
    display: 'inline-block',
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: '#fff',
    padding: '4px 12px',
    borderRadius: 20,
    marginBottom: 12,
  },
  dbName: { fontSize: 34, fontWeight: 800, marginBottom: 8 },
  qualifier: { fontSize: 20, fontWeight: 500, opacity: 0.8 },
  neutral: { fontSize: 15, lineHeight: 1.5, opacity: 0.85, marginBottom: 16 },
  notes: { margin: '0 0 18px', paddingLeft: 20 },
  note: { fontSize: 14.5, lineHeight: 1.5, marginBottom: 6 },
  recapTitle: {
    fontSize: 12,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    opacity: 0.6,
    marginBottom: 10,
  },
  recap: { listStyle: 'none', padding: 0, margin: '0 0 22px' },
  recapItem: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 16,
    padding: '7px 0',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    fontSize: 14,
  },
  recapPrompt: { opacity: 0.8, textAlign: 'left', flex: 1 },
  recapAnswer: { fontWeight: 700, whiteSpace: 'nowrap' },
  actions: { display: 'flex', gap: 12 },
  btn: {
    flex: 1,
    padding: '12px 18px',
    fontSize: 15,
    fontWeight: 700,
    borderRadius: 10,
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
  },
  undo: { background: 'rgba(255,255,255,0.16)' },
  disabled: { opacity: 0.4, cursor: 'not-allowed' },
};
