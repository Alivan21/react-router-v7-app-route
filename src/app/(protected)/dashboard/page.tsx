import { httpClient } from "@/libs/axios";

export default function DashboardPage() {
  const testButton = () => {
    console.log(httpClient.defaults.headers.common.Authorization);
  };
  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={testButton}>Test</button>
    </div>
  );
}
