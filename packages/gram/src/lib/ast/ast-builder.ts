import {
  GramIdentifier,
  GramSymbol,
  GramNode,
  GramPattern,
  GramRelationship,
  GramAnnotation,
  GramRelation,
} from './ast-elements';
import {
  BooleanLiteral,
  DateLiteral,
  DecimalLiteral,
  DurationLiteral,
  GramPropertyRelation,
  GramPropertyValue,
  GramRecord,
  GramRecordEntry,
  HexadecimalLiteral,
  IntegerLiteral,
  MeasurementLiteral,
  OctalLiteral,
  StringLiteral,
  TaggedTextLiteral,
  TimeLiteral,
  isGramLiteral,
} from './ast-record';

const dateToYMD = (d: Date) => d.toISOString().slice(0, 10);

const dateToDayOfMonth = (d: Date) => '--' + d.toISOString().slice(5, 10);

export const recordValue = (
  relation: GramPropertyRelation,
  value: GramPropertyValue
): GramRecordEntry => ({
  relation,
  value,
});

export const propertyValue = (value: any): GramPropertyValue => {
  if (Array.isArray(value)) {
    return value.map((v) => propertyValue(v));
  } else if (typeof value === 'object') {
    if (value instanceof Date) {
      return date(value);
    } else if (isGramLiteral(value)) {
      return value;
    }
    return object(value);
  } else {
    switch (typeof value) {
      case 'string':
        return string(value);
      case 'bigint':
        return decimal(value.toString());
      case 'boolean':
        return boolean(value);
      case 'number':
        return decimal(value.toString());
      case 'symbol':
        return string(value.toString());
      default:
        throw new Error(`Unsupported value: ${value}`);
    }
  }
};

export const boolean = (value: boolean): BooleanLiteral => ({
  type: 'boolean',
  value: value ? 'true' : 'false',
});

export const string = (value: string): StringLiteral => ({
  type: 'string',
  value,
});

export const tagged = (tag: string, value: string): TaggedTextLiteral => ({
  type: 'tagged',
  value,
  tag,
});

export const integer = (value: string | number): IntegerLiteral => ({
  type: 'integer',
  value: String(value),
});

export const decimal = (value: string | number): DecimalLiteral => ({
  type: 'decimal',
  value: String(value),
});

export const hexadecimal = (value: string | number): HexadecimalLiteral => ({
  type: 'hexadecimal',
  value: typeof value === 'number' ? value.toString(16) : value,
});

export const octal = (value: string | number): OctalLiteral => ({
  type: 'octal',
  value: typeof value === 'number' ? value.toString(8) : value,
});

export const measurement = (
  unit: string,
  value: string | number
): MeasurementLiteral => ({
  type: 'measurement',
  value: String(value),
  unit,
});

export const year = (value: string | Date): DateLiteral =>
  tagged(
    'date',
    value instanceof Date ? value.getFullYear().toString() : value
  ) as DateLiteral;

export const date = (value: string | Date): DateLiteral =>
  tagged(
    'date',
    value instanceof Date ? dateToYMD(value) : value
  ) as DateLiteral;

export const dayOfMonth = (value: string | Date): DateLiteral =>
  tagged(
    'date',
    value instanceof Date ? dateToDayOfMonth(value) : value
  ) as DateLiteral;

export const time = (value: string | Date): TimeLiteral =>
  tagged(
    'time',
    value instanceof Date ? value.toTimeString() : value
  ) as TimeLiteral;

export const duration = (value: string | Date): DurationLiteral =>
  tagged(
    'duration',
    value instanceof Date
      ? `P${
          value.getUTCFullYear() - 1970
        }Y${value.getUTCMonth()}M${value.getUTCDate()}DT${value.getUTCHours()}H${value.getUTCMinutes()}M${
          value.getUTCMilliseconds() / 1000
        }S`
      : value
  ) as DurationLiteral;

/**
 * Create a new, empty GramRecord.
 *
 */
export const emptyRecord = () => ({ type: 'record', value: {} } as GramRecord);

/**
 * Transforms a plain js object into a GramRecord.
 *
 * @param o
 */
export const object = (o: any): GramRecord => {
  return Object.entries(o).reduce((acc, [k, v]) => {
    acc.value[k] = recordValue(':', propertyValue(v));
    return acc;
  }, emptyRecord());
};

export const pattern = (
  members: ReadonlyArray<GramPattern>,
  relation?: GramRelation,
  identifier?: string,
  labels?: string[],
  record?: GramRecord
): GramPattern => ({
  ...(identifier && { identifier: GramIdentifier(identifier) }),
  ...{ labels: labels ? labels.map(GramSymbol) : [] },
  ...(record && { record }),
  ...(relation && { relation }),
  members,
});

export const node = (
  identifier?: string,
  labels?: string[],
  record?: GramRecord
): GramNode => pattern([], undefined, identifier, labels, record) as GramNode;

export const annotation = (
  subject: GramPattern,
  identifier?: string,
  labels?: string[],
  record?: GramRecord
): GramAnnotation =>
  pattern([subject], undefined, identifier, labels, record) as GramAnnotation;

export const relationship = (
  members: [GramNode, GramNode],
  relation: GramRelation,
  identifier?: string,
  labels?: string[],
  record?: GramRecord
): GramRelationship =>
  pattern(members, relation, identifier, labels, record) as GramRelationship;
