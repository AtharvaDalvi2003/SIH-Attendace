<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Smart Attendance & Analytics System - SIH Project</title>
    <!-- Tailwind CSS for attractive styling -->
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            font-family: 'Inter', sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        .welcome {
            text-align: center;
            color: white;
            font-size: 2rem;
            animation: fadeIn 1s ease-in-out;
        }
        .login-form {
            display: none;
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 2rem;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            width: 100%;
            max-width: 400px;
            animation: slideUp 0.5s ease-in-out;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        .spinner {
            width: 50px;
            height: 50px;
            border: 5px solid rgba(255, 255, 255, 0.3);
            border-top: 5px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 1rem auto;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <!-- Welcome Screen -->
    <div id="welcome" class="welcome">
        <h1>Welcome to Attendance System</h1>
        <div class="spinner"></div>
        <p>Loading...</p>
    </div>

    <!-- Login Form (Hidden Initially) -->
    <div id="loginForm" class="login-form">
        <h2 class="text-2xl font-bold text-center mb-4 text-gray-800">Login</h2>
        <form id="login">
            <input type="email" id="email" placeholder="Email" class="w-full p-3 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            <input type="password" id="password" placeholder="Password" class="w-full p-3 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            <button type="submit" class="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition">Login</button>
            <p id="error" class="text-red-500 text-center mt-2 hidden">Invalid credentials. Try again.</p>
        </form>
    </div>

    <!-- React App Root (Shown After Login) -->
    <div id="root" style="display: none;"></div>

    <script>
        // Show welcome for 3 seconds, then reveal login form
        setTimeout(() => {
            document.getElementById('welcome').style.display = 'none';
            document.getElementById('loginForm').style.display = 'block';
        }, 3000);

        // Handle login (basic check: teacher email + "123", student email + "1234")
        document.getElementById('login').addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const error = document.getElementById('error');

            // Simple validation (replace with real API call later)
            if ((email.includes('teacher') && password === '123') || (email.includes('student') && password === '1234')) {
                error.classList.add('hidden');
                // Hide login and load React app
                document.getElementById('loginForm').style.display = 'none';
                document.getElementById('root').style.display = 'block';
                // Load React (assuming Vite setup)
                import('/src/main.jsx');
            } else {
                error.classList.remove('hidden');
            }
        });
    </script>
</body>
</html>