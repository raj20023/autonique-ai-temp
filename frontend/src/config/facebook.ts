// Centralized Facebook OAuth configuration
export const FACEBOOK_CONFIG = {
  // OAuth Permissions - Keep this in sync with backend
  OAUTH_SCOPE: 'pages_messaging,instagram_basic,instagram_manage_messages,pages_show_list,business_management,pages_manage_metadata',
  
  // API Version
  API_VERSION: 'v18.0',
  
  // OAuth Parameters
  OAUTH_PARAMS: {
    response_type: 'code',
    auth_type: 'rerequest',
    display: 'popup'
  },
  
  // Required Permissions List
  REQUIRED_PERMISSIONS: [
    'pages_messaging',
    'instagram_basic',
    'instagram_manage_messages',
    'pages_show_list',
    'business_management',
    'pages_manage_metadata'
  ],
  
  // Permission Descriptions
  PERMISSION_DESCRIPTIONS: {
    'pages_messaging': 'Send messages to your pages',
    'instagram_basic': 'Access basic Instagram info',
    'instagram_manage_messages': 'Manage Instagram messages',
    'pages_show_list': 'Access your Facebook pages list',
    'business_management': 'Manage business assets',
    'pages_manage_metadata': 'Manage page metadata and Instagram Business account access'
  }
} as const;

// Helper function to build OAuth URL
export const buildFacebookOAuthUrl = (redirectUri: string): string => {
  // Hardcoded values since Railway env vars aren't working properly
  const appId = '2032087817551720';



  const params = new URLSearchParams({
    client_id: appId,
    redirect_uri: redirectUri,
    scope: FACEBOOK_CONFIG.OAUTH_SCOPE,
    ...FACEBOOK_CONFIG.OAUTH_PARAMS
  });

  const url = `https://www.facebook.com/${FACEBOOK_CONFIG.API_VERSION}/dialog/oauth?${params.toString()}`;

  return url;
};

// Helper function to get redirect URI
export const getRedirectUri = (): string => {
  // Hardcoded since Railway env vars aren't working properly
  const frontendUrl = 'https://autonique.in';
  return `${frontendUrl}/auth/callback`;
};
