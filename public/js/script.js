<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kick Bot Manager</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="mainContent">
        <div class="header">
            <h2>Bot Dashboard</h2>
            <div class="userProfile">
                <span id="welcomeMessage">Welcome</span>
                <img src="" alt="Profile">
            </div>
        </div>
    <div>
        <div class="panel quickActions" style="margin-bottom: 20px;">
            <div class="panelHeader">
                <h3>Quick Actions</h3>
            </div>
            <button class="btn btnOutline" id="refreshToken">
                <i class="fas faRefreshToken"></i> Refresh Token Endpoint
            </button>
            <button class="btn btnOutline" id="revokeToken">
                <i class="fas faRevokeToken"></i> Revoke Token Endpoint
            </button>
        </div>
    <!-- Login Modal -->
    <div id="loginModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; justify-content: center; align-items: center;">
        <div style="background: white; padding: 30px; border-radius: 10px; text-align: center; max-width: 400px; width: 90%;">
            <h2>Login Required</h2>
            <p>Please Connect Your Kick Account To Manage Your Bot</p>
            <button id="authButton" style="background: #6e45e2; color: white; border: none; padding: 12px 24px; border-radius: 6px; font-weight: 500; cursor: pointer; margin-top: 20px;">
                <i class="fab fa-kickstarter"></i> Login with Kick
            </button>
        </div>
    </div>
    <script src="js/script.js"></script>
</body>
</html>
