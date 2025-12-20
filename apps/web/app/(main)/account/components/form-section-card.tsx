import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";

export default function FormSectionCard({
  children,
  title,
  description,
  isPending,
}: {
  children: React.ReactNode;
  title: string;
  description?: string;
  isPending: boolean;
}) {
  return (
    <Card className="p-0 overflow-hidden">
      <CardHeader className="m-0 border-b [.border-b]:py-5 bg-muted/30 flex items-center">
        <CardTitle className="">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex md:flex-row flex-col">
        {children}
      </CardContent>
      <CardFooter className="border-t [.border-t]:py-3 flex justify-between">
        <CardDescription>{description}</CardDescription>
        <Button disabled={isPending}>{isPending ? "保存中..." : "保存"}</Button>
      </CardFooter>
    </Card>
  );
}
