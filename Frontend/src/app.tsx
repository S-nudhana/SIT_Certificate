import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAuth } from "./store/slices/authSlices";
import axiosInstance from "./services/axios/axiosInstances";

import { RouterProvider } from "react-router-dom";
import { router } from "./routes";

import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axiosInstance.get("/user/authorize");

        dispatch(
          setAuth({
            authorized: res.data.data.authorized,
            firstname: res.data.data.userFirstname,
          })
        );
      } catch {
        dispatch(
          setAuth({
            authorized: false,
            firstname: "",
          })
        );
      }
    };

    checkAuth();
  }, [dispatch]);

  return <RouterProvider router={router} />;
}

export default App;