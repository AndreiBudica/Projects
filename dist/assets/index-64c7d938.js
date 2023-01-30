(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))o(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const c of t.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&o(c)}).observe(document,{childList:!0,subtree:!0});function i(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?t.credentials="include":e.crossorigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function o(e){if(e.ep)return;e.ep=!0;const t=i(e);fetch(e.href,t)}})();function U(d,a){const i=`https://api.open-meteo.com/v1/forecast?latitude=${d}&longitude=${a}&hourly=temperature_2m,apparent_temperature,precipitation,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum&current_weather=true&timeformat=unixtime&timezone=auto`;return fetch(i).then(o=>o.json()).catch(o=>{})}const C=new Map;g([0],"sun-solid.svg");g([1,2,3],"cloud-sun-solid.svg");g([45,48,51,53,55,56,57],"smog-solid.svg");g([61,63,65,66,67,80,81,81,96,99],"cloud-showers-heavy-solid.svg");g([71,73,75,77,85,86],"snowflake-solid.svg");function g(d,a){d.forEach(i=>{C.set(i,a)})}window.addEventListener("load",()=>{const d=document.getElementById("map"),a=document.querySelector(".current-location"),i=document.querySelector(".daily-div"),o=["SUN","MON","TUE","WED","THR","FRI","SAT"];navigator.geolocation&&navigator.geolocation.getCurrentPosition(e=>{let t=L.map(d).setView([0,0],13);const{latitude:c}=e.coords,{longitude:P}=e.coords,x=[c,P];t.setView(x,7),L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(t),t.on("click",function(D){const{lat:l,lng:p}=D.latlng;let w=L.popup({className:"current-popup",autoPan:!1}),E=L.marker([l,p]).addTo(t).bindPopup(w).openPopup(),f=document.createElement("div");f.classList.add("popupDiv");function H(){return new Promise((u,h)=>{fetch(`https://api.opencagedata.com/geocode/v1/json?q=${l}+${p}&key=031bb5bcf3c54b27aec2b960f5baf307`).then(n=>n.json()).then(n=>{let _=n.results[0].formatted.split(",")[0],m=n.results[0].components.country_code?n.results[0].components.country_code.toUpperCase():"",b=n.results[0].annotations.flag?n.results[0].annotations.flag:"no flag for this location",y=`${_}, ${m} ${b}`,v=document.createElement("div");v.innerHTML=y,u(v)}).catch(n=>{h(n)})})}function M(){return new Promise((u,h)=>{U(l,p).then(({current_weather:n,daily:r})=>{let _=n.temperature,m=document.createElement("div");m.innerHTML=`${_}°C`,m.classList.add("temp-div");const b=n.weathercode,y=C.get(b)||"default-icon.svg",v=new Date,O=o[v.getDay()],N=v.getDay();a.innerHTML=`
                <div class="current-left">
                      <h1 class="today-name">${O}</h1>
                      <img
                        class="weather-icon large"
                        src="svgs/${y}"
                        data-current-${y}
                      />
                      <div class="current-temp"><span data-current-temp>${n.temperature}</span>&deg;</div>
                 </div>

                 <div class="current-right">
                       <div class="info-group">
                       <div class="label">High</div>
                       <div><span data-current-high>${r.temperature_2m_max[0]}</span>&deg</div>
                 </div>

                 <div class="info-group">
                        <div class="label">FL High</div>
                        <div><span data-current-fl-high>${r.apparent_temperature_max[0]}</span>&deg</div>
                 </div>

                 <div class="info-group">
                   <div class="label">Wind</div>
                   <div>
                    <span data-current-wind>${n.windspeed}</span>
                    <span class="value-sub-info"> km/h</span>
                   </div>
                 </div>

                 <div class="info-group">
                    <div class="label">Low</div>
                    <div><span data-current-low>${r.temperature_2m_min[0]}</span>&deg</div>
                 </div>

                <div class="info-group">
                    <div class="label">FL Low</div>
                    <div><span data-current-fl-low>${r.apparent_temperature_min[0]}</span>&deg</div>
                </div>

                <div class="info-group">
                    <div class="label">Precip</div>
                    <div>
                      <span data-current-precip>${r.precipitation_sum[0]}</span
                      ><span class="value-sub-info"> ml</span>
                    </div>
                </div>`,t.flyTo([l,p],6);const{precipitation_sum:A,temperature_2m_max:T,temperature_2m_min:I,weathercode:S}=r;console.log(r),i.innerHTML="";for(let s=1;s<T.length;s++){let $=document.createElement("div");$.classList.add("day");let W=(s+N)%o.length,j=o[W],q=S[s],F=C.get(q);$.innerHTML=`
                  <div class = 'daily-left'>
                     <h3>${j}</h3> 
                    <img class="weather-icon" src="svgs/${F}"/>
                  </div>
                  <div class="daily-right">
                    <div class="daily-info">
                      <div class="label">Max</div>
                      <div class="daily-temp"><span data-daily-temp>${T[s]}</span>&deg</div>
                    </div>
                    <div class="daily-info">
                      <div class="label">Min</div>
                      <div class="daily-temp"><span data-daily-temp>${I[s]}</span>&deg</div>
                    </div>
                    <div class="daily-info">
                      <div class="">Precip</div>
                      <div class="daily-temp"><span data-daily-temp>${A[s]}</span>ml</div>
                    </div>
                  </div>

                      `,i.appendChild($)}u(m)}).catch(n=>{i.innerHTML="",a.innerHTML="We could not get the weather for this location"})})}function k(){const u=M(),h=H();Promise.all([u,h]).then(n=>{f.appendChild(n[0]),f.appendChild(n[1]),w.setContent(f),w.update()})}k(),E.on("click",function(){t.flyTo([l,p],6),M()})})},e=>{console.log(e),map.setView([0,0],13),alert("Could not get your location")})});
