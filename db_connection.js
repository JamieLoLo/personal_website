import { Sequelize } from 'sequelize'
import { options } from './database/config/config.mjs'
import getRdsPassword from './lib/rds'

async function initSequelize() {
  const password = await getRdsPassword() // 動態獲取密碼
  const dbOptions = { ...options, password } // 將密碼動態地插入到 options 中
  dbOptions.dialectModule = require('mysql2') // 確保使用 mysql2 模組

  const sequelize = new Sequelize(dbOptions)

  return sequelize
}

// 動態創建 sequelize 實例
const sequelize = await initSequelize()

export default sequelize
