import { useCallback, useMemo, useState } from 'react';
import { ROOT_ID } from '../domain/tree.constants';
import { getNode, resolveNext } from '../domain/tree.helpers';
import type { OutcomeNode, QuestionNode } from '../domain/tree.types';
import type { HistoryEntry } from './journey.types';

export interface JourneyApi {
  currentNodeId: string;
  currentNode: QuestionNode | OutcomeNode;
  history: HistoryEntry[];
  canUndo: boolean;
  isAtOutcome: boolean;
  /** Readable trace of committed answers, e.g. "PostgreSQL in production? — No". */
  pathRecap: { prompt: string; answer: string }[];
  /** Commit the branch at the given index of the current question node. */
  commit: (branchIndex: number) => void;
  undo: () => void;
  reset: () => void;
}

/** In-memory journey state over an answer-history stack. No persistence. */
export function useJourney(): JourneyApi {
  const [currentNodeId, setCurrentNodeId] = useState<string>(ROOT_ID);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const currentNode = getNode(currentNodeId);
  const isAtOutcome = currentNode.kind === 'outcome';
  const canUndo = history.length > 0;

  const commit = useCallback(
    (branchIndex: number) => {
      const node = getNode(currentNodeId);
      if (node.kind !== 'question') return;
      const nextId = resolveNext(currentNodeId, branchIndex);
      if (!nextId) return;
      const branch = node.branches[branchIndex];
      setHistory((prev) => [
        ...prev,
        {
          fromNodeId: currentNodeId,
          branchIndex,
          branchLabel: branch.label,
          toNodeId: nextId,
        },
      ]);
      setCurrentNodeId(nextId);
    },
    [currentNodeId],
  );

  const undo = useCallback(() => {
    setHistory((prev) => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      setCurrentNodeId(last.fromNodeId);
      return prev.slice(0, -1);
    });
  }, []);

  const reset = useCallback(() => {
    setHistory([]);
    setCurrentNodeId(ROOT_ID);
  }, []);

  const pathRecap = useMemo(
    () =>
      history.map((entry) => {
        const q = getNode(entry.fromNodeId);
        return {
          prompt: q.kind === 'question' ? q.prompt : entry.fromNodeId,
          answer: entry.branchLabel,
        };
      }),
    [history],
  );

  return {
    currentNodeId,
    currentNode,
    history,
    canUndo,
    isAtOutcome,
    pathRecap,
    commit,
    undo,
    reset,
  };
}
