// TODO: confirm licences before publishing any output.
export const licences = [
  { id: 'CC-BY-4.0', name: 'Creative Commons Attribution 4.0', use: 'Written material, figures and documentation, unless stated otherwise.', url: 'https://creativecommons.org/licenses/by/4.0/' },
  { id: 'MIT', name: 'MIT Licence', use: 'Code and notebooks, unless stated otherwise.', url: 'https://opensource.org/license/mit' },
  { id: 'CC0-1.0', name: 'CC0 1.0 Public Domain Dedication', use: 'Compiled datasets where the underlying sources permit it.', url: 'https://creativecommons.org/publicdomain/zero/1.0/' },
  { id: 'source', name: 'Source licence applies', use: 'Third-party data keeps its original licence. Always check the source.', url: undefined },
] as const;
