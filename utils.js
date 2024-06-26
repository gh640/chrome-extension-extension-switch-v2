/**
 * Get extentions.
 */
export async function getExtensions() {
  const excludedIds = await getExcludedExtensionIds();

  return (await getAllExtensions()).filter(isTarget);

  // Check if the app is a target.
  function isTarget(app) {
    return !excludedIds.includes(app.id);
  }
}

/**
 * Get all extensions.
 */
export async function getAllExtensions() {
  const id = chrome.runtime.id;

  return (await getApps()).filter(isTarget).sort(compareName);

  // Check if the app is a target.
  function isTarget(app) {
    return app.type === "extension" && app.id !== id;
  }

  // Comparator which uses `.name` property.
  function compareName(e1, e2) {
    if (e1.name < e2.name) {
      return -1;
    } else if (e1.name > e2.name) {
      return 1;
    }

    return 0;
  }
}

/**
 * Get the excluded extension ids.
 */
export async function getExcludedExtensionIds() {
  const KEY = "extensionsExcluded";
  const result = await getStorage(KEY);
  return result[KEY] || [];
}

/**
 * Get the apps using the Chrome API.
 */
async function getApps() {
  return new Promise((resolve) => {
    chrome.management.getAll((apps) => {
      resolve(apps);
    });
  });
}

/**
 * Get a storage value.
 */
async function getStorage(key) {
  return new Promise((resolve) => {
    chrome.storage.sync.get(key, (result) => {
      resolve(result);
    });
  });
}

/**
 * Get an extension info.
 */
async function getExtension(id) {
  return new Promise((resolve) => {
    chrome.management.get(id, (app) => {
      resolve(app);
    });
  });
}

/**
 * Switch the state of an extension.
 */
export async function switchExtension(app) {
  return new Promise((resolve) => {
    chrome.management.setEnabled(app.id, !app.enabled, () => {
      resolve();
    });
  });
}

/**
 * Switch the excluded setting of an extension.
 */
export async function switchExcludedStatus(id, excludedIds) {
  return new Promise((resolve) => {
    const index = excludedIds.indexOf(id);

    if (index > -1) {
      excludedIds.splice(index, 1);
    } else {
      excludedIds.push(id);
    }

    const setting = {
      extensionsExcluded: excludedIds,
    };

    chrome.storage.sync.set(setting, () => {
      resolve();
    });
  });
}
/**
 * Get the extension icon url.
 */
export function getIconUrl(extension) {
  const icons = extension.icons;

  // `icons` can be undefined and should be checked.
  if (Array.isArray(icons)) {
    if (icons.length > 0) {
      let [icon] = [...icons].reverse();
      return icon.url;
    }
  }

  return null;
}

/**
 * Get the extension name for display.
 */
export function getNameDisplay(extension, max) {
  let name = extension.name;
  return name.length > max ? name.slice(0, max) + "..." : name;
}
