import "./App.css";
import { Box, Center, Flex } from "@chakra-ui/react";
import { Link, Outlet } from "react-router-dom";
import Header from "./parts/header/Header";
import Footer from "./parts/footer/Footer";
function App() {
  return (
    <Box className="App"  height="100vh">
      <Header />
      <Footer />
      <Outlet />
    </Box>
  );
}

export default App;
