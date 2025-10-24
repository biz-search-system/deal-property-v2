"use server";

import { auth } from "@/lib/auth";
import { verifySession } from "@/lib/sesstion";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

/**
 * 組織を作成するサーバーアクション
 */
export async function createOrganizationAction(data: {
  name: string;
  slug: string;
  logo?: string;
  metadata?: Record<string, unknown>;
}) {
  try {
    // セッション認証
    await verifySession();

    // 組織を作成
    const result = await auth.api.createOrganization({
      body: {
        name: data.name,
        slug: data.slug,
        logo: data.logo,
        metadata: data.metadata,
      },
      headers: await headers(),
    });

    if (!result) {
      return { success: false, error: "組織の作成に失敗しました" };
    }

    // キャッシュを再検証
    revalidatePath("/members");

    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to create organization:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "組織の作成に失敗しました",
    };
  }
}

/**
 * 組織のスラッグが利用可能かチェックするサーバーアクション
 */
export async function checkOrganizationSlugAction(slug: string) {
  try {
    // セッション認証
    await verifySession();

    const result = await auth.api.checkOrganizationSlug({
      body: { slug },
    });

    // resultがtrueの場合はスラッグが使用済み
    return { success: true, available: !result };
  } catch (error) {
    console.error("Failed to check organization slug:", error);
    return { success: false, available: false };
  }
}

/**
 * アクティブな組織を設定するサーバーアクション
 */
export async function setActiveOrganizationAction(organizationId: string) {
  try {
    // セッション認証
    await verifySession();

    const result = await auth.api.setActiveOrganization({
      body: { organizationId },
      headers: await headers(),
    });

    if (!result) {
      return { success: false, error: "アクティブ組織の設定に失敗しました" };
    }

    // キャッシュを再検証
    revalidatePath("/organization");

    return { success: true };
  } catch (error) {
    console.error("Failed to set active organization:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "アクティブ組織の設定に失敗しました",
    };
  }
}

/**
 * 組織一覧を取得するサーバーアクション
 */
export async function getOrganizationsAction() {
  try {
    // セッション認証
    await verifySession();

    const result = await auth.api.listOrganizations({
      headers: await headers(),
    });

    return { success: true, data: result || [] };
  } catch (error) {
    console.error("Failed to get organizations:", error);
    return { success: false, data: [] };
  }
}

/**
 * 組織の詳細情報を取得するサーバーアクション
 */
export async function getFullOrganizationAction(
  organizationId?: string,
  membersLimit: number = 100
) {
  try {
    // セッション認証
    await verifySession();

    const result = await auth.api.getFullOrganization({
      query: {
        organizationId,
        membersLimit,
      },
      headers: await headers(),
    });

    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to get full organization:", error);
    return { success: false, data: null };
  }
}

/**
 * アクティブな組織を取得するサーバーアクション
 */
export async function getActiveOrganizationAction() {
  try {
    // セッション認証
    const session = await verifySession();

    // セッションからアクティブな組織IDを取得
    const activeOrgId = session.session?.activeOrganizationId;

    if (!activeOrgId) {
      return { success: true, data: null };
    }

    // 組織の詳細情報を取得
    const result = await auth.api.getFullOrganization({
      query: {
        organizationId: activeOrgId,
      },
      headers: await headers(),
    });

    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to get active organization:", error);
    return { success: false, data: null };
  }
}

/**
 * 組織を削除するサーバーアクション
 */
export async function deleteOrganizationAction(organizationId: string) {
  try {
    // セッション認証
    await verifySession();

    await auth.api.deleteOrganization({
      body: { organizationId },
      headers: await headers(),
    });

    // キャッシュを再検証
    revalidatePath("/organization");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete organization:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "組織の削除に失敗しました",
    };
  }
}

/**
 * 組織から退出するサーバーアクション
 */
export async function leaveOrganizationAction(organizationId: string) {
  try {
    // セッション認証
    await verifySession();

    await auth.api.leaveOrganization({
      body: { organizationId },
      headers: await headers(),
    });

    // キャッシュを再検証
    revalidatePath("/organization");

    return { success: true };
  } catch (error) {
    console.error("Failed to leave organization:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "組織からの退出に失敗しました",
    };
  }
}

/**
 * 組織を更新するサーバーアクション
 */
