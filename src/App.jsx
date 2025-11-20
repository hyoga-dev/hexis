import { useState } from "react";
import { BrowserRouter, Routes, Route, Link, Outlet } from "react-router-dom";
import Home from "./Pages/Home";
import Test from "./Pages/test";



function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Test" element={<Test />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
