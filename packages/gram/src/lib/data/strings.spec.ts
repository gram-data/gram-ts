import * as Pattern from './pattern';

describe('Patterns of strings', () => {
  it('should start with a single string', () => {
    const a = Pattern.of('a');
    expect(Pattern.value(a)).toEqual('a');
  });
  it('should combine two strings', () => {
    const a = Pattern.of('hello'); // a=(hello)
    const b = Pattern.of('world'); // b=(world)
    const helloWorld = Pattern.combine([a, b]); // helloWorld=[(hello),(world)]

    expect(Pattern.value(helloWorld)).toBeUndefined(); // <V> is <string | null>
    expect(Pattern.members(helloWorld).length).toBe(2);

    const [hello, world] = Pattern.members(helloWorld);
    expect(Pattern.value(hello)).toEqual('hello');
    expect(Pattern.value(world)).toEqual('world');

    const helloWorldString = Pattern.reduce(
      helloWorld,
      '',
      (acc, a) => acc + (a ?? '')
    ); // nullish coallesce to avoid "null" in string
    expect(helloWorldString).toEqual('helloworld');
  });
});
