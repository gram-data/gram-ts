import { Data, Equal } from 'effect';

export type SubjectPropertyValue = string | number | boolean | null;

export type SubjectRecord = Record<string, unknown>;

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

export const equals = <ID, R extends SubjectRecord>(
  a: Subject<ID, R>,
  b: Subject<ID, R>
): boolean =>
  a.identifier === b.identifier &&
  Equal.equals(Data.array(a.labels), Data.array(b.labels));
