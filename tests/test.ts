import { assert } from "chai";
import { describe } from "mocha";
import { executeFormulaFromPackDef } from "@codahq/packs-sdk/dist/development";
import { it } from "mocha";
import { pack } from "../pack";

const examples = [
  {
    params: ['Google Photos', 'username', ['pack'], ['pack']],
    result: [
      'username/googlephotos-pack',
      'username/google-photos-pack',
      'username/googlephotospack',
      'username/google-photos',
      'username/googlephotos',
    ]
  },
  {
    params: ['Google Photos', 'username', ['pack']],
    result: [
      'username/google-photos-pack',
      'username/googlephotospack',
      'username/google-photos',
      'username/googlephotos',
    ]
  },
  {
    params: ['Google Photos', 'username', undefined, ['pack']],
    result: [
      'username/googlephotos-pack',
      'username/google-photos',
      'username/googlephotos',
    ]
  },
  {
    params: ['WordPress', 'username', undefined, ['pack']],
    result: [
      'username/wordpress-pack',
      'username/wordpress',
    ]
  },
  {
    params: ['WordPress', 'username'],
    result: [
      'username/wordpress',
    ]
  },
]

describe('GenerateProjectSlugs Formula', () => {
  it('executes the formula with all parameters', async () => {
    const result =
      await executeFormulaFromPackDef(pack, 'GenerateProjectSlugs', ['Google Photos', 'username', ['pack'], ['pack']]);
    assert.deepEqual(result, examples[0].result);
  });
  it('executes the formula with only wordsBefore param', async () => {
    const result =
      await executeFormulaFromPackDef(pack, 'GenerateProjectSlugs', ['Google Photos', 'username', ['pack']]);
    assert.deepEqual(result, examples[1].result);
  });
  it('executes the formula with only wordsAfter param', async () => {
    const result =
      await executeFormulaFromPackDef(pack, 'GenerateProjectSlugs', ['Google Photos', 'username', undefined, ['pack']]);
    assert.deepEqual(result, examples[2].result);
  });
  it('executes the formula with projectName as a single word', async () => {
    const result =
      await executeFormulaFromPackDef(pack, 'GenerateProjectSlugs', ['WordPress', 'username', undefined, ['pack']]);
    assert.deepEqual(result, examples[3].result);
  });
  it('executes the formula with projectName as a single word, with repoOwner', async () => {
    const result =
      await executeFormulaFromPackDef(pack, 'GenerateProjectSlugs', ['WordPress', 'username']);
    assert.deepEqual(result, examples[4].result);
  });
});
