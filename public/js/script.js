async function loadTokenInfo() {
    try {
        const response = await fetch('/api/my-token', {
            credentials: 'include' // Send session cookie
        });
        
        if (!response.ok) throw new Error('Failed to fetch token info');
        
        const tokenInfo = await response.json();
        return tokenInfo
        
    } catch (error) {
        console.error('Error loading token info:', error);
        return false
    }
}

async function refreshTokenInfo() {
    try {
        const response = await fetch('/api/refresh-token', {
            credentials: 'include' // Send session cookie
        });
        
        if (!response.ok) throw new Error('Failed to fetch token info');
        return true
        
    } catch (error) {
        console.error('Error loading token info:', error);
        return false
    }
}

async function loadConfig() {
    try {
      const response = await fetch('/api/client-config');
      const appConfig = await response.json();
      return appConfig
    } catch (error) {
        console.error('Failed to load config:', error);
        return false
      }
}

document.addEventListener('DOMContentLoaded', async () => {

    setupAuthListeners();
    try {
        const token = await loadTokenInfo();
        if (!token) {
            showLoginModal();
            return;
        }

        const isValidToken = await checkTokenValidity(token);
        
        if (!isValidToken) {
            const isTokenRefreshed = await refreshTokenInfo();
            if(!isTokenRefreshed){
                showLoginModal();
            }
            return;
        }

        // Token is valid, continue with your app logic

        document.getElementById('welcomeMessage').textContent = `Welcome, ${token.slug || 'Admin'}`;


    } catch (error) {
        console.error('Failed to check auth status:', error);
        showLoginModal();

    }
});

const showLoginModal = () => {
    document.getElementById('loginModal').style.display = 'flex';
};
const checkTokenValidity = async (token) => {
    try {
        const Keys = loadConfig();
        if(!Keys)return false;
        const response = await fetch(`https://api.kick.com/public/v1/token/introspect`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token.accessToken}`,
                'Content-Type': 'application/json'
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return true;
    } catch (error) {
        console.error('Token validation failed:', error);
        return false;
    }
};

function setupAuthListeners() {
    document.getElementById('authButton').addEventListener('click', () => {
        // Redirect to backend OAuth endpoint
        window.location.href = 'http://localhost:3000/auth/kick';
    });
    document.getElementById('refreshToken').addEventListener('click', () => {
        refreshTokenInfo()
    });
}
