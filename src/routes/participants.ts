import { Hono } from 'hono'
import { pool } from '../db/connection.js'

const participants = new Hono()

// 参加者一覧取得
participants.get('/', async (c) => {
  try {
    const result = await pool.query(
      'SELECT id, name, created_at FROM participants ORDER BY created_at DESC'
    )
    return c.json({ participants: result.rows })
  } catch (error) {
    console.error('参加者一覧取得エラー:', error)
    return c.json({ error: '参加者一覧の取得に失敗しました' }, 500)
  }
})

// 参加者登録
participants.post('/', async (c) => {
  try {
    const { name } = await c.req.json()

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return c.json({ error: '名前は必須です' }, 400)
    }

    const result = await pool.query(
      'INSERT INTO participants (name) VALUES ($1) RETURNING id, name, created_at',
      [name.trim()]
    )

    return c.json({ participant: result.rows[0] }, 201)
  } catch (error) {
    console.error('参加者登録エラー:', error)
    return c.json({ error: '参加者の登録に失敗しました' }, 500)
  }
})

// 参加者削除
participants.delete('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'))

    if (isNaN(id)) {
      return c.json({ error: '無効なIDです' }, 400)
    }

    const result = await pool.query(
      'DELETE FROM participants WHERE id = $1 RETURNING id',
      [id]
    )

    if (result.rows.length === 0) {
      return c.json({ error: '参加者が見つかりませんでした' }, 404)
    }

    return c.json({ message: '参加者を削除しました' })
  } catch (error) {
    console.error('参加者削除エラー:', error)
    return c.json({ error: '参加者の削除に失敗しました' }, 500)
  }
})

export default participants

