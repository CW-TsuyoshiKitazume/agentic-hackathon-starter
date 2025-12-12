import { pool } from './connection.js'

// テストデータの登録
export async function seedDatabase() {
  try {
    // 参加者データ（30名）
    const participants = [
      '山田太郎', '佐藤花子', '鈴木一郎', '田中次郎', '渡辺三郎',
      '伊藤四郎', '中村五郎', '小林六郎', '加藤七郎', '吉田八郎',
      '山本九郎', '松本十郎', '井上十一', '木村十二', '林十三',
      '斎藤十四', '清水十五', '山口十六', '森十七', '池田十八',
      '橋本十九', '石井二十', '前田二十一', '藤田二十二', '後藤二十三',
      '近藤二十四', '遠藤二十五', '青木二十六', '坂本二十七', '石川二十八'
    ]

    // 行き先データ（10か所）
    const destinations = [
      'イタリアンレストラン「トラットリア」',
      '和食レストラン「さくら」',
      '中華料理「龍の宮」',
      'フレンチレストラン「ル・シェフ」',
      '焼肉店「牛角」',
      '寿司屋「すし善」',
      'カフェ「スターバックス」',
      'ラーメン店「一風堂」',
      'パスタ専門店「パスタマン」',
      '居酒屋「魚民」'
    ]

    console.log('テストデータの登録を開始します...')

    // 既存データをクリア（オプション）
    await pool.query('DELETE FROM group_members')
    await pool.query('DELETE FROM groups')
    await pool.query('DELETE FROM participants')
    await pool.query('DELETE FROM destinations')

    // 参加者を登録
    console.log('参加者を登録中...')
    for (const name of participants) {
      await pool.query('INSERT INTO participants (name) VALUES ($1)', [name])
    }
    console.log(`${participants.length}名の参加者を登録しました`)

    // 行き先を登録
    console.log('行き先を登録中...')
    for (const name of destinations) {
      await pool.query('INSERT INTO destinations (name) VALUES ($1)', [name])
    }
    console.log(`${destinations.length}か所の行き先を登録しました`)

    console.log('テストデータの登録が完了しました！')
  } catch (error) {
    console.error('テストデータ登録エラー:', error)
    throw error
  }
}

// スクリプトとして直接実行された場合
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => {
      console.log('完了')
      process.exit(0)
    })
    .catch((error) => {
      console.error('エラー:', error)
      process.exit(1)
    })
}

