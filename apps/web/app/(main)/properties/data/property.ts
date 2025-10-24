// ========================================
// 共通型定義
// ========================================

// チェック項目の型（日時・ユーザー情報付き）
export interface CheckItem {
  checked: boolean;
  date?: string; // チェック日時（例: "2025/01/10 14:30"）
  user?: string; // チェックしたユーザー（苗字のみ）
}

// 書類進捗のステータス型
export type DocumentProgressStatus = "空欄" | "依頼" | "取得完了" | "書類なし";

// 書類進捗項目の型
export interface DocumentItem {
  status: DocumentProgressStatus;
  date?: string; // 更新日時
  user?: string; // 更新者（苗字のみ）
}

// 段階的進捗の型（作成→送付→CB完了など）
export interface StageProgress {
  created?: CheckItem; // 作成
  sent?: CheckItem; // 送付
  cbCompleted?: CheckItem; // CB完了
  crCompleted?: CheckItem; // CR完了（AB精算書用）
}

// ========================================
// 契約進捗
// ========================================

// AB関係の契約進捗
export interface AbContractProgress {
  contractSaved: CheckItem; // 契約書 保存完了
  proxyCompleted: CheckItem; // 委任状関係 保存完了
  sellerIdSaved: CheckItem; // 売主身分証 保存完了
}

// BC関係の契約進捗
export interface BcContractProgress {
  bcContractCreated: CheckItem; // BC売契作成
  importantMattersCreated: CheckItem; // 重説作成
  bcContractSent: CheckItem; // BC売契送付
  importantMattersSent: CheckItem; // 重説送付
  bcContractCbCompleted: CheckItem; // BC売契CB完了
  importantMattersCbCompleted: CheckItem; // 重説CB完了
}

// ========================================
// 書類進捗
// ========================================

// 賃貸管理関係の書類
export interface RentalDocuments {
  rentalContract: DocumentItem; // 賃貸借契約書
  managementContract: DocumentItem; // 管理委託契約書
}

// 建物管理関係の書類
export interface BuildingDocuments {
  importantMatters: DocumentItem; // 重要事項調査報告書
  managementRules: DocumentItem; // 管理規約
  longTermPlan: DocumentItem; // 長期修繕計画書
  generalMeeting: DocumentItem; // 総会議事録
}

// 役所関係の書類
export interface GovernmentDocuments {
  taxCertificate: DocumentItem; // 公課証明
  buildingPlan: DocumentItem; // 建築計画概要書
  registryRecord: DocumentItem; // 台帳記載事項証明書
  useDistrict: DocumentItem; // 用途地域
  roadLedger: DocumentItem; // 道路台帳
}

// 銀行関係の書類
export interface BankDocuments {
  loanCalculation: DocumentItem; // ローン計算書
}

// ========================================
// 決済進捗
// ========================================

// 精算書関係
export interface StatementProgress {
  bcStatement: StageProgress; // BC精算書（作成→送付→CB完了）
  loanCalculationSaved: CheckItem; // ローン計算書 保存
  abStatement: StageProgress; // AB精算書（作成→送付→CR完了）
}

// 司法書士関係
export interface ScrivenerProgress {
  requested: CheckItem; // 司法書士依頼
  documentsShared: CheckItem; // 必要書類共有
  idDocumentSent: CheckItem; // 本人確認書類 発送
  idDocumentReceived: CheckItem; // 本人確認書類 受取
  idDocumentReturned: CheckItem; // 本人確認書類 返送
  noDefects: CheckItem; // 書類不備なし
}

// 抵当銀行関係
export interface MortgageBankProgress {
  requested: CheckItem; // 抵当銀行 依頼
  accepted: CheckItem; // 抵当銀行 受付完了
  noDefects: CheckItem; // 書類不備なし
  loanCalculationSaved: CheckItem; // ローン計算書 保存
  sellerPaymentCompleted: CheckItem; // 売主手出し完了
}

// 賃貸管理・決済後関係
export interface PostSettlementProgress {
  managementCancellationRequested: CheckItem; // 管理解約依頼 依頼
  managementCancellationCompleted: CheckItem; // 管理解約依頼 完了
  guaranteeSuccessionRequested: CheckItem; // 保証会社承継 依頼
  guaranteeSuccessionCompleted: CheckItem; // 保証会社承継 完了
  keyReceived: CheckItem; // 鍵 受取
  keySent: CheckItem; // 鍵 発送
  accountTransferReceived: CheckItem; // 管積 口座振替手続き 受取
  accountTransferSent: CheckItem; // 管積 口座振替手続き 発送
  transactionLedger: CheckItem; // 取引台帳記入
}

// ========================================
// 口座関係の定数
// ========================================

// 口座会社
export const ACCOUNT_COMPANIES = {
  REIJIT: "レイジット",
  LIFE: "ライフ",
  MS: "エムズ",
} as const;

// 各社の銀行口座
export const BANK_ACCOUNTS = {
  REIJIT: {
    GMO_MAIN: "GMOメイン",
    GMO_SUB: "GMOサブ",
    SUMISHIN: "住信",
    KINSANS: "近産",
  },
  MS: {
    GMO_MAIN: "GMOメイン",
    GMO_SUB: "GMOサブ",
    SUMISHIN: "住信",
    PAYPAY_1: "ペイペイ①",
    PAYPAY_2: "ペイペイ②",
    PAYPAY_3: "ペイペイ③",
    RAKUTEN_1: "楽天①",
    RAKUTEN_2: "楽天②",
  },
  LIFE: {
    GMO_MAIN: "GMOメイン",
    GMO_SUB: "GMOサブ",
  },
} as const;

