import * as coda from "@codahq/packs-sdk";

export const pack = coda.newPack();

enum ProjectType {
  website = "Website",
  pack = "Coda Pack"
};

/**
 * Remove non-alphanumeric characters from a list of words
 * @param words A list of words to clean
 * @returns The list of words with non-alphanumeric characters removed
 */
function cleanWords(words: string[]): string[] {
  return words.map(word => word.toLowerCase().replace(/[^a-zA-Z0-9-.]+/g, ''));
}

/**
 * Replace spaces with dashes in a list of words
 * @param words A list of words to add to the slug
 * @returns The list of words with spaces replaced with dashes
 */
function spacesToDashes(words: string[]): string[] {
  return words.map(word => word.replace(/\s+/g, '-'));
}

/**
 * Convert a string of text to an array of words
 * @param text A string of text to convert to words
 * @returns An array of words
 */
function toWords(text: string): string[] {
  return text
    .replace(/[^a-zA-Z0-9-.]+/g, ' ')
    .replace(/[-.]+/g, ' ')
    .trim()
    .split(' ');
}

/**
 * Add the plural version to a list of words
 * @param words A list of words to add to the slug
 * @param plural Whether to add the plural version of the words
 * @returns The list of words with the plural version added
 */
function withPlural(words: string[], plural = true): string[] {
  return plural ? words.flatMap(word => [word, `${word}s`]) : words;
}

/**
 * Add a GitHub user or organization name to the beginning of a slug
 * @param slug The slug to add the repo owner to
 * @param repoOwner The GitHub user or organization name
 * @returns The slug with the repo owner added to the beginning
 */
function slugWithRepoOwner(slug: string, repoOwner?: string): string {
  return repoOwner ? `${repoOwner}/${slug}` : slug;
}

/**
 * Create a slug from a project name and type and optional additional words
 * @param projectName The name of the project to generate the slugs from
 * @param words A list of words to add at the end of the slug
 * @returns An array of words that make up the slug
 */
function createSlug(projectName: string, words?: string[]): string[] {
  const projectNameWords = toWords(projectName);
  let slug = projectNameWords;
  if (words?.length > 0) {
    slug.push(...words);
  }
  return slug;
}
/**
 * Creates an array of slugs by joining a base slug with each joiner option.
 * @param slug A slug to join with each joiner
 * @param joiners An array of joiners to join the slug with
 * @returns An array of slugs joined with each joiner
 */
function withJoiners(slug: string[], joiners: string[]): string[] {
  const slugs: string[] = [];

  joiners.forEach(joiner => {
    const slugWithJoiner = slug.join(joiner);
    slugs.push(slugWithJoiner);
  });

  return slugs;
}

/**
 * Creates an array of slugs by joining a base slug with each joiner option and adding words before and after a separator.
 * @param projectName The name of the project to generate the slugs from
 * @param joiners An array of joiners to join the slug with
 * @param wordsBefore A list of words to add before the separator
 * @param wordsAfter A list of words to add after the separator
 * @returns An array of slugs
 */
function createSlugs(
  projectName: string,
  joiners: string[],
  wordsBefore?: string[],
  wordsAfter?: string[]
): string[] {

  const baseSlugProjectName = createSlug(projectName);
  const baseSlugWithWordsBefore = createSlug(projectName, wordsBefore);

  const slugs: string[] = [];

  // if (baseSlugWithWordsBefore.length === 1) {
  //   slugs.push(...baseSlugWithWordsBefore);
  //   return slugs;
  // }

  if (wordsAfter.length > 0) {
    slugs.push([
      baseSlugProjectName.join(''),
      wordsAfter.join('')
    ].join('-'));
  }

  (wordsBefore.length > 0) && slugs.push(...withJoiners(baseSlugWithWordsBefore, joiners));
  slugs.push(...withJoiners(baseSlugProjectName, joiners));

  return slugs;

}

pack.addFormula({
  name: "GenerateProjectSlugs",
  description: "Generate a list of slugs for a specified project name",

  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "projectName",
      description: "The name of the project to generate the slugs from",
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "repoOwner",
      description: "A GitHub user or organization name",
      optional: true,
    }),
    coda.makeParameter({
      type: coda.ParameterType.StringArray,
      name: "additionalWordsBefore",
      description: "A list of words to add before the separator",
      optional: true,
    }),
    coda.makeParameter({
      type: coda.ParameterType.StringArray,
      name: "additionalWordsAfter",
      description: "A list of words to add after the separator",
      optional: true,
    }),
  ],

  resultType: coda.ValueType.Array,
  items: { type: coda.ValueType.String },

  examples: [
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
  ],

  execute: async function ([
    projectName,
    repoOwner,
    wordsBefore = [],
    wordsAfter = []
  ]: [string, string, string[], string[]]) {

    const projectNameLower = projectName.toLowerCase();
    debugger;
    const wordsBeforeLower = cleanWords(wordsBefore);
    const wordsAfterLower = cleanWords(wordsAfter);

    const joiners = ["-", ""];
    const slugs = createSlugs(projectNameLower, joiners, wordsBeforeLower, wordsAfterLower);
    const slugsWithRepoOwner = slugs.map(slug => slugWithRepoOwner(slug, repoOwner));

    return slugsWithRepoOwner;
  },
});
