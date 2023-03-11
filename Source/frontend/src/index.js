import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { ProSidebarProvider } from "react-pro-sidebar";
import { BrowserRouter, Route, Routes, Switch } from "react-router-dom";
import { store } from "./store/store";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { createStandaloneToast } from "@chakra-ui/toast";

import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import NotFound from "./pages/notfound/NotFound";
import Home from "./pages/home/Home";
import Auth from "./pages/auth/Auth";
import Test from "./pages/test/Test";
import Dashboard from "./pages/home/Admin/Dashboard";
import Profile from "./pages/home/Setting/Profile";
import ScrollToTop from "./components/ScrollToTop";
import PrivateRoutes from "./Utils/PrivateRoutes";
import { GlobalHistory } from "./Utils/GlobalHistory";
import EmployeesGeneral from "./pages/home/Employees/EmployeesGeneral";
const { ToastContainer, toast } = createStandaloneToast();
const theme = extendTheme({
  colors: {
    link: "#4374e3",
  },
});
// Create a client
const queryClient = new QueryClient();
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <ChakraProvider theme={theme}>
          <ProSidebarProvider>
            <BrowserRouter>
              <ScrollToTop />
              <ToastContainer />
              <GlobalHistory />
              <Routes>
                <Route element={<Auth />}>
                  <Route path="/" element={<Login />} />
                  <Route path="sign-in" element={<Login />} />
                  <Route path="sign-up" element={<Register />} />
                </Route>
                <Route element={<PrivateRoutes />}>
                  <Route element={<Home />}>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="organization">
                      <Route path="general-organization" element={<Test />} />
                      <Route path="location" element={<Test />} />
                      <Route path="department" element={<Test />} />
                    </Route>
                    <Route path="employees">
                      <Route path="general-employees" element={<EmployeesGeneral />} />
                      <Route path="work-experience" element={<Test />} />
                    </Route>
                    <Route path="payroll">
                      <Route path="gross-net" element={<Test />} />
                      <Route path="payslip" element={<Test />} />
                    </Route>
                    <Route path="work-shift" element={<Test />} />
                    <Route path="notification" element={<Test />} />
                    <Route path="report" element={<Test />} />
                    <Route path="leave-request" element={<Test />} />
                    <Route path="attendance" element={<Test />} />
                    <Route path="setting">
                      <Route path="profile" element={<Profile />} />
                    </Route>
                  </Route>
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </ProSidebarProvider>
        </ChakraProvider>
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>
);

reportWebVitals();
