import React, { createContext, useState, useContext, useMemo } from 'react';

export type PlayerState = 'hidden' | 'minimized' | 'full';

const PlayerContext = createContext<
  [PlayerState, (playerSize: PlayerState) => void] | null
>(null);

function PlayerContextProvider(props: any) {
  const [playerSize, setPlayerSize] = useState<PlayerState>('hidden');
  const value = useMemo(() => [playerSize, setPlayerSize], [playerSize]);
  return <PlayerContext.Provider {...props} value={value} />;
}

function usePlayerState() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error(
      'usePlayerState must be used within a PlayerContextProvider'
    );
  }
  return context;
}

export { usePlayerState, PlayerContextProvider };
