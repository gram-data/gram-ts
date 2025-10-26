import {
  parse,
  nodes,
  relationships,
  labels,
  properties,
  propertyKey,
  propertyValue,
  rightNode,
  leftNode,
} from './parser';

describe('Extract from CST', () => {
  it('should extract a node', () => {
    const parseTree = parse('(hello)');
    const cstNodes = nodes(parseTree.rootNode);
    expect(cstNodes).toHaveLength(1);
    expect(cstNodes[0].type).toBe('node');
    expect(cstNodes[0].identifierNode?.text).toBe('hello');
  });
  it('should extract nodes', () => {
    const parseTree = parse('(hello),(world)');
    const cstNodes = nodes(parseTree.rootNode);
    expect(cstNodes).toHaveLength(2);
    expect(cstNodes[0].identifierNode?.text).toBe('hello');
    expect(cstNodes[1].identifierNode?.text).toBe('world');
  });
  it('should extract a --> relationship', () => {
    const parseTree = parse('(hello)-[to]->(world)');
    const cstRelationships = relationships(parseTree.rootNode);
    expect(cstRelationships).toHaveLength(1);
    expect(cstRelationships[0].type).toBe('relationship');
    expect(cstRelationships[0].leftNode.identifierNode?.text).toBe('hello');
    expect(rightNode(cstRelationships[0]).identifierNode?.text).toBe('world');
    expect(cstRelationships[0].kindNode.identifierNode?.text).toBe('to');
    expect(cstRelationships[0].kindNode.type).toBe('right_arrow');
  });
  it('should extract a --> relationship', () => {
    const parseTree = parse('(hello)-[to]->(world)-[from]->(abk)');
    const cstRelationships = relationships(parseTree.rootNode);
    expect(cstRelationships).toHaveLength(2);
    // cstRelationships.forEach((cstRelationship, index) => console.log(`${index}: ${cstRelationship.toString()}`));
    expect(cstRelationships[0].type).toBe('relationship');
    expect(cstRelationships[0].leftNode.identifierNode?.text).toBe('hello');
    expect(cstRelationships[0].kindNode.identifierNode?.text).toBe('to');
    expect(rightNode(cstRelationships[0]).identifierNode?.text).toBe('world');
    expect(cstRelationships[0].kindNode.type).toBe('right_arrow');
    expect(rightNode(cstRelationships[0]).id).toBe(
      leftNode(cstRelationships[1]).id,
    );
    expect(leftNode(cstRelationships[1]).identifierNode?.text).toBe('world');
    expect(cstRelationships[1].kindNode.identifierNode?.text).toBe('from');
    expect(rightNode(cstRelationships[1]).identifierNode?.text).toBe('abk');
  });
  it('should extract labels', () => {
    const parseTree = parse('(hello:Word:Greeting),(world:Word:Subject)');
    const cstLabels = labels(parseTree.rootNode);
    // console.log(cstLabels);
    expect(cstLabels).toHaveLength(3);
    expect(cstLabels.has('Word')).toBeTruthy();
    expect(cstLabels.has('Greeting')).toBeTruthy();
    expect(cstLabels.has('Subject')).toBeTruthy();
  });
  it('should extract records', () => {
    const parseTree = parse("{name: 'world', since: 1969, height: 183cm}");
    const cstProperties = properties(parseTree.rootNode);
    expect(cstProperties).toHaveLength(3);
    expect(propertyKey(cstProperties[0])).toBe('name');
    expect(propertyValue(cstProperties[0])).toBe("'world'");
    expect(propertyKey(cstProperties[1])).toBe('since');
    expect(propertyValue(cstProperties[1])).toBe('1969');
    expect(propertyKey(cstProperties[2])).toBe('height');
    expect(propertyValue(cstProperties[2])).toBe('183cm');
  });
});
