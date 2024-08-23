import { getServerSession } from 'next-auth'
import { authOptions } from '../app/api/auth/[...nextauth]/route'

export async function requireAdminSession() {
  const session = await getServerSession(authOptions)
  if (!session || (session && session.user.name !== 'Jamie')) {
    return { status: 401, error: 'You must be logged in as an admin.' }
  }
  return { status: 200, session }
}
