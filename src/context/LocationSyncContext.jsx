import React, { createContext, useContext, useState } from "react";

const LocationSyncContext = createContext();

export function LocationSyncProvider({ children }) {
  const [locationValue, setLocationValue] = useState("all");
  return (
    <LocationSyncContext.Provider value={{ locationValue, setLocationValue }}>
      {children}
    </LocationSyncContext.Provider>
  );
}

export function useLocationSync() {
  return useContext(LocationSyncContext);
}
