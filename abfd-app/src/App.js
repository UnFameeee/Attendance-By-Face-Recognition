import "./App.css";
import { Box, Flex } from "@chakra-ui/react";
import { Link, Outlet } from "react-router-dom";
function App() {
  return (
    <div className="App">
      <h1>Attendance by face recognition</h1>
      <nav>
        <Flex flexDirection='column'>
          <Link to="login">Login</Link>
          <Link to="register">Register</Link>
        </Flex>
      </nav>
      <Outlet/>
    </div>
  );
}

export default App;
