import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { ProSidebarProvider } from "react-pro-sidebar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { store } from "./store/store";
import { Provider } from "react-redux";
import {
  QueryClient,
  QueryClientProvider,
  persistQueryClient,
} from "react-query";
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
import EmployeesManagement from "./pages/home/Employees/EmployeesManagement";
import OrganizationGeneral from "./pages/home/Organization/OrganizationGeneral";
import FaceAttendance from "./pages/home/Attendance/FaceAttendance";
import DepartmentManagement from "./pages/home/Organization/DepartmentManagement";
import AttendancePersonal from "./pages/home/Attendance/AttendancePersonal";
import LeaveRequestPersonal from "./pages/home/LeaveRequest/LeaveRequestPersonal";
import WorkShift from "./pages/home/WorkShift/WorkShift";
import ContextWrapper from "./pages/home/WorkShift/context/ContextWrapper";
import AttendanceModal from "./components/Attendance/AttendanceModal";
import ExceptionModel from "./components/Attendance/ExceptionModel";
import AssignDepartmentManagement from "./pages/home/Organization/AssignDepartmentManagement";
import LeaveRequestManagement from "./pages/home/LeaveRequest/LeaveRequestManagement";
import AttendanceExceptionManagement from "./pages/home/Attendance/AttendanceExceptionManagement";
import ReportAttendanceException from "./pages/home/Attendance/ReportAttendanceException";
import URLValidationRoute from "./Utils/URLValidateRoute";
import FirstTimeLogin from "./pages/auth/FirstTimeLogin";
import TrainingFace from "./pages/home/Training/TrainingFace";
import TrainingQR from "./pages/home/Training/TrainingQR";
import ProtectedFirstTimeLoginRoute from "./Utils/ProtectedFirstTimeLoginRoute";

const { ToastContainer, toast } = createStandaloneToast();
const theme = extendTheme({
  colors: {
    link: "#4374e3",
    mainBg: "#d7e2e978",
    primary1: "#3182CE",
    primary2: "#002664",
    secondary1: "#DCA11D",
    secondary2: "#E6F4F1",
  },
});
// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <ProSidebarProvider>
          <ContextWrapper>
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
                      <Route
                        path="general-organization"
                        element={<OrganizationGeneral />}
                      />
                      <Route
                        path="department-management"
                        element={<DepartmentManagement />}
                      />
                      <Route
                        path="assign-department"
                        element={<AssignDepartmentManagement />}
                      />
                    </Route>
                    <Route path="employees">
                      <Route
                        path="employees-management"
                        element={<EmployeesManagement />}
                      />
                    </Route>
                    {/* <Route path="payroll">
                      <Route path="gross-net" element={<Test />} />
                      <Route path="payslip" element={<Test />} />
                    </Route> */}
                    <Route path="work-shift" element={<WorkShift />} />
                    {/* <Route path="notification" element={<Test />} /> */}
                    {/* <Route path="report" element={<Test />} /> */}
                    <Route path="leave-request">
                      <Route
                        path="leave-request-personal"
                        element={<LeaveRequestPersonal />}
                      />
                      <Route
                        path="leave-request-management"
                        element={<LeaveRequestManagement />}
                      />
                    </Route>
                    <Route path="attendance">
                      <Route
                        path="attendance-personal"
                        element={<AttendancePersonal />}
                      />
                      <Route
                        path="attendance-exception-management"
                        element={<AttendanceExceptionManagement />}
                      />
                    </Route>
                    <Route path="setting">
                      <Route path="profile" element={<Profile />} />
                    </Route>
                  </Route>
                </Route>
                <Route element={<ProtectedFirstTimeLoginRoute />}>
                  <Route path="first-time-login" element={<FirstTimeLogin />} />
                </Route>
                <Route>
                  {/* Anonymous route  */}
                  <Route element={<URLValidationRoute />}>
                    <Route path="report-attendance-exception" element={<ReportAttendanceException />} />
                    <Route path="training-face" element={<TrainingFace />} />
                  </Route>
                  <Route path="face-attendance" element={<FaceAttendance />} />
                  <Route path="first-time-login" element={<FirstTimeLogin />} />
                  <Route path="training-qr" element={<TrainingQR />} />

                  <Route path="test" element={<AttendanceModal />} />
                  <Route path="test2" element={<ExceptionModel />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </ContextWrapper>
        </ProSidebarProvider>
      </ChakraProvider>
    </Provider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);
