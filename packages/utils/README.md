# `@dub/utils`

`@dub/utils` is a library of utility functions that are used across Dub's web applications.

## Installation

To install the package, run:

```bash
pnpm i @dub/utils
```

## 機能一覧

このパッケージには、文字列操作、配列操作、日時処理、URL処理、フェッチユーティリティなど、多様なユーティリティ関数が含まれています。

---

## 📝 文字列操作

### `capitalize`

文字列内の各単語の最初の文字を大文字に変換します。

```typescript
import { capitalize } from '@dub/utils';

capitalize('hello world'); // "Hello World"
capitalize(null); // null
```

### `toCamelCase`

snake_case形式の文字列をcamelCase形式に変換します。

```typescript
import { toCamelCase } from '@dub/utils';

toCamelCase('user_name'); // "userName"
toCamelCase('first_name_last_name'); // "firstNameLastName"
```

### `truncate`

指定された長さで文字列を切り詰め、末尾に "..." を追加します。

```typescript
import { truncate } from '@dub/utils';

truncate('This is a long text', 10); // "This is..."
truncate('Short', 10); // "Short"
```

### `smartTruncate`

ドメインとパスを考慮した賢い切り詰めアルゴリズム。パスを優先し、必要に応じてドメインを切り詰めます。

```typescript
import { smartTruncate } from '@dub/utils';

smartTruncate('example.com/very/long/path/to/resource', 25);
// ドメインとパスを適切にバランスさせて切り詰め
```

### `normalizeString`

BOM、特殊文字、印字不可能な文字を削除し、文字列を正規化します。

```typescript
import { normalizeString } from '@dub/utils';

normalizeString('  Hello\u0000World  '); // "hello world"
```

### `regexEscape`

正規表現で使用する文字列をエスケープします。

```typescript
import { regexEscape } from '@dub/utils';

regexEscape('example.com'); // "example\\.com"
```

### `trim`

文字列の前後の空白を削除します。文字列以外の値はそのまま返します。

```typescript
import { trim } from '@dub/utils';

trim('  hello  '); // "hello"
trim(123); // 123
```

---

## 🔢 配列・オブジェクト操作

### `arrayEqual`

2つの文字列配列が等しいかどうかを比較します。順序を考慮するオプションあり。

```typescript
import { arrayEqual } from '@dub/utils';

arrayEqual(['a', 'b'], ['b', 'a']); // true (順序無視)
arrayEqual(['a', 'b'], ['b', 'a'], { sameOrder: true }); // false
```

### `chunk`

配列を指定されたサイズのチャンクに分割します。

```typescript
import { chunk } from '@dub/utils';

chunk([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]
```

### `deepEqual`

2つのオブジェクトを深く比較します。

```typescript
import { deepEqual } from '@dub/utils';

deepEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } }); // true
deepEqual({ a: 1 }, { a: 2 }); // false
```

### `stableSort`

比較関数を使用して配列を安定ソートします（等しい要素の順序を保持）。

```typescript
import { stableSort } from '@dub/utils';

const items = [{ id: 1, value: 5 }, { id: 2, value: 5 }, { id: 3, value: 3 }];
stableSort(items, (a, b) => a.value - b.value);
// 同じ値の要素の順序が保持される
```

---

## 📅 日時処理

### `formatDate`

日付を読みやすい形式でフォーマットします。

```typescript
import { formatDate } from '@dub/utils';

formatDate(new Date('2024-01-15')); // "January 15, 2024"
formatDate('2024-01-15', { month: 'short' }); // "Jan 15, 2024"
```

### `formatDateTime`

日時を読みやすい形式でフォーマットします。

```typescript
import { formatDateTime } from '@dub/utils';

formatDateTime(new Date('2024-01-15T14:30:00')); // "Jan 15, 2024, 2:30 PM"
```

### `timeAgo`

タイムスタンプから「○分前」のような相対時間を生成します。

```typescript
import { timeAgo } from '@dub/utils';

timeAgo(new Date(Date.now() - 5000)); // "5s"
timeAgo(new Date(Date.now() - 60000), { withAgo: true }); // "1m ago"
timeAgo(null); // "Never"
```

### `getBillingStartDate`

請求サイクルの開始日を計算します。

```typescript
import { getBillingStartDate } from '@dub/utils';

// 毎月15日が請求開始日の場合
getBillingStartDate(15); // 最も直近の請求開始日を返す
```