// 使用する銀行口座の型
export type BankAccountType =
  | (typeof BANK_ACCOUNTS.REIJIT)[keyof typeof BANK_ACCOUNTS.REIJIT]
  | (typeof BANK_ACCOUNTS.MS)[keyof typeof BANK_ACCOUNTS.MS]
  | (typeof BANK_ACCOUNTS.LIFE)[keyof typeof BANK_ACCOUNTS.LIFE]
  | "";

// ========================================
// メインのProperty型定義
// ========================================

export interface Property {
  id: number;

  // ========================================
  // 基本情報
  // ========================================
  assignee: string[]; // 担当（複数可）
  propertyName: string; // 物件名
  roomNumber: string; // 号室
  ownerName: string; // オーナー名
  leadType: string; // 名簿種別

  // ========================================
  // 金額情報
  // ========================================
  aAmount: number; // A金額（AB間売買価格）
  exitAmount: number; // 出口金額（BC間売買価格）
  commission: number; // 仲手等（合計）
  profit: number; // 利益（自動計算: 出口金額 - A金額 + 仲手等）
  bcDeposit: number; // BC手付

  // ========================================
  // 契約情報
  // ========================================
  contractType: string; // 契約形態
  aContractDate: string; // A契約日（AB契約日）
  bcContractDate: string; // BC契約日
  settlementDate: string | null; // 決済日（BC確定前はnull、"10月予定"なども可能）

  // ========================================
  // 関係者情報
  // ========================================
  buyerCompany: string; // 買取業者
  bCompany: string; // B会社
  brokerCompany: string; // 仲介会社
  mortgageBank: string; // 抵当銀行

  // ========================================
  // 口座管理
  // ========================================
  account: "レイジット" | "ライフ" | "エムズ" | ""; // 使用口座会社
  bankAccount: BankAccountType; // 使用する銀行口座

  // ========================================
  // 契約進捗状況
  // ========================================
  contractProgress: {
    ab: AbContractProgress; // AB関係
    bc: BcContractProgress; // BC関係
  };

  // ========================================
  // 書類進捗関係
  // ========================================
  documentProgress: {
    rental: RentalDocuments; // 賃貸管理関係
    building: BuildingDocuments; // 建物管理関係
    government: GovernmentDocuments; // 役所関係
    bank: BankDocuments; // 銀行関係
  };

  // ========================================
  // 決済進捗状況
  // ========================================
  settlementProgress: {
    statement: StatementProgress; // 精算書関係
    scrivener: ScrivenerProgress; // 司法書士関係
    mortgageBank: MortgageBankProgress; // 抵当銀行関係
    postSettlement: PostSettlementProgress; // 賃貸管理・決済後関係
  };

  // ========================================
  // その他管理項目（後方互換性のため残す）
  // ========================================
  ownershipTransfer: boolean; // 所変
  accountTransfer: boolean; // 口振
  documentSent: boolean; // 送付
  workplaceDM: boolean; // 勤務先DM
  transactionLedger: boolean; // 取引台帳
  managementCancel: boolean; // 管理解約
  memo: string; // 備考

  // ========================================
  // ステータス
  // ========================================
  businessStatus: string; // 業者ステータス（7段階）
  documentStatus: string; // 書類ステータス（3段階）
}

// 業者ステータス（7段階）
export const BUSINESS_STATUS = {
  BC_UNCONFIRMED: "BC確定前",
  BC_CONFIRMED_CB_WAITING: "BC確定 CB待ち",
  BC_CONFIRMED_CONTRACT_WAITING: "BC確定 契約待ち",
  BC_COMPLETED_SETTLEMENT_WAITING: "BC完了 決済日確定待ち",
  SETTLEMENT_CONFIRMED_STATEMENT_WAITING: "決済日確定 精算書待ち",
  STATEMENT_COMPLETED_SETTLEMENT_WAITING: "精算書完了 決済待ち",
  SETTLEMENT_COMPLETED: "決済完了",
} as const;

// 書類ステータス（3段階）
export const DOCUMENT_STATUS = {
  REQUEST_WAITING: "書類依頼待ち",
  ACQUIRING: "書類取得中",
  ALL_ACQUIRED: "全書類取得完了",
} as const;

// 契約形態
export const CONTRACT_TYPES = {
  AB_BC: "AB・BC",
  AC: "AC",
  BREACH: "違約",
  BREACH_SCHEDULED: "違約予定",
  BROKER_BUY: "買仲",
  LAWYER: "弁護士",
} as const;

// B会社
export const B_COMPANIES = {
  MS_COMPANY: "M'scompany",
  LIFE_INVEST: "ライフインベスト",
  REIJIT: "レイジット",
  TRANSACTION_BROKER: "取引業者",
  NONE: "",
} as const;

// 仲介会社
export const BROKER_COMPANIES = {
  REIJIT: "レイジット",
  TOUSEI: "TOUSEI",
  ARK: "アーク",
  RD: "RD",
  NBF: "NBF",
  SHINE_TERRACE: "SHINE TERRACE",
  ESUKU: "エスク",
  MS_COMPANY: "M'scompany",
  NONE: "",
} as const;

