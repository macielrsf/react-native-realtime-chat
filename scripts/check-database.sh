#!/bin/bash
# scripts/check-database.sh

echo "🔍 Checking database status..."

# Check if MongoDB container is running
if ! docker ps | grep -q rn_chat_mongo; then
    echo "❌ MongoDB container is not running!"
    echo "   Please start the backend first: ./scripts/start-backend-docker.sh"
    exit 1
fi

echo ""
echo "📊 Database Overview:"

# Get database information
docker exec -it rn_chat_mongo mongosh rn_chat --eval "
    print('🗄️  Database: rn_chat');
    print('');
    
    // Show all collections with counts
    print('📋 Collections:');
    var totalDocs = 0;
    db.getCollectionNames().sort().forEach(function(collection) {
        var count = db[collection].countDocuments();
        totalDocs += count;
        var icon = '📊';
        if (collection === 'users') icon = '👥';
        if (collection === 'messages') icon = '💬';
        if (collection === 'unreadcounts') icon = '🔔';
        
        print('  ' + icon + ' ' + collection + ': ' + count + ' documents');
    });
    
    print('');
    print('📈 Total documents: ' + totalDocs);
    
    if (db.users.countDocuments() > 0) {
        print('');
        print('👤 Available Users:');
        db.users.find({}, {name: 1, username: 1, _id: 0}).sort({name: 1}).forEach(function(user) {
            print('  🟢 ' + user.name + ' (' + user.username + ')');
        });
    }
    
    if (db.messages.countDocuments() > 0) {
        print('');
        print('💬 Recent Messages (last 5):');
        db.messages.find({}, {body: 1, createdAt: 1, _id: 0}).sort({createdAt: -1}).limit(5).forEach(function(msg) {
            var date = new Date(msg.createdAt).toLocaleString();
            print('  📝 \"' + msg.body + '\" (' + date + ')');
        });
    }
    
    if (db.unreadcounts.countDocuments() > 0) {
        print('');
        print('🔔 Unread Counts:');
        db.unreadcounts.find({}, {userId: 1, conversationWith: 1, count: 1, _id: 0}).forEach(function(unread) {
            print('  📬 User ' + unread.userId.substring(0, 8) + '... has ' + unread.count + ' unread from ' + unread.conversationWith.substring(0, 8) + '...');
        });
    }
" 2>/dev/null

echo ""
echo "🌐 Backend Status:"
if curl -f -s http://localhost:3001/api/health >/dev/null 2>&1; then
    echo "  ✅ Backend API is responding"
    echo "  🔗 http://localhost:3001"
else
    echo "  ❌ Backend API is not responding"
    echo "  💡 Check: docker compose logs backend"
fi

echo ""
echo "🎮 Available Commands:"
echo "  🔄 Reset database: ./scripts/reset-database.sh"
echo "  🌱 Seed database: ./scripts/seed.sh"
echo "  🚀 Start backend: ./scripts/start-backend-docker.sh"
echo "  📱 Start frontend: cd frontend && npm start"