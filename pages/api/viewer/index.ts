import {PrismaClient} from '@prisma/client'
import {NextApiRequest, NextApiResponse} from 'next'
import nc from 'next-connect'

import {validateHeaderToken} from '../../../lib'

const handler = nc<NextApiRequest, NextApiResponse>()

handler.post(async (req, res) => {
  const prisma = new PrismaClient({log: ['query']})

  try {
    const token = validateHeaderToken(req.headers)
    if (!token) {
      res
        .status(401)
        .json({error: {message: 'Missing or invalid authorization token'}})
      return
    }

    const {email} = token
    const user = await prisma.user.findOne({where: {email}})

    res.json(user)
  } catch (error) {
    console.error(error)
    res.status(500).json({error: {message: error.message}})
  } finally {
    await prisma.disconnect()
  }
})

export default handler
