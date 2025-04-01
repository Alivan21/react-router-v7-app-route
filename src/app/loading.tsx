import Spinner from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <Spinner />
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Loading...</h1>
        <p className="text-muted-foreground max-w-[500px]">
          Please wait while we prepare your content.
        </p>
      </div>
    </div>
  );
}
