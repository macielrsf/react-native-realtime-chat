#!/bin/bash
# scripts/reset-database.sh

echo "🗃️  Resetting database only..."

# Check if MongoDB container is running
if ! docker ps | grep -q rn_chat_mongo; then
    echo "❌ MongoDB container is not running!"
    echo "   Please start the backend first: ./scripts/start-backend-docker.sh"
    exit 1
fi

echo "🗑️  Clearing all database collections..."

# Connect to MongoDB and clear all data
docker exec -it rn_chat_mongo mongosh rn_chat --eval "
    print('🗑️  Dropping collections...');
    
    // Show current state
    print('Current collections:');
    db.getCollectionNames().forEach(function(collection) {
        var count = db[collection].countDocuments();
        print('  📊 ' + collection + ': ' + count + ' documents');
    });
    
    print('');
    print('Dropping all collections...');
    
    // Drop all collections
    var dropped = 0;
    ['users', 'messages', 'unreadcounts'].forEach(function(collection) {
        if (db[collection].drop()) {
            print('  ✅ Dropped: ' + collection);
            dropped++;
        } else {
            print('  ⚠️  Collection not found: ' + collection);
        }
    });
    
    print('');
    print('📊 Summary: ' + dropped + ' collections dropped');
    print('✅ Database cleared successfully!');
"

if [ $? -ne 0 ]; then
    echo "❌ Failed to clear database!"
    exit 1
fi

echo ""
echo "⏳ Waiting 2 seconds before reseeding..."
sleep 2

# Check if seed script exists
if [ ! -f "./scripts/seed.sh" ]; then
    echo "❌ Seed script not found!"
    echo "   Please make sure ./scripts/seed.sh exists"
    exit 1
fi

# Make seed script executable
chmod +x ./scripts/seed.sh

# Reseed the database
echo "🌱 Reseeding database with fresh data..."
./scripts/seed.sh

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Database reset and repopulation complete!"
    echo ""
    echo "📊 New database state:"
    
    # Show the new state
    docker exec -it rn_chat_mongo mongosh rn_chat --eval "
        print('👥 Users created:');
        db.users.find({}, {name: 1, username: 1, _id: 0}).forEach(function(user) {
            print('  🟢 ' + user.name + ' (' + user.username + ')');
        });
        
        print('');
        print('📈 Collection counts:');
        db.getCollectionNames().forEach(function(collection) {
            var count = db[collection].countDocuments();
            if (count > 0) {
                print('  📊 ' + collection + ': ' + count + ' documents');
            }
        });
    " 2>/dev/null
    
    echo ""
    echo "🚀 Ready to use! Test accounts:"
    echo "  👤 alice / password123"
    echo "  👤 bob / password123"
    echo "  👤 charlie / password123"
    echo ""
    echo "💡 Next steps:"
    echo "  📱 Start frontend: cd frontend && npm start"
    echo "  🔍 View logs: docker compose logs -f backend"
else
    echo ""
    echo "❌ Failed to seed database!"
    echo "   Please check the seed script for errors"
    exit 1
fi