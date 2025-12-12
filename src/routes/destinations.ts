import { Hono } from 'hono'
import { pool } from '../db/connection.js'

const destinations = new Hono()

// 行き先一覧取得
destinations.get('/', async (c) => {
  try {
    const result = await pool.query(
      'SELECT id, name, created_at FROM destinations ORDER BY created_at DESC'
    )
    return c.json({ destinations: result.rows })
  } catch (error) {
    console.error('行き先一覧取得エラー:', error)
    return c.json({ error: '行き先一覧の取得に失敗しました' }, 500)
  }
})

// 行き先登録
destinations.post('/', async (c) => {
  try {
    const { name } = await c.req.json()

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return c.json({ error: '名前は必須です' }, 400)
    }

    const result = await pool.query(
      'INSERT INTO destinations (name) VALUES ($1) RETURNING id, name, created_at',
      [name.trim()]
    )

    return c.json({ destination: result.rows[0] }, 201)
  } catch (error) {
    console.error('行き先登録エラー:', error)
    return c.json({ error: '行き先の登録に失敗しました' }, 500)
  }
})

// 行き先削除
destinations.delete('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'))

    if (isNaN(id)) {
      return c.json({ error: '無効なIDです' }, 400)
    }

    const result = await pool.query(
      'DELETE FROM destinations WHERE id = $1 RETURNING id',
      [id]
    )

    if (result.rows.length === 0) {
      return c.json({ error: '行き先が見つかりませんでした' }, 404)
    }

    return c.json({ message: '行き先を削除しました' })
  } catch (error) {
    console.error('行き先削除エラー:', error)
    return c.json({ error: '行き先の削除に失敗しました' }, 500)
  }
})

export default destinations

