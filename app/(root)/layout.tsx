import StreamVideoProvider from "@/providers/StreamClientProvider";
import React, { ReactNode } from "react";

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main>
      <StreamVideoProvider>
        {/* <div className="relative w-full h-screen flex flex-col items-center justify-center">
          {children}
        </div> */}
        {children}
      </StreamVideoProvider>
    </main>
  );
};

export default RootLayout;
