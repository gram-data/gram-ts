import { GramNode, isGramNode, GramPattern, isGramRelationship, GramRelationship, GramRelation } from './ast-elements';
import { GramPropertyValue, GramRecord, GramRecordEntry } from './ast-record';

export const stringifyPropertyValue = (value: GramPropertyValue): string => {
  console.log(value);
  if (Array.isArray(value)) {
    return `[${value.map(v => stringifyPropertyValue(v)).join(",")}]`;
  }
  switch (value.type) {
    case 'string':
      return `"${value.value}"`;
    case 'boolean':
      return value.value;
    case 'integer':
      return value.value;
    case 'decimal':
      return value.value;
    case 'hexadecimal':
      return value.value;
    case 'octal':
      return value.value;
    case 'measurement':
      return value.value;
    case 'tagged':
      return `#${value.tag}\`"${value.value}\`"`;
    case 'record':
      return stringifyRecord(value);
  }

}

export const stringifyRecordEntry = (entry: GramRecordEntry): string =>
  `${entry.relation ?? ":"}${stringifyPropertyValue(entry.value)}`

export const stringifyRecord = (record: GramRecord): string => 
  `{${Object.entries(record.value).map(([k, v]) => `${k}${stringifyRecordEntry(v)}`).join(",")}}`;

export const stringifyAttributes = (pattern: GramPattern): string => {
  const idAndLabels = `${pattern.identifier ?? ""}${(pattern.labels.length > 0) ? ":" + pattern.labels.join(':') : ""}`;
  const record = pattern.record ? stringifyRecord(pattern.record) : "";
  return `${idAndLabels}${((idAndLabels.length > 0) && (record.length > 0)) ? " " : ""}${record}`
}

export const stringifyNode = (pattern: GramNode): string => {
  const attrs = stringifyAttributes(pattern);
  return `(${attrs})`;
}

export const splitArrow = (relation: GramRelation): [string, string] => {
  const shaftPos = relation.search(/[-=~]/);
  if (shaftPos >= 0) {
    const left = relation.slice(0, shaftPos + 1);
    const right = relation.slice(shaftPos + 1);
    return [left, right];
  }
  return ["-","-"]
}

export const stringifyArrow = (pattern: GramRelationship): string => {
  const arrow = pattern.relation ?? GramRelation("--");
  const leftRight = splitArrow(arrow)
  const left = leftRight[0];
  const right = leftRight[1];
  const attrs = stringifyAttributes(pattern);
  return `${left}${(attrs.length > 0) ? "[" + attrs + "]" : ""}${right}`;
}

export const stringifyRelationship = (pattern: GramRelationship): string => {
  const fromNode = stringifyNode(pattern.members[0]);
  const toNode = stringifyNode(pattern.members[1]);
  return `${fromNode}${stringifyArrow(pattern)}${toNode}`;
}

export const stringify = (pattern: GramPattern): string => {
  if (isGramNode(pattern)) {
    return stringifyNode(pattern);
  } else if (isGramRelationship(pattern)) {
    return stringifyRelationship(pattern);
  } else {
    return `Unsupported pattern: ${JSON.stringify(pattern)}`;
  }
}