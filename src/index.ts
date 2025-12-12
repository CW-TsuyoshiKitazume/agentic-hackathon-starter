import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import { initDatabase } from './db/init.js'
import participants from './routes/participants.js'
import destinations from './routes/destinations.js'
import groups from './routes/groups.js'
import { commonStyles, getNavigation } from './views/common.js'

const app = new Hono()

// Middleware
app.use('*', logger())
app.use('*', cors())

// データベース初期化
initDatabase().catch((error) => {
  console.error('データベース初期化エラー:', error)
})

// メイン画面（グループ分け実行）
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="ja">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>シャッフルランチアプリ - グループ分け</title>
      <style>${commonStyles}</style>
    </head>
    <body>
      <div class="container">
        <h1>🍽️ シャッフルランチアプリ</h1>
        ${getNavigation('home')}

        <!-- グループ分けセクション -->
        <div class="section">
          <h2>グループ分け</h2>
          <p style="margin-bottom: 20px; color: #666;">
            参加者と行き先を登録したら、グループ分けを実行してください。
            <br>
            <a href="/participants" style="color: #667eea; text-decoration: underline;">参加者管理</a> または 
            <a href="/destinations" style="color: #667eea; text-decoration: underline;">行き先管理</a> から登録できます。
          </p>
          <button class="shuffle-btn" onclick="shuffleGroups()">グループ分けを実行</button>
          <div id="groups-container"></div>
        </div>
      </div>

      <script>
        // グループ分けを実行
        async function shuffleGroups() {
          const button = event.target
          button.disabled = true
          button.textContent = 'グループ分け中...'

          try {
            const response = await fetch('/api/groups/shuffle', {
              method: 'POST'
            })

            if (response.ok) {
              loadGroups()
            } else {
              const data = await response.json()
              alert(data.error || 'グループ分けに失敗しました')
            }
          } catch (error) {
            console.error('グループ分けエラー:', error)
            alert('グループ分けに失敗しました')
          } finally {
            button.disabled = false
            button.textContent = 'グループ分けを実行'
          }
        }

        // グループ一覧を取得
        async function loadGroups() {
          try {
            const response = await fetch('/api/groups')
            const data = await response.json()
            const container = document.getElementById('groups-container')
            
            if (data.groups && data.groups.length > 0) {
              container.innerHTML = data.groups.map((group, index) => \`
                <div class="group-item">
                  <div class="group-card">
                    <h3>グループ \${index + 1}</h3>
                    <ul class="members">
                      \${group.members.map(m => \`<li>👤 \${m.name}</li>\`).join('')}
                    </ul>
                  </div>
                  <div class="group-destination">
                    🍽️ \${group.destination ? group.destination.name : '未設定'}
                  </div>
                </div>
              \`).join('')
            } else {
              container.innerHTML = '<div class="empty-state">グループ分けがまだ実行されていません</div>'
            }
          } catch (error) {
            console.error('グループ一覧取得エラー:', error)
          }
        }

        // ページ読み込み時にデータを取得
        loadGroups()
      </script>
    </body>
    </html>
  `)
})

// 参加者管理画面
app.get('/participants', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="ja">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>シャッフルランチアプリ - 参加者管理</title>
      <style>${commonStyles}</style>
    </head>
    <body>
      <div class="container">
        <h1>👥 参加者管理</h1>
        ${getNavigation('participants')}

        <div class="section">
          <h2>参加者の追加</h2>
          <div class="form-group">
            <label for="participant-name">参加者名</label>
            <input type="text" id="participant-name" placeholder="参加者の名前を入力">
          </div>
          <button onclick="addParticipant()">参加者を追加</button>
        </div>

        <div class="section">
          <h2>参加者一覧</h2>
          <div class="list" id="participants-list"></div>
        </div>
      </div>

      <script>
        // 参加者一覧を取得
        async function loadParticipants() {
          try {
            const response = await fetch('/api/participants')
            const data = await response.json()
            const list = document.getElementById('participants-list')
            
            if (data.participants && data.participants.length > 0) {
              list.innerHTML = data.participants.map(p => \`
                <div class="list-item">
                  <span>\${p.name}</span>
                  <button class="delete-btn" onclick="deleteParticipant(\${p.id})">削除</button>
                </div>
              \`).join('')
            } else {
              list.innerHTML = '<div class="empty-state">参加者が登録されていません</div>'
            }
          } catch (error) {
            console.error('参加者一覧取得エラー:', error)
          }
        }

        // 参加者を追加
        async function addParticipant() {
          const nameInput = document.getElementById('participant-name')
          const name = nameInput.value.trim()
          
          if (!name) {
            alert('名前を入力してください')
            return
          }

          try {
            const response = await fetch('/api/participants', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name })
            })

            if (response.ok) {
              nameInput.value = ''
              loadParticipants()
            } else {
              const data = await response.json()
              alert(data.error || '参加者の追加に失敗しました')
            }
          } catch (error) {
            console.error('参加者追加エラー:', error)
            alert('参加者の追加に失敗しました')
          }
        }

        // 参加者を削除
        async function deleteParticipant(id) {
          if (!confirm('この参加者を削除しますか？')) return

          try {
            const response = await fetch(\`/api/participants/\${id}\`, {
              method: 'DELETE'
            })

            if (response.ok) {
              loadParticipants()
            } else {
              const data = await response.json()
              alert(data.error || '参加者の削除に失敗しました')
            }
          } catch (error) {
            console.error('参加者削除エラー:', error)
            alert('参加者の削除に失敗しました')
          }
        }

        // ページ読み込み時にデータを取得
        loadParticipants()

        // Enterキーで送信
        document.getElementById('participant-name').addEventListener('keypress', (e) => {
          if (e.key === 'Enter') addParticipant()
        })
      </script>
    </body>
    </html>
  `)
})

// 行き先管理画面
app.get('/destinations', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="ja">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>シャッフルランチアプリ - 行き先管理</title>
      <style>${commonStyles}</style>
    </head>
    <body>
      <div class="container">
        <h1>📍 行き先管理</h1>
        ${getNavigation('destinations')}

        <div class="section">
          <h2>行き先の追加</h2>
          <div class="form-group">
            <label for="destination-name">行き先名</label>
            <input type="text" id="destination-name" placeholder="行き先の名前を入力">
          </div>
          <button onclick="addDestination()">行き先を追加</button>
        </div>

        <div class="section">
          <h2>行き先一覧</h2>
          <div class="list" id="destinations-list"></div>
        </div>
      </div>

      <script>
        // 行き先一覧を取得
        async function loadDestinations() {
          try {
            const response = await fetch('/api/destinations')
            const data = await response.json()
            const list = document.getElementById('destinations-list')
            
            if (data.destinations && data.destinations.length > 0) {
              list.innerHTML = data.destinations.map(d => \`
                <div class="list-item">
                  <span>\${d.name}</span>
                  <button class="delete-btn" onclick="deleteDestination(\${d.id})">削除</button>
                </div>
              \`).join('')
            } else {
              list.innerHTML = '<div class="empty-state">行き先が登録されていません</div>'
            }
          } catch (error) {
            console.error('行き先一覧取得エラー:', error)
          }
        }

        // 行き先を追加
        async function addDestination() {
          const nameInput = document.getElementById('destination-name')
          const name = nameInput.value.trim()
          
          if (!name) {
            alert('名前を入力してください')
            return
          }

          try {
            const response = await fetch('/api/destinations', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name })
            })

            if (response.ok) {
              nameInput.value = ''
              loadDestinations()
            } else {
              const data = await response.json()
              alert(data.error || '行き先の追加に失敗しました')
            }
          } catch (error) {
            console.error('行き先追加エラー:', error)
            alert('行き先の追加に失敗しました')
          }
        }

        // 行き先を削除
        async function deleteDestination(id) {
          if (!confirm('この行き先を削除しますか？')) return

          try {
            const response = await fetch(\`/api/destinations/\${id}\`, {
              method: 'DELETE'
            })

            if (response.ok) {
              loadDestinations()
            } else {
              const data = await response.json()
              alert(data.error || '行き先の削除に失敗しました')
            }
          } catch (error) {
            console.error('行き先削除エラー:', error)
            alert('行き先の削除に失敗しました')
          }
        }

        // ページ読み込み時にデータを取得
        loadDestinations()

        // Enterキーで送信
        document.getElementById('destination-name').addEventListener('keypress', (e) => {
          if (e.key === 'Enter') addDestination()
        })
      </script>
    </body>
    </html>
  `)
})

app.get('/health', (c) => {
  return c.json({ status: 'ok' })
})

// API routes
const api = new Hono()

api.route('/participants', participants)
api.route('/destinations', destinations)
api.route('/groups', groups)

app.route('/api', api)

// Start server
const port = Number(process.env.PORT) || 3000

console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port,
})

export default app
