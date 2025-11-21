import AsyncStorage from '@react-native-async-storage/async-storage';
import { StateCreator, StoreMutatorIdentifier } from 'zustand';

/**
 * Persistence middleware options
 */
export interface PersistOptions<T> {
  /** Storage key (e.g., '@hacknews:theme') */
  name: string;
  /** Version number for migrations */
  version?: number;
  /** Migration function for version upgrades */
  migrate?: (persistedState: unknown, version: number) => T;
  /** Merge strategy for hydration (default: replace) */
  merge?: (persistedState: Partial<T>, currentState: T) => T;
  /** Fields to exclude from persistence */
  partialize?: (state: T) => Partial<T>;
  /** Called on hydration error */
  onError?: (error: Error) => void;
}

/**
 * Persistence middleware type definition
 */
export type PersistMiddleware = <
  T,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = []
>(
  config: StateCreator<T, Mps, Mcs>,
  options: PersistOptions<T>
) => StateCreator<T, Mps, Mcs>;

/**
 * Default merge strategy - replace entire state
 */
const defaultMerge = <T>(persistedState: Partial<T>, _currentState: T): T => {
  return persistedState as T;
};

/**
 * Default partialize - persist entire state
 */
const defaultPartialize = <T>(state: T): Partial<T> => {
  return state;
};

/**
 * Zustand persistence middleware using AsyncStorage
 *
 * Features:
 * - Automatic hydration on store creation
 * - Automatic persistence on every state change
 * - Version-based migrations
 * - Error handling with fallbacks
 * - Partial state persistence
 * - Custom merge strategies
 *
 * @example
 * ```typescript
 * const useStore = create(
 *   persist<MyState>(
 *     (set) => ({
 *       count: 0,
 *       increment: () => set((state) => ({ count: state.count + 1 }))
 *     }),
 *     {
 *       name: '@myapp:store',
 *       version: 1
 *     }
 *   )
 * );
 * ```
 */
export const persist: PersistMiddleware = (config, options) => (set, get, api) => {
  const {
    name,
    version = 1,
    migrate,
    merge = defaultMerge,
    partialize = defaultPartialize,
    onError,
  } = options;

  // Storage metadata key
  const metadataKey = `${name}:metadata`;

  /**
   * Load persisted state from AsyncStorage
   */
  const hydrate = async () => {
    try {
      // Load data and metadata
      const [dataJson, metadataJson] = await Promise.all([
        AsyncStorage.getItem(name),
        AsyncStorage.getItem(metadataKey),
      ]);

      if (!dataJson) {
        return; // No persisted state
      }

      // Parse persisted state
      let persistedState = JSON.parse(dataJson);

      // Check version and migrate if needed
      if (metadataJson) {
        const metadata = JSON.parse(metadataJson);
        const persistedVersion = metadata.version || 1;

        if (persistedVersion < version && migrate) {
          persistedState = migrate(persistedState, persistedVersion);
        }
      }

      // Merge with current state
      const currentState = get();
      const nextState = merge(persistedState, currentState);

      // Apply hydrated state (cast through any to avoid type issues)
      (set as any)(nextState, true);
    } catch (error) {
      console.error(`[persist] Failed to hydrate ${name}:`, error);
      if (onError) {
        onError(error as Error);
      }
    }
  };

  /**
   * Persist current state to AsyncStorage
   */
  const persistState = async (state: any) => {
    try {
      // Get state to persist (may be partial)
      const stateToPersist = partialize(state);

      // Create metadata
      const metadata = {
        version,
        timestamp: Date.now(),
      };

      // Save data and metadata
      await Promise.all([
        AsyncStorage.setItem(name, JSON.stringify(stateToPersist)),
        AsyncStorage.setItem(metadataKey, JSON.stringify(metadata)),
      ]);
    } catch (error) {
      console.error(`[persist] Failed to persist ${name}:`, error);
      if (onError) {
        onError(error as Error);
      }
    }
  };

  /**
   * Clear persisted state
   */
  const clearPersistedState = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(name),
        AsyncStorage.removeItem(metadataKey),
      ]);
    } catch (error) {
      console.error(`[persist] Failed to clear ${name}:`, error);
      if (onError) {
        onError(error as Error);
      }
    }
  };

  // Wrap set to persist on every change
  const persistingSet = (partial: any, replace?: any) => {
    set(partial, replace);

    // Persist after state update
    const state = get();
    persistState(state);
  };

  // Create the store with persisting set
  const store = config(persistingSet as any, get, api);

  // Hydrate on initialization
  hydrate();

  // Return store with persistence methods attached (cast to avoid type issues)
  return Object.assign({}, store, {
    persist: {
      hydrate,
      clearPersistedState,
    },
  }) as any;
};

/**
 * Helper to get persistence utilities from a store
 */
export const getPersistUtils = <T extends { persist?: { hydrate: () => Promise<void>; clearPersistedState: () => Promise<void> } }>(
  store: T
): { hydrate: () => Promise<void>; clearPersistedState: () => Promise<void> } => {
  if (!store.persist) {
    throw new Error('Store does not have persistence middleware');
  }
  return store.persist;
};
