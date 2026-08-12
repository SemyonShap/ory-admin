import { create } from "zustand"
import { persist } from "zustand/middleware"

interface ServerState {
  activeServer: string
  isLoading: boolean
  setActiveServer: (name: string) => void
  setLoading: (loading: boolean) => void
}

export const useServerStore = create<ServerState>()(
  persist(
    (set) => ({
      activeServer: "",
      isLoading: true,
      setActiveServer: (activeServer) => set({ activeServer }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: "ory-admin-active-server",
      partialize: (state) => ({ activeServer: state.activeServer }),
    },
  ),
)
