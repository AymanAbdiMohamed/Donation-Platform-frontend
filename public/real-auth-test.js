// Real authentication test - simulates actual user interaction
console.log('🎯 Starting real authentication test...');

// Helper function to wait for elements
function waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const element = document.querySelector(selector);
        if (element) {
            resolve(element);
            return;
        }

        const observer = new MutationObserver(() => {
            const element = document.querySelector(selector);
            if (element) {
                observer.disconnect();
                resolve(element);
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        setTimeout(() => {
            observer.disconnect();
            reject(new Error(`Element ${selector} not found within ${timeout}ms`));
        }, timeout);
    });
}

// Helper function to fill form and submit
async function testRealLogin() {
    console.log('🔐 Testing real login form...');
    
    try {
        // Wait for the form to load
        await waitForElement('form');
        console.log('✅ Login form found');
        
        // Find email input
        const emailInput = await waitForElement('input[type="email"]');
        console.log('✅ Email input found');
        
        // Find password input  
        const passwordInput = await waitForElement('input[type="password"]');
        console.log('✅ Password input found');
        
        // Find submit button
        const submitButton = await waitForElement('button[type="submit"]');
        console.log('✅ Submit button found');
        
        // Clear and fill inputs
        emailInput.value = '';
        passwordInput.value = '';
        emailInput.value = 'test@example.com';
        passwordInput.value = 'password123';
        
        // Trigger input events
        emailInput.dispatchEvent(new Event('input', { bubbles: true }));
        passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
        
        console.log('📝 Form filled with test credentials');
        console.log('📧 Email:', emailInput.value);
        console.log('🔒 Password:', passwordInput.value);
        
        // Monitor for navigation changes
        let navigationHappened = false;
        const originalLocation = window.location.pathname;
        console.log('🗺️ Current location:', originalLocation);
        
        // Set up navigation monitoring
        const checkNavigation = setInterval(() => {
            if (window.location.pathname !== originalLocation) {
                navigationHappened = true;
                console.log('🔄 Navigation detected!');
                console.log('📍 New location:', window.location.pathname);
                clearInterval(checkNavigation);
            }
        }, 100);
        
        // Monitor for loading states
        const checkLoading = setInterval(() => {
            const loadingElement = document.querySelector('[data-loading="true"], .loading, .spinner');
            if (loadingElement) {
                console.log('⏳ Loading state detected');
            }
        }, 100);
        
        // Submit the form
        console.log('🚀 Submitting form...');
        submitButton.click();
        
        // Wait for either navigation or error
        await new Promise((resolve) => {
            let timeoutId = setTimeout(() => {
                clearInterval(checkNavigation);
                clearInterval(checkLoading);
                resolve();
            }, 10000); // 10 second timeout
            
            const originalInterval = setInterval(() => {
                if (navigationHappened) {
                    clearTimeout(timeoutId);
                    clearInterval(originalInterval);
                    clearInterval(checkLoading);
                    resolve();
                }
            }, 100);
        });
        
        // Check results
        if (navigationHappened) {
            console.log('🎉 SUCCESS! Form submitted and navigation occurred');
            console.log('🎯 Final location:', window.location.pathname);
            
            // Check if we're on a dashboard page
            if (window.location.pathname.includes('/donor') || 
                window.location.pathname.includes('/charity') || 
                window.location.pathname.includes('/admin')) {
                console.log('✅ Successfully redirected to dashboard!');
                return { success: true, redirected: true, location: window.location.pathname };
            }
        } else {
            console.log('❌ No navigation occurred within timeout');
            
            // Check for any error messages
            const errorElement = document.querySelector('.error, [role="alert"], .text-red, .text-danger');
            if (errorElement) {
                console.log('🚨 Error message found:', errorElement.textContent);
                return { success: false, error: errorElement.textContent };
            } else {
                console.log('🤔 No error message found, form may be stuck');
                return { success: false, error: 'Form submitted but no response' };
            }
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        return { success: false, error: error.message };
    }
}

// Auto-run test if we're on login page
if (window.location.pathname.includes('/login')) {
    console.log('🎯 On login page, running test in 2 seconds...');
    setTimeout(() => {
        testRealLogin().then(result => {
            console.log('📊 Test result:', result);
            if (result.success) {
                console.log('🎉🎉🎉 AUTHENTICATION WORKING! 🎉🎉🎉');
            } else {
                console.log('💥💥💥 AUTHENTICATION BROKEN! 💥💥💥');
            }
        });
    }, 2000);
}

// Make function globally available
window.testRealLogin = testRealLogin;
console.log('🛠️ Real auth test loaded. Call window.testRealLogin() manually or wait for auto-test.');