import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

type provider = {
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
};

const TabBarContext = createContext<provider | null>(null);

export const TabBarProvider = ({ children }: { children: React.ReactNode }) => {
  const [isVisible, setIsVisible] = useState<boolean>(true);

  return (
    <TabBarContext.Provider value={{ isVisible, setIsVisible }}>
      {children}
    </TabBarContext.Provider>
  );
};

export const useTabBarVisibility = () => {
  const context = useContext(TabBarContext);
  if (!context)
    throw new Error("useTabBarVisibility must be used within a TabBarProvider");
  return {
    isTabBarVisible: context.isVisible,
    setTabBarVisible: context.setIsVisible,
  };
};
