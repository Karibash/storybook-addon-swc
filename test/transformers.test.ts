import { createSwcLoader } from '../src/transformers';

describe('createSwcLoader', () => {
  it('Pass empty options', () => {
    const rule = createSwcLoader({});
    expect(rule.loader).toMatch(/swc-loader/);
    expect(rule.options).toEqual({ parseMap: false });
  });

  it('Pass options', () => {
    const options = { jsc: { parser: { syntax: 'typescript' } } } as const;
    const rule = createSwcLoader(options);
    expect(rule.loader).toMatch(/swc-loader/);
    expect(rule.options).toEqual({ parseMap: false, ...options });
  });

  it('Pass options with sourceMaps set to false', () => {
    const options = { sourceMaps: false } as const;
    const rule = createSwcLoader(options);
    expect(rule.loader).toMatch(/swc-loader/);
    expect(rule.options).toEqual({ parseMap: false, ...options });
  });

  it('Pass options with sourceMaps set to true', () => {
    const options = { sourceMaps: true } as const;
    const rule = createSwcLoader(options);
    expect(rule.loader).toMatch(/swc-loader/);
    expect(rule.options).toEqual({ parseMap: true, ...options });
  });
});
