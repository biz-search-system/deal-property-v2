"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";
import { CheckCircle2 } from "lucide-react";
import { useQueryState } from "nuqs";

export function InvitationSuccessDialog() {
  const [invitedOrg, setInvitedOrg] = useQueryState("invited");

  const isOpen = invitedOrg !== null;

  const handleClose = () => {
    setInvitedOrg(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <DialogTitle className="text-center">
            組織への参加が完了しました
          </DialogTitle>
          <DialogDescription className="text-center">
            {invitedOrg}への招待を受け入れました。
            <br />
            案件の閲覧・編集が可能になりました。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center">
          <Button onClick={handleClose}>はじめる</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
