import Router from "./Router";
import ContextProvider from "./ContextProvider";

const App = () => {
  return (
    <ContextProvider>
      <Router />
    </ContextProvider>
  );
};

export default App;
