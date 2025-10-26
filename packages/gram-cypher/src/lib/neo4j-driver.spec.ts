import neo4j from 'neo4j-driver';
import { describe, expect, it } from 'vitest';

describe('neo4j driver', () => {
  it('creates a driver without connecting', async () => {
    const driver = neo4j.driver(
      'neo4j://localhost',
      neo4j.auth.basic('neo4j', 'password'),
      { userAgent: 'gram-cypher/tests', disableLosslessIntegers: true },
    );

    expect(typeof driver.session).toBe('function');

    await driver.close();
  });
});
