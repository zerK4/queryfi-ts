module.exports = {
  branches: [
    'main',
    {
      name: 'next',
      prerelease: true,
    },
  ],
  repositoryUrl: 'https://github.com/zerK4/queryfi-ts.git',
  plugins: [
    '@semantic-release/commit-analyzer', // Analyze commits
    '@semantic-release/release-notes-generator', // Generate changelogs
    '@semantic-release/changelog', // Update CHANGELOG.md
    [
      '@semantic-release/npm', // Publish to npm
      {
        npmPublish: true,
        pkgRoot: './dist', // Built package directory
        tarballDir: 'release',
      },
    ],
    '@semantic-release/github', // GitHub releases
    [
      '@semantic-release/git', // Git commits
      {
        assets: [
          'package.json',
          'CHANGELOG.md',
          'CHANGELOG.md',
          'dist/**/*.{js}',
        ],
        message:
          'chore: Release ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
  ],
};
