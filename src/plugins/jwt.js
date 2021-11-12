import Vue from 'vue'

const CryptoJS = require('crypto-js')

function base64url (source) {
  // Encode in classical base64
  let encodedSource = CryptoJS.enc.Base64.stringify(source)

  // Remove padding equal characters
  encodedSource = encodedSource.replace(/=+$/, '')

  // Replace characters according to base64url specifications
  encodedSource = encodedSource.replace(/\+/g, '-')
  encodedSource = encodedSource.replace(/\//g, '_')

  return encodedSource
}

function encodedJsonToString (json) {
  return CryptoJS.enc.Utf8.parse(JSON.stringify(json))
}

const defaultHeader = {
  alg: 'HS256',
  typ: 'JWT'
}

function createJWT (
  header = defaultHeader,
  payload = {
    id: 'ID'
  },
  secret = 'secretKey'
) {
  let token = ''

  // HEADER
  const encodedHeader = base64url(encodedJsonToString(header))

  // PAYLOAD
  const encodedPayload = base64url(encodedJsonToString(payload))

  token = `${encodedHeader}.${encodedPayload}`

  // SIGNATURE
  let signature = CryptoJS.HmacSHA256(token, secret)
  signature = base64url(signature)

  return `${token}.${signature}`
}

const TOOLBAR_BUTTONS_NORMAL = [
  'microphone',
  'camera',
  'closedcaptions',
  'desktop',
  // 'embedmeeting',
  'fullscreen',
  'fodeviceselection',
  'hangup',
  'profile',
  'chat',
  // 'recording',
  // 'livestreaming',
  'etherpad',
  // 'sharedvideo',
  'settings',
  'raisehand',
  'videoquality',
  'filmstrip',
  // 'invite',
  // 'feedback',
  'stats',
  'shortcuts',
  'tileview',
  // 'videobackgroundblur',
  'download',
  'help',
  'mute-everyone',
  'security'
  // 'custom1'
]

const TOOLBAR_BUTTONS_LEADER = [
  'microphone',
  'camera',
  'closedcaptions',
  'desktop',
  // 'embedmeeting',
  'fullscreen',
  'fodeviceselection',
  'hangup',
  'profile',
  'chat',
  'recording',
  // 'livestreaming',
  'etherpad',
  // 'sharedvideo',
  'settings',
  'raisehand',
  'videoquality',
  'filmstrip',
  // 'invite',
  // 'feedback',
  'stats',
  'shortcuts',
  'tileview',
  // 'videobackgroundblur',
  'download',
  'help',
  'mute-everyone',
  'security'
  // 'custom1'
]

Vue.prototype.defaultHeader = defaultHeader
Vue.prototype.createJWT = createJWT
Vue.prototype.TOOLBAR_BUTTONS_NORMAL = TOOLBAR_BUTTONS_NORMAL
Vue.prototype.TOOLBAR_BUTTONS_LEADER = TOOLBAR_BUTTONS_LEADER
