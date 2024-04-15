/**
 * Get extentions.
 */
export async function get_extensions() {
  const excluded_ids = await get_excluded_extention_ids();

  return (await get_all_extensions()).filter(is_target);

  // Check if the app is a target.
  function is_target(app) {
    return !excluded_ids.includes(app.id);
  }
}

/**
 * Get all extensions.
 */
export async function get_all_extensions() {
  const own_id = chrome.runtime.id;

  return (await get_apps()).filter(is_target).sort(compare_name);

  // Check if the app is a target.
  function is_target(app) {
    return app.type === "extension" && app.id !== own_id;
  }

  // Comparator which uses `.name` property.
  function compare_name(e1, e2) {
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
export async function get_excluded_extention_ids() {
  const KEY = "extensionsExcluded";
  const result = await get_storage(KEY);
  return result[KEY] || [];
}

/**
 * Get the apps using the Chrome API.
 */
async function get_apps() {
  return new Promise((resolve) => {
    chrome.management.getAll((apps) => {
      resolve(apps);
    });
  });
}

/**
 * Get a storage value.
 */
async function get_storage(key) {
  return new Promise((resolve) => {
    chrome.storage.sync.get(key, (result) => {
      resolve(result);
    });
  });
}

/**
 * Get an extension info.
 */
async function get_extension(id) {
  return new Promise((resolve) => {
    chrome.management.get(id, (app) => {
      resolve(app);
    });
  });
}

/**
 * Switch the state of an extension.
 */
export async function switch_extension(app) {
  return new Promise((resolve) => {
    chrome.management.setEnabled(app.id, !app.enabled, () => {
      resolve();
    });
  });
}

/**
 * Switch the excluded setting of an extension.
 */
export async function switch_excluded_status(id, excludedIds) {
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
export function get_icon_url(extension) {
  const icons = extension.icons;

  if (icons.length > 0) {
    let [icon] = [...icons].reverse();
    return icon.url;
  }

  return null;
}

/**
 * Get the extension name for display.
 */
export function get_name_display(extension, max) {
  let name = extension.name;
  return name.length > max ? name.slice(0, max) + "..." : name;
}
