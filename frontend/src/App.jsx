import React from "react";
import "./App.scss";
import {router} from "./AppRoutes"
import { AuthProvider } from "./features/authContext";
import { RouterProvider } from "react-router-dom";

function App() {
  return (
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
  );
}

export default App;