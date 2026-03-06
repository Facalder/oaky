import z from 'zod'

export function enumToPgEnum(myEnum) {
  return Object.values(myEnum)
}

export function enumToZod(myEnum) {
  return z.enum(Object.values(myEnum))
}
