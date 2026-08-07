import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <Card className="overflow-hidden p-0 shadow-lg">
          <CardContent className="grid p-0 md:grid-cols-2">
            <div className="p-6 md:p-8">{children}</div>
            <div className="relative hidden items-center justify-center bg-muted md:flex">
              <Image
                src="/sst-flow-logo-text.png"
                alt="SST Flow"
                width={240}
                height={240}
                className="h-72 w-auto"
                priority
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
