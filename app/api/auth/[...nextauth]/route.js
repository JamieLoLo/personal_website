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
        account: { label: 'Account', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          // 确保连线到数据库
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
