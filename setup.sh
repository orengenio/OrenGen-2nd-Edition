#!/bin/bash
# OrenGen.io - Quick Setup Script

echo "🚀 OrenGen.io Platform Setup"
echo "=============================="
echo ""

# Check if running in correct directory
if [ ! -f "ARCHITECTURE.md" ]; then
    echo "❌ Error: Run this from /workspaces/home directory"
    exit 1
fi

# Generate secrets
echo "🔐 Generating security secrets..."
echo ""
echo "Copy these to your Coolify environment variables:"
echo ""
echo "ACCESS_TOKEN_SECRET=$(openssl rand -base64 32)"
echo "LOGIN_TOKEN_SECRET=$(openssl rand -base64 32)"
echo "REFRESH_TOKEN_SECRET=$(openssl rand -base64 32)"
echo "FILE_TOKEN_SECRET=$(openssl rand -base64 32)"
echo "POSTGRES_PASSWORD=$(openssl rand -base64 24)"
echo ""

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "⚠️  Warning: Docker not found. Install Docker first."
else
    echo "✅ Docker is installed"
fi

# Check available memory
TOTAL_MEM=$(free -g | awk '/^Mem:/{print $2}')
echo "💾 Server Memory: ${TOTAL_MEM}GB"

if [ "$TOTAL_MEM" -lt 8 ]; then
    echo "⚠️  Warning: Less than 8GB RAM. Recommended: 12GB+"
else
    echo "✅ Memory looks good"
fi

echo ""
echo "📋 Next Steps:"
echo "1. Copy the secrets above"
echo "2. Go to Coolify dashboard"
echo "3. Create new Docker Compose service"
echo "4. Repository: orengenio/OrenGen-2nd-Edition"
echo "5. Base directory: crm"
echo "6. Add environment variables"
echo "7. Domain: crm.orengen.io"
echo "8. Deploy!"
echo ""
echo "📖 See ARCHITECTURE.md for full documentation"
