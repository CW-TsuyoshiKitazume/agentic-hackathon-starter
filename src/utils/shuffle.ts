// 配列をシャッフルする関数（Fisher-Yatesアルゴリズム）
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// 参加者を3-4人のグループに分割
export function createGroups(participants: { id: number; name: string }[]): {
  id: number
  name: string
}[][] {
  if (participants.length === 0) {
    return []
  }

  // 参加者をシャッフル
  const shuffled = shuffleArray(participants)
  const groups: { id: number; name: string }[][] = []

  // 3-4人ずつグループに分割
  for (let i = 0; i < shuffled.length; i += 4) {
    const group = shuffled.slice(i, i + 4)
    // 最後のグループが2人以下の場合は、前のグループに統合
    if (group.length <= 2 && groups.length > 0) {
      groups[groups.length - 1].push(...group)
    } else {
      groups.push(group)
    }
  }

  return groups
}

// 行き先をランダムに割り当て
export function assignDestinations(
  groups: { id: number; name: string }[][],
  destinations: { id: number; name: string }[]
): { destinationId: number; destinationName: string }[] {
  if (destinations.length === 0) {
    return groups.map(() => ({ destinationId: 0, destinationName: '未設定' }))
  }

  // 行き先をシャッフル
  const shuffledDestinations = shuffleArray(destinations)

  // 各グループに行き先を割り当て（行き先が足りない場合は繰り返し使用）
  return groups.map((_, index) => {
    const destination =
      shuffledDestinations[index % shuffledDestinations.length]
    return {
      destinationId: destination.id,
      destinationName: destination.name,
    }
  })
}

