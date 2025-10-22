import { Button } from "@workspace/ui/components/button";
import { useForm, useFormContext } from "react-hook-form";
import { cn } from "@workspace/ui/lib/utils";

export default function Page() {
  return (
    <div className={cn("flex items-center justify-center min-h-svh")}>
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Hello World</h1>
        <Button size="sm">Button</Button>
      </div>
    </div>
  );
}
