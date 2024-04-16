import "./App.css";

import LabelBottomNavigation from "./components/LabelBottomNavigation";
import Home from "./components/Home";
import Auth from "./components/Auth";

function App() {
  return (
    <div className="App">
      <Auth />
      <LabelBottomNavigation />
    </div>
  );
}

export default App;
