import { scope } from 'csi-accounts-express'
import { RequestHandler } from 'express'

export type year = string

export interface Options {
  secret: string
  scope?: scope[]
  years?: year[]
  token?: RequestHandler
}
