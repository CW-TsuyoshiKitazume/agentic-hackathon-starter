import { Hono } from 'hono'
import { pool } from '../db/connection.js'
import { createGroups, assignDestinations } from '../utils/shuffle.js'

const groups = new Hono()

// グループ分け実行
groups.post('/shuffle', async (c) => {
  try {
    // 既存のグループを削除
    await pool.query('DELETE FROM group_members')
    await pool.query('DELETE FROM groups')

    // 参加者一覧を取得
    const participantsResult = await pool.query(
      'SELECT id, name FROM participants'
    )
    const participants = participantsResult.rows

    if (participants.length < 3) {
      return c.json(
        { error: '参加者は3人以上必要です' },
        400
      )
    }

    // 行き先一覧を取得
    const destinationsResult = await pool.query(
      'SELECT id, name FROM destinations'
    )
    const destinations = destinationsResult.rows

    if (destinations.length === 0) {
      return c.json(
        { error: '行き先が登録されていません' },
        400
      )
    }

    // グループ分け
    const participantGroups = createGroups(participants)
    const destinationAssignments = assignDestinations(
      participantGroups,
      destinations
    )

    // データベースに保存
    const createdGroups = []

    for (let i = 0; i < participantGroups.length; i++) {
      const group = participantGroups[i]
      const destination = destinationAssignments[i]

      // グループを作成
      const groupResult = await pool.query(
        'INSERT INTO groups (destination_id) VALUES ($1) RETURNING id',
        [destination.destinationId]
      )
      const groupId = groupResult.rows[0].id

      // メンバーを追加
      for (const participant of group) {
        await pool.query(
          'INSERT INTO group_members (group_id, participant_id) VALUES ($1, $2)',
          [groupId, participant.id]
        )
      }

      createdGroups.push({
        id: groupId,
        destination: {
          id: destination.destinationId,
          name: destination.destinationName,
        },
        members: group,
      })
    }

    return c.json({ groups: createdGroups }, 201)
  } catch (error) {
    console.error('グループ分けエラー:', error)
    return c.json({ error: 'グループ分けに失敗しました' }, 500)
  }
})

// グループ分け結果一覧取得
groups.get('/', async (c) => {
  try {
    const result = await pool.query(`
      SELECT 
        g.id as group_id,
        g.created_at as group_created_at,
        d.id as destination_id,
        d.name as destination_name,
        json_agg(
          json_build_object(
            'id', p.id,
            'name', p.name
          )
        ) as members
      FROM groups g
      LEFT JOIN destinations d ON g.destination_id = d.id
      LEFT JOIN group_members gm ON g.id = gm.group_id
      LEFT JOIN participants p ON gm.participant_id = p.id
      GROUP BY g.id, g.created_at, d.id, d.name
      ORDER BY g.created_at DESC
    `)

    const groups = result.rows.map((row) => ({
      id: row.group_id,
      destination: row.destination_id
        ? {
            id: row.destination_id,
            name: row.destination_name,
          }
        : null,
      members: row.members.filter((m: any) => m.id !== null),
      created_at: row.group_created_at,
    }))

    return c.json({ groups })
  } catch (error) {
    console.error('グループ一覧取得エラー:', error)
    return c.json({ error: 'グループ一覧の取得に失敗しました' }, 500)
  }
})

// 特定グループの詳細取得
groups.get('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'))

    if (isNaN(id)) {
      return c.json({ error: '無効なIDです' }, 400)
    }

    const result = await pool.query(
      `
      SELECT 
        g.id as group_id,
        g.created_at as group_created_at,
        d.id as destination_id,
        d.name as destination_name,
        json_agg(
          json_build_object(
            'id', p.id,
            'name', p.name
          )
        ) as members
      FROM groups g
      LEFT JOIN destinations d ON g.destination_id = d.id
      LEFT JOIN group_members gm ON g.id = gm.group_id
      LEFT JOIN participants p ON gm.participant_id = p.id
      WHERE g.id = $1
      GROUP BY g.id, g.created_at, d.id, d.name
    `,
      [id]
    )

    if (result.rows.length === 0) {
      return c.json({ error: 'グループが見つかりませんでした' }, 404)
    }

    const row = result.rows[0]
    const group = {
      id: row.group_id,
      destination: row.destination_id
        ? {
            id: row.destination_id,
            name: row.destination_name,
          }
        : null,
      members: row.members.filter((m: any) => m.id !== null),
      created_at: row.group_created_at,
    }

    return c.json({ group })
  } catch (error) {
    console.error('グループ詳細取得エラー:', error)
    return c.json({ error: 'グループ詳細の取得に失敗しました' }, 500)
  }
})

// グループ削除
groups.delete('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'))

    if (isNaN(id)) {
      return c.json({ error: '無効なIDです' }, 400)
    }

    const result = await pool.query(
      'DELETE FROM groups WHERE id = $1 RETURNING id',
      [id]
    )

    if (result.rows.length === 0) {
      return c.json({ error: 'グループが見つかりませんでした' }, 404)
    }

    return c.json({ message: 'グループを削除しました' })
  } catch (error) {
    console.error('グループ削除エラー:', error)
    return c.json({ error: 'グループの削除に失敗しました' }, 500)
  }
})

export default groups