### `getFirstAndLastDay`

指定された日付を基準に、期間の最初と最後の日を計算します。

```typescript
import { getFirstAndLastDay } from '@dub/utils';

getFirstAndLastDay(15);
// { firstDay: Date, lastDay: Date }
```

---

## 🌐 URL・ドメイン処理

### `isValidUrl`

URLが有効かどうかを検証します。

```typescript
import { isValidUrl } from '@dub/utils';

isValidUrl('https://example.com'); // true
isValidUrl('not a url'); // false
```

### `getUrlFromString`

文字列からURLを構築します。プロトコルがない場合は自動的に追加します。

```typescript
import { getUrlFromString } from '@dub/utils';

getUrlFromString('example.com'); // "https://example.com"
getUrlFromString('https://example.com'); // "https://example.com"
```

### `getApexDomain`

URLからトップレベルドメインを抽出します。

```typescript
import { getApexDomain } from '@dub/utils';

getApexDomain('https://blog.example.co.uk'); // "example.co.uk"
getApexDomain('https://sub.domain.example.com'); // "example.com"
```

### `getDomainWithoutWWW`

URLからwwwを除いたドメインを取得します。

```typescript
import { getDomainWithoutWWW } from '@dub/utils';

getDomainWithoutWWW('https://www.example.com'); // "example.com"
```

### `getPrettyUrl`

URLから読みやすい形式を生成します（プロトコルとwwwを削除）。

```typescript
import { getPrettyUrl } from '@dub/utils';

getPrettyUrl('https://www.example.com/page'); // "example.com/page"
```

### `getSearchParams`

URLからクエリパラメータを抽出します。

```typescript
import { getSearchParams } from '@dub/utils';

getSearchParams('https://example.com?foo=bar&baz=qux');
// { foo: 'bar', baz: 'qux' }
```

### `constructURLFromUTMParams`

URLにUTMパラメータを追加します。

```typescript
import { constructURLFromUTMParams } from '@dub/utils';

constructURLFromUTMParams('https://example.com', {
  utm_source: 'google',
  utm_medium: 'cpc'
});
// "https://example.com?utm_source=google&utm_medium=cpc"
```

### `linkConstructor`

ドメイン、キー、検索パラメータからリンクを構築します。

```typescript
import { linkConstructor } from '@dub/utils';

linkConstructor({
  domain: 'example.com',
  key: 'abc123',
  searchParams: { ref: 'twitter' }
});
// "https://example.com/abc123?ref=twitter"
```

### `punycode` / `punyEncode`

国際化ドメイン名（IDN）をUnicode/ASCIIに変換します。

```typescript
import { punycode, punyEncode } from '@dub/utils';

punycode('xn--n3h.com'); // "☃.com"
punyEncode('☃.com'); // "xn--n3h.com"
```

---

## 🌍 フェッチユーティリティ

### `fetcher`

SWR用のフェッチ関数。エラーハンドリングを含みます。

```typescript
import { fetcher } from '@dub/utils';

const data = await fetcher('/api/data');
// エラー時はステータスコードと詳細を含むエラーをスロー
```

### `textFetcher`

テキストレスポンスを返すフェッチ関数。

```typescript
import { textFetcher } from '@dub/utils';

const text = await textFetcher('/api/text');
```

### `fetchWithTimeout`

タイムアウト付きのフェッチ関数。

```typescript
import { fetchWithTimeout } from '@dub/utils';

const response = await fetchWithTimeout('https://api.example.com', {}, 3000);
// 3秒でタイムアウト
```

### `fetchWithRetry`

自動リトライ機能付きのフェッチ関数。レート制限やサーバーエラーに対応。

```typescript
import { fetchWithRetry } from '@dub/utils';

const response = await fetchWithRetry('https://api.example.com', {}, {
  maxRetries: 5,
  retryDelay: 1000,
  timeout: 5000
});
// 失敗時は指数バックオフで自動リトライ
```

---

## 🎨 UI・React関連

### `cn`

Tailwind CSSのクラス名を結合・マージします（clsx + tailwind-merge）。

```typescript
import { cn } from '@dub/utils';

cn('px-2 py-1', 'px-4'); // "py-1 px-4" (後の方が優先される)
cn('text-red-500', condition && 'text-blue-500');
```

