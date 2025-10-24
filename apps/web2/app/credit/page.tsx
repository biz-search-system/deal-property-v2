import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CreditPage() {
  const license = {
    name: "@vercel/avatar",
    version: "latest",
    license: "MIT",
    description: " Beautiful avatars as a microservice",
    copyright: "Copyright (c) 2020 Vercel, Inc.",
    github: "https://github.com/vercel/avatar",
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">クレジット</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>使用ライブラリ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <div className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{license.name}</h3>
                    <Badge variant="secondary">{license.version}</Badge>
                  </div>
                  <Badge>{license.license}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {license.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  {license.copyright}
                </p>
                <a
                  href={license.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline"
                >
                  {license.github}
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
