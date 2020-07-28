import {PrismaClient} from '@prisma/client'
import {NextApiRequest, NextApiResponse} from 'next'

import {validateHeaderToken} from '../../../utils'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const prisma = new PrismaClient({log: ['query']})

  try {
    const token = validateHeaderToken(req.headers)

    const {slug, target} = req.body

    const link = token?.email
      ? await prisma.link.create({
          data: {
            author: {
              connect: {
                email: token.email,
              },
            },
            slug: slug,
            target: target,
          },
        })
      : await prisma.link.create({
          data: {
            slug: slug,
            target: target,
          },
        })

    res.status(201).json({link})
  } catch (err) {
    res.status(500).json({error: {message: err.message}})
  } finally {
    await prisma.disconnect()
  }
}
