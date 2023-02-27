import { useNavigate, NavigateFunction } from "react-router-dom";

export let globalNavigate;

export const GlobalHistory = () => {
  globalNavigate = useNavigate();

  return null;
};