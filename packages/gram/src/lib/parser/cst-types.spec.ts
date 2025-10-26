import { CstNode, CstPattern, CstRelationship } from './cst-types';
import { parse } from '../parser/parser';
describe('CstSyntax', () => {
  it('empty node', () => {
    const cst = parse('()');
    const gram = cst.rootNode;
    const pattern = gram.firstNamedChild as CstPattern;
    const node = pattern?.firstNamedChild as CstNode;
    expect(node.type).toBe('node');
    expect(node.identifierNode).toBeNull();
    expect(node.labelsNode).toBeNull();
    expect(node.recordNode).toBeNull();
  });
  it('identified node', () => {
    const cst = parse('(a)');
    const gram = cst.rootNode;
    const pattern = gram.firstNamedChild as CstPattern;
    const node = pattern?.firstNamedChild as CstNode;
    expect(node.type).toBe('node');
    expect(node.identifierNode?.type).toBe('symbol');
    expect(node.labelsNode).toBeNull();
    expect(node.recordNode).toBeNull();
  });
  it('identified, labeled node', () => {
    const cst = parse('(a:A)');
    const gram = cst.rootNode;
    const pattern = gram.firstNamedChild as CstPattern;
    const node = pattern?.firstNamedChild as CstNode;
    expect(node.type).toBe('node');
    expect(node.identifierNode?.type).toBe('symbol');
    expect(node.labelsNode?.type).toBe('labels');
    expect(node.recordNode).toBeNull();
  });
  it('identified, labeled node with a record', () => {
    const cst = parse("(a:A {k:'v'})");
    const gram = cst.rootNode;
    const pattern = gram.firstNamedChild as CstPattern;
    const node = pattern?.firstNamedChild as CstNode;
    expect(node.type).toBe('node');
    expect(node.identifierNode?.type).toBe('symbol');
    expect(node.labelsNode?.type).toBe('labels');
    expect(node.recordNode?.type).toBe('record');
  });
  it('empty relationship', () => {
    const cst = parse('()-->()');
    const gram = cst.rootNode;
    const pattern = gram.firstNamedChild as CstPattern;
    const relationship = pattern?.firstNamedChild as CstRelationship;
    expect(relationship.type).toBe('relationship');
    expect(relationship.leftNode).toBeDefined();
    expect(relationship.leftNode.type).toBe('node');
    expect(relationship.rightNode).toBeDefined();
    expect(relationship.rightNode.type).toBe('node');
    expect(relationship.kindNode).toBeDefined();
    expect(relationship.kindNode.type).toBe('right_arrow');
  });
});
