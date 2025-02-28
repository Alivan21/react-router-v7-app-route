import { Outlet } from "react-router";

export default function PublicLayout() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="grid h-full w-full lg:grid-cols-2">
        <div className="bg-muted hidden lg:block" />
        <Outlet />
      </div>
    </div>
  );
}
