# インライン編集 仕様書

## バージョン情報

- **作成日**: 2026-01-17
- **バージョン**: 1.0
- **対象フェーズ**: Phase 1（現在の実装状態）

---

## 1. 概要

### 1.1 目的

一覧画面から直接データを編集できるインライン編集機能の仕様です。編集画面に遷移することなく、効率的にデータを更新できます。

### 1.2 対象画面

- BC確定前案件一覧（`/properties/unconfirmed`）
- 月次案件一覧（`/properties/monthly/[year]/[month]`）

---

## 2. インライン編集の種類

### 2.1 編集タイプ一覧

| タイプ | 説明 | UI |
|--------|------|-----|
| Popover編集 | テキスト・金額・日付の編集 | Popoverが開く |
| Dropdown編集 | 選択式項目の編集 | DropdownMenuが開く |
| Badge Toggle | 2値の切り替え | クリックでトグル |
| Combobox編集 | サジェスト付き選択 | Comboboxが開く |

---

## 3. Popover編集

### 3.1 対象項目

| 項目 | 項目ID | 入力タイプ | バリデーション |
|------|--------|------------|----------------|
| 物件名 | propertyName | テキスト | 最大100文字 |
| 号室 | roomNumber | テキスト | 最大20文字 |
| オーナー名 | ownerName | テキスト | 最大100文字 |
| A金額 | amountA | 数値（万円） | 0以上 |
| 出口金額 | amountExit | 数値（万円） | 0以上 |
| 仲手等 | commission | 数値（万円） | 0以上 |
| BC手付 | bcDeposit | 数値（万円） | 0以上 |
| 備考 | notes | テキストエリア | 最大1000文字 |
| 決済日 | settlementDate | 月選択 | - |

### 3.2 UI構造

```
┌─────────────────────────────┐
│ フィールド名                 │
│ ┌─────────────────────────┐ │
│ │ 入力エリア               │ │
│ │                          │ │
│ └─────────────────────────┘ │
│                    [保存]    │
└─────────────────────────────┘
```

### 3.3 動作仕様

1. セルをクリックするとPopoverが開く
2. 現在の値が入力欄に表示される
3. 値を編集
4. 「保存」ボタンをクリック、またはEnterキーで保存
5. Escキーでキャンセル

### 3.4 コンポーネント詳細

#### 3.4.1 PropertyNameEdit（物件名編集）

**ファイル**: `apps/web/components/property/inline-edit/property-name-edit.tsx`

```typescript
interface PropertyNameEditProps {
  propertyId: string;
  currentValue: string;
}
```

**サーバーアクション**: `updatePropertyName(id, propertyName)`

#### 3.4.2 RoomNumberEdit（号室編集）

**ファイル**: `apps/web/components/property/inline-edit/room-number-edit.tsx`

```typescript
interface RoomNumberEditProps {
  propertyId: string;
  currentValue: string | null;
}
```

**サーバーアクション**: `updatePropertyRoomNumber(id, roomNumber)`

#### 3.4.3 OwnerNameEdit（オーナー名編集）

**ファイル**: `apps/web/components/property/inline-edit/owner-name-edit.tsx`

```typescript
interface OwnerNameEditProps {
  propertyId: string;
  currentValue: string;
}
```

**サーバーアクション**: `updatePropertyOwnerName(id, ownerName)`

#### 3.4.4 AmountEdit（金額編集）

**ファイル**: `apps/web/components/property/inline-edit/amount-edit.tsx`

```typescript
interface AmountEditProps {
  propertyId: string;
  field: 'amountA' | 'amountExit' | 'commission' | 'bcDeposit';
  currentValue: number | null;
  label: string;
}
```

**サーバーアクション**: `updatePropertyAmount(id, field, value)`

**特記事項**:

- 万円単位で入力
- 保存時に円単位に変換（× 10,000）
- 利益は自動再計算される

#### 3.4.5 NotesEdit（備考編集）

**ファイル**: `apps/web/components/property/inline-edit/notes-edit.tsx`

```typescript
interface NotesEditProps {
  propertyId: string;
  currentValue: string | null;
}
```

**サーバーアクション**: `updatePropertyNotes(id, notes)`

#### 3.4.6 SettlementDateEdit（決済日編集）

**ファイル**: `apps/web/components/property/inline-edit/settlement-date-edit.tsx`

```typescript
interface SettlementDateEditProps {
  propertyId: string;
  currentValue: Date | null;
}
```

**サーバーアクション**: `updatePropertySettlementDate(id, settlementDate)`

**特記事項**:

- MonthPickerを使用
- 月末日で保存（例: 2026年1月 → 2026-01-31）
- 決済日変更時、月次一覧の表示が変わる可能性あり

---

## 4. Dropdown編集

### 4.1 対象項目

| 項目 | 項目ID | 選択肢数 |
|------|--------|----------|
| 進捗ステータス | progressStatus | 7 |
| 書類ステータス | documentStatus | 3 |
| 契約形態 | contractType | 9 |
| B会社 | companyB | 7 |
| 仲介会社 | brokerCompany | 8 |

