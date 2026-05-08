import { Provider } from "react-redux";
import { Toaster } from "@/components/ui/sonner";
import { store } from "@/app/store";

const AppProviders = ({ children }) => {
  return (
    <Provider store={store}>
      {children}
      <Toaster position="top-right" />
    </Provider>
  );
};

export default AppProviders;
