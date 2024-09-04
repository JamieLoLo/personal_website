import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import sequelize from '../../../../db_connection'
import { DataTypes } from 'sequelize'
import initAdminModel from '../../../../models/admin'

const Admin = initAdminModel(sequelize, DataTypes)

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        account: { type: 'text' },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        try {
          // 確認資料庫連線，驗證成功會自動往下進行。
          await sequelize.authenticate()
          const user = await Admin.findOne({
            where: { account: credentials.account },
          })

          if (user && bcrypt.compare(credentials.password, user.password)) {
            return { id: user.id, name: user.name }
          }

          return null
        } catch (error) {
          console.error('Error connecting to the database: ', error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
      }
      return token
    },
    async session({ session, token }) {
      session.user = { ...session.user, id: token.id }
      return session
    },
  },
  pages: {
    signIn: '/admin/signin',
  },
}

// 使用 authOptions 初始化 NextAuth
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
