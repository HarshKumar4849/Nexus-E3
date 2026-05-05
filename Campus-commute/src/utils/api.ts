// FILE: src/utils/api.ts

/**
 * FIXED: Global 401 Interceptor (BUG 1)
 * This global fetch wrapper intercepts all responses.
 * If a 401 Unauthorized is detected (indicating cookie expiration),
 * it forcefully triggers the logout routine unless the user is already on the login page.
 */

let isInterceptorSetup = false;

export const setupFetchInterceptor = (logout: () => void, toast: any) => {
  if (isInterceptorSetup) return;
  isInterceptorSetup = true;

  const originalFetch = window.fetch;

  window.fetch = async (...args) => {
    const url = typeof args[0] === 'string' ? args[0] : (args[0] instanceof Request ? args[0].url : '');
    
    // Perform original fetch
    const response = await originalFetch(...args);

    // Skip interception for auth endpoints themselves to prevent infinite loops
    const isAuthEndpoint = url.includes('/login') || url.includes('/register') || url.includes('/google-login') || url.includes('/send-otp') || url.includes('/verify-otp') || url.includes('/logout');
    const isAuthPage = window.location.pathname === '/' || window.location.pathname.includes('/login');

    if (response.status === 401 && !isAuthEndpoint && !isAuthPage) {
      // Show toast message
      if (toast) {
        toast({
          title: "Session Expired",
          description: "Your session has expired. Please log in again.",
          variant: "destructive",
          duration: 5000,
        });
      }
      
      // Call AuthContext logout function which will also redirect
      logout();
      
      // Ensure redirect to login
      if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
         window.location.href = '/login';
      }
    }

    return response;
  };
};
