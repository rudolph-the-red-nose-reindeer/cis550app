 import React, { useState } from 'react';
//import onClickOutside from 'react-onclickoutside';
import 'bootstrap/dist/css/bootstrap.min.css';



function Dropdown({ title, multiSelect = false }) {
  const [open, setOpen] = useState(false);
  const [selection, setSelection] = useState([]);
  const toggle = () => setOpen(!open);
  const items = [
  	{id: 1, value:'Product stats'},{id:2, value:'Top products in a brand' },{id: 3, value:'Most reviewed brands' },
  	{id: 4, value:'Most expensive products per brand'},{id: 5, value:'Average rating and price in a brand'},
  	{id: 6, value:'Get related products'},
  ];
  Dropdown.handleClickOutside = () => setOpen(false);



  function handleOnClick(item) {
    if (!selection.some(current => current.id === item.id)) {
      if (!multiSelect) {
        setSelection([item]);
      } else if (multiSelect) {
        setSelection([...selection, item]);
      }
    } else {
      let selectionAfterRemoval = selection;
      selectionAfterRemoval = selectionAfterRemoval.filter(
        current => current.id !== item.id
      );
      setSelection([...selectionAfterRemoval]);
    }
  }

  function isItemInSelection(item) {
    if (selection.some(current => current.id === item.id)) {
      return true;
    }
    return false;
  }

  return (
    <div className="dd-wrapper">
      <div
        tabIndex={0}
        className="dd-header"
        role="button"
        onKeyPress={() => toggle(!open)}
        onClick={() => toggle(!open)}
      >
        <div className="dd-header__title">
          <p className="dd-header__title--bold">{title}</p>
        </div>
        <div className="dd-header__action">
          <p>{open ? 'Close' : 'Open'}</p>
        </div>
      </div>
      {open && (
        <ul className="dd-list">
          {items.map(item => (
            <li className="dd-list-item" key={item.id}>
              <button type="button" onClick={() => handleOnClick(item)}>
                <span>{item.value}</span>
                //need to add paths to pages and link them properly
                <span>{isItemInSelection(item) && <a  href={"/" + item}>{item.charAt(0).toUpperCase() + item.substring(1, item.length)}</a>}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}



export default Dropdown;
