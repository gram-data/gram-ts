import { Data, Equal } from "effect"

export type SubjectPropertyValue = string | number | boolean | null

export type SubjectRecord = Record<string, SubjectPropertyValue>

export interface Subject {
  readonly identifier: string
  readonly labels: string[]
}

export const Subject = Data.case<Subject>()

const personA = Subject({ identifier: "a", labels: ["Person"] })
const personB = Subject({ identifier: "b", labels: ["Person"] })