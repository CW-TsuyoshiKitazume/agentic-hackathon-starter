import { pool } from './connection.js'
import { readFileSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// スキーマファイルを読み込んで実行
export async function initDatabase() {
  try {
    // データベース接続をテスト
    await pool.query('SELECT 1')
    console.log('データベース接続を確認しました')

    const schemaPath = join(__dirname, 'schema.sql')
    const schema = readFileSync(schemaPath, 'utf-8')
    
    // SQLを実行（セミコロンで分割して実行）
    const statements = schema
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0)

    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await pool.query(statement)
        } catch (error: any) {
          // テーブルが既に存在する場合は無視
          if (error.code !== '42P07') {
            throw error
          }
        }
      }
    }

    console.log('データベーススキーマの初期化が完了しました')
  } catch (error) {
    console.error('データベーススキーマの初期化エラー:', error)
    // エラーを投げずに続行（開発環境では接続できない場合がある）
    console.warn('データベース接続に失敗しましたが、アプリケーションは続行します')
  }
}