### `isClickOnInteractiveChild`

クリックイベントがインタラクティブな子要素（ボタン、リンクなど）で発生したかを判定します。

```typescript
import { isClickOnInteractiveChild } from '@dub/utils';

function handleCardClick(e: MouseEvent) {
  if (isClickOnInteractiveChild(e)) return;
  // カード自体がクリックされた場合の処理
}
```

### `constructMetadata`

Next.jsのメタデータオブジェクトを構築します。

```typescript
import { constructMetadata } from '@dub/utils';

export const metadata = constructMetadata({
  title: 'My Page',
  description: 'This is my page',
  image: 'https://example.com/og-image.jpg'
});
```

---

## 🔧 その他のユーティリティ

### `combineWords`

単語の配列を自然な形式で結合します（最後の単語の前に"and"を追加）。

```typescript
import { combineWords } from '@dub/utils';

combineWords(['apple', 'banana', 'cherry']); // "apple, banana and cherry"
```

### `pluralize`

数に応じて単語を複数形にします。

```typescript
import { pluralize } from '@dub/utils';

pluralize('item', 1); // "item"
pluralize('item', 5); // "items"
pluralize('person', 5, { plural: 'people' }); // "people"
```

### `nFormatter`

数値を読みやすい形式にフォーマットします（K, M, G など）。

```typescript
import { nFormatter } from '@dub/utils';

nFormatter(1234); // "1.2K"
nFormatter(1234567); // "1.2M"
nFormatter(1234, { full: true }); // "1,234"
```

### `currencyFormatter`

数値を通貨形式でフォーマットします。

```typescript
import { currencyFormatter } from '@dub/utils';

currencyFormatter(1234.56); // "$1,234.56"
currencyFormatter(1000, { trailingZeroDisplay: 'stripIfInteger' }); // "$1,000"
```

### `formatFileSize`

バイト数を人間が読みやすいファイルサイズに変換します。

```typescript
import { formatFileSize } from '@dub/utils';

formatFileSize(1024); // "1 KB"
formatFileSize(1048576); // "1 MB"
formatFileSize(0); // "0 Bytes"
```

### `nanoid`

ランダムな一意のIDを生成します。

```typescript
import { nanoid } from '@dub/utils';

nanoid(); // "a1B2c3D" (7文字)
nanoid(10); // "a1B2c3D4e5" (10文字)
```

### `hashStringSHA256`

文字列をSHA-256でハッシュ化します。

```typescript
import { hashStringSHA256 } from '@dub/utils';

await hashStringSHA256('my-secret-string');
// "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824"
```

### `randomValue`

配列からランダムに値を選択します。

```typescript
import { randomValue } from '@dub/utils';

randomValue(['red', 'green', 'blue']); // "green" (ランダム)
```

### `resizeImage`

画像ファイルをリサイズし、base64文字列として返します。

```typescript
import { resizeImage } from '@dub/utils';

const base64 = await resizeImage(file, {
  width: 1200,
  height: 630,
  quality: 0.9
});
```

### `isIframeable`

URLがiframe内に表示可能かどうかをチェックします（CSPやX-Frame-Optionsを確認）。

```typescript
import { isIframeable } from '@dub/utils';

const canEmbed = await isIframeable({
  url: 'https://example.com',
  requestDomain: 'https://mysite.com'
});
```

### `log`

指定されたタイプのSlack Webhookにメッセージを送信します。

```typescript
import { log } from '@dub/utils';

await log({
  message: 'An error occurred',
  type: 'errors',
  mention: true
});
```

### `keys` (バリデーション関数)

リンクキーのバリデーション関数群。

```typescript
import { validKeyRegex, isUnsupportedKey, isReservedKeyGlobal } from '@dub/utils';

validKeyRegex.test('my-link-123'); // true
isUnsupportedKey('.well-known'); // true
isReservedKeyGlobal('favicon.ico'); // true
```

### Promise型ガード

Promise.allSettledの結果を型安全に処理します。

```typescript
import { isFulfilled, isRejected } from '@dub/utils';

const results = await Promise.allSettled([promise1, promise2]);
const fulfilled = results.filter(isFulfilled);
const rejected = results.filter(isRejected);
```

---

## 📄 ライセンス

このパッケージは、Dub's web applicationsで使用されているユーティリティ関数をまとめたものです。
