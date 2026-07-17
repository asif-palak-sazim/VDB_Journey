import type { QuestionNode } from '../domain/tree.types';
import { COLORS } from './ui.constants';

interface QuestionPanelProps {
  node: QuestionNode;
  highlightedIndex: number;
  onSelect: (index: number) => void;
  onCommit: () => void;
}

export function QuestionPanel({
  node,
  highlightedIndex,
  onSelect,
  onCommit,
}: QuestionPanelProps) {
  return (
    <div style={styles.wrap}>
      <div style={styles.nodeId}>{node.id}</div>
      <div style={styles.prompt}>{node.prompt}</div>
      <div style={styles.branches}>
        {node.branches.map((branch, i) => {
          const active = i === highlightedIndex;
          return (
            <button
              key={i}
              onClick={() => {
                onSelect(i);
                onCommit();
              }}
              onMouseEnter={() => onSelect(i)}
              style={{
                ...styles.branch,
                ...(active ? styles.branchActive : null),
              }}
            >
              {branch.label}
            </button>
          );
        })}
      </div>
      <div style={styles.hint}>
        Use <kbd style={styles.kbd}>←</kbd> <kbd style={styles.kbd}>→</kbd> to
        choose, <kbd style={styles.kbd}>Enter</kbd> to confirm
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: {
    position: 'absolute',
    bottom: 32,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 'min(680px, 92vw)',
    background: COLORS.panelBg,
    color: COLORS.panelText,
    borderRadius: 16,
    padding: '20px 24px',
    boxShadow: '0 12px 40px rgba(0,0,0,0.35)',
    backdropFilter: 'blur(6px)',
    textAlign: 'center',
  },
  nodeId: {
    fontSize: 12,
    letterSpacing: 2,
    opacity: 0.6,
    marginBottom: 6,
  },
  prompt: { fontSize: 19, lineHeight: 1.4, marginBottom: 18, fontWeight: 600 },
  branches: { display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' },
  branch: {
    flex: '1 1 auto',
    minWidth: 140,
    padding: '12px 18px',
    fontSize: 16,
    borderRadius: 10,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: 'rgba(255,255,255,0.25)',
    background: 'rgba(255,255,255,0.06)',
    color: COLORS.panelText,
    cursor: 'pointer',
    transition: 'all 120ms ease',
  },
  branchActive: {
    borderColor: COLORS.edgeHighlight,
    background: COLORS.edgeHighlight,
    transform: 'scale(1.04)',
  },
  hint: { marginTop: 16, fontSize: 13, opacity: 0.7 },
  kbd: {
    background: 'rgba(255,255,255,0.15)',
    borderRadius: 5,
    padding: '2px 7px',
    fontFamily: 'monospace',
  },
};
