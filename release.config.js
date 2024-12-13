module.exports = {
  branches: ['main'],
  repositoryUrl: 'https://github.com/zerK4/queryfi-ts',
  plugins: [
    '@semantic-release/commit-analyzer', // Analyze commit messages
    '@semantic-release/release-notes-generator', // Generate release notes
    '@semantic-release/changelog', // Update CHANGELOG.md
    '@semantic-release/npm', // Publish to npm
    '@semantic-release/github', // Create GitHub release
    [
      '@semantic-release/git',
      {
        assets: ['package.json', 'CHANGELOG.md'],
        message:
          'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
  ],
};
