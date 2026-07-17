import { Canvas } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import { Scene } from './three/Scene';
import { useJourney } from './state/useJourney';

export default function App() {
  const journey = useJourney();
  const [highlighted, setHighlighted] = useState(0);

  const branchCount =
    journey.currentNode.kind === 'question'
      ? journey.currentNode.branches.length
      : 0;

  // Reset highlight when the node changes.
  useEffect(() => {
    setHighlighted(0);
  }, [journey.currentNodeId]);

  // Temporary keyboard handler for Task 6 verification (full UI in Task 7).
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (journey.currentNode.kind !== 'question') return;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        setHighlighted((h) => (h - 1 + branchCount) % branchCount);
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        setHighlighted((h) => (h + 1) % branchCount);
      } else if (e.key === 'Enter') {
        journey.commit(highlighted);
      } else if (e.key === 'Backspace') {
        journey.undo();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [journey, highlighted, branchCount]);

  return (
    <Canvas shadows camera={{ position: [0, 7, 13], fov: 50 }}>
      <Scene
        currentNodeId={journey.currentNodeId}
        highlightedBranchIndex={
          journey.currentNode.kind === 'question' ? highlighted : null
        }
        isAtOutcome={journey.isAtOutcome}
      />
    </Canvas>
  );
}
