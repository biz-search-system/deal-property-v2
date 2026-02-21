# 組織一覧画面 仕様書

## バージョン情報

- **作成日**: 2026-01-17
- **バージョン**: 1.0
- **対象画面**: `/organization`

---

## 1. 画面概要

### 1.1 目的

ユーザーが所属する全ての組織を一覧表示し、組織の選択・管理へのアクセスを提供します。

### 1.2 アクセス条件

- ログイン済みユーザーのみアクセス可能
- 未ログインの場合はログイン画面にリダイレクト

---

## 2. 画面構成

### 2.1 レイアウト

```
┌─────────────────────────────────────────────────────────┐
│ パンくず: 組織 > 組織一覧                                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [+ 新規作成]                                           │
│                                                         │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │
│  │ 組織カード   │ │ 組織カード   │ │ 組織カード   │       │
│  │             │ │             │ │             │       │
│  │ 組織名      │ │ 組織名      │ │ 組織名      │       │
│  │ メンバー数   │ │ メンバー数   │ │ メンバー数   │       │
│  │ [役割バッジ] │ │ [役割バッジ] │ │ [役割バッジ] │       │
│  │       [⋮]  │ │       [⋮]  │ │       [⋮]  │       │
│  └─────────────┘ └─────────────┘ └─────────────┘       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 2.2 コンポーネント構成

| コンポーネント | ファイル | 説明 |
|--------------|---------|------|
| OrganizationsContent | `organizations-content.tsx` | メインコンテナ（SWR統合） |
| OrganizationsList | `organizations-list.tsx` | カードグリッド表示 |
| OrganizationCardMenu | `organization-card-menu.tsx` | ドロップダウンメニュー |
| DeleteOrganizationDialog | `delete-organization-dialog.tsx` | 削除確認ダイアログ |

---

## 3. 組織カード

### 3.1 表示項目

| 項目 | 説明 |
|------|------|
| 組織名 | 組織の表示名 |
| メンバー数 | 組織に所属するメンバーの総数 |
| 役割バッジ | ユーザーの役割（owner/admin/member） |
| メニューボタン | 操作メニュー（⋮アイコン） |

### 3.2 役割バッジ

| 役割 | 表示 | スタイル |
|------|------|----------|
| owner | オーナー | secondary variant |
| admin | 管理者 | secondary variant |
| member | メンバー | secondary variant |

### 3.3 アクティブ組織のハイライト（開発環境のみ）

- 開発環境では、アクティブな組織にリングスタイルを適用
- `ring-2 ring-primary` クラスでハイライト表示

---

## 4. カードメニュー

### 4.1 メニュー項目

| 項目 | アイコン | 条件 | 動作 |
|------|---------|------|------|
| アクティブに設定 | - | アクティブでない場合 | アクティブ組織を切り替え |
| 管理 | Settings | 常時表示 | 組織管理画面に遷移 |
| 退出 | LogOut | owner以外 | 組織から退出 |
| 削除 | Trash2 | ownerのみ | 組織を削除 |

### 4.2 削除確認ダイアログ

- AlertDialog を使用
- 確認メッセージ: 「組織「{組織名}」を削除しますか？」
- 警告メッセージ: 「この操作は取り消せません。組織に関連するすべてのデータが削除されます。」
- ボタン: キャンセル / 削除

---

## 5. データ取得

### 5.1 SWRフック

```typescript
useOrganizationsWithUserRole()
```

**レスポンス型**:

```typescript
interface OrganizationWithUserRole {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  createdAt: Date;
  metadata: string | null;
  role: "owner" | "admin" | "member";
  memberCount: number;
}
```

### 5.2 APIエンドポイント

| エンドポイント | メソッド | 説明 |
|---------------|---------|------|
| `/api/organization/user-role` | GET | 組織一覧（役割情報付き）を取得 |

---

## 6. サーバーアクション

### 6.1 アクティブ組織設定

```typescript
setActiveOrganizationAction(organizationId: string)
```

### 6.2 組織退出

```typescript
leaveOrganizationAction(organizationId: string)
```

### 6.3 組織削除

```typescript
deleteOrganizationAction(organizationId: string)
```

**前提条件**:
- 実行者がオーナーであること
- 組織が存在すること

---

## 7. 状態管理

### 7.1 ローディング状態

- スケルトンローダーを表示
- カードのプレースホルダーを3つ表示

### 7.2 エラー状態

- Alert コンポーネントで destructive variant を表示
- エラーメッセージを表示

### 7.3 空状態

- 組織が0件の場合、「組織がありません」メッセージを表示
- 新規作成ボタンへの誘導

---

## 8. 画面遷移

| 操作 | 遷移先 |
|------|--------|
| 新規作成ボタン | `/organization/new` |
| 管理メニュー | `/organization/{organizationId}` |
| カードクリック | （なし - メニューから操作） |

---

## 9. UIコンポーネント

### 9.1 使用コンポーネント

- Card（shadcn/ui）
- Badge（shadcn/ui）
- Button（shadcn/ui）
- DropdownMenu（shadcn/ui）
- AlertDialog（shadcn/ui）
- Alert（shadcn/ui）
- Skeleton（shadcn/ui）

### 9.2 グリッドレイアウト

```
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4
```

---

最終更新: 2026-01-17
