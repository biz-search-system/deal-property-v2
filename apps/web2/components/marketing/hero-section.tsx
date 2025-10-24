import MarketingSection, {
  MarketingSectionContent,
} from "@/components/marketing/marketing-section";
import { Button } from "@/components/ui/button";
import HeroImage from "@/components/marketing/hero-image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <MarketingSection className="py-10 md:py-20 h-full flex-1 flex items-center justify-center shadow-2xl rounded-2xl">
      <div className="py-10 px-4 lg:py-20 lg:px-8 text-center">
        <MarketingSectionContent>
          <div className="grid lg:grid-cols-2 gap-4 ">
            <div className="flex flex-col items-start justify-center">
              <h2 className="text-5xl/normal font-bold mb-6">
                シンプルな仕組みで
                <br />
                ビジネスを管理する
              </h2>
              <p className="text-xl/relaxed mb-8">
                「情報の分散」と「手動管理によるミス」を解決します。
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  size="lg"
                  className={`h-14 rounded-full text-lg tracking-widest shadow-lg px-10
                    hover:cursor-pointer`}
                  asChild
                >
                  <Link href="/login">ログイン</Link>
                </Button>
                {/* <Button
                  variant="outline"
                  size="lg"
                  className="h-14 rounded-full text-lg tracking-widest shadow-lg px-8!"
                >
                  詳細を見る
                </Button> */}
              </div>
            </div>
            <div className="flex items-center justify-center">
              <HeroImage />
            </div>
          </div>
        </MarketingSectionContent>
      </div>
    </MarketingSection>
  );
}
