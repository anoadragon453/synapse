function sortDocumentationVersions(versions) {
    // Sort the array of documentation versions

    // Sort in reverse-alphabetical order so that v1.50 comes before v1.49.
    // TODO: This will break if we release v1.100+
    versions.sort();
    versions.reverse();

    // Move the "latest" and "develop" versions to the front of the array
    if (versions.includes("develop")) {
        versions.pop("develop");
    }
    if (versions.includes("latest")) {
        versions.pop("latest");
    }
    versions.unshift("develop");
    versions.unshift("latest");

    // Return the sorted versions
    return versions;
}

// Get async working pls
async function downloadAndSortVersions() {
    // Download all known doc versions.
    let versionJson;
    try {
        const res = await fetch("/versions.json", {
            cache: "force-cache",
        });

        versionJson = await res.json();
    } catch (error) {
        console.error("Failed to fetch version data", error);
    }

    if (! "versions" in versionJson) {
        console.error("Failed to find docs version information in downloaded version json")
        return null;
    }

    // Sort and return known doc versions
    const sortedVersions = sortDocumentationVersions(versionJson.versions);

    return sortedVersions;
}

async function createVersionPicker() {
    // Download the list of all available versions
    const versions = await downloadAndSortVersions();
    if (versions == null) {
        // The list of versions is not available.
        // Don't display the version picker.
        return;
    }

    // Get the current version of the docs.
    // SYNAPSE_DOCS_VERSION is set by the 'current-version.js' script generated
    // in the CI, and loaded and executed by mdbook.
    const currentVersion = window.SYNAPSE_DOCS_VERSION || 'develop';

    // Create the version picker UI

    // Insert a version span into the chapter title sidebar
    const scrollbox = document.querySelector(".sidebar-scrollbox");
    scrollbox.innerHTML = `
        <div class="version-box">
            <span>Select Synapse version: </span>
        </div>${scrollbox.innerHTML}`;

    // Create a dropdown box and add it to the sidebar
    const selectElement = document.createElement("select");
    document.querySelector(".version-box").appendChild(selectElement);

    // Create a dropdown option for each known doc version
    for (const version of versions) {
        const option = document.createElement("option");
        option.innerHTML = version;
        selectElement.add(option);

        // Select the current version of the docs
        if (currentVersion === version) {
            option.setAttribute('selected', '');
        }
    }

    // Add a listener for a version being chosen
    selectElement.addEventListener('change', (event) => {
        // Update the current URL to the chosen version.
        const versionlessPath = window.location.pathname.split('/').slice(2).join('/');
        window.location = `${window.location.origin}/${event.target.value}/${versionlessPath}`;
    });
}

(function() {
    window.addEventListener("load", async () => {
        await createVersionPicker();
    });
})();
