/** フォームタブの型 */
export type FormTabValue = "basic" | "contract" | "document" | "settlement";

/** フィールド名からタブを特定するマッピング */
const FIELD_TO_TAB: Record<string, FormTabValue> = {
  // basic タブ
  organizationId: "basic",
  staffIds: "basic",
  propertyName: "basic",
  roomNumber: "basic",
  ownerName: "basic",
  amountA: "basic",
  amountExit: "basic",
  commission: "basic",
  profit: "basic",
  bcDeposit: "basic",
  buyerCompany: "basic",
  contractType: "basic",
  companyB: "basic",
  brokerCompany: "basic",
  mortgageBank: "basic",
  listType: "basic",
  notes: "basic",
  // contract タブ
  maisokuDistribution: "contract",
  progressStatus: "contract",
  abContractSaved: "contract",
  abAuthorizationSaved: "contract",
  abSellerIdSaved: "contract",
  contractDateA: "contract",
  contractDateBc: "contract",
  settlementDate: "contract",
  bcContractCreated: "contract",
  bcDescriptionCreated: "contract",
  bcContractSent: "contract",
  bcDescriptionSent: "contract",
  bcContractCbDone: "contract",
  bcDescriptionCbDone: "contract",
  // document タブ
  documentStatus: "document",
  // settlement タブ
  bcSettlementStatus: "settlement",
  abSettlementStatus: "settlement",
  lawyerRequested: "settlement",
  documentsShared: "settlement",
  managementCancelScheduledMonth: "settlement",
  managementCancelRequestedDate: "settlement",
  managementCancelCompletedDate: "settlement",
  accountCompany: "settlement",
  bankAccount: "settlement",
};

/** エラーのあるフィールドから最初のタブを取得 */
export function getFirstErrorTab(errorFields: string[]): FormTabValue | null {
  for (const field of errorFields) {
    // documentItem_ で始まるフィールドは document タブ
    if (field.startsWith("documentItem_")) {
      return "document";
    }
    const tab = FIELD_TO_TAB[field];
    if (tab) {
      return tab;
    }
  }
  return null;
}
