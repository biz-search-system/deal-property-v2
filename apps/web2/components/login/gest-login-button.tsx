"use client";

import React from "react";
import { Button } from "../ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function GestLoginButton() {
  const router = useRouter();
  return (
    <Button
      onClick={() => {
        authClient.signIn
          .anonymous()
          .then(() => {
            toast.success("ログインしました");
            router.push("/properties/unconfirmed");
          })
          .catch((error) => {
            console.error(error);
          });
      }}
      // variant="outline"
      type="button"
      className="w-full"
    >
      ゲストログイン
    </Button>
  );
}