### 4.2 UI構造

```
┌─────────────────────┐
│ 選択肢1             │
│ 選択肢2 ✓           │
│ 選択肢3             │
│ ...                 │
└─────────────────────┘
```

### 4.3 動作仕様

1. バッジをクリックするとDropdownMenuが開く
2. 選択肢を選択すると即座に保存
3. 外側クリックでキャンセル

### 4.4 コンポーネント詳細

#### 4.4.1 ProgressStatusDropdown（進捗ステータス）

**ファイル**: `apps/web/components/property/inline-edit/progress-status-dropdown.tsx`

```typescript
interface ProgressStatusDropdownProps {
  propertyId: string;
  currentValue: ProgressStatus;
}
```

**サーバーアクション**: `updatePropertyProgressStatus(id, progressStatus)`

**選択肢**:

| 値 | 表示名 |
|----|--------|
| bc_before_confirmed | BC確定前 |
| bc_confirmed_cb_waiting | 契約CB待ち |
| bc_confirmed_contract_waiting | BC契約待ち |
| bc_completed_settlement_waiting | 決済日待ち |
| settlement_confirmed_statement_waiting | 精算CB待ち |
| statement_completed_settlement_waiting | 決済待ち |
| settlement_completed | 決済完了 |

**バリデーション**:

- 決済日が設定されていない場合、「BC確定前」以外は選択不可
- 「BC確定前」を選択した場合、決済日がクリアされる

#### 4.4.2 DocumentStatusDropdown（書類ステータス）

**ファイル**: `apps/web/components/property/inline-edit/document-status-dropdown.tsx`

```typescript
interface DocumentStatusDropdownProps {
  propertyId: string;
  currentValue: DocumentStatus;
}
```

**サーバーアクション**: `updatePropertyDocumentStatus(id, documentStatus)`

**選択肢**:

| 値 | 表示名 |
|----|--------|
| waiting_request | 営業依頼待ち |
| in_progress | 書類取得中 |
| completed | 書類取得完了 |

#### 4.4.3 ContractTypeBadge（契約形態）

**ファイル**: `apps/web/components/property/inline-edit/contract-type-badge.tsx`

```typescript
interface ContractTypeBadgeProps {
  propertyId: string;
  currentValue: ContractType | null;
}
```

**サーバーアクション**: `updatePropertyEnumField(id, 'contractType', value)`

#### 4.4.4 CompanyBBadge（B会社）

**ファイル**: `apps/web/components/property/inline-edit/company-b-badge.tsx`

```typescript
interface CompanyBBadgeProps {
  propertyId: string;
  currentValue: CompanyB | null;
}
```

**サーバーアクション**: `updatePropertyEnumField(id, 'companyB', value)`

#### 4.4.5 BrokerCompanyBadge（仲介会社）

**ファイル**: `apps/web/components/property/inline-edit/broker-company-badge.tsx`

```typescript
interface BrokerCompanyBadgeProps {
  propertyId: string;
  currentValue: BrokerCompany | null;
}
```

**サーバーアクション**: `updatePropertyEnumField(id, 'brokerCompany', value)`

---

## 5. Badge Toggle

### 5.1 対象項目

| 項目 | 項目ID | 状態 |
|------|--------|------|
| マイソク配布 | maisokuDistributed | 未配布 / 配布済 |

### 5.2 UI構造

```
クリック前: [未配布]（グレー）
クリック後: [配布済]（緑）
```

### 5.3 動作仕様

1. バッジをクリック
2. 状態が即座にトグル
3. サーバーに保存

### 5.4 コンポーネント詳細

#### 5.4.1 MaisokuBadge（マイソク配布）

**ファイル**: `apps/web/components/property/inline-edit/maisoku-badge.tsx`

```typescript
interface MaisokuBadgeProps {
  propertyId: string;
  distributed: boolean;
}
```

**サーバーアクション**: `updatePropertyEnumField(id, 'maisokuDistributed', !currentValue)`

---

## 6. Combobox編集

### 6.1 対象項目

| 項目 | 項目ID | サジェスト元 |
|------|--------|-------------|
| 買取業者 | buyerCompany | 過去の入力値 |

### 6.2 UI構造

```
┌─────────────────────────────┐
│ 買取業者                     │
│ ┌─────────────────────────┐ │
│ │ 検索入力...               │ │
│ ├─────────────────────────┤ │
│ │ ○○不動産                 │ │
│ │ △△リアルティ             │ │
│ │ □□ホールディングス        │ │
│ └─────────────────────────┘ │
│                    [保存]    │
└─────────────────────────────┘
```

### 6.3 動作仕様

1. セルをクリックするとPopoverが開く
2. Comboboxで検索または選択
3. 「保存」ボタンをクリック、またはEnterキーで保存
4. Escキーでキャンセル

### 6.4 コンポーネント詳細

#### 6.4.1 BuyerCompanyCombobox（買取業者）

**ファイル**: `apps/web/components/property/inline-edit/buyer-company-combobox.tsx`

```typescript
interface BuyerCompanyComboboxProps {
  propertyId: string;
  currentValue: string | null;
}
```

**サーバーアクション**: `updatePropertyBuyerCompany(id, buyerCompany)`

---

## 7. サーバーアクション一覧

### 7.1 アクション一覧

| アクション | 対象項目 | パラメータ |
|-----------|----------|------------|
| updatePropertyProgressStatus | progressStatus | id, progressStatus |
| updatePropertyDocumentStatus | documentStatus | id, documentStatus |
| updatePropertyNotes | notes | id, notes |
| updatePropertySettlementDate | settlementDate | id, settlementDate |
| updatePropertyName | propertyName | id, propertyName |
| updatePropertyOwnerName | ownerName | id, ownerName |
| updatePropertyAmount | amountA, amountExit, commission, bcDeposit | id, field, value |
| updatePropertyEnumField | contractType, companyB, brokerCompany, maisokuDistributed | id, field, value |
| updatePropertyBuyerCompany | buyerCompany | id, buyerCompany |
| updatePropertyRoomNumber | roomNumber | id, roomNumber |
| updatePropertyDocumentItem | documentItems | propertyId, itemType, status |

### 7.2 共通仕様

```typescript
// 戻り値の型
type ActionResult = {
  success: boolean;
  message?: string;
  error?: string;
};
```

### 7.3 エラーハンドリング

1. バリデーションエラー → トースト表示
2. サーバーエラー → トースト表示
3. 認証エラー → ログイン画面にリダイレクト

---

## 8. 変更追跡

### 8.1 追跡対象

以下の項目は変更時に日時と担当者を記録:

- 進捗ステータス（progressStatus）
- 書類ステータス（documentStatus）
- 決済日（settlementDate）
- 各書類の個別ステータス（documentItems）

### 8.2 記録内容

| フィールド | 説明 |
|-----------|------|
| updatedAt | 更新日時 |
| updatedBy | 更新者のユーザーID |

### 8.3 履歴テーブル

進捗ステータスの変更は`propertyProgressHistory`テーブルに記録:

| フィールド | 説明 |
|-----------|------|
| id | 履歴ID |
| propertyId | 案件ID |
| fromStatus | 変更前ステータス |
| toStatus | 変更後ステータス |
| changedBy | 変更者のユーザーID |
| changedAt | 変更日時 |

---

## 9. revalidatePath

### 9.1 更新後の再検証パス

| アクション | revalidatePath |
|-----------|----------------|
| updatePropertyProgressStatus | `/properties`, `/properties/unconfirmed` |
| updatePropertyDocumentStatus | `/properties`, `/properties/unconfirmed` |
| updatePropertyNotes | `/properties`, `/properties/unconfirmed` |
| updatePropertySettlementDate | `/properties`, `/properties/monthly/[year]/[month]` |
| updatePropertyName | `/properties`, `/properties/unconfirmed` |
| updatePropertyOwnerName | `/properties`, `/properties/unconfirmed` |
| updatePropertyAmount | `/properties`, `/properties/unconfirmed` |
| updatePropertyEnumField | `/properties`, `/properties/unconfirmed` |
| updatePropertyBuyerCompany | `/properties` |
| updatePropertyRoomNumber | `/properties`, `/properties/unconfirmed` |
| updatePropertyDocumentItem | `/properties`, `/properties/unconfirmed` |

---

## 10. パフォーマンス考慮事項

### 10.1 楽観的更新

現在は実装されていませんが、将来的に検討:

- 保存ボタンクリック時にUIを即座に更新
- サーバー保存が失敗した場合にロールバック

### 10.2 デバウンス

テキスト入力時のデバウンスは未実装（保存ボタンクリック時に保存）。

---

## 11. 関連ファイル

### 11.1 コンポーネント

- `apps/web/components/property/inline-edit/property-name-edit.tsx`
- `apps/web/components/property/inline-edit/room-number-edit.tsx`
- `apps/web/components/property/inline-edit/owner-name-edit.tsx`
- `apps/web/components/property/inline-edit/amount-edit.tsx`
- `apps/web/components/property/inline-edit/notes-edit.tsx`
- `apps/web/components/property/inline-edit/settlement-date-edit.tsx`
- `apps/web/components/property/inline-edit/progress-status-dropdown.tsx`
- `apps/web/components/property/inline-edit/document-status-dropdown.tsx`
- `apps/web/components/property/inline-edit/contract-type-badge.tsx`
- `apps/web/components/property/inline-edit/company-b-badge.tsx`
- `apps/web/components/property/inline-edit/broker-company-badge.tsx`
- `apps/web/components/property/inline-edit/maisoku-badge.tsx`
- `apps/web/components/property/inline-edit/buyer-company-combobox.tsx`

### 11.2 サーバーアクション

- `apps/web/lib/actions/property.ts`

---

最終更新: 2026-01-17
