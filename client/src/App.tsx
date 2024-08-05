import "./App.css";
import Routes from "./routes/Routes";
import AuthProvider from "./context/auth/AuthProvider";

function App() {
  return (
    <AuthProvider>
        <Routes />
    </AuthProvider>
  );
}

export default App;
