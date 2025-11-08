# 銀行口座管理 DB設計書

## バージョン情報

- **作成日**: 2025-11-08
- **バージョン**: 1.0
- **対象フェーズ**: MVP（最小限の機能を実装した初期バージョン）

---

## 1. 概要

### 1.1 目的

不動産案件の決済時に使用する銀行口座を管理するためのDB設計です。各口座には1日あたりの決済上限（通常1億円）が設定されており、同日の決済を複数口座に分散することでリスク管理を行います。

### 1.2 ビジネス要件

- 3つの口座会社（レイジット、ライフ、エムズ）が存在
- 各口座会社は複数の銀行口座を保有
- 各銀行口座には1日1億円の決済上限が存在
- 案件ごとに使用する口座を指定し、決済上限を超えないよう管理

---

## 2. テーブル構造

### 2.1 propertiesテーブル内のフィールド

```sql
-- 案件テーブル内の口座関連フィールド
account_company  VARCHAR(20)  NULL  -- 使用口座会社
bank_account     VARCHAR(50)  NULL  -- 使用銀行口座
```

### 2.2 データ型と制約

| フィールド名     | データ型     | NULL許可 | 説明                                    |
| --------------- | ------------ | -------- | --------------------------------------- |
| account_company | VARCHAR(20)  | YES      | 使用口座会社（legit/life/ms）           |
| bank_account    | VARCHAR(50)  | YES      | 使用銀行口座（会社により選択肢が変化）   |

---

## 3. マスタデータ定義

### 3.1 account_company（使用口座会社）の値

| DB値  | 表示名     | 説明                       |
| ----- | ---------- | -------------------------- |
| legit | レイジット | 株式会社レイジットの口座    |
| life  | ライフ     | ライフインベストの口座      |
| ms    | エムズ     | M'scompanyの口座           |

### 3.2 bank_account（使用銀行口座）の値

#### レイジット（legit）

| DB値      | 表示名    | 銀行名              | 備考           |
| --------- | --------- | ------------------- | -------------- |
| gmo_main  | GMOメイン | GMOあおぞらネット銀行 | メイン口座     |
| gmo_sub   | GMOサブ   | GMOあおぞらネット銀行 | サブ口座       |
| kinsan    | 近産      | 近畿産業信用組合     | 追加口座       |

#### ライフ（life）

| DB値              | 表示名           | 口座番号  | 備考           |
| ----------------- | ---------------- | --------- | -------------- |
| main_1727088      | メイン1727088    | 1727088   | メイン口座     |
| sub_1728218       | サブ1728218      | 1728218   | サブ口座       |
| new_main_2309414  | 新メイン2309414  | 2309414   | 新規メイン口座 |

#### エムズ（ms）

| DB値      | 表示名   | 銀行名                | 備考         |
| --------- | -------- | --------------------- | ------------ |
| sumi_shin | 住信     | 住信SBIネット銀行      | メイン口座   |
| gmo_main  | GMOメイン | GMOあおぞらネット銀行  | GMO口座1     |
| gmo_sub   | GMOサブ  | GMOあおぞらネット銀行  | GMO口座2     |
| rakuten   | 楽天     | 楽天銀行              | 楽天口座     |
| paypay_1  | PayPay① | PayPay銀行            | PayPay口座1  |
| paypay_2  | PayPay② | PayPay銀行            | PayPay口座2  |
| paypay_3  | PayPay③ | PayPay銀行            | PayPay口座3  |

---

## 4. ビジネスロジック

### 4.1 口座選択の制御

```typescript
// 口座会社に応じた銀行口座の選択肢を返す
function getBankAccountOptions(accountCompany: string) {
  switch(accountCompany) {
    case 'legit':
      return ['gmo_main', 'gmo_sub', 'kinsan'];
    case 'life':
      return ['main_1727088', 'sub_1728218', 'new_main_2309414'];
    case 'ms':
      return ['sumi_shin', 'gmo_main', 'gmo_sub', 'rakuten',
              'paypay_1', 'paypay_2', 'paypay_3'];
    default:
      return [];
  }
}
```

### 4.2 決済上限管理

各銀行口座には以下の制限があります：

- **1日あたりの決済上限**: 1億円（10,000万円）
- **警告閾値**: 80%（8,000万円）以上で警告表示
- **エラー閾値**: 100%（10,000万円）以上でエラー表示

---

## 5. 集計クエリ

### 5.1 同日同口座の決済金額集計

