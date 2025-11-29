import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

export default function SectionCard({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <Card className="pt-0 overflow-hidden">
      <CardHeader className="m-0 border-b [.border-b]:py-5 bg-muted/30 flex items-center">
        <CardTitle className="">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex md:flex-row flex-col">
        {children}
      </CardContent>
    </Card>
  );
}
