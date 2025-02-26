import { Outlet } from "react-router";

export default function ProtectedLayout() {
  return (
    <div className="min-h-screen bg-blue-600">
      ProtectedLayout
      <div>
        <Outlet />
      </div>
    </div>
  );
}