```sql
-- 特定日・特定口座の決済金額合計を取得
SELECT
  settlement_date,
  account_company,
  bank_account,
  SUM(amount_exit) as total_amount,
  COUNT(*) as property_count,
  CASE
    WHEN SUM(amount_exit) >= 10000 THEN 'ERROR'
    WHEN SUM(amount_exit) >= 8000 THEN 'WARNING'
    ELSE 'OK'
  END as status
FROM properties
WHERE
  settlement_date = :target_date
  AND account_company = :company
  AND bank_account = :account
  AND progress_status != 'settlement_completed'
GROUP BY settlement_date, account_company, bank_account;
```

### 5.2 月次口座別集計

```sql
-- 月次の口座別決済予定集計
SELECT
  DATE_FORMAT(settlement_date, '%Y-%m') as month,
  account_company,
  bank_account,
  COUNT(*) as property_count,
  SUM(amount_exit) as total_amount
FROM properties
WHERE
  settlement_date BETWEEN :start_date AND :end_date
  AND progress_status != 'settlement_completed'
GROUP BY
  DATE_FORMAT(settlement_date, '%Y-%m'),
  account_company,
  bank_account
ORDER BY month, account_company, bank_account;
```

---

## 6. データ整合性

### 6.1 バリデーションルール

1. **口座会社・銀行口座の組み合わせチェック**
   - `account_company`が設定されている場合、`bank_account`も必須
   - `bank_account`は`account_company`に対応する有効な値のみ許可

2. **決済日との関連チェック**
   - `settlement_date`が設定されている場合、口座情報の入力を推奨
   - 決済日が近い案件（3日以内）は口座情報必須

### 6.2 インデックス設計

```sql
-- 口座別集計用の複合インデックス
CREATE INDEX idx_properties_settlement_account
ON properties(settlement_date, account_company, bank_account)
WHERE progress_status != 'settlement_completed';
```

---

## 7. UI実装ガイドライン

### 7.1 フォーム実装

1. **口座会社選択**（第1プルダウン）
   - デフォルト: 未選択
   - 変更時: 銀行口座をクリア

2. **銀行口座選択**（第2プルダウン）
   - 口座会社未選択時: 非活性
   - 口座会社選択時: 対応する選択肢を表示

3. **決済上限表示**
   - 決済日と口座選択時: リアルタイムで残枠表示
   - 警告/エラー表示の実装

### 7.2 一覧画面での表示

BC確定前案件一覧や月次案件一覧では口座情報を表示しませんが、詳細画面では以下の形式で表示：

```
使用口座: レイジット - GMOメイン
決済日: 2025/01/15
同日同口座合計: 8,500万円 / 10,000万円 (85%)
```

---

## 8. 将来の拡張検討

### 8.1 Phase 1での改善案

1. **口座マスタテーブルの作成**
   ```sql
   CREATE TABLE account_companies (
     id VARCHAR(20) PRIMARY KEY,
     name VARCHAR(100) NOT NULL,
     organization_id VARCHAR(255),
     is_active BOOLEAN DEFAULT true,
     display_order INT
   );

   CREATE TABLE bank_accounts (
     id VARCHAR(50) PRIMARY KEY,
     account_company_id VARCHAR(20) NOT NULL,
     name VARCHAR(100) NOT NULL,
     bank_name VARCHAR(100),
     account_number VARCHAR(20),
     daily_limit DECIMAL(10,0) DEFAULT 10000,
     is_active BOOLEAN DEFAULT true,
     display_order INT,
     FOREIGN KEY (account_company_id) REFERENCES account_companies(id)
   );
   ```

2. **自動口座振り分け機能**
   - 決済日の残枠を自動計算
   - 最適な口座を自動提案
   - 複数口座への自動分割

### 8.2 Phase 2以降での検討事項

1. **口座別の上限カスタマイズ**
   - 口座ごとに異なる上限設定
   - 曜日別・月別の上限変更

2. **口座利用履歴の管理**
   - 実際の決済実行記録
   - 口座別の利用統計

3. **アラート機能**
   - 上限接近時のメール通知
   - 決済日前の口座確認リマインダー

---

## 9. メリット・デメリット

### 9.1 メリット

- **決済リスク管理**: 1日1億円の上限を案件単位で管理可能
- **柔軟性**: 組織や金額に応じた最適な口座選択
- **トレーサビリティ**: 案件と口座の紐付けが明確
- **障害対応**: 特定口座の問題時も他口座で業務継続可能

### 9.2 デメリット

- **入力負荷**: 案件ごとの口座選択が必要
- **管理複雑性**: 口座と案件の紐付け管理が煩雑
- **データ整合性リスク**: 口座変更時の更新漏れリスク
- **集計処理負荷**: リアルタイム上限チェックの処理コスト

---

## 10. 参照ドキュメント

- [案件管理システム データベース定義書](./er-diagram.md)
- [案件新規登録・編集画面 要件定義書](../deal-create-edit.md)
- [MVPシステム要件定義書](../mvp-requirements-definition-for-client.md)

---

最終更新: 2025-11-08