import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { urlService } from '../services/url/url';
import NotFound from '../pages/notfound/NotFound';

export default function URLValidationRoute() {
  const url = window.location.href;
  const dataQuery = { url };
  const {
    data: urlValidateData,
    status: urlValidateStatus,
    isFetching: urlValidateisFetching,
    error: urlValidateError,
  } = urlService.useValidateURL(dataQuery);

  if (urlValidateisFetching) {
    return <Outlet />
  }

  if (urlValidateData.result == false) {
    // return <Navigate to="notfound" />;
    return <NotFound />;
  }

  return (
    <Outlet />
  )
}
