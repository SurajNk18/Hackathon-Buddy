import React from "react";
import Header from "./Header";
import Footer from "./Footer";

function Layout({ children }) {
  return (
    <div className="app-layout" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <div className="app-main-content" style={{ flex: 1 }}>
        {children}
      </div>
      <Footer />
    </div>
  );
}

export default Layout;
