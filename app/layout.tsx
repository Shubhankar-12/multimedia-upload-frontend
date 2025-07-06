"use client";

import type React from "react";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { useAppDispatch } from "@/lib/hooks";
import { loadUserFromStorage } from "@/lib/store/authSlice";
import "./globals.css";

function AuthLoader({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  return <>{children}</>;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <AuthLoader>{children}</AuthLoader>
        </Provider>
      </body>
    </html>
  );
}
