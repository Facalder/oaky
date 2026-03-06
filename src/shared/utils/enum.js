import z from 'zod'

export function enumToPgEnum(myEnum) {
  const values = Object.values(myEnum)
  return /** @type {[string, ...string[]]} */ (values)
}

export function enumToZod(myEnum) {
  return z.enum(Object.values(myEnum))
}