// 担当営業
export const ASSIGNEES = {
  MINATO: "湊",
  IWATA: "岩田",
  KIYOHARA: "清原",
  HORI: "堀",
  YABUTA: "薮田",
  HAYAKAWA: "早川",
  KONDO: "近藤",
  KOBAYASHI: "小林",
  MUTA: "牟田",
  KUNIMI: "國眼",
  SAKAMOTO: "坂本",
  YOKOYAMA: "横山",
} as const;

// ========================================
// ヘルパー関数：デフォルトの進捗データを生成
// ========================================

// デフォルトのチェック項目（未チェック）
const createEmptyCheckItem = (): CheckItem => ({
  checked: false,
});

// デフォルトの書類項目（空欄）
const createEmptyDocumentItem = (): DocumentItem => ({
  status: "空欄",
});

// デフォルトの段階的進捗
const createEmptyStageProgress = (): StageProgress => ({});

// デフォルトのAB契約進捗
const createDefaultAbProgress = (): AbContractProgress => ({
  contractSaved: createEmptyCheckItem(),
  proxyCompleted: createEmptyCheckItem(),
  sellerIdSaved: createEmptyCheckItem(),
});

// デフォルトのBC契約進捗
const createDefaultBcProgress = (): BcContractProgress => ({
  bcContractCreated: createEmptyCheckItem(),
  importantMattersCreated: createEmptyCheckItem(),
  bcContractSent: createEmptyCheckItem(),
  importantMattersSent: createEmptyCheckItem(),
  bcContractCbCompleted: createEmptyCheckItem(),
  importantMattersCbCompleted: createEmptyCheckItem(),
});

// デフォルトの賃貸書類
const createDefaultRentalDocuments = (): RentalDocuments => ({
  rentalContract: createEmptyDocumentItem(),
  managementContract: createEmptyDocumentItem(),
});

// デフォルトの建物書類
const createDefaultBuildingDocuments = (): BuildingDocuments => ({
  importantMatters: createEmptyDocumentItem(),
  managementRules: createEmptyDocumentItem(),
  longTermPlan: createEmptyDocumentItem(),
  generalMeeting: createEmptyDocumentItem(),
});

// デフォルトの役所書類
const createDefaultGovernmentDocuments = (): GovernmentDocuments => ({
  taxCertificate: createEmptyDocumentItem(),
  buildingPlan: createEmptyDocumentItem(),
  registryRecord: createEmptyDocumentItem(),
  useDistrict: createEmptyDocumentItem(),
  roadLedger: createEmptyDocumentItem(),
});

// デフォルトの銀行書類
const createDefaultBankDocuments = (): BankDocuments => ({
  loanCalculation: createEmptyDocumentItem(),
});

// デフォルトの精算書進捗
const createDefaultStatementProgress = (): StatementProgress => ({
  bcStatement: createEmptyStageProgress(),
  loanCalculationSaved: createEmptyCheckItem(),
  abStatement: createEmptyStageProgress(),
});

// デフォルトの司法書士進捗
const createDefaultScrivenerProgress = (): ScrivenerProgress => ({
  requested: createEmptyCheckItem(),
  documentsShared: createEmptyCheckItem(),
  idDocumentSent: createEmptyCheckItem(),
  idDocumentReceived: createEmptyCheckItem(),
  idDocumentReturned: createEmptyCheckItem(),
  noDefects: createEmptyCheckItem(),
});

// デフォルトの抵当銀行進捗
const createDefaultMortgageBankProgress = (): MortgageBankProgress => ({
  requested: createEmptyCheckItem(),
  accepted: createEmptyCheckItem(),
  noDefects: createEmptyCheckItem(),
  loanCalculationSaved: createEmptyCheckItem(),
  sellerPaymentCompleted: createEmptyCheckItem(),
});

// デフォルトの決済後進捗
const createDefaultPostSettlementProgress = (): PostSettlementProgress => ({
  managementCancellationRequested: createEmptyCheckItem(),
  managementCancellationCompleted: createEmptyCheckItem(),
  guaranteeSuccessionRequested: createEmptyCheckItem(),
  guaranteeSuccessionCompleted: createEmptyCheckItem(),
  keyReceived: createEmptyCheckItem(),
  keySent: createEmptyCheckItem(),
  accountTransferReceived: createEmptyCheckItem(),
  accountTransferSent: createEmptyCheckItem(),
  transactionLedger: createEmptyCheckItem(),
});

// ========================================
// サンプルデータ（15件）
// 構成: BC未確定 5件、9月決済 5件、10月決済 5件
// ========================================

