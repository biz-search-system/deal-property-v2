import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { cn } from "@workspace/ui/lib/utils";

export default function SectionCard({
  children,
  title,
  className,
}: {
  children: React.ReactNode;
  title: string;
  className?: string;
}) {
  return (
    <Card className={cn("pt-0 overflow-hidden", className)}>
      <CardHeader className="m-0 border-b [.border-b]:py-5 bg-muted/30 flex items-center">
        <CardTitle className="">{title}</CardTitle>
      </CardHeader>
      <CardContent className="">{children}</CardContent>
    </Card>
  );
}
