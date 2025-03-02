import { FileQuestion } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center p-4">
      <div className="flex max-w-md flex-col items-center justify-center space-y-4 text-center">
        <div className="rounded-full bg-blue-100 p-3">
          <FileQuestion className="h-10 w-10 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">404</h1>
        <h2 className="text-2xl font-semibold">Page Not Found</h2>
        <p className="text-muted-foreground">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row">
          <Button asChild>
            <Link to="/">Go Home</Link>
          </Button>
          <Button onClick={() => void navigate(-1)} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
