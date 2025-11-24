"use server";

import { db } from "@workspace/drizzle/db";
import { properties } from "@workspace/drizzle/schemas";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getBankAccountLimit, formatAmountInYen } from "@workspace/utils";
import type { AccountCompany, BankAccount } from "@workspace/drizzle/types";
import { verifySession } from "../data/sesstion";
import {
  getBankAccountDailyTotal,
  getPropertyBankInfo,
} from "../data/bank-account";
import {
  propertyBankAccountSchema,
  bankAccountSchema,
} from "../zod/schemas/bank-account";
import type { PropertyBankAccountInput } from "../types/bank-account";

/**
 * 口座情報を更新
 */
export async function updatePropertyBankAccount(
  input: PropertyBankAccountInput,
) {
  // セッション認証
  const session = await verifySession();

  // バリデーション
  const validatedData = propertyBankAccountSchema.parse(input);

  // トランザクション処理で上限チェックと更新を実行
  const result = await db.transaction(async (tx) => {
    // 対象物件の情報を取得
    const property = await getPropertyBankInfo(validatedData.propertyId);

    if (!property) {
      throw new Error("物件が見つかりません");
    }

    // 組織の権限チェック
    // const userOrganization = session.session.activeOrganizationId;
    // if (property.organizationId !== userOrganization) {
    //   throw new Error("この物件を更新する権限がありません");
    // }

    // 決済日が設定されている場合は上限チェック
    if (property.settlementDate && property.amountExit) {
      // 同日同口座の合計金額を取得（対象物件を除く）
      const { total: totalAmount } = await getBankAccountDailyTotal({
        date: property.settlementDate,
        accountCompany: validatedData.accountCompany,
        bankAccount: validatedData.bankAccount,
        excludePropertyId: validatedData.propertyId,
      });

      const totalWithCurrent = totalAmount + property.amountExit; // 現在の案件を含めた合計金額

      // 上限金額を取得
      const accountLimit = getBankAccountLimit(
        validatedData.accountCompany,
        validatedData.bankAccount,
      );

      // 上限チェック
      if (totalWithCurrent > accountLimit) {
        throw new Error(
          `決済上限（${formatAmountInYen(accountLimit)}）を超えています。他の口座を選択してください。`,
        );
      }
    }

    // 口座情報を更新
    await tx
      .update(properties)
      .set({
        accountCompany: validatedData.accountCompany,
        bankAccount: validatedData.bankAccount,
        updatedAt: new Date(),
        updatedBy: session.user.id,
      })
      .where(eq(properties.id, validatedData.propertyId));

    return { success: true };
  });

  // キャッシュの再検証
  revalidatePath(`/properties/${validatedData.propertyId}`);
  revalidatePath("/properties");

  return result;
}

/**
 * 同日同口座の合計金額を取得（API用ラッパー）
 * データレイヤーの関数を呼び出すだけのシンプルな実装
 */
export async function getBankAccountTotal({
  date,
  accountCompany,
  bankAccount,
  excludePropertyId,
}: {
  date: Date;
  accountCompany: AccountCompany;
  bankAccount: BankAccount;
  excludePropertyId?: string;
}) {
  // セッション認証
  await verifySession();

  // バリデーション
  const validatedData = bankAccountSchema.parse({
    accountCompany,
    bankAccount,
  });

  // データレイヤーの関数を呼び出す
  return getBankAccountDailyTotal({
    date,
    accountCompany: validatedData.accountCompany,
    bankAccount: validatedData.bankAccount,
    excludePropertyId,
  });
}
