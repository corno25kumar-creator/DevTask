import { StatusCodes } from 'http-status-codes'

export const asyncErrorMiddleware = (err, req, res, next) => {
  console.error({ err })

  if (err?.extensions?.code === 'UNAUTHENTICATED') {
    return res.status(StatusCodes.UNAUTHORIZED).json(err)
  }

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    message: 'Internal Server Error',
    extension: {
      code: StatusCodes.INTERNAL_SERVER_ERROR,
    },
  })
}
