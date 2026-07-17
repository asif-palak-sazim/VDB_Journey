import { COLORS } from './ui.constants';

interface PowerBarProps {
  canUndo: boolean;
  onUndo: () => void;
  onRequestReset: () => void;
}

export function PowerBar({ canUndo, onUndo, onRequestReset }: PowerBarProps) {
  return (
    <div style={styles.wrap}>
      <div style={styles.title}>VDB Journey</div>
      <div style={styles.buttons}>
        <button
          onClick={onUndo}
          disabled={!canUndo}
          style={{ ...styles.btn, ...(canUndo ? null : styles.btnDisabled) }}
          title="Revert to previous state (Backspace)"
        >
          ↩ Undo
        </button>
        <button
          onClick={onRequestReset}
          style={styles.btn}
          title="Reset the journey"
        >
          ⟳ Reset
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    pointerEvents: 'none',
  },
  title: {
    color: COLORS.panelText,
    fontSize: 18,
    fontWeight: 700,
    background: COLORS.panelBg,
    padding: '8px 16px',
    borderRadius: 10,
    letterSpacing: 0.5,
  },
  buttons: { display: 'flex', gap: 10, pointerEvents: 'auto' },
  btn: {
    padding: '10px 16px',
    fontSize: 15,
    borderRadius: 10,
    border: 'none',
    background: COLORS.panelBg,
    color: COLORS.panelText,
    cursor: 'pointer',
    fontWeight: 600,
  },
  btnDisabled: { opacity: 0.4, cursor: 'not-allowed' },
};
