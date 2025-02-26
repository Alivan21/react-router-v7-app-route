import { Outlet } from "react-router";

export default function ProtectedLayout() {
  return (
    <div>
      ProtectedLayout
      <div>
        <Outlet />
      </div>
    </div>
  );
}
