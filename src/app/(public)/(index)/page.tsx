// In your page.tsx file
import { LoaderFunction } from "react-router";

// Make sure the export is named properly and exactly matches what the route creator expects
export const loader: LoaderFunction = async () => {
  console.log("🔍 LOADER RUNNING IN INDEX PAGE");
  // Using a shorter timeout for testing
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return null;
};

// The default export for the component
export default function IndexPage() {
  return <div>IndexPage</div>;
}
