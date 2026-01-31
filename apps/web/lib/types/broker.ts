/**
 * 買取業者マスタ 型定義
 */

/** 業者種別 */
export type BrokerType = "buyer" | "broker";

/** 買取業者 */
export interface Broker {
  id: string;
  organizationId: string;
  name: string;
  brokerType: BrokerType;
  contactName: string | null;
  email: string;
  phone: string | null;
  address: string | null;
  startedAt: Date | null;
  groupId: string | null;
  notes: string | null;
  isActive: boolean;
  displayOrder: number | null;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

/** 業者グループ */
export interface BrokerGroup {
  id: string;
  organizationId: string;
  name: string;
  description: string | null;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

/** 買取業者（グループ付き） */
export interface BrokerWithGroup extends Broker {
  group: BrokerGroup | null;
}

/** 業者種別ラベル */
export const BROKER_TYPE_LABELS: Record<BrokerType, string> = {
  buyer: "買取業者",
  broker: "買取仲介",
};

/** 業者種別カラー */
export const BROKER_TYPE_COLORS: Record<BrokerType, string> = {
  buyer: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  broker:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
};

/** 業者分析データ */
export interface BrokerAnalytics {
  brokerId: string;
  brokerName: string;
  brokerType: BrokerType;
  /** 配布回数 */
  distributionCount: number;
  /** 回答回数 */
  responseCount: number;
  /** 回答率（%） */
  responseRate: number;
  /** 成約回数 */
  contractCount: number;
  /** 成約率（%） */
  contractRate: number;
  /** 平均回答金額（万円） */
  averageResponsePrice: number | null;
  /** 平均回答日数 */
  averageResponseDays: number | null;
  /** アッパー獲得回数 */
  upperCount: number;
  /** 直近取引日 */
  lastTransactionAt: Date | null;
}
