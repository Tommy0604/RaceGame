import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";


export interface CounterState {
  blocksCount: number;
  blocksSeed: number;
  startTime: number;
  endTime: number;
  phase: string;
  start: () => void;
  restart: () => void;
  end: () => void;
  destory: () => void;
}
export default create(
  subscribeWithSelector<CounterState>((set) => {
    return {
      blocksCount: 10,
      blocksSeed: 0,

      /** Time */
      startTime: 0,
      endTime: 0,

      /** phase */
      phase: 'ready',

      start: () => {
        set((state: { phase: string }) => {
          if (state.phase === 'ready')
            return { phase: 'playing', startTime: Date.now() };
          return {}
        })
      },

      restart: () => {
        set((state: { phase: string }) => {
          if (state.phase === 'playing' || state.phase === 'ended' || state.phase === 'destory')
            return { phase: 'ready', blocksSeed: Math.random() };
          return {}
        })
      },

      end: () => {
        set((state: { phase: string }) => {
          if (state.phase === 'playing')
            return { phase: 'ended', endTime: Date.now() };
          return {}
        })
      },

      destory: () => {
        set((state: { phase: string }) => {
          if (state.phase === 'playing')
            return { phase: 'destory', endTime: Date.now() };
          return {}
        })
      }
    }
  })
)