#!/bin/bash
# GitHub Deployment Verification Script

echo "🚀 Verifying Elite XSS Framework GitHub Deployment..."
echo "====================================================="

# Check if we're in the right directory
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a Git repository"
    exit 1
fi

# Check current branch
BRANCH=$(git branch --show-current)
echo "📋 Current branch: $BRANCH"

# Check remote
REMOTE=$(git remote -v | grep origin)
echo "🔗 Remote repository: $REMOTE"

# Check latest commit
COMMIT=$(git log -1 --oneline)
echo "📝 Latest commit: $COMMIT"

# Check if changes are pushed
STATUS=$(git status --porcelain)
if [ -z "$STATUS" ]; then
    echo "✅ Working directory is clean"
else
    echo "⚠️  Working directory has uncommitted changes"
fi

# Check if branch is up to date with remote
LOCAL=$(git rev-parse HEAD)
REMOTE_HEAD=$(git rev-parse origin/main 2>/dev/null || echo "unknown")

if [ "$LOCAL" = "$REMOTE_HEAD" ]; then
    echo "✅ Local branch is up to date with remote"
else
    echo "🔄 Local branch differs from remote"
fi

echo ""
echo "🎉 GitHub deployment verification complete!"
echo "   Your Elite XSS Framework is now available at:"
echo "   https://github.com/Nevrkin/My-XSS"
echo ""
echo "📊 Next steps:"
echo "   1. Visit your GitHub repository to verify files"
echo "   2. Enable GitHub Pages in repository settings"
echo "   3. Configure GitHub Actions in the 'Actions' tab"
echo "   4. Set up branch protection rules for 'main' branch"