export async function updateOrganizationAction(
  organizationId: string,
  data: {
    name?: string;
    slug?: string;
    logo?: string;
    metadata?: Record<string, unknown>;
  }
) {
  try {
    // セッション認証
    await verifySession();

    const result = await auth.api.updateOrganization({
      body: {
        organizationId,
        data,
      },
      headers: await headers(),
    });

    if (!result) {
      return { success: false, error: "組織の更新に失敗しました" };
    }

    // キャッシュを再検証
    revalidatePath("/members");

    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to update organization:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "組織の更新に失敗しました",
    };
  }
}

/**
 * 組織のメンバー一覧を取得するサーバーアクション
 */
export async function getOrganizationMembersAction(
  organizationId?: string,
  limit: number = 100,
  offset: number = 0
) {
  try {
    // セッション認証
    await verifySession();

    const result = await auth.api.listMembers({
      query: {
        organizationId,
        limit,
        offset,
      },
      headers: await headers(),
    });

    return { success: true, data: result || [] };
  } catch (error) {
    console.error("Failed to get organization members:", error);
    return { success: false, data: [] };
  }
}

/**
 * メンバーを招待するサーバーアクション
 */
export async function inviteMemberAction(data: {
  email: string;
  role?: "member" | "owner" | "admin" | ("member" | "owner" | "admin")[];
  organizationId?: string;
}) {
  try {
    // セッション認証
    await verifySession();

    const result = await auth.api.createInvitation({
      body: {
        email: data.email,
        role: data.role || "member",
        organizationId: data.organizationId,
        resend: true,
      },
      headers: await headers(),
    });

    if (!result) {
      return { success: false, error: "招待の送信に失敗しました" };
    }

    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to invite member:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "招待の送信に失敗しました",
    };
  }
}

/**
 * 招待を受け入れるサーバーアクション
 */
export async function acceptInvitationAction(invitationId: string) {
  try {
    // セッション認証
    await verifySession();

    const result = await auth.api.acceptInvitation({
      body: { invitationId },
      headers: await headers(),
    });

    if (!result) {
      return { success: false, error: "招待の受け入れに失敗しました" };
    }

    // キャッシュを再検証
    revalidatePath("/members");

    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to accept invitation:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "招待の受け入れに失敗しました",
    };
  }
}

/**
 * 招待をキャンセルするサーバーアクション
 */
export async function cancelInvitationAction(invitationId: string) {
  try {
    // セッション認証
    await verifySession();

    await auth.api.cancelInvitation({
      body: { invitationId },
      headers: await headers(),
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to cancel invitation:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "招待のキャンセルに失敗しました",
    };
  }
}

/**
 * 招待一覧を取得するサーバーアクション
 */
export async function getInvitationsAction(organizationId?: string) {
  try {
    // セッション認証
    await verifySession();

    const result = await auth.api.listInvitations({
      query: { organizationId },
      headers: await headers(),
    });

    return { success: true, data: result || [] };
  } catch (error) {
    console.error("Failed to get invitations:", error);
    return { success: false, data: [] };
  }
}

/**
 * メンバーを削除するサーバーアクション
 */
export async function removeMemberAction(
  memberIdOrEmail: string,
  organizationId?: string
) {
  try {
    // セッション認証
    await verifySession();

    await auth.api.removeMember({
      body: {
        memberIdOrEmail,
        organizationId,
      },
      headers: await headers(),
    });

    // キャッシュを再検証
    revalidatePath("/organization/members");

    return { success: true };
  } catch (error) {
    console.error("Failed to remove member:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "メンバーの削除に失敗しました",
    };
  }
}

/**
 * メンバーの役割を更新するサーバーアクション
 */
export async function updateMemberRoleAction(
  memberId: string,
  role: "member" | "owner" | "admin" | ("member" | "owner" | "admin")[],
  organizationId?: string
) {
  try {
    // セッション認証
    await verifySession();

    await auth.api.updateMemberRole({
      body: {
        memberId,
        role,
        organizationId,
      },
      headers: await headers(),
    });

    // キャッシュを再検証
    revalidatePath("/organization/members");

    return { success: true };
  } catch (error) {
    console.error("Failed to update member role:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "役割の更新に失敗しました",
    };
  }
}
