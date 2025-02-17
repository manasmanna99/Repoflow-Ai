import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";

export const loadGithubRepo = async (
  githubUrl: string,
  githubToken?: string,
) => {
  const loader = new GithubRepoLoader(githubUrl, {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    accessToken: githubToken || '',
    branch:'main',
    ignoreFiles:['.gitignore', 'README.md', 'CONTRIBUTING.md', 'CODE_OF_CONDUCT.md', 'LICENSE.md', 'PULL_REQUEST_TEMPLATE.md', 'ISSUE_TEMPLATE.md', 'SECURITY.md', 'FUNDING.yml', 'SUPPORT.md', 'CHANGELOG.md', 'CONTRIBUTORS.md', 'AUTHORS.md', 'HISTORY.md', 'UPGRADING.md', 'TODO.md', 'TODO', 'CHANGELOG', 'UPGRADING', 'HISTORY', 'AUTHORS', 'CONTRIBUTORS', 'SECURITY', 'SUPPORT', 'FUNDING', 'ISSUE_TEMPLATE', 'PULL_REQUEST_TEMPLATE', 'LICENSE', 'CODE_OF_CONDUCT', 'CONTRIBUTING', 'README', 'LICENSE.txt'],
    recursive: true,
    unknown:"warn",
    maxConcurrency: 5,
  });
  const docs = await loader.load();
  return docs;
};


console.log(await loadGithubRepo('https://github.com/mrinal-mann/TrustPay'));


// Document {
//     pageContent: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">\n' +
//       '  <path d="M9.99984 4.16666V15.8333M4.1665 10H15.8332" stroke="#475467" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>\n' +
//       '</svg>',
//     metadata: {
//       source: 'public/icons/plus.svg',
//       repository: 'https://github.com/mrinal-mann/TrustPay',
//       branch: 'master'
//     },
