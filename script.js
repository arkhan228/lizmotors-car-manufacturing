'use strict';

// Saving updated tree to localStorage
window.addEventListener('beforeunload', () => {
  localStorage.setItem('tree', JSON.stringify({ list: list.innerHTML }));
});

// Tree main list
const list = document.querySelector('.list');
const formContainerEl = document.querySelector('.form-container');
const formEl = document.querySelector('.form');

// Getting saved data from localStorage, if any
const savedList = JSON.parse(localStorage.getItem('tree'));
if (savedList) list.innerHTML = savedList.list;

// For transfering event from list event listener to form submition
let addEvent;

// Listening for element addition and deletion events
list.addEventListener('click', e => {
  addEvent = e;

  const clickedListItemElement = e.target.closest('.list-item');

  // If addition even, desplay form
  if (e.target.closest('.add-elements')) {
    document.querySelector('.form-container').style.display = 'block';
    return;
  }

  // If deletion event, delete element
  if (e.target.closest('.btn-delete'))
    if (e.target.closest('.list').children.length === 1)
      e.target.closest('.list').remove();
    else clickedListItemElement.remove();
});

// Listening for form submition
formEl.addEventListener('submit', formSubmit);

// Form submition callback function
function formSubmit(e) {
  e.preventDefault();
  const formData = [...new FormData(formEl)];
  const data = Object.fromEntries(formData);

  formEl.reset();
  formContainerEl.style.display = 'none';

  if (!data.title) return alert('Invalid form data! Please try again.');

  addElement(addEvent, data);
}

// Adding element upon form submition based on selection (sibling or child)
function addElement(e, data) {
  // Main branch of the tree where element will be added
  const parent = e.target.closest('.parent').classList[0];

  // Markup for sibling element
  const sibling = /* HTML */ ` <li class="list-item">
    <div class="list-item-box">
      <button type="button" class="btn-delete">&minus;</button>
      <a href="#${parent}">${data.title}</a>
      <p class="description">
        <strong>${data.title}</strong> <br />
        ${data.details}
      </p>
      <button type="button" class="btn-add">
        &plus;
        <div class="add-elements">
          <span class="add-sibling">sibling</span>
          <span class="add-child">child</span>
        </div>
      </button>
    </div>
  </li>`;

  // Markup for child element
  const child = /* HTML */ ` <ul class="list">
    <li class="list-item">
      <div class="list-item-box">
        <button type="button" class="btn-delete">&minus;</button>
        <a href="#${parent}">${data.title}</a>
        <p class="description">
          <strong>${data.title}</strong> <br />
          ${data.details}
        </p>
        <button type="button" class="btn-add">
          &plus;
          <div class="add-elements">
            <span class="add-sibling">sibling</span>
            <span class="add-child">child</span>
          </div>
        </button>
      </div>
    </li>
  </ul>`;

  // The list item that was clicked
  const clickedListItemElement = e.target.closest('.list-item');

  // Adding sibling to the tree as sibling selection is made
  if (e.target.classList.contains('add-sibling')) {
    e.target.closest('.list').insertAdjacentHTML('beforeend', sibling);
  }

  // Adding child to the tree as child selection is made
  if (e.target.classList.contains('add-child')) {
    // Checking if selected list item item already has a child list
    const clickedLIChildren = clickedListItemElement.children;
    const clickedElChildList = clickedLIChildren[clickedLIChildren.length - 1];

    // Child list, if alredy existed. (otherwise, just a div)
    const childListExists = clickedElChildList.classList.contains('list');

    // If it was indeed a list, remove it
    if (childListExists) clickedElChildList.remove();

    // Adding the new child element
    e.target.closest('.list-item-box').insertAdjacentHTML('afterend', child);

    // Push the removed list as the child of new element, if existed
    if (childListExists)
      clickedLIChildren[clickedLIChildren.length - 1].children[0].appendChild(
        clickedElChildList
      );
  }
}

// For resetting tree to original state
if (!localStorage.getItem('originalTree'))
  localStorage.setItem(
    'originalTree',
    JSON.stringify({ list: list.innerHTML })
  );
function resetTree() {
  const confirmation = confirm(
    'Are you sure you want to reset the tree to original state?'
  );
  if (!confirmation) return;

  localStorage.getItem('originalTree');
  list.innerHTML = JSON.parse(localStorage.getItem('originalTree')).list;
}
const btnReset = document.querySelector('.btn-reset');
btnReset.addEventListener('click', resetTree);
