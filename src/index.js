import { fromEvent } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, switchMap, mergeMap, tap, filter } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax'

const URL = 'https://api.github.com/search/users?q=';

const search = document.getElementById('search');
const result = document.getElementById('result');

const stream$ = fromEvent(search, 'input')
    .pipe(
        map(event => event.target.value),
        debounceTime(1000),
        distinctUntilChanged(),
        tap( () => result.innerHTML = ''),
        filter( res => res.trim()),
        switchMap(req => ajax.getJSON(URL + req)),
        map(res => res.items),
        mergeMap(items => items)
    );

stream$.subscribe(user => {
    console.log(user);
    const HTML = `
            <div class="card">
                <div class="card-img"> 
                    <img src="${user.avatar_url}" />
                    <span class="card-title">${user.login}</span>
                </div>
                <div class="card-action">
                    <a href="${user.html_url}" target="_blank">Открыть GitHub</a>
                </div>
            </div>
    `
    result.insertAdjacentHTML('beforeend', HTML);
});

