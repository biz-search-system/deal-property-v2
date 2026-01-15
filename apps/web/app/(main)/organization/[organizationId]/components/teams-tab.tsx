"use client";

import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { Plus, Users, Settings, UserPlus, MoreHorizontal } from "lucide-react";
import { useOrganizationTeams } from "@/lib/swr/team";
import { useState } from "react";
import { CreateTeamDialog } from "./create-team-dialog";
import { TeamMembersDialog } from "./team-members-dialog";
import { EditTeamDialog } from "./edit-team-dialog";
import { Skeleton } from "@workspace/ui/components/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";

interface TeamsTabProps {
  organizationId: string;
  userRole: string | undefined;
}

export function TeamsTab({ organizationId, userRole }: TeamsTabProps) {
  const { teams, isLoading, error, mutate } =
    useOrganizationTeams(organizationId);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedTeamForMembers, setSelectedTeamForMembers] = useState<
    string | null
  >(null);
  const [selectedTeamForEdit, setSelectedTeamForEdit] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const isAdmin = userRole === "admin" || userRole === "owner";

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">チーム一覧</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-4">
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        チーム一覧の取得に失敗しました
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">チーム一覧</h3>
        {isAdmin && (
          <Button onClick={() => setCreateDialogOpen(true)} size="sm">
            <Plus className="h-4 w-4" />
            チームを作成
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1">
        {!teams || teams.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Users className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>まだチームが作成されていません</p>
            {isAdmin && (
              <p className="text-sm mt-2">
                「チームを作成」ボタンから最初のチームを作成してください
              </p>
            )}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {teams.map((team) => (
              <Card key={team.id} className="relative">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-base">{team.name}</h4>
                    {isAdmin && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">メニュー</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => setSelectedTeamForMembers(team.id)}
                          >
                            <UserPlus className="h-4 w-4" />
                            メンバー管理
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              setSelectedTeamForEdit({
                                id: team.id,
                                name: team.name,
                              })
                            }
                          >
                            <Settings className="h-4 w-4" />
                            チーム設定
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{team.memberCount || 0} 名のメンバー</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* チーム作成ダイアログ */}
      <CreateTeamDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        organizationId={organizationId}
        onSuccess={() => {
          mutate();
          setCreateDialogOpen(false);
        }}
      />

      {/* チームメンバー管理ダイアログ */}
      {selectedTeamForMembers && (
        <TeamMembersDialog
          open={!!selectedTeamForMembers}
          onOpenChange={(open) => {
            if (!open) setSelectedTeamForMembers(null);
          }}
          teamId={selectedTeamForMembers}
          organizationId={organizationId}
          onUpdate={() => mutate()}
        />
      )}

      {/* チーム編集ダイアログ */}
      {selectedTeamForEdit && (
        <EditTeamDialog
          open={!!selectedTeamForEdit}
          onOpenChange={(open) => {
            if (!open) setSelectedTeamForEdit(null);
          }}
          teamId={selectedTeamForEdit.id}
          teamName={selectedTeamForEdit.name}
          onSuccess={() => {
            mutate();
            setSelectedTeamForEdit(null);
          }}
        />
      )}
    </div>
  );
}
