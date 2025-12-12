// 共通のCSSスタイル
export const commonStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    padding: 20px;
  }
  .container {
    max-width: 1600px;
    margin: 0 auto;
  }
  .nav {
    background: white;
    border-radius: 15px;
    padding: 20px;
    margin-bottom: 30px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    display: flex;
    gap: 15px;
    justify-content: center;
    flex-wrap: wrap;
  }
  .nav a {
    display: inline-block;
    padding: 12px 30px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 600;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .nav a:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
  }
  .nav a.active {
    background: #333;
  }
  h1 {
    color: white;
    text-align: center;
    font-size: 2em;
    margin-bottom: 30px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  }
  @media (min-width: 768px) {
    h1 {
      font-size: 2.5em;
    }
  }
  .section {
    background: white;
    border-radius: 15px;
    padding: 30px;
    margin-bottom: 30px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }
  .section h2 {
    color: #333;
    font-size: 1.8em;
    margin-bottom: 20px;
    border-bottom: 3px solid #667eea;
    padding-bottom: 10px;
  }
  .form-group {
    margin-bottom: 20px;
  }
  .form-group label {
    display: block;
    margin-bottom: 5px;
    color: #555;
    font-weight: 600;
  }
  .form-group input {
    width: 100%;
    padding: 12px;
    border: 2px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
    transition: border-color 0.3s;
  }
  .form-group input:focus {
    outline: none;
    border-color: #667eea;
  }
  button {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 12px 30px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  button:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
  }
  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  .list {
    margin-top: 20px;
  }
  .list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 8px;
    margin-bottom: 10px;
  }
  .list-item span {
    font-size: 16px;
    color: #333;
  }
  .delete-btn {
    background: #dc3545;
    padding: 8px 20px;
    font-size: 14px;
  }
  .delete-btn:hover {
    background: #c82333;
  }
  .shuffle-btn {
    width: 100%;
    padding: 20px;
    font-size: 20px;
    margin-top: 20px;
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  }
  .shuffle-btn:hover {
    background: linear-gradient(135deg, #f5576c 0%, #f093fb 100%);
    box-shadow: 0 5px 15px rgba(245, 87, 108, 0.4);
  }
  .groups-container {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
    margin-top: 50px;
  }
  .group-item {
    display: flex;
    gap: 20px;
    align-items: flex-start;
  }
  .group-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    transition: transform 0.2s, box-shadow 0.2s;
    flex: 1;
  }
  .group-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  }
  .group-destination {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    color: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    min-width: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2em;
    font-weight: 600;
    text-align: center;
    word-break: break-word;
  }
  @media (max-width: 767px) {
    .group-item {
      flex-direction: column;
    }
    .group-destination {
      min-width: 100%;
    }
  }
  
  /* レスポンシブデザイン: 画面サイズに応じて列数を調整 */
  @media (min-width: 480px) {
    .groups-container {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  @media (min-width: 768px) {
    .groups-container {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  @media (min-width: 1024px) {
    .groups-container {
      grid-template-columns: repeat(4, 1fr);
    }
  }
  @media (min-width: 1280px) {
    .groups-container {
      grid-template-columns: repeat(5, 1fr);
    }
  }
  @media (min-width: 1600px) {
    .groups-container {
      grid-template-columns: repeat(6, 1fr);
    }
  }
  .group-card h3 {
    font-size: 1.2em;
    margin-bottom: 15px;
    border-bottom: 2px solid rgba(255, 255, 255, 0.3);
    padding-bottom: 10px;
  }
  @media (min-width: 768px) {
    .group-card h3 {
      font-size: 1.3em;
    }
  }
  .group-card .members {
    list-style: none;
  }
  .group-card .members li {
    padding: 8px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }
  .group-card .members li:last-child {
    border-bottom: none;
  }
  .empty-state {
    text-align: center;
    color: #999;
    padding: 40px;
    font-size: 18px;
  }
`

// ナビゲーションバーを生成
export function getNavigation(activePage: 'home' | 'participants' | 'destinations') {
  return `
    <div class="nav">
      <a href="/" class="${activePage === 'home' ? 'active' : ''}">🏠 グループ分け</a>
      <a href="/participants" class="${activePage === 'participants' ? 'active' : ''}">👥 参加者管理</a>
      <a href="/destinations" class="${activePage === 'destinations' ? 'active' : ''}">📍 行き先管理</a>
    </div>
  `
}

