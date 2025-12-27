/**
 * テーブルのヘッダーカラム幅クラスを取得
 */
export const getHeaderColumnClass = (columnId: string): string => {
  switch (columnId) {
    case "organization":
      return "w-[70px]";
    case "staff":
      return "w-[50px]";
    case "propertyName":
      return "";
    case "roomNumber":
      return "w-[40px]";
    case "ownerName":
      return "min-w-[55px]";
    case "amountA":
    case "amountExit":
    case "commission":
    case "profit":
    case "bcDeposit":
      return "w-[50px]";
    case "settlementDate":
      return "w-[60px]";
    case "buyerCompany":
      return "min-w-[40px]";
    case "contractType":
    case "companyB":
    case "brokerCompany":
    case "progressStatus":
    case "documentStatus":
      return "w-[70px]";
    case "notes":
      return "min-w-[65px] max-w-[120px]";
    case "actions":
      return "sticky right-0 bg-background w-[50px]";
    default:
      return "";
  }
};

/**
 * テーブルのセルカラム幅クラスを取得
 */
export const getCellColumnClass = (columnId: string): string => {
  const base = "text-[10px] p-1";
  switch (columnId) {
    case "organization":
      return `${base} w-[70px] text-center`;
    case "staff":
      return `${base} max-w-[80px]`;
    case "propertyName":
      return `${base} max-w-[140px]`;
    case "roomNumber":
      return base;
    case "ownerName":
      return `${base} max-w-[60px]`;
    case "buyerCompany":
      return `${base} max-w-[50px]`;
    case "notes":
      return `${base} max-w-[80px]`;
    case "actions":
      return `${base} text-center p-0`;
    default:
      return base;
  }
};
