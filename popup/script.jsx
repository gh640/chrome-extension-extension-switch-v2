import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";

import "./style.css";
import {
  getExtensions,
  switchExtension,
  getIconUrl,
  getNameDisplay,
} from "../utils.js";

const NAME_MAX_SIZE = 30;

const App = () => {
  let [searchWords, setSearchWords] = useState("");
  let [extensions, setExtensions] = useState([]);
  const extensionsEnabled = extensions.filter((e) => e.enabled);
  const extensionsDisabled = extensions.filter((e) => !e.enabled);

  const refresh = async () => {
    setExtensions(await getExtensions());
  };

  const handleClick = (extension) => {
    return async (_event) => {
      await switchExtension(extension);
      await refresh();
    };
  };

  const Items = ({ extensions }) => {
    let items;
    if (searchWords.length < 1) {
      items = extensions.map((e) => (
        <Item extension={e} onClick={handleClick(e)} />
      ));
    } else {
      items = extensions
        .filter(
          (e) =>
            e.name.toLowerCase().includes(searchWords) ||
            e.description.toLowerCase().includes(searchWords)
        )
        .map((e) => <Item extension={e} onClick={handleClick(e)} />);
    }

    return <>{items}</>;
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div>
      <section className="section">
        <input
          type="text"
          placeholder="Search"
          className="search"
          onChange={(e) => setSearchWords(e.target.value.toLocaleLowerCase())}
        />
      </section>

      <section className="section">
        <h1 className="heading">Enabled</h1>
        <div className="extensions extensions-enabled">
          <Items extensions={extensionsEnabled} />
        </div>
      </section>

      <section className="section">
        <h1 className="heading">Disabled</h1>
        <div className="extensions extensions-disabled">
          <Items extensions={extensionsDisabled} />
        </div>
      </section>
    </div>
  );
};

const Item = ({ extension, onClick }) => {
  const url = getIconUrl(extension);
  const name = getNameDisplay(extension, NAME_MAX_SIZE);

  return (
    <button key={extension.name} onClick={onClick} className="extension">
      {url ? (
        <img
          src={url}
          alt={extension.name}
          width="14"
          height="14"
          className="extension-image"
        />
      ) : null}
      <span className="extension-name">{name}</span>
    </button>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
