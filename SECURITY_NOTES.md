# Security Notes - Admin Authentication

## ⚠️ Important: Client-Side Security Limitations

**Client-side JavaScript code CANNOT be truly hidden.** Anyone can:
- View page source
- Open browser DevTools
- Inspect JavaScript files
- See all code that runs in the browser

## Current Security Measures

### ✅ What We've Implemented:

1. **Password Hashing (SHA-256)**
   - Passwords are stored as hashes, not plain text
   - Hashes are obfuscated (split into chunks)
   - Makes casual inspection harder

2. **Rate Limiting**
   - Locks account after 5 failed attempts
   - 15-minute lockout period
   - Prevents brute force attacks

3. **Session Management**
   - Secure session tokens
   - 8-hour session expiration
   - Proper session cleanup

4. **Code Obfuscation**
   - Hashes split into chunks
   - Variable names obfuscated
   - Makes reverse engineering harder (but not impossible)

### ⚠️ What Determined Attackers Can Still Do:

1. **View Source Code** - All JavaScript is downloadable
2. **Debugger Tools** - Can step through code execution
3. **Memory Inspection** - Can inspect runtime values
4. **Network Interception** - Can see localStorage/sessionStorage

## For True Security

**You need server-side authentication:**
- Backend API with secure authentication
- Database-stored password hashes (with salt)
- HTTPS encryption
- Session management on server
- Rate limiting on server

## Current Protection Level

**Good for:**
- Personal portfolio/blog sites
- Low-risk applications
- Protection against casual users
- Deterring automated scripts

**Not suitable for:**
- Financial applications
- Medical data
- Sensitive personal information
- High-value targets

## Recommendations

1. **Change passwords regularly**
2. **Use strong, unique passwords**
3. **Monitor login attempts** (via analytics)
4. **Consider server-side auth** for production apps
5. **Use HTTPS** when deploying

## Changing Credentials

To change username/password:

1. Generate new SHA-256 hashes:
   ```bash
   node -e "const crypto = require('crypto'); console.log(crypto.createHash('sha256').update('yourpassword').digest('hex'));"
   ```

2. Update `js/admin.js`:
   - Replace hash chunks in `_u1` array (username)
   - Replace hash chunks in `_p1` array (password)

3. Split hash into 8-character chunks for obfuscation

