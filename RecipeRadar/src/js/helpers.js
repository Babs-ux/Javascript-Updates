import { async } from 'regenerator-runtime'; // Importing async functionality
import { TIMEOUT_SEC } from './config.js'; // Importing timeout constant

const timeout = function (s) {  
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const getJSOn = async function(url) {
    try{
    const fetchPromise = fetch(url);   
    const res = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
    } catch (err) {
        throw err; // Propagate the error
    }
}