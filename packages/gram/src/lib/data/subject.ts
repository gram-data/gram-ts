import { Data, Equal } from 'effect';

export type SubjectPropertyValue = 
  null | 
  string | number | boolean |
  SubjectPropertyValue[] |
  SubjectRecord;

export type SubjectRecord = Record<string, unknown>;

/**
 * A Subject is an object which is self-identified
 * and qualified with labels. 
 * 
 */
export interface Subject<ID, R extends SubjectRecord> {
  readonly identifier: ID;
  readonly labels: string[];
  readonly record: R;
}

export const make = <ID, R extends SubjectRecord>(
  identifier: ID,
  labels: string[],
  record: R
): Subject<ID, R> => ({
  identifier,
  labels,
  record,
});

export const of = <ID, R extends SubjectRecord>(args: {
  readonly identifier: ID;
  readonly labels: string[];
  readonly record: R;
}) => make(args.identifier, args.labels, args.record);

export const fromObject = <R extends SubjectRecord>(o: R) => make(null, [], o);

export const fromNamedObject = <ID, R extends SubjectRecord>(name:ID, o: R) => make(name, [], o);

/**
 * The signature of a Subject is compose of:
 * - identifier
 * - labels
 * - top-level keys within the record
 * 
 * This is a shallow signature. 
 */
export const equalSignature = <ID, R extends SubjectRecord>(
  a: Subject<ID, R>,
  b: Subject<ID, R>
): boolean =>
  a.identifier === b.identifier &&
  Equal.equals(Data.array(a.labels), Data.array(b.labels)) &&
  Equal.equals(Data.array(Object.keys(a.record)), Data.array(Object.keys(b.record)));
