# Tracking Guide - Understanding Visitor Analytics

## 📊 What Can Be Tracked?

Your analytics system now tracks **comprehensive visitor data**:

### ✅ Currently Tracked:

1. **Basic Visitor Info**
   - IP Address
   - Country, City, Region
   - Browser Language
   - Timezone
   - Screen Resolution
   - Device Type (Mobile/Tablet/Desktop)

2. **Traffic Sources** 🔍
   - **Email Detection** - Automatically detects if visitor came from email
   - **Social Media** - Facebook, Twitter, Instagram, LinkedIn, etc.
   - **Search Engines** - Google, Bing, DuckDuckGo, etc.
   - **Direct Traffic** - Typed URL or bookmarks
   - **Referral Sites** - Other websites linking to you

3. **UTM Parameters** 📈
   - `utm_source` - Where traffic came from
   - `utm_medium` - Type of traffic (email, social, cpc, etc.)
   - `utm_campaign` - Campaign name
   - `utm_term` - Keywords (for paid ads)
   - `utm_content` - Specific content that was clicked

4. **Behavioral Data**
   - Page visited
   - Time of visit
   - Session ID
   - Referrer URL

## 📧 How to Track Email Campaigns

### Method 1: UTM Parameters (Recommended)

Add UTM parameters to your email links:

```
https://yoursite.com/?utm_source=newsletter&utm_medium=email&utm_campaign=january2024
```

**Benefits:**
- ✅ Always detected as email traffic
- ✅ Can track specific campaigns
- ✅ Works even if referrer is blocked

### Method 2: Automatic Detection

The system automatically detects email clients:
- Gmail
- Outlook/Hotmail
- Yahoo Mail
- iCloud Mail
- ProtonMail
- And many more...

**Note:** This only works if the email client passes referrer info (some don't for privacy).

## 🌐 Social Media Tracking

Automatically detects these platforms:
- Facebook
- Twitter/X
- Instagram
- LinkedIn
- Pinterest
- Reddit
- TikTok
- YouTube
- WhatsApp
- Telegram
- Discord
- And more...

### Using UTM for Social:

```
https://yoursite.com/?utm_source=facebook&utm_medium=social&utm_campaign=product_launch
```

## 🔍 Search Engine Tracking

Detects:
- Google
- Bing
- Yahoo
- DuckDuckGo
- Baidu
- Yandex
- Ecosia
- Startpage

## 📈 Campaign Tracking Examples

### Email Newsletter:
```
https://yoursite.com/?utm_source=newsletter&utm_medium=email&utm_campaign=weekly_digest
```

### Social Media Post:
```
https://yoursite.com/?utm_source=twitter&utm_medium=social&utm_campaign=blog_post_promo
```

### Paid Ad:
```
https://yoursite.com/?utm_source=google&utm_medium=cpc&utm_campaign=summer_sale&utm_term=buy_now
```

### Content Variant:
```
https://yoursite.com/?utm_source=email&utm_medium=email&utm_campaign=newsletter&utm_content=button_cta
```

## 🎯 What You'll See in Analytics

### Summary Cards:
- Total Visits
- Unique Visitors (by IP)
- Average per Day
- **Email Visits** (new!)
- **Social Visits** (new!)
- **Search Visits** (new!)

### Charts:
- Daily Visits
- Weekly Visits
- Hourly Distribution
- Referrers (domains)
- Countries
- **Source Categories** (Email/Social/Search/Direct/Referral)

### Lists:
- Top Pages
- Top Referrers
- Top Countries
- **Top Sources** (Gmail, Facebook, Google, etc.)
- **Top Campaigns** (your UTM campaigns)

### Recent Visits:
Each visit shows:
- Page visited
- Timestamp
- **Source badge** (📧 Email, 📱 Social, 🔍 Search)
- IP Address
- Country & City
- Source name
- Campaign name (if UTM used)
- Referrer
- Device type

## 🔒 Privacy & Limitations

### What's Tracked:
- ✅ Public information (IP, referrer, browser info)
- ✅ Information you provide (UTM parameters)
- ✅ Stored locally in your browser only

### What's NOT Tracked:
- ❌ Personal information (names, emails)
- ❌ User behavior after leaving (can't track cross-site)
- ❌ Exact location (only city-level)
- ❌ If email referrer is blocked (some email clients)

### Limitations:
1. **Email Tracking:**
   - Works best with UTM parameters
   - Some email clients block referrer info
   - Gmail usually works, Outlook sometimes doesn't

2. **Privacy Tools:**
   - VPNs hide real IP/country
   - Ad blockers may block tracking
   - Private browsing doesn't persist sessions

3. **Client-Side Only:**
   - All data stored in browser
   - Can be cleared by user
   - No server-side tracking

## 💡 Best Practices

1. **Always use UTM parameters** for email campaigns
2. **Use descriptive campaign names** to track performance
3. **Test your links** before sending emails
4. **Check analytics regularly** to see what's working
5. **Use unique campaigns** for different content

## 🚀 Quick Examples

### Track a Blog Post Share:
```
https://yoursite.com/blog/post-name/?utm_source=twitter&utm_medium=social&utm_campaign=blog_share
```

### Track Newsletter Signup Link:
```
https://yoursite.com/?utm_source=homepage&utm_medium=email&utm_campaign=newsletter_signup
```

### Track Product Launch:
```
https://yoursite.com/products/new/?utm_source=email&utm_medium=email&utm_campaign=product_launch&utm_content=cta_button
```

Your analytics dashboard will automatically categorize and display all this information!

