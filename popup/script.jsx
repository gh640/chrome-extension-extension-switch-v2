import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";

import "./style.css";
import {
  get_extensions,
  switch_extension,
  get_icon_url,
  get_name_display,
} from "../utils.js";

const NAME_MAX_SIZE = 30;

const App = () => {
  let [extensions, setExtensions] = useState([]);
  const extensionsEnabled = extensions.filter((e) => e.enabled);
  const extensionsDisabled = extensions.filter((e) => !e.enabled);

  const refresh = async () => {
    setExtensions(await get_extensions());
  };

  const handleClick = (extension) => {
    return async (_event) => {
      await switch_extension(extension);
      await refresh();
    };
  };

  const Items = ({ extensions }) => (
    <>
      {extensions.map((e) => (
        <Item extension={e} onClick={handleClick(e)} />
      ))}
    </>
  );

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div>
      <section className="section">
        <input type="text" placeholder="Search" className="search" />
      </section>

      <section className="section">
        <h1 className="heading">Enabled</h1>
        <div className="extensions-enabled">
          <Items extensions={extensionsEnabled} />
        </div>
      </section>

      <section className="section">
        <h1 className="heading">Disabled</h1>
        <div className="extensions-disabled">
          <Items extensions={extensionsDisabled} />
        </div>
      </section>
    </div>
  );
};

const Item = ({ extension, onClick }) => {
  const url = get_icon_url(extension);
  const name = get_name_display(extension, NAME_MAX_SIZE);

  return (
    <a key={extension.name} onClick={onClick} className="extension">
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
    </a>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
