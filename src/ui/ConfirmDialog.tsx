import { COLORS } from './ui.constants';

interface ConfirmDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ message, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <div style={styles.backdrop}>
      <div style={styles.dialog}>
        <div style={styles.message}>{message}</div>
        <div style={styles.actions}>
          <button style={{ ...styles.btn, ...styles.cancel }} onClick={onCancel}>
            Cancel
          </button>
          <button style={{ ...styles.btn, ...styles.confirm }} onClick={onConfirm}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  backdrop: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0,0,0,0.45)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  dialog: {
    background: COLORS.panelBg,
    color: COLORS.panelText,
    padding: '28px 32px',
    borderRadius: 16,
    width: 'min(420px, 90vw)',
    textAlign: 'center',
  },
  message: { fontSize: 18, marginBottom: 22, fontWeight: 600 },
  actions: { display: 'flex', gap: 12, justifyContent: 'center' },
  btn: {
    padding: '10px 22px',
    fontSize: 15,
    borderRadius: 10,
    border: 'none',
    cursor: 'pointer',
    fontWeight: 600,
  },
  cancel: { background: 'rgba(255,255,255,0.14)', color: COLORS.panelText },
  confirm: { background: COLORS.edgeHighlight, color: '#fff' },
};
