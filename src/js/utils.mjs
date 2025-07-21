// // // wrapper for querySelector...returns matching element
// // export function qs(selector, parent = document) {
// //   return parent.querySelector(selector);
// // }
// // // or a more concise version if you are into that sort of thing:
// // // export const qs = (selector, parent = document) => parent.querySelector(selector);

// // // retrieve data from localstorage
// // export function getLocalStorage(key) {
// //   return JSON.parse(localStorage.getItem(key));
// // }
// // // save data to local storage
// // export function setLocalStorage(key, data) {
// //   localStorage.setItem(key, JSON.stringify(data));
// // }
// // // set a listener for both touchend and click
// // export function setClick(selector, callback) {
// //   qs(selector).addEventListener("touchend", (event) => {
// //     event.preventDefault();
// //     callback();
// //   });
// //   qs(selector).addEventListener("click", callback);
// // }


// // export function getParam(param) {
// //   const queryString = window.location.search;
// //   const urlParams = new URLSearchParams(queryString);
// //   return urlParams.get(param);
// // }









// // utils.mjs
// export function qs(selector, parent = document) {
//   try {
//     return parent.querySelector(selector);
//   } catch (err) {
//     console.error("Selector invalid or parent not found:", selector);
//     return null;
//   }
// }

// export function getLocalStorage(key) {
//   try {
//     const data = localStorage.getItem(key);
//     return data ? JSON.parse(data) : [];
//   } catch (err) {
//     console.error("Error reading localStorage:", err);
//     return [];
//   }
// }

// export function setLocalStorage(key, data) {
//   try {
//     localStorage.setItem(key, JSON.stringify(data));
//   } catch (err) {
//     console.error("Error saving to localStorage:", err);
//   }
// }

// export function setClick(selector, callback) {
//   const element = qs(selector);
//   if (!element) {
//     console.error("Element not found:", selector);
//     return;
//   }
  
//   const handleInteraction = (event) => {
//     if (event.type === "touchend") event.preventDefault();
//     callback();
//   };

//   element.addEventListener("click", handleInteraction);
//   element.addEventListener("touchend", handleInteraction);
// }

// export function getParam(param) {
//   const queryString = window.location.search;
//   const urlParams = new URLSearchParams(queryString);
//   return urlParams.get(param);
// }











export function qs(selector, parent = document) {
  try {
    return parent.querySelector(selector);
  } catch (err) {
    console.error("Selector invalid or parent not found:", selector);
    return null;
  }
}

export function getLocalStorage(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Error reading localStorage:", err);
    return [];
  }
}

export function setLocalStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error("Error saving to localStorage:", err);
  }
}

export function setClick(selector, callback) {
  const element = qs(selector);
  if (!element) {
    console.error("Element not found:", selector);
    return;
  }

  const handleInteraction = (event) => {
    if (event.type === "touchend") event.preventDefault();
    callback();
  };

  element.addEventListener("click", handleInteraction);
  element.addEventListener("touchend", handleInteraction);
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}
