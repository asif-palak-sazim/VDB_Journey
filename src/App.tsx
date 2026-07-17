import { Canvas } from '@react-three/fiber';
import { useCallback, useEffect, useState } from 'react';
import { Scene } from './three/Scene';
import { useJourney } from './state/useJourney';
import { useKeyboard } from './ui/useKeyboard';
import { QuestionPanel } from './ui/QuestionPanel';
import { PowerBar } from './ui/PowerBar';
import { OutcomeCard } from './ui/OutcomeCard';
import { ConfirmDialog } from './ui/ConfirmDialog';

export default function App() {
  const journey = useJourney();
  const [highlighted, setHighlighted] = useState(0);
  const [confirmingReset, setConfirmingReset] = useState(false);

  const currentNode = journey.currentNode;
  const isQuestion = currentNode.kind === 'question';
  const branchCount = currentNode.kind === 'question' ? currentNode.branches.length : 0;

  // Reset highlight when the node changes.
  useEffect(() => {
    setHighlighted(0);
  }, [journey.currentNodeId]);

  const prev = useCallback(
    () => setHighlighted((h) => (h - 1 + branchCount) % branchCount),
    [branchCount],
  );
  const next = useCallback(
    () => setHighlighted((h) => (h + 1) % branchCount),
    [branchCount],
  );
  const commit = useCallback(() => {
    if (isQuestion) journey.commit(highlighted);
  }, [isQuestion, journey, highlighted]);

  useKeyboard({
    onPrev: prev,
    onNext: next,
    onCommit: commit,
    onUndo: journey.undo,
    suspended: confirmingReset || !isQuestion,
  });

  const confirmReset = () => {
    journey.reset();
    setConfirmingReset(false);
  };

  return (
    <>
      <Canvas shadows camera={{ position: [0, 7, 13], fov: 50 }}>
        <Scene
          currentNodeId={journey.currentNodeId}
          highlightedBranchIndex={isQuestion ? highlighted : null}
          isAtOutcome={journey.isAtOutcome}
        />
      </Canvas>

      <PowerBar
        canUndo={journey.canUndo}
        onUndo={journey.undo}
        onRequestReset={() => setConfirmingReset(true)}
      />

      {isQuestion && journey.currentNode.kind === 'question' && (
        <QuestionPanel
          node={journey.currentNode}
          highlightedIndex={highlighted}
          onSelect={setHighlighted}
          onCommit={commit}
        />
      )}

      {journey.isAtOutcome && journey.currentNode.kind === 'outcome' && (
        <OutcomeCard
          node={journey.currentNode}
          pathRecap={journey.pathRecap}
          canUndo={journey.canUndo}
          onUndo={journey.undo}
          onStartOver={journey.reset}
        />
      )}

      {confirmingReset && (
        <ConfirmDialog
          message="Reset journey and return to the start?"
          onConfirm={confirmReset}
          onCancel={() => setConfirmingReset(false)}
        />
      )}
    </>
  );
}
