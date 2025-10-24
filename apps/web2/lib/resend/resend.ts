import { Resend } from "resend";

// Resend API キーが設定されていない場合はダミーのキーを使用
// 実際のメール送信は無効化される
const apiKey = process.env.RESEND_API_KEY;

export const resend = new Resend(apiKey);