export const properties: Property[] = [
  // ===== BC未確定案件（5件）=====
  {
    id: 1,
    assignee: ["湊", "岩田"],
    propertyName: "エスリード神戸ハーバークロス",
    roomNumber: "605",
    ownerName: "米川哲治",
    leadType: "反響",
    aAmount: 12000000,
    exitAmount: 14800000,
    commission: 300000,
    profit: 3100000,
    bcDeposit: 0,
    contractType: CONTRACT_TYPES.LAWYER,
    aContractDate: "2025-08-10",
    bcContractDate: "",
    settlementDate: null,
    buyerCompany: "",
    bCompany: B_COMPANIES.MS_COMPANY,
    brokerCompany: BROKER_COMPANIES.TOUSEI,
    mortgageBank: "",
    account: "",
    bankAccount: "",
    ownershipTransfer: false,
    accountTransfer: false,
    documentSent: false,
    workplaceDM: false,
    transactionLedger: false,
    managementCancel: false,
    memo: "弁護士から連絡あり",
    businessStatus: BUSINESS_STATUS.BC_UNCONFIRMED,
    documentStatus: DOCUMENT_STATUS.REQUEST_WAITING,
    contractProgress: {
      ab: createDefaultAbProgress(),
      bc: createDefaultBcProgress(),
    },
    documentProgress: {
      rental: createDefaultRentalDocuments(),
      building: createDefaultBuildingDocuments(),
      government: createDefaultGovernmentDocuments(),
      bank: createDefaultBankDocuments(),
    },
    settlementProgress: {
      statement: createDefaultStatementProgress(),
      scrivener: createDefaultScrivenerProgress(),
      mortgageBank: createDefaultMortgageBankProgress(),
      postSettlement: createDefaultPostSettlementProgress(),
    },
  },
  {
    id: 2,
    assignee: ["岩田"],
    propertyName: "LANDIC O2227",
    roomNumber: "901",
    ownerName: "宮川洋平",
    leadType: "テレアポ",
    aAmount: 12500000,
    exitAmount: 16000000,
    commission: 400000,
    profit: 3900000,
    bcDeposit: 0,
    contractType: CONTRACT_TYPES.LAWYER,
    aContractDate: "2025-08-15",
    bcContractDate: "",
    settlementDate: null,
    buyerCompany: "",
    bCompany: B_COMPANIES.MS_COMPANY,
    brokerCompany: BROKER_COMPANIES.TOUSEI,
    mortgageBank: "",
    account: "",
    bankAccount: "",
    ownershipTransfer: false,
    accountTransfer: false,
    documentSent: false,
    workplaceDM: false,
    transactionLedger: false,
    managementCancel: false,
    memo: "重調51,700円",
    businessStatus: BUSINESS_STATUS.BC_UNCONFIRMED,
    documentStatus: DOCUMENT_STATUS.ACQUIRING,
    contractProgress: {
      ab: createDefaultAbProgress(),
      bc: createDefaultBcProgress(),
    },
    documentProgress: {
      rental: createDefaultRentalDocuments(),
      building: createDefaultBuildingDocuments(),
      government: createDefaultGovernmentDocuments(),
      bank: createDefaultBankDocuments(),
    },
    settlementProgress: {
      statement: createDefaultStatementProgress(),
      scrivener: createDefaultScrivenerProgress(),
      mortgageBank: createDefaultMortgageBankProgress(),
      postSettlement: createDefaultPostSettlementProgress(),
    },
  },
  {
    id: 3,
    assignee: ["清原", "堀"],
    propertyName: "アドバンス心斎橋ラシュレ",
    roomNumber: "305",
    ownerName: "倉田怜輝",
    leadType: "DM",
    aAmount: 12800000,
    exitAmount: 15300000,
    commission: 240000,
    profit: 2740000,
    bcDeposit: 0,
    contractType: CONTRACT_TYPES.BREACH_SCHEDULED,
    aContractDate: "2025-08-20",
    bcContractDate: "",
    settlementDate: null,
    buyerCompany: "",
    bCompany: B_COMPANIES.MS_COMPANY,
    brokerCompany: BROKER_COMPANIES.REIJIT,
    mortgageBank: "",
    account: "",
    bankAccount: "",
    ownershipTransfer: false,
    accountTransfer: false,
    documentSent: false,
    workplaceDM: false,
    transactionLedger: false,
    managementCancel: false,
    memo: "違約予定",
    businessStatus: BUSINESS_STATUS.BC_UNCONFIRMED,
    documentStatus: DOCUMENT_STATUS.REQUEST_WAITING,
    contractProgress: {
      ab: createDefaultAbProgress(),
      bc: createDefaultBcProgress(),
    },
    documentProgress: {
      rental: createDefaultRentalDocuments(),
      building: createDefaultBuildingDocuments(),
      government: createDefaultGovernmentDocuments(),
      bank: createDefaultBankDocuments(),
    },
    settlementProgress: {
      statement: createDefaultStatementProgress(),
      scrivener: createDefaultScrivenerProgress(),
      mortgageBank: createDefaultMortgageBankProgress(),
      postSettlement: createDefaultPostSettlementProgress(),
    },
  },
  {
    id: 4,
    assignee: ["薮田", "早川"],
    propertyName: "MAXIV八王子DUE",
    roomNumber: "404",
    ownerName: "永田滉基",
    leadType: "紹介",
    aAmount: 11500000,
    exitAmount: 11500000,
    commission: 445500,
    profit: 445500,
    bcDeposit: 0,
    contractType: CONTRACT_TYPES.AB_BC,
    aContractDate: "2025-08-25",
    bcContractDate: "",
    settlementDate: null,
    buyerCompany: "",
    bCompany: B_COMPANIES.MS_COMPANY,
    brokerCompany: BROKER_COMPANIES.TOUSEI,
    mortgageBank: "",
    account: "",
    bankAccount: "",
    ownershipTransfer: false,
    accountTransfer: false,
    documentSent: false,
    workplaceDM: false,
    transactionLedger: false,
    managementCancel: false,
    memo: "",
    businessStatus: BUSINESS_STATUS.BC_UNCONFIRMED,
    documentStatus: DOCUMENT_STATUS.ACQUIRING,
    contractProgress: {
      ab: createDefaultAbProgress(),
      bc: createDefaultBcProgress(),
    },
    documentProgress: {
      rental: createDefaultRentalDocuments(),
      building: createDefaultBuildingDocuments(),
      government: createDefaultGovernmentDocuments(),
      bank: createDefaultBankDocuments(),
    },
    settlementProgress: {
      statement: createDefaultStatementProgress(),
      scrivener: createDefaultScrivenerProgress(),
      mortgageBank: createDefaultMortgageBankProgress(),
      postSettlement: createDefaultPostSettlementProgress(),
    },
  },
  {
    id: 5,
    assignee: ["近藤", "小林"],
    propertyName: "エステムコート横濱大通り公園",
    roomNumber: "605",
    ownerName: "水野泰宏",
    leadType: "反響",
    aAmount: 19000000,
    exitAmount: 21930000,
    commission: 693000,
    profit: 3623000,
    bcDeposit: 0,
    contractType: CONTRACT_TYPES.AB_BC,
    aContractDate: "2025-09-01",
    bcContractDate: "",
    settlementDate: null,
    buyerCompany: "",
    bCompany: B_COMPANIES.MS_COMPANY,
    brokerCompany: BROKER_COMPANIES.NBF,
    mortgageBank: "",
    account: "",
    bankAccount: "",
    ownershipTransfer: false,
    accountTransfer: false,
    documentSent: false,
    workplaceDM: false,
    transactionLedger: false,
    managementCancel: false,
    memo: "業者選定中",
    businessStatus: BUSINESS_STATUS.BC_UNCONFIRMED,
    documentStatus: DOCUMENT_STATUS.ACQUIRING,
    contractProgress: {
      ab: createDefaultAbProgress(),
      bc: createDefaultBcProgress(),
    },
    documentProgress: {
      rental: createDefaultRentalDocuments(),
      building: createDefaultBuildingDocuments(),
      government: createDefaultGovernmentDocuments(),
      bank: createDefaultBankDocuments(),
    },
    settlementProgress: {
      statement: createDefaultStatementProgress(),
      scrivener: createDefaultScrivenerProgress(),
      mortgageBank: createDefaultMortgageBankProgress(),
      postSettlement: createDefaultPostSettlementProgress(),
    },
  },

  // ===== 9月決済案件（5件）=====
  {
    id: 6,
    assignee: ["牟田"],
    propertyName: "MAXIV武蔵小杉",
    roomNumber: "204",
    ownerName: "白幡拓也",
    leadType: "反響",
    aAmount: 16520000,
    exitAmount: 20050000,
    commission: 400000,
    profit: 3930000,
    bcDeposit: 0,
    contractType: CONTRACT_TYPES.AB_BC,
    aContractDate: "2025-06-01",
    bcContractDate: "2025-06-15",
    settlementDate: "2025-09-08",
    buyerCompany: "REIC→株式会社アップルハウス",
    bCompany: B_COMPANIES.MS_COMPANY,
    brokerCompany: BROKER_COMPANIES.REIJIT,
    mortgageBank: "ジャックス",
    account: "レイジット",
    bankAccount: BANK_ACCOUNTS.REIJIT.SUMISHIN,
    ownershipTransfer: true,
    accountTransfer: true,
    documentSent: true,
    workplaceDM: false,
    transactionLedger: true,
    managementCancel: false,
    memo: "※B案件 決済完了",
    businessStatus: BUSINESS_STATUS.SETTLEMENT_COMPLETED,
    documentStatus: DOCUMENT_STATUS.ALL_ACQUIRED,
    contractProgress: {
      ab: createDefaultAbProgress(),
      bc: createDefaultBcProgress(),
    },
    documentProgress: {
      rental: createDefaultRentalDocuments(),
      building: createDefaultBuildingDocuments(),
      government: createDefaultGovernmentDocuments(),
      bank: createDefaultBankDocuments(),
    },
    settlementProgress: {
      statement: createDefaultStatementProgress(),
      scrivener: createDefaultScrivenerProgress(),
      mortgageBank: createDefaultMortgageBankProgress(),
      postSettlement: createDefaultPostSettlementProgress(),
    },
  },
  {
    id: 7,
    assignee: ["牟田"],
    propertyName: "HY's横浜SOUTHWEST",
    roomNumber: "701",
    ownerName: "佐々木彬（旧姓 畠山）",
    leadType: "テレアポ",
    aAmount: 15950000,
    exitAmount: 22700000,
    commission: 400000,
    profit: 7150000,
    bcDeposit: 0,
    contractType: CONTRACT_TYPES.AB_BC,
    aContractDate: "2025-06-06",
    bcContractDate: "2025-07-03",
    settlementDate: "2025-09-16",
    buyerCompany: "ネクストステージ",
    bCompany: B_COMPANIES.MS_COMPANY,
    brokerCompany: BROKER_COMPANIES.REIJIT,
    mortgageBank: "SBJ銀行",
    account: "レイジット",
    bankAccount: BANK_ACCOUNTS.REIJIT.GMO_MAIN,
    ownershipTransfer: true,
    accountTransfer: true,
    documentSent: true,
    workplaceDM: false,
    transactionLedger: true,
    managementCancel: false,
    memo: "決済完了",
    businessStatus: BUSINESS_STATUS.SETTLEMENT_COMPLETED,
    documentStatus: DOCUMENT_STATUS.ALL_ACQUIRED,
    contractProgress: {
      ab: createDefaultAbProgress(),
      bc: createDefaultBcProgress(),
    },
    documentProgress: {
      rental: createDefaultRentalDocuments(),
      building: createDefaultBuildingDocuments(),
      government: createDefaultGovernmentDocuments(),
      bank: createDefaultBankDocuments(),
    },
    settlementProgress: {
      statement: createDefaultStatementProgress(),
      scrivener: createDefaultScrivenerProgress(),
      mortgageBank: createDefaultMortgageBankProgress(),
      postSettlement: createDefaultPostSettlementProgress(),
    },
  },
  {
    id: 8,
    assignee: ["清原"],
    propertyName: "アドバンス名古屋モクシー",
    roomNumber: "1409",
    ownerName: "櫻井祐希",
    leadType: "DM",
    aAmount: 12200000,
    exitAmount: 16500000,
    commission: 0,
    profit: 4300000,
    bcDeposit: 0,
    contractType: CONTRACT_TYPES.AB_BC,
    aContractDate: "2025-02-14",
    bcContractDate: "2025-05-23",
    settlementDate: "2025-09-19",
    buyerCompany: "GEED",
    bCompany: B_COMPANIES.LIFE_INVEST,
    brokerCompany: BROKER_COMPANIES.REIJIT,
    mortgageBank: "ソニー銀行",
    account: "ライフ",
    bankAccount: BANK_ACCOUNTS.LIFE.GMO_MAIN,
    ownershipTransfer: true,
    accountTransfer: true,
    documentSent: true,
    workplaceDM: false,
    transactionLedger: true,
    managementCancel: false,
    memo: "決済完了",
    businessStatus: BUSINESS_STATUS.SETTLEMENT_COMPLETED,
    documentStatus: DOCUMENT_STATUS.ALL_ACQUIRED,
    contractProgress: {
      ab: createDefaultAbProgress(),
      bc: createDefaultBcProgress(),
    },
    documentProgress: {
      rental: createDefaultRentalDocuments(),
      building: createDefaultBuildingDocuments(),
      government: createDefaultGovernmentDocuments(),
      bank: createDefaultBankDocuments(),
    },
    settlementProgress: {
      statement: createDefaultStatementProgress(),
      scrivener: createDefaultScrivenerProgress(),
      mortgageBank: createDefaultMortgageBankProgress(),
      postSettlement: createDefaultPostSettlementProgress(),
    },
  },
  {
    id: 9,
    assignee: ["牟田"],
    propertyName: "HY's綾瀬駅前",
    roomNumber: "404",
    ownerName: "山田雅也",
    leadType: "紹介",
    aAmount: 20000000,
    exitAmount: 23300000,
    commission: 600000,
    profit: 3900000,
    bcDeposit: 500000,
    contractType: CONTRACT_TYPES.AB_BC,
    aContractDate: "2025-07-04",
    bcContractDate: "2025-07-23",
    settlementDate: "2025-09-26",
    buyerCompany: "GA",
    bCompany: B_COMPANIES.MS_COMPANY,
    brokerCompany: BROKER_COMPANIES.REIJIT,
    mortgageBank: "楽天銀行",
    account: "エムズ",
    bankAccount: BANK_ACCOUNTS.MS.GMO_MAIN,
    ownershipTransfer: true,
    accountTransfer: true,
    documentSent: true,
    workplaceDM: false,
    transactionLedger: true,
    managementCancel: false,
    memo: "決済完了",
    businessStatus: BUSINESS_STATUS.SETTLEMENT_COMPLETED,
    documentStatus: DOCUMENT_STATUS.ALL_ACQUIRED,
    contractProgress: {
      ab: createDefaultAbProgress(),
      bc: createDefaultBcProgress(),
    },
    documentProgress: {
      rental: createDefaultRentalDocuments(),
      building: createDefaultBuildingDocuments(),
      government: createDefaultGovernmentDocuments(),
      bank: createDefaultBankDocuments(),
    },
    settlementProgress: {
      statement: createDefaultStatementProgress(),
      scrivener: createDefaultScrivenerProgress(),
      mortgageBank: createDefaultMortgageBankProgress(),
      postSettlement: createDefaultPostSettlementProgress(),
    },
  },
  {
    id: 10,
    assignee: ["牟田"],
    propertyName: "HY's西横浜",
    roomNumber: "205",
    ownerName: "永瀬繁幸",
    leadType: "反響",
    aAmount: 9570000,
    exitAmount: 19100000,
    commission: 340000,
    profit: 9870000,
    bcDeposit: 0,
    contractType: CONTRACT_TYPES.AB_BC,
    aContractDate: "2025-07-25",
    bcContractDate: "2025-08-30",
    settlementDate: "2025-09-30",
    buyerCompany: "セカンドライブ→ブロードブレインズ",
    bCompany: B_COMPANIES.MS_COMPANY,
    brokerCompany: BROKER_COMPANIES.REIJIT,
    mortgageBank: "イオン銀行",
    account: "エムズ",
    bankAccount: BANK_ACCOUNTS.MS.GMO_MAIN,
    ownershipTransfer: true,
    accountTransfer: true,
    documentSent: true,
    workplaceDM: false,
    transactionLedger: true,
    managementCancel: false,
    memo: "※B案件 決済完了",
    businessStatus: BUSINESS_STATUS.SETTLEMENT_COMPLETED,
    documentStatus: DOCUMENT_STATUS.ALL_ACQUIRED,
    contractProgress: {
      ab: createDefaultAbProgress(),
      bc: createDefaultBcProgress(),
    },
    documentProgress: {
      rental: createDefaultRentalDocuments(),
      building: createDefaultBuildingDocuments(),
      government: createDefaultGovernmentDocuments(),
      bank: createDefaultBankDocuments(),
    },
    settlementProgress: {
      statement: createDefaultStatementProgress(),
      scrivener: createDefaultScrivenerProgress(),
      mortgageBank: createDefaultMortgageBankProgress(),
      postSettlement: createDefaultPostSettlementProgress(),
    },
  },

  // ===== 10月決済案件（5件）決済完了含む =====
  {
    id: 11,
    assignee: ["清原", "坂本"],
    propertyName: "スワンズシティ南堀江ブルーム",
    roomNumber: "1204",
    ownerName: "留田敏和",
    leadType: "反響",
    aAmount: 16800000,
    exitAmount: 19000000,
    commission: 0,
    profit: 2200000,
    bcDeposit: 0,
    contractType: CONTRACT_TYPES.AB_BC,
    aContractDate: "2025-06-04",
    bcContractDate: "2025-06-04",
    settlementDate: "2025-10-02",
    buyerCompany: "ネクサス",
    bCompany: B_COMPANIES.LIFE_INVEST,
    brokerCompany: BROKER_COMPANIES.TOUSEI,
    mortgageBank: "オリックス銀行",
    account: "ライフ",
    bankAccount: BANK_ACCOUNTS.LIFE.GMO_MAIN,
    ownershipTransfer: true,
    accountTransfer: false,
    documentSent: true,
    workplaceDM: false,
    transactionLedger: true,
    managementCancel: false,
    memo: "決済完了",
    businessStatus: BUSINESS_STATUS.SETTLEMENT_COMPLETED,
    documentStatus: DOCUMENT_STATUS.ALL_ACQUIRED,
    contractProgress: {
      ab: createDefaultAbProgress(),
      bc: createDefaultBcProgress(),
    },
    documentProgress: {
      rental: createDefaultRentalDocuments(),
      building: createDefaultBuildingDocuments(),
      government: createDefaultGovernmentDocuments(),
      bank: createDefaultBankDocuments(),
    },
    settlementProgress: {
      statement: createDefaultStatementProgress(),
      scrivener: createDefaultScrivenerProgress(),
      mortgageBank: createDefaultMortgageBankProgress(),
      postSettlement: createDefaultPostSettlementProgress(),
    },
  },
  {
    id: 12,
    assignee: ["清原", "横山"],
    propertyName: "アクタス大濠レノア",
    roomNumber: "403",
    ownerName: "上原樹縁",
    leadType: "テレアポ",
    aAmount: 8150000,
    exitAmount: 10700000,
    commission: 335000,
    profit: 2885000,
    bcDeposit: 300000,
    contractType: CONTRACT_TYPES.AB_BC,
    aContractDate: "2025-07-30",
    bcContractDate: "2025-08-30",
    settlementDate: "2025-10-07",
    buyerCompany: "トラストアライアンス（買仲）",
    bCompany: B_COMPANIES.MS_COMPANY,
    brokerCompany: BROKER_COMPANIES.REIJIT,
    mortgageBank: "東京スター銀行",
    account: "エムズ",
    bankAccount: BANK_ACCOUNTS.MS.GMO_SUB,
    ownershipTransfer: true,
    accountTransfer: true,
    documentSent: true,
    workplaceDM: false,
    transactionLedger: true,
    managementCancel: false,
    memo: "※B案件 決済完了",
    businessStatus: BUSINESS_STATUS.SETTLEMENT_COMPLETED,
    documentStatus: DOCUMENT_STATUS.ALL_ACQUIRED,
    contractProgress: {
      ab: createDefaultAbProgress(),
      bc: createDefaultBcProgress(),
    },
    documentProgress: {
      rental: createDefaultRentalDocuments(),
      building: createDefaultBuildingDocuments(),
      government: createDefaultGovernmentDocuments(),
      bank: createDefaultBankDocuments(),
    },
    settlementProgress: {
      statement: createDefaultStatementProgress(),
      scrivener: createDefaultScrivenerProgress(),
      mortgageBank: createDefaultMortgageBankProgress(),
      postSettlement: createDefaultPostSettlementProgress(),
    },
  },
  {
    id: 13,
    assignee: ["牟田"],
    propertyName: "バージュアル武蔵小杉",
    roomNumber: "205",
    ownerName: "黒瀬有希",
    leadType: "DM",
    aAmount: 8160000,
    exitAmount: 11500000,
    commission: 300000,
    profit: 3640000,
    bcDeposit: 500000,
    contractType: CONTRACT_TYPES.AB_BC,
    aContractDate: "2025-07-15",
    bcContractDate: "2025-08-01",
    settlementDate: "2025-10-16",
    buyerCompany: "アップルハウス",
    bCompany: B_COMPANIES.MS_COMPANY,
    brokerCompany: BROKER_COMPANIES.REIJIT,
    mortgageBank: "auじぶん銀行",
    account: "エムズ",
    bankAccount: BANK_ACCOUNTS.MS.GMO_SUB,
    ownershipTransfer: true,
    accountTransfer: true,
    documentSent: true,
    workplaceDM: false,
    transactionLedger: false,
    managementCancel: false,
    memo: "重調58,300円 ※B案件",
    businessStatus: BUSINESS_STATUS.STATEMENT_COMPLETED_SETTLEMENT_WAITING,
    documentStatus: DOCUMENT_STATUS.ALL_ACQUIRED,
    contractProgress: {
      ab: createDefaultAbProgress(),
      bc: createDefaultBcProgress(),
    },
    documentProgress: {
      rental: createDefaultRentalDocuments(),
      building: createDefaultBuildingDocuments(),
      government: createDefaultGovernmentDocuments(),
      bank: createDefaultBankDocuments(),
    },
    settlementProgress: {
      statement: createDefaultStatementProgress(),
      scrivener: createDefaultScrivenerProgress(),
      mortgageBank: createDefaultMortgageBankProgress(),
      postSettlement: createDefaultPostSettlementProgress(),
    },
  },
  {
    id: 14,
    assignee: ["國眼"],
    propertyName: "メインステージ千歳烏山",
    roomNumber: "501",
    ownerName: "菊池健宏",
    leadType: "紹介",
    aAmount: 15580000,
    exitAmount: 19900000,
    commission: 100000,
    profit: 4420000,
    bcDeposit: 500000,
    contractType: CONTRACT_TYPES.AB_BC,
    aContractDate: "2025-07-01",
    bcContractDate: "2025-07-01",
    settlementDate: "2025-10-31",
    buyerCompany: "",
    bCompany: B_COMPANIES.MS_COMPANY,
    brokerCompany: BROKER_COMPANIES.NBF,
    mortgageBank: "楽天銀行",
    account: "エムズ",
    bankAccount: BANK_ACCOUNTS.MS.SUMISHIN,
    ownershipTransfer: true,
    accountTransfer: true,
    documentSent: true,
    workplaceDM: false,
    transactionLedger: false,
    managementCancel: false,
    memo: "",
    businessStatus: BUSINESS_STATUS.STATEMENT_COMPLETED_SETTLEMENT_WAITING,
    documentStatus: DOCUMENT_STATUS.ALL_ACQUIRED,
    contractProgress: {
      ab: createDefaultAbProgress(),
      bc: createDefaultBcProgress(),
    },
    documentProgress: {
      rental: createDefaultRentalDocuments(),
      building: createDefaultBuildingDocuments(),
      government: createDefaultGovernmentDocuments(),
      bank: createDefaultBankDocuments(),
    },
    settlementProgress: {
      statement: createDefaultStatementProgress(),
      scrivener: createDefaultScrivenerProgress(),
      mortgageBank: createDefaultMortgageBankProgress(),
      postSettlement: createDefaultPostSettlementProgress(),
    },
  },
  {
    id: 15,
    assignee: ["國眼"],
    propertyName: "アドバンス新大阪ラシュレ",
    roomNumber: "815",
    ownerName: "石井辰弥",
    leadType: "反響",
    aAmount: 13800000,
    exitAmount: 16800000,
    commission: 521400,
    profit: 3521400,
    bcDeposit: 300000,
    contractType: CONTRACT_TYPES.AB_BC,
    aContractDate: "2025-09-26",
    bcContractDate: "2025-09-26",
    settlementDate: "2025-10-31",
    buyerCompany: "GDR",
    bCompany: B_COMPANIES.LIFE_INVEST,
    brokerCompany: BROKER_COMPANIES.ESUKU,
    mortgageBank: "ジャックス",
    account: "ライフ",
    bankAccount: BANK_ACCOUNTS.LIFE.GMO_MAIN,
    ownershipTransfer: true,
    accountTransfer: true,
    documentSent: true,
    workplaceDM: false,
    transactionLedger: false,
    managementCancel: true,
    memo: "",
    businessStatus: BUSINESS_STATUS.STATEMENT_COMPLETED_SETTLEMENT_WAITING,
    documentStatus: DOCUMENT_STATUS.ALL_ACQUIRED,
    contractProgress: {
      ab: createDefaultAbProgress(),
      bc: createDefaultBcProgress(),
    },
    documentProgress: {
      rental: createDefaultRentalDocuments(),
      building: createDefaultBuildingDocuments(),
      government: createDefaultGovernmentDocuments(),
      bank: createDefaultBankDocuments(),
    },
    settlementProgress: {
      statement: createDefaultStatementProgress(),
      scrivener: createDefaultScrivenerProgress(),
      mortgageBank: createDefaultMortgageBankProgress(),
      postSettlement: createDefaultPostSettlementProgress(),
    },
  },
];
