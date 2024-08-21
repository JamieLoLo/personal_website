import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import sequelize from '../../../../db_connection'
import { DataTypes } from 'sequelize'
import initAdminModel from '../../../../models/admin'

const Admin = initAdminModel(sequelize, DataTypes)

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        account: { label: 'Account', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          // 確保連線到資料庫
          await sequelize.authenticate()

          const user = await Admin.findOne({
            where: { account: credentials.account },
          })

          if (user && bcrypt.compareSync(credentials.password, user.password)) {
            return { name: user.name }
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
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id
      return session
    },
  },
  pages: {
    signIn: '/admin/signin',
  },
})

export { handler as GET, handler as POST }
