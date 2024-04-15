import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";

import "./style.css";
import {
  getAllExtensions,
  getIconUrl,
  getNameDisplay,
  getExcludedExtensionIds,
  switchExcludedStatus,
} from "../utils.js";

const NAME_MAX_SIZE = 30;

const App = () => {
  let [extensions, setExtensions] = useState([]);
  let [excludedIds, setExcludedIds] = useState([]);

  const refresh = async () => {
    await Promise.all([
      (async () => setExtensions(await getAllExtensions()))(),
      (async () => setExcludedIds(await getExcludedExtensionIds()))(),
    ]);
  };

  const handleClick = (extension, excludedIds) => {
    return async (_event) => {
      await switchExcludedStatus(extension.id, excludedIds);
      await refresh();
    };
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div>
      <h1 class="heading">Excluded extensions</h1>
      <div class="description">
        Extensions checked here are excluded from the list of switches.
      </div>
      <div>
        {extensions.map((e) => (
          <Item
            extension={e}
            excluded={excludedIds.includes(e.id)}
            onClick={handleClick(e, excludedIds)}
          />
        ))}
      </div>
    </div>
  );
};

const Item = ({ extension, excluded, onClick }) => {
  const url = getIconUrl(extension);
  const name = getNameDisplay(extension, NAME_MAX_SIZE);

  return (
    <label key={extension.name} className="extension">
      <input type="checkbox" checked={excluded} onClick={onClick} />
      {url ? (
        <img
          src={url}
          alt={extension.name}
          width="14"
          height="14"
          className="extension-image"
        />
      ) : null}
      <span>{name}</span>
    </label>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
