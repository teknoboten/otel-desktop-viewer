import React from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};
const theme = extendTheme({ config });

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <MainView />,
//     loader: mainLoader,
//     errorElement: <ErrorPage />,
//     children: [
//       {
//         path: "telemetry/:traceID",
//         element: <TelemetryView />,
//         loader: telemetryLoader,
//       },
//     ],
//   },
// ]);

const container = document.getElementById("root");
if (!!container) {
  const root = createRoot(container);

  root.render(
    <React.StrictMode>
      <ChakraProvider theme={theme}>
        {/* <RouterProvider router={router} /> */}
        <div>
          <h1>Hello, check out this sweet experimental UI 💁‍♀️</h1>
        </div>
      </ChakraProvider>
    </React.StrictMode>,
  );
}
