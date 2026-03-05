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

// TODO: 현재 상태바가 있고없고 페이지를 왔다갔다하면서 페이지 리렌더링이 발생
// TODO: 내 의도와는 다른 데이터 리패칭이 암묵적으로 이루어짐
// TODO: 수정 필요
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
