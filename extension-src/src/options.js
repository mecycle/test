// Saves options to chrome.storage
function save_options() {
    //chrome.runtime.reload();

    var source = document.getElementById('csvSource').value;
    chrome.storage.sync.set({csvSource : source}, function() {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        setTimeout(function(){ status.textContent = '';
        }, 3000);
        status.textContent = 'Options saved.';
        // chrome.tabs.reload(activeTab.tabId);

        // chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        //     chrome.tabs.reload(tabs[0].id);
        // });
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    // Use default value = 'local'
    chrome.storage.sync.get({
        csvSource : "local",
    }, function(items) {
        document.getElementById('csvSource').value = items.csvSource;
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
    