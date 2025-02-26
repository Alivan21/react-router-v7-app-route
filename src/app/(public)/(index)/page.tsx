export async function loader() {
  console.log("🔍 LOADER RUNNING IN INDEX PAGE");
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return null;
}

export default function IndexPage() {
  return <div>IndexPage</div>;
}
