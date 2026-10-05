import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import CustomerRoutes from "./customer/routes/CustomerRoutes";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <CustomerRoutes />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
