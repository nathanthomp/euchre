
playerIds.forEach((playerId, i) => {
    // Stagger connections by 500ms each
    setTimeout(() => {
        console.log(`🤝 ${playerId} connecting...`);
        
        const ws = new WebSocket(url);
        
        ws.on('open', () => {
            console.log(`✅ ${playerId} connected!`);
            
            const joinMsg = {
                type: 'JOIN',
                playerId: playerId,
                teamId: i % 2 == 0 ? 'RED' : 'BLACK'
            };
            
            ws.send(JSON.stringify(joinMsg));
            console.log(`📤 ${playerId} → JOIN sent`);
        });
        
        ws.on('message', (data) => {
            console.log(`📨 ${playerId} ← Server: ${data}`);
        });
        
        ws.on('close', () => {
            console.log(`❌ ${playerId} disconnected`);
        });
        
        ws.on('error', (err) => {
            console.error(`💥 ${playerId} error:`, err.message);
        });
        
    }, i * 500);  // player1: 0ms, player2: 500ms, player3: 1000ms, player4: 1500ms
});

// Wait 10 seconds total, then exit
setTimeout(() => {
    console.log('\n🏁 Test complete - all players joined!');
    process.exit(0);
}, 10000);
