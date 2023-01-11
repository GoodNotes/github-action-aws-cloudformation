import { describe, it, expect } from '@jest/globals';
import { getCloudFormationParameters } from '../cloudformation';

describe('getCloudFormationParameters', () => {
  it('should parse parameters', () => {
    const params = getCloudFormationParameters(`
      Param1=foo&
      Param2=bar
    `);
    expect(params).toEqual([
      {
        ParameterKey: 'Param1',
        ParameterValue: 'foo',
      },
      {
        ParameterKey: 'Param2',
        ParameterValue: 'bar',
      },
    ]);
  });

  it('should allow empty parameters', () => {
    const params = getCloudFormationParameters();
    expect(params).toEqual([]);
  });

  it('should not set empty parameter values to undefined', () => {
    const params = getCloudFormationParameters(`
    Param1=foo&
    Param2=&
    Param3=bar`);
    expect(params).toEqual([
      {
        ParameterKey: 'Param1',
        ParameterValue: 'foo',
      },
      {
        ParameterKey: 'Param2',
        ParameterValue: '',
      },
      {
        ParameterKey: 'Param3',
        ParameterValue: 'bar',
      },
    ]);
  });

  it('should handle quotes and double quotes in parameter values', () => {
    const params = getCloudFormationParameters(`
      Param1='foo'&
      Param2="bar"&
      Param3=qux`);
    expect(params).toEqual([
      {
        ParameterKey: 'Param1',
        ParameterValue: "'foo'",
      },
      {
        ParameterKey: 'Param2',
        ParameterValue: '"bar"',
      },
      {
        ParameterKey: 'Param3',
        ParameterValue: 'qux',
      },
    ]);
  });
});
