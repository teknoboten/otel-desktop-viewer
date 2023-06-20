import React from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

import MainView, { mainLoader } from "./routes/main-view";
import ErrorPage from "./error-page";
import TelemetryView, { telemetryLoader } from "./routes/telemetry-view";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};
const theme = extendTheme({ config });

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainView />,
    loader: mainLoader,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "telemetry/:traceID",
        element: <TelemetryView />,
        loader: telemetryLoader,
      },
    ],
  },
]);

const container = document.getElementById("root");
if (!!container) {
  const root = createRoot(container);

  root.render(
    <React.StrictMode>
      <ChakraProvider theme={theme}>
        <RouterProvider router={router} />
      </ChakraProvider>
    </React.StrictMode>,
  );
}
