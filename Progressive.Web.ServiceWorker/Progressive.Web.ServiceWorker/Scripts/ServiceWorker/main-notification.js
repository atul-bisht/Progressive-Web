


var isSubscribed = false;
var serviceWorker;
var pushButton = document.getElementById('pushButton');
const applicationServerPublicKey = 'BC_DAz7kABsP6lu--NIirYaFZKdBc0OsLYDq1JVnu36K8AGkHTZIc0-7yC91Q_1LwQgJmw-ywxNc9KfvsQa5Ee0';

if ('PushManager' in window)
    console.log('Service Worker Push is supported');

if ('serviceWorker' in navigator && 'PushManager' in window) {
    console.log('Service Worker is supported');
    navigator.serviceWorker.register('../../push-worker.js')
    .then(function (registration) {
        serviceWorker = registration;
        initializeUI();
        console.log('Registration successful, scope is:', registration.scope);
    })
    .catch(function (error) {
        console.log('Service worker registration failed, error:', error);
    });
} else {
    console.log('Push Notification not supported, error:', error);
}


function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

function initializeUI() {

    pushButton.addEventListener('click', function () {
        pushButton.disabled = true;
        pushButton.value = 'Waiting for Service worker......';
        if (isSubscribed) {
            unsubscribeUser();
        } else {
            subscribeUser();
        }
    });

    // Set the initial subscription value
    serviceWorker.pushManager.getSubscription()
    .then(function (subscription) {
        isSubscribed = !(subscription === null);
        updateSubscriptionOnServer(subscription);
        if (isSubscribed) {
            console.log('User IS subscribed.');
        } else {
            console.log('User is NOT subscribed.');
        }

        updateBtn();
    });
}

function subscribeUser() {
    const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
    serviceWorker.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey
    })
    .then(function (subscription) {
        console.log('User is subscribed.');

        updateSubscriptionOnServer(subscription);

        isSubscribed = true;

        updateBtn();
    })
    .catch(function (err) {
        console.log('Failed to subscribe the user: ', err);
        updateBtn();
    });
}


function updateBtn() {
    if (Notification.permission === 'denied') {
        pushButton.textContent = 'Push Messaging Blocked.';
        pushButton.disabled = true;
        updateSubscriptionOnServer(null);
        return;
    }
    if (isSubscribed) {
        pushButton.value = 'Disable Push Messaging';
    } else {
        pushButton.value = 'Enable Push Messaging';
    }

    pushButton.disabled = false;
}

function unsubscribeUser() {
    serviceWorker.pushManager.getSubscription()
    .then(function (subscription) {
        if (subscription) {
            return subscription.unsubscribe();
        }
    })
    .catch(function (error) {
        console.log('Error unsubscribing', error);
    })
    .then(function () {
        updateSubscriptionOnServer(null);

        console.log('User is unsubscribed.');
        isSubscribed = false;

        updateBtn();
    });
}


function updateSubscriptionOnServer(subscription) {
    // TODO: Send subscription to application server

    const subscriptionJson = document.querySelector('.js-subscription-json');
    const subscriptionDetails =
      document.querySelector('.js-subscription-details');

    if (subscription) {
        subscriptionJson.textContent = JSON.stringify(subscription);
        //subscriptionDetails.classList.remove('is-invisible');
    } else {
        //subscriptionDetails.classList.add('is-invisible');
    }
}