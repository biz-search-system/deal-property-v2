# BC確定前案件一覧 仕様書

## バージョン情報

- **作成日**: 2026-01-17
- **バージョン**: 1.0
- **対象フェーズ**: Phase 1（現在の実装状態）

---

## 1. 画面概要

### 1.1 画面の目的

BC確定前の案件を一覧表示し、進捗を管理する画面です。利益見込み合計や件数を集計表示し、インライン編集で効率的に案件を管理できます。

### 1.2 想定利用者

- 営業担当者
- 事務担当者
- 経営者

### 1.3 画面のURL

- 一覧: `/properties/unconfirmed`
- 詳細: `/properties/unconfirmed/[id]`
- 編集: `/properties/unconfirmed/[id]/edit`

---

## 2. 画面構成

### 2.1 レイアウト

```
┌────────────────────────────────────────────────────────────────────┐
│ サイドバー │ ヘッダー                                              │
│           ├───────────────────────────────────────────────────────│
│           │ ┌─────────────────────────────────────────────────┐  │
│           │ │ 集計エリア                                        │  │
│           │ │ [利益見込み: ¥12,345万円] [件数: 25件]             │  │
│           │ └─────────────────────────────────────────────────┘  │
│           │                                                        │
│           │ ┌─────────────────────────────────────────────────┐  │
│           │ │ テーブル                                          │  │
│           │ │ ┌───┬───┬───┬───┬───┬───┬───┬───┐ │  │
│           │ │ │担当│物件名│号室│オーナー│A金額│出口│...│操作│ │  │
│           │ │ ├───┼───┼───┼───┼───┼───┼───┼───┤ │  │
│           │ │ │...│...   │...│...    │...  │... │...│...│ │  │
│           │ │ └───┴───┴───┴───┴───┴───┴───┴───┘ │  │
│           │ └─────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────┘
```

### 2.2 集計エリア

画面上部に以下の集計情報を表示:

| 項目 | 説明 | 表示形式 |
|------|------|----------|
| 利益見込み合計 | BC確定前案件の利益合計 | ¥XX,XXX万円 |
| 件数 | BC確定前案件の総件数 | XX件 |

---

## 3. テーブル仕様

### 3.1 表示カラム

| # | 項目 | 項目ID | 説明 | 表示仕様 | インライン編集 |
|---|------|--------|------|----------|----------------|
| 1 | 管理組織 | organization | 案件を管理する会社 | バッジ表示 | - |
| 2 | 担当 | staff | 担当者名 | バッジ表示 | - |
| 3 | 物件名 | propertyName | 物件の名称 | 全文表示・固定列 | ○（Popover） |
| 4 | 号室 | roomNumber | 部屋番号 | 全文表示・固定列 | ○（Popover） |
| 5 | オーナー | ownerName | オーナー名 | 全文表示 | ○（Popover） |
| 6 | A金額 | amountA | 入口金額（万円単位） | 右寄せ | ○（Popover） |
| 7 | 出口 | amountExit | 出口金額（万円単位） | 右寄せ | ○（Popover） |
| 8 | 仲手等 | commission | 仲介手数料等（万円単位） | 右寄せ | ○（Popover） |
| 9 | 利益 | profit | 自動計算された利益額 | 右寄せ・強調 | - |
| 10 | 契約形態 | contractType | 契約の形態 | バッジ表示 | ○（Dropdown） |
| 11 | B会社 | companyB | B会社名 | バッジ表示 | ○（Dropdown） |
| 12 | 仲介 | brokerCompany | 仲介会社名 | バッジ表示 | ○（Dropdown） |
| 13 | マイソク | maisokuDistributed | 配布状況 | バッジ表示 | ○（Badge Toggle） |
| 14 | 進捗 | progressStatus | 業務ステータス | バッジ表示 | ○（Dropdown） |
| 15 | 書類 | documentStatus | 書類ステータス | バッジ表示 | ○（Dropdown） |
| 16 | 備考 | notes | メモ・注意事項 | 省略表示 | ○（Popover） |
| 17 | 操作 | actions | 詳細・編集メニュー | 三点メニュー・固定列 | - |

### 3.2 カラム詳細

#### 3.2.1 管理組織（organization）

組織をバッジで表示。

| 値 | 表示名 | バッジ色 |
|----|--------|----------|
| レイジット | レイジット | 赤系 |
| エスク | エスク | 紫系 |
| TOUSEI | TOUSEI | 青系 |

#### 3.2.2 担当（staff）

複数の担当者がいる場合、バッジを横並びで表示。

#### 3.2.3 契約形態（contractType）

| 値 | 表示名 | バッジ色 |
|----|--------|----------|
| ab_bc | AB・BC | 青 |
| ac | AC | 緑 |
| iyaku | 違約 | 赤 |
| hakushi | 白紙 | グレー |
| mitei | 未定 | 黄 |
| jisha | 自社仕入れ | 紫 |
| bengoshi | 弁護士 | 茶 |
| kaichu | 買仲 | オレンジ |
| iyaku_yotei | 違約予定 | ピンク |

#### 3.2.4 進捗ステータス（progressStatus）

| 値 | 表示名 | バッジ色 |
|----|--------|----------|
| bc_before_confirmed | BC確定前 | グレー |
| bc_confirmed_cb_waiting | 契約CB待ち | 黄 |
| bc_confirmed_contract_waiting | BC契約待ち | 青 |
| bc_completed_settlement_waiting | 決済日待ち | 紫 |
| settlement_confirmed_statement_waiting | 精算CB待ち | オレンジ |
| statement_completed_settlement_waiting | 決済待ち | 緑 |
| settlement_completed | 決済完了 | 緑（濃） |

#### 3.2.5 書類ステータス（documentStatus）

| 値 | 表示名 | バッジ色 |
|----|--------|----------|
| waiting_request | 営業依頼待ち | グレー |
| in_progress | 書類取得中 | 黄 |
| completed | 書類取得完了 | 緑 |

---

## 4. インライン編集

### 4.1 Popover編集

テキスト・金額項目をクリックするとPopoverが開き、その場で編集可能。

| 対象項目 | 入力タイプ | バリデーション |
|----------|------------|----------------|
| 物件名 | テキスト | 最大100文字 |
| 号室 | テキスト | 最大20文字 |
| オーナー名 | テキスト | 最大100文字 |
| A金額 | 数値（万円） | 0以上 |
| 出口金額 | 数値（万円） | 0以上 |
| 仲手等 | 数値（万円） | 0以上 |
| 備考 | テキストエリア | 最大1000文字 |

**Popoverの構成**:

```
┌─────────────────────────┐
│ フィールド名            │
│ ┌─────────────────────┐ │
│ │ 入力エリア           │ │
│ └─────────────────────┘ │
│ [保存]                   │
└─────────────────────────┘
```

### 4.2 Dropdown編集

選択式項目をクリックするとDropdownが開き、選択可能。

| 対象項目 | 選択肢 |
|----------|--------|
| 契約形態 | 9種類（上記参照） |
| B会社 | 7種類 |
| 仲介会社 | 8種類 |
| 進捗ステータス | 7種類 |
| 書類ステータス | 3種類 |

### 4.3 Badge Toggle編集

マイソク配布状況をクリックするとトグル。

| 状態 | 表示 | クリック後 |
|------|------|------------|
| 未配布 | グレーバッジ | 配布済に変更 |
| 配布済 | 緑バッジ | 未配布に変更 |

---

## 5. 操作メニュー

### 5.1 三点メニューの項目

| 項目 | アイコン | 説明 |
|------|----------|------|
| 詳細を見る | Eye | 案件詳細画面に遷移 |
| 編集する | Pencil | 案件編集画面に遷移 |
| 削除する | Trash | 案件を削除（確認ダイアログ） |

### 5.2 削除の確認ダイアログ

```
┌─────────────────────────────────┐
│ 案件を削除しますか？             │
│                                  │
│ この操作は取り消せません。        │
│ 「〇〇マンション 101号室」を      │
│ 削除してもよろしいですか？        │
│                                  │
│        [キャンセル] [削除する]    │
└─────────────────────────────────┘
```

---

## 6. データフィルタリング

