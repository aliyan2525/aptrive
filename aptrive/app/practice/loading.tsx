import { Loader2 } from "lucide-react";

export default function PracticeLoading() {
  return (
    <div className="flex h-[60vh] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-2 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium">Preparing practice session...</p>
      </div>
    </div>
  );
}
