import { Outlet } from "react-router";

export default function PublicLayout() {
  return (
    <div>
      PublicLayout
      <div>
        <Outlet />
      </div>
    </div>
  );
}