### 6.1 表示条件

- 進捗ステータスが「BC確定前」（bc_before_confirmed）の案件のみ表示
- ユーザーの所属組織に基づくフィルタリング

### 6.2 権限によるフィルタリング

| ロール | 表示範囲 |
|--------|----------|
| owner（経営者） | Active Organization = null: 全組織 / 特定: その組織のみ |
| admin（管理者） | 所属組織の案件のみ |
| member（メンバー） | 所属組織の案件のみ |

### 6.3 ソート

決済予定日（settlementDate）の昇順でソート。

---

## 7. データフロー

### 7.1 初期データ取得

```
[ページロード]
    ↓
[Server Component]
    ↓
[getUnconfirmedProperties()]
    - organizationId でフィルタリング
    - progressStatus = 'bc_before_confirmed'
    - settlementDate ASC でソート
    ↓
[UnconfirmedPropertiesTable]
    ↓
[集計計算]
    - 利益合計
    - 件数
    ↓
[レンダリング]
```

### 7.2 インライン編集

```
[セルクリック]
    ↓
[Popover/Dropdown 表示]
    ↓
[値の変更]
    ↓
[Server Action 呼び出し]
    - updatePropertyProgressStatus
    - updatePropertyDocumentStatus
    - updatePropertyNotes
    - updatePropertyAmount
    - etc.
    ↓
[revalidatePath]
    ↓
[UI更新]
```

---

## 8. コンポーネント構成

### 8.1 主要コンポーネント

| コンポーネント | ファイル | 説明 |
|---------------|----------|------|
| UnconfirmedProperties | unconfirmed/unconfirmed-properties.tsx | メインコンテナ |
| UnconfirmedPropertiesTable | unconfirmed/unconfirmed-properties-table.tsx | テーブル本体 |
| unconfirmedColumns | unconfirmed/unconfirmed-columns.tsx | カラム定義 |

### 8.2 インライン編集コンポーネント

| コンポーネント | ファイル | 説明 |
|---------------|----------|------|
| PropertyNameEdit | inline-edit/property-name-edit.tsx | 物件名編集 |
| RoomNumberEdit | inline-edit/room-number-edit.tsx | 号室編集 |
| OwnerNameEdit | inline-edit/owner-name-edit.tsx | オーナー名編集 |
| AmountEdit | inline-edit/amount-edit.tsx | 金額編集 |
| NotesEdit | inline-edit/notes-edit.tsx | 備考編集 |
| ProgressStatusDropdown | inline-edit/progress-status-dropdown.tsx | 進捗選択 |
| DocumentStatusDropdown | inline-edit/document-status-dropdown.tsx | 書類選択 |
| ContractTypeBadge | inline-edit/contract-type-badge.tsx | 契約形態選択 |
| CompanyBBadge | inline-edit/company-b-badge.tsx | B会社選択 |
| BrokerCompanyBadge | inline-edit/broker-company-badge.tsx | 仲介会社選択 |
| MaisokuBadge | inline-edit/maisoku-badge.tsx | マイソク配布トグル |

---

## 9. 関連ファイル

### 9.1 ページ

- `apps/web/app/(main)/properties/unconfirmed/page.tsx`
- `apps/web/app/(main)/properties/unconfirmed/[id]/page.tsx`
- `apps/web/app/(main)/properties/unconfirmed/[id]/edit/page.tsx`

### 9.2 コンポーネント

- `apps/web/components/property/unconfirmed/*.tsx`
- `apps/web/components/property/inline-edit/*.tsx`

### 9.3 サーバーアクション

- `apps/web/lib/actions/property.ts`
  - `updatePropertyProgressStatus`
  - `updatePropertyDocumentStatus`
  - `updatePropertyNotes`
  - `updatePropertyName`
  - `updatePropertyOwnerName`
  - `updatePropertyAmount`
  - `updatePropertyEnumField`
  - `updatePropertyRoomNumber`

### 9.4 データ取得

- `apps/web/lib/data/property.ts`
  - `getUnconfirmedProperties`
  - `getAllUnconfirmedPropertiesBySettlementDate`

---

最終更新: 2026-01-17
