import { Theme } from "@radix-ui/themes";
import { Router, Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import { AuthProvider } from "./contexts/AuthContext";


// const theme = createTheme({
//   typography: {
//     fontFamily: "'Instrument Sans', Inter, system-ui, Avenir, Helvetica, Arial, sans-serif",
//   },
//   palette: {
//     mode: 'light',
//     primary: {
//       main: '#1976d2',
//     },
//     secondary: {
//       main: '#dc004e',
//     },
//   },
// });

function App() {
  return (
      <Theme>
        <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </Theme>
  );
}

export default App;
