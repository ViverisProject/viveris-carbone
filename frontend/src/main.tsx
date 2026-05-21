
  import { createRoot } from "react-dom/client";
  import { QueryClient } from "@tanstack/react-query";
  import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
  import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
  import App from "./App.tsx";
  import "./index.css";

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Never auto-refetch from cache — all updates go through explicit mutations.
        // This prevents the persisted (potentially old) cache from triggering a
        // background refetch that overwrites optimistic updates mid-animation.
        staleTime: Infinity,
        // Keep inactive cache for 24 hours
        gcTime: 24 * 60 * 60 * 1000,
        // Don't retry failed requests automatically
        retry: 1,
        // No background refetch on window focus either
        refetchOnWindowFocus: false,
      },
    },
  });

  const persister = createSyncStoragePersister({
    storage: window.localStorage,
    key: "viv_query_cache",
  });

  createRoot(document.getElementById("root")!).render(
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister, maxAge: 24 * 60 * 60 * 1000 }}
    >
      <App />
    </PersistQueryClientProvider>
  );
  
