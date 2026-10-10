import { createContext, useContext, useEffect, useState } from "react";

const API_ORIGIN = "https://nova-market-backend-2.onrender.com";
const GET_URL = `${API_ORIGIN}/api/v1/store/getStoreInfo`;

const StoreInfoContext = createContext(null);

export function StoreInfoProvider({ children }) {
  const [storeInfo, setStoreInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStoreInfo = async () => {
      try {
        const response = await fetch(GET_URL);

        // 404 mane store info ekhono create kora hoyni
        if (response.status === 404) {
          setStoreInfo(null);
          return;
        }

        const data = await response.json();

        if (response.ok) {
          setStoreInfo(data?.storeInfo || null);
        }
      } catch (error) {
        console.error("Store info fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreInfo();
  }, []);

  return (
    <StoreInfoContext.Provider value={{ storeInfo, loading }}>
      {children}
    </StoreInfoContext.Provider>
  );
}

export function useStoreInfo() {
  const context = useContext(StoreInfoContext);

  if (!context) {
    throw new Error("useStoreInfo must be used inside <StoreInfoProvider>");
  }

  return context;
}