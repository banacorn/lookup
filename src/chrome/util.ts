import * as Promise from 'bluebird'

export function fetch(word: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://en.wiktionary.org/w/index.php?title=' + word + '&printable=yes', true);
        xhr.addEventListener('load', (e) => {
            if (xhr.status === 200) {
                resolve(xhr.responseText);
            } else {
                reject(new Error(xhr.statusText));
            }
        });
        xhr.addEventListener('error', (e) => {
                reject(new Error(`Network Error`));
        });
        xhr.send();
    });
}
