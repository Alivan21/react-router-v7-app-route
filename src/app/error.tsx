import { AlertTriangle, RefreshCw } from "lucide-react";
import { useNavigate, useRouteError } from "react-router";
import { Button } from "@/components/ui/button";

export default function ErrorPage() {
  const navigate = useNavigate();
  const error = useRouteError();
  console.error(error);
  const reset = () => {
    window.location.reload();
  };

  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center p-4">
      <div className="flex max-w-md flex-col items-center justify-center space-y-4 text-center">
        <div className="rounded-full bg-red-100 p-3">
          <AlertTriangle className="h-10 w-10 text-red-600" />
        </div>
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Something went wrong</h1>
        <p className="text-muted-foreground">
          We apologize for the inconvenience. An error occurred while processing your request.
        </p>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row">
          <Button onClick={reset}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Try again
          </Button>
          <Button onClick={() => void navigate(-1)} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
