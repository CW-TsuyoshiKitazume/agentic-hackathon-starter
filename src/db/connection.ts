import { Pool } from 'pg'

// データベース接続プールの作成
export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'mydb',
  user: process.env.DB_USER || 'user',
  password: process.env.DB_PASSWORD || 'password',
})

// 接続テスト
pool.on('connect', () => {
  console.log('データベースに接続しました')
})

pool.on('error', (err) => {
  console.error('データベース接続エラー:', err)
})

