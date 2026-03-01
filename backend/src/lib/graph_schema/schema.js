import { GlobalTypeDef } from './globalSchema.js'
import { merge } from 'lodash-es'
import { TaskResolver, TaskTypeDef } from '../../model/model.js'


export const typeDefs = [GlobalTypeDef, TaskTypeDef]
export const resolvers = merge([TaskResolver])