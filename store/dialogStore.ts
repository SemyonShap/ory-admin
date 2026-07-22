import { create } from 'zustand'

interface DialogState {
  type: string | null
  open: boolean
  props?: Record<string, unknown>
}

interface DialogActions {
  openDialog: (type: string, props?: Record<string, unknown>) => void
  closeDialog: (open?: boolean) => void
}

type DialogStore = DialogState & DialogActions

export const useDialogStore = create<DialogStore>((set) => ({
  type: null,
  open: false,
  props: undefined,

  openDialog: (type: string, props?: Record<string, unknown>) => {
    set({
      type,
      props,
      open: true
    })
  },

  closeDialog: (open: boolean = false) => {
    if (!open) {
      set({
        type: null,
        open: false,
        props: undefined
      })
    }
  }
}))