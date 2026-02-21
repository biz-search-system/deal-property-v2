/**
 * 出口管理 型定義
 */

/** 出口ステータス */
export type ExitStatus =
  | "not_purchased" // 未仕入
  | "waiting_purchase" // 仕入待ち（😭）
  | "negotiating" // 交渉中（▲）
  | "confirmed" // 確定（〇）
  | "breach" // 違約
  | "troubled"; // 要注意（荒れ案件）

/** 現況 */
export type Situation = "renting" | "sublease" | "vacant";

/** 出口管理 */
export interface Exit {
  id: string;
  organizationId: string;
  propertyId: string | null;
  propertyName: string;
  roomNumber: string | null;
  address: string | null;
  builtDate: Date | null;
  area: number | null;
  structure: string | null;
  floor: string | null;
  situation: Situation | null;
  rent: number | null;
  managementFee: number | null;
  purchasePrice: number | null;
  maisokuPrice: number | null;
  brokerageFee: number | null;
  expectedYield: number | null;
  nearestStation: string | null;
  nearestStation2: string | null;
  roomType: string | null;
  totalUnits: number | null;
  staffId: string | null;
  notes: string | null;
  status: ExitStatus;
  confirmedBrokerId: string | null;
  confirmedPrice: number | null;
  confirmedYield: number | null;
  confirmedAt: Date | null;
  confirmedBy: string | null;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

/** 業者回答 */
export interface ExitResponse {
  id: string;
  distributionId: string;
  price: number;
  yield: number | null;
  responderName: string;
  responderContact: string | null;
  conditions: string | null;
  validUntil: Date | null;
  status: "pending" | "responded" | "declined";
  respondedAt: Date;
  broker: { id: string; name: string };
}

/** 配布履歴 */
export interface ExitDistribution {
  id: string;
  exitId: string;
  brokerId: string;
  token: string;
  message: string | null;
  expiresAt: Date;
  distributedBy: string;
  distributedAt: Date;
  reminderCount: number;
  lastReminderAt: Date | null;
  broker: { id: string; name: string };
  response: ExitResponse | null;
}

/** 出口管理（リレーション付き） */
export interface ExitWithRelations extends Exit {
  staff: { id: string; name: string } | null;
  confirmedBroker: { id: string; name: string } | null;
  responses: ExitResponse[];
  distributions: ExitDistribution[];
}

/** 一覧表示用の順位付き回答 */
export interface RankedResponse {
  rank: number;
  brokerId: string;
  brokerName: string;
  price: number;
  yield: number | null;
}

/** 一覧表示用の出口管理データ */
export interface ExitListItem extends Exit {
  organizationSlug: string | null;
  staff: { id: string; name: string } | null;
  rankedResponses: RankedResponse[];
}

/** 出口ステータスラベル */
export const EXIT_STATUS_LABELS: Record<ExitStatus, string> = {
  not_purchased: "未仕入",
  waiting_purchase: "仕入待ち",
  negotiating: "交渉中",
  confirmed: "確定",
  breach: "違約",
  troubled: "要注意",
};

/** 出口ステータスカラー */
export const EXIT_STATUS_COLORS: Record<ExitStatus, string> = {
  not_purchased:
    "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  waiting_purchase:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  negotiating:
    "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  confirmed:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  breach: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  troubled:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
};

/** 現況ラベル */
export const SITUATION_LABELS: Record<Situation, string> = {
  renting: "賃貸中",
  sublease: "サブリース",
  vacant: "空室",
};

/** 現況カラー */
export const SITUATION_COLORS: Record<Situation, string> = {
  renting: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  sublease:
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
  vacant: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
};
