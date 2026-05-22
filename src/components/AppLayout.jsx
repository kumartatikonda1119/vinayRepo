import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import MobileNav from "./MobileNav.jsx";
import "./AppLayout.css";

export default function AppLayout() {
  return (
    <div className="layout-container">
      <Sidebar />
      <MobileNav />
      <main className="layout-main">
        <Outlet />
      </main>
    </div>
  );
}
