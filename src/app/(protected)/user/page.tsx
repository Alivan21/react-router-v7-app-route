export async function loader() {
  console.log("🔍 LOADER RUNNING IN USER PAGE");
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return null;
}

export default function UserPage() {
  return <div>User Index Page</div>;
}
