import { createContext, useContext } from "react";
import { AnyFieldHandlers } from "../types";

const FieldHandlersContext = createContext<Record<string, AnyFieldHandlers>>(
  {},
);

export function FieldHandlersProvider({
  children,
  handlers = {},
}: {
  children: React.ReactNode;
  handlers?: Record<string, AnyFieldHandlers>;
}) {
  return (
    <FieldHandlersContext.Provider value={handlers}>
      {children}
    </FieldHandlersContext.Provider>
  );
}

export function useFieldHandlers(fieldName: string) {
  const handlers = useContext(FieldHandlersContext);
  return handlers[fieldName] ?? {};
}
