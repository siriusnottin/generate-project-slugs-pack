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
});
