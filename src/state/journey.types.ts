/** One committed step in the journey. */
export interface HistoryEntry {
  fromNodeId: string;
  branchIndex: number;
  branchLabel: string;
  toNodeId: string;
}

export interface JourneyState {
  currentNodeId: string;
  history: HistoryEntry[];
}
