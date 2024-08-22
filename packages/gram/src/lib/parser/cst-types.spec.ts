import {
  CstNode,
  CstPattern,
  CstRelationship,
} from './cst-types';
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
    expect(node.identifierNode).toBeDefined();
    expect(node.labelsNode).toBeNull();
    expect(node.recordNode).toBeNull();
  });
  it('identified, labeled node', () => {
    const cst = parse('(a:A)');
    const gram = cst.rootNode;
    const pattern = gram.firstNamedChild;
    const node = pattern?.firstNamedChild as CstNode;
    expect(node.type).toBe('node');
    expect(node.identifierNode).toBeDefined();
    expect(node.labelsNode).toBeDefined();
    expect(node.recordNode).toBeNull();
  });
  it('identified, labeled node with a record', () => {
    const cst = parse("(a:A {k:'v'})");
    const gram = cst.rootNode;
    const pattern = gram.firstNamedChild;
    const node = pattern?.firstNamedChild as CstNode;
    expect(node.type).toBe('node');
    expect(node.identifierNode).toBeDefined();
    expect(node.labelsNode).toBeDefined();
    expect(node.recordNode).toBeDefined();
  });
  it('empty relationship', () => {
    const cst = parse('()-->()');
    const gram = cst.rootNode;
    const pattern = gram.firstNamedChild;
    const relationship = pattern?.firstNamedChild as CstRelationship;
    expect(relationship.type).toBe('relationship');
    expect(relationship.leftNode).toBeDefined();
    expect(relationship.leftNode.type).toBe('node');
    expect(relationship.rightNode).toBeDefined();
    expect(relationship.rightNode.type).toBe('node');
    expect(relationship.valueNode).toBeDefined();
    expect(relationship.valueNode.type).toBe('single_right');
  });
});
