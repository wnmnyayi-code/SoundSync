// Get current tab information
async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  return tab
}

// Extract track information from SoundSync page
async function getTrackInfo() {
  const tab = await getCurrentTab()
  
  if (!tab.url.includes('soundsync.co.za')) {
    return null
  }
  
  // Execute content script to extract track info
  const [result] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      // Try to find track information in the page
      const titleEl = document.querySelector('h1, .track-title, [data-track-title]')
      const artistEl = document.querySelector('.artist-name, [data-artist-name]')
      
      return {
        title: titleEl?.textContent || 'Unknown Track',
        artist: artistEl?.textContent || 'Unknown Artist',
        url: window.location.href
      }
    }
  })
  
  return result.result
}

// Show status message
function showStatus(message, type = 'success') {
  const statusEl = document.getElementById('status')
  statusEl.textContent = message
  statusEl.style.display = 'block'
  statusEl.style.background = type === 'success' 
    ? 'hsl(142 70% 45% / 0.1)' 
    : 'hsl(0 70% 50% / 0.1)'
  statusEl.style.borderColor = type === 'success'
    ? 'hsl(142 70% 45% / 0.3)'
    : 'hsl(0 70% 50% / 0.3)'
  
  setTimeout(() => {
    statusEl.style.display = 'none'
  }, 3000)
}

// Share to Facebook
function shareToFacebook(trackInfo) {
  const url = encodeURIComponent(trackInfo.url)
  const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`
  chrome.tabs.create({ url: shareUrl })
  showStatus('Opening Facebook...')
}

// Share to Twitter
function shareToTwitter(trackInfo) {
  const text = encodeURIComponent(`🎵 Check out "${trackInfo.title}" by ${trackInfo.artist} on SoundSync!`)
  const url = encodeURIComponent(trackInfo.url)
  const shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`
  chrome.tabs.create({ url: shareUrl })
  showStatus('Opening Twitter...')
}

// Share to WhatsApp
function shareToWhatsApp(trackInfo) {
  const text = encodeURIComponent(`🎵 Check out "${trackInfo.title}" by ${trackInfo.artist} on SoundSync!\n${trackInfo.url}`)
  const shareUrl = `https://wa.me/?text=${text}`
  chrome.tabs.create({ url: shareUrl })
  showStatus('Opening WhatsApp...')
}

// Copy to clipboard for Instagram
function shareToInstagram(trackInfo) {
  const text = `🎵 Check out "${trackInfo.title}" by ${trackInfo.artist} on SoundSync!\n${trackInfo.url}`
  navigator.clipboard.writeText(text).then(() => {
    showStatus('Link copied! Paste in Instagram bio or story')
  })
}

// Initialize popup
async function init() {
  const trackInfo = await getTrackInfo()
  
  if (trackInfo) {
    document.getElementById('trackTitle').textContent = trackInfo.title
    document.getElementById('trackArtist').textContent = trackInfo.artist
    
    // Enable share buttons
    document.getElementById('shareFacebook').addEventListener('click', () => shareToFacebook(trackInfo))
    document.getElementById('shareTwitter').addEventListener('click', () => shareToTwitter(trackInfo))
    document.getElementById('shareWhatsApp').addEventListener('click', () => shareToWhatsApp(trackInfo))
    document.getElementById('shareInstagram').addEventListener('click', () => shareToInstagram(trackInfo))
  } else {
    document.getElementById('trackTitle').textContent = 'No track detected'
    document.getElementById('trackArtist').textContent = 'Visit a SoundSync track page'
  }
}

// Run initialization
init()