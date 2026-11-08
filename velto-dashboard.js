/* VELTO Dashboard v0.1 — native Home Assistant Lovelace custom card, no dependencies. */
class VeltoDashboard extends HTMLElement {
  constructor(){super();this.attachShadow({mode:'open'});this._config={};this._room='all';this._editLayout=false;this._activeOnly=false;this._hideTechnical=false;this._themeOverride=null;try{this._themeOverride=globalThis.localStorage?.getItem?.('velto:theme:override')||null}catch{}this._calendarCompact=false;this._calendarPrivate=true;try{const saved=globalThis.localStorage?.getItem?.('velto:calendar:private');if(saved!==null&&saved!==undefined)this._calendarPrivate=saved==='1'}catch{};this._sidebarToolsOpen=false;this._sidebarCollapsed=!!globalThis.matchMedia?.('(max-width: 600px)')?.matches;try{if(!this._sidebarCollapsed)this._sidebarCollapsed=globalThis.localStorage?.getItem?.('velto:sidebar:collapsed')==='1'}catch{}this._categoryFilter='all';this._hass=null;this._registry=null;this._registryLoading=false;this._registryLoadingConnection=null;this._registryRequest=0;this._registryConnection=null;this._registryFailedConnection=null;this._registryError=null;this._calendarEvents=[];this._calendarError=null;this._calendarLoading=false;this._calendarKey='';this._calendarTimer=null;this._clockTimer=null;this._dayTimer=null;this._visibilityListener=null;this._calendarLastChecked=null;this._calendarRequest=0;this._calendarConnection=null;this._weatherForecast=[];this._weatherForecastError=null;this._weatherForecastEntity=null;this._weatherForecastConnection=null;this._weatherForecastUnsub=null;this._weatherForecastPending=false;this._weatherForecastRequest=0;this._weatherForecastRetryAt=0;this._localLayoutOrder=null;this._localTileSizes=null;this._layoutStorageWarning=false;this._renderFrame=null;this._cancelRenderFrame=null;this._renderPending=false}
  layoutStorageKey(config=this._config){
    const scope=String(config?.layout_id||config?.title||'home').trim().toLowerCase().replace(/[^a-z0-9_-]+/g,'_').slice(0,80)||'home';
    const path=String(globalThis?.location?.pathname||'home-assistant').replace(/[^a-z0-9/_-]+/gi,'_').slice(0,120);
    return 'velto:layout:v1:'+path+':'+scope
  }
  layoutSizeStorageKey(config=this._config){return this.layoutStorageKey(config)+':sizes'}
  readLocalSizes(config=this._config){
    if(config?.layout_persistence==='config')return null;
    try{
      const raw=globalThis?.localStorage?.getItem?.(this.layoutSizeStorageKey(config));if(!raw)return null;
      const parsed=JSON.parse(raw);if(!parsed||typeof parsed!=='object'||Array.isArray(parsed))return null;
      const clean={};for(const [room,items] of Object.entries(parsed)){
        if(!items||typeof items!=='object'||Array.isArray(items))continue;
        const sizes={};for(const [id,size] of Object.entries(items))if(typeof id==='string'&&['small','medium','large'].includes(size))sizes[id]=size;
        if(Object.keys(sizes).length)clean[room]=sizes
      }
      this._layoutStorageWarning=false;return clean
    }catch(error){this._layoutStorageWarning=true;console.warn('VELTO local tile sizes unavailable',error);return null}
  }
  persistLocalSizes(sizes=this._config.tile_sizes){
    if(this._config?.layout_persistence==='config')return false;
    try{globalThis?.localStorage?.setItem?.(this.layoutSizeStorageKey(),JSON.stringify(sizes||{}));this._layoutStorageWarning=false;return true}
    catch(error){this._layoutStorageWarning=true;console.warn('VELTO local tile size save failed',error);return false}
  }
  readLocalLayout(config=this._config){
    if(config?.layout_persistence==='config')return null;
    try{
      const raw=globalThis?.localStorage?.getItem?.(this.layoutStorageKey(config));if(!raw)return null;
      const parsed=JSON.parse(raw);if(!parsed||typeof parsed!=='object'||Array.isArray(parsed))return null;
      const clean={};for(const [room,ids] of Object.entries(parsed))if(Array.isArray(ids))clean[room]=ids.filter(id=>typeof id==='string');
      this._layoutStorageWarning=false;return clean
    }catch(error){this._layoutStorageWarning=true;console.warn('VELTO local layout unavailable',error);return null}
  }
  persistLocalLayout(order=this._config.tile_order){
    if(this._config?.layout_persistence==='config')return false;
    try{globalThis?.localStorage?.setItem?.(this.layoutStorageKey(),JSON.stringify(order||{}));this._layoutStorageWarning=false;return true}
    catch(error){this._layoutStorageWarning=true;console.warn('VELTO local layout save failed',error);return false}
  }
  clearLocalLayout(){
    try{globalThis?.localStorage?.removeItem?.(this.layoutStorageKey());globalThis?.localStorage?.removeItem?.(this.layoutSizeStorageKey());this._layoutStorageWarning=false;return true}
    catch(error){this._layoutStorageWarning=true;console.warn('VELTO local layout reset failed',error);return false}
  }
  commitLayoutState(order,sizes,{persist=true,emit=true}={}){
    const cleanOrder={};for(const [room,ids] of Object.entries(order||{}))if(Array.isArray(ids)&&ids.length)cleanOrder[room]=[...new Set(ids.filter(id=>typeof id==='string'))];
    const cleanSizes={};for(const [room,items] of Object.entries(sizes||{})){
      if(!items||typeof items!=='object'||Array.isArray(items))continue;
      const roomSizes={};for(const [id,size] of Object.entries(items))if(typeof id==='string'&&['small','medium','large'].includes(size))roomSizes[id]=size;
      if(Object.keys(roomSizes).length)cleanSizes[room]=roomSizes
    }
    const config={...this._config,tile_order:cleanOrder,tile_sizes:cleanSizes};this._config=config;this._localLayoutOrder=cleanOrder;this._localTileSizes=cleanSizes;
    const mode=this._config.layout_persistence||'hybrid';
    if(persist&&mode!=='config'){this.persistLocalLayout(cleanOrder);this.persistLocalSizes(cleanSizes)}
    if(emit&&mode!=='local')this.dispatchEvent(new CustomEvent('config-changed',{detail:{config},bubbles:true,composed:true}));
    this.render()
  }
  applyLayoutOrder(order,options){this.commitLayoutState(order,this._config.tile_sizes,options)}
  applyTileSize(roomId,entityId,size){
    if(!roomId||!entityId||!['small','medium','large'].includes(size))return;
    const sizes={...(this._config.tile_sizes||{}),[roomId]:{...(this._config.tile_sizes?.[roomId]||{}),[entityId]:size}};
    this.commitLayoutState(this._config.tile_order,sizes)
  }
  resetLayout(roomId){
    const order={...(this._config.tile_order||{})},sizes={...(this._config.tile_sizes||{})};
    if(roomId&&roomId!=='all'){delete order[roomId];delete sizes[roomId]}else{for(const key of Object.keys(order))delete order[key];for(const key of Object.keys(sizes))delete sizes[key]}
    this.commitLayoutState(order,sizes)
  }
  setConfig(config){this.cancelScheduledRender();this._renderPending=false;if(!config||(!Array.isArray(config.rooms)&&!config.auto_areas))throw Error('VELTO: rooms must be an array, or enable auto_areas');
    const local=config.layout_persistence==='config'?null:this.readLocalLayout(config),localSizes=config.layout_persistence==='config'?null:this.readLocalSizes(config);
    const configured=config.tile_order&&typeof config.tile_order==='object'&&!Array.isArray(config.tile_order)?config.tile_order:{};
    const configuredSizes=config.tile_sizes&&typeof config.tile_sizes==='object'&&!Array.isArray(config.tile_sizes)?config.tile_sizes:{};
    this._localLayoutOrder=local;this._localTileSizes=localSizes;this._config={...config,tile_order:local?{...configured,...local}:configured,tile_sizes:localSizes?{...configuredSizes,...localSizes}:configuredSizes};this._lastSignature=null;this._registryRequest++;this._registryLoading=false;this._registryLoadingConnection=null;this._registry=null;this._registryConnection=null;this._registryFailedConnection=null;this._registryError=null;this._calendarKey='';this._calendarEvents=[];this._calendarError=null;this._calendarConnection=null;this._calendarRequest++;this.loadRegistry();this.loadCalendar();this.loadWeatherForecast();this.render()}
  set hass(value){
    const previousConnection=this._hass?.connection,nextConnection=value?.connection;
    this._hass=value;
    if(previousConnection!==nextConnection){this._calendarKey='';this._calendarConnection=null;this._calendarEvents=[];this._calendarError=null;this._calendarLastChecked=null;this._calendarRequest++;this._calendarLoading=false}
    this.loadRegistry();this.loadCalendar();this.loadWeatherForecast();
    const rooms=this.getRooms(),ids=new Set(rooms.flatMap(r=>(r.entities||[]).map(e=>typeof e==='string'?e:e.entity)));
    if(this._config.presence?.entity)ids.add(this._config.presence.entity);
    for(const id of Object.values(this._config.weather?.entities||{}))if(id)ids.add(id);
    const forecastWeatherId=this.weatherForecastEntity();if(forecastWeatherId)ids.add(forecastWeatherId);
    const signature=[this._room,this._config.theme==='auto'?String(value?.themes?.darkMode):'',rooms.map(r=>[r.id,r.name,(r.entities||[]).map(e=>typeof e==='string'?e:e.entity).join(',')].join(':')).join('|'),
      ...[...ids].sort().map(id=>{const s=value?.states?.[id],a=s?.attributes||{};return id+':'+(s?.state??'')+':'+[a.friendly_name,a.unit_of_measurement,a.device_class,a.entity_picture,a.media_image_url,a.media_title,a.media_artist,a.app_name,a.source,a.volume_level,a.media_duration,a.media_position,a.supported_features,Array.isArray(a.supported_color_modes)?a.supported_color_modes.join(','):a.supported_color_modes,a.brightness,a.percentage,a.temperature,a.current_temperature,a.hvac_action,a.current_position,a.battery_level,a.status].map(x=>x==null?'':String(x)).join('|')})].join(';');
    if(signature!==this._lastSignature){this._lastSignature=signature;this.scheduleRender()}
  }
  scheduleRender(){
    this._renderPending=true;
    if(this.isConnected===false)return;
    if(this.isConnected===true&&globalThis.document?.hidden===true)return;
    if(this.isConnected!==true){this._renderPending=false;this.render();return}
    if(this._renderFrame!==null)return;
    const flush=()=>{
      this._renderFrame=null;this._cancelRenderFrame=null;
      if(this.isConnected===false)return;
      if(this.isConnected===true&&globalThis.document?.hidden===true)return;
      this._renderPending=false;this.render()
    };
    if(typeof globalThis.requestAnimationFrame==='function'){
      const id=globalThis.requestAnimationFrame(flush);this._renderFrame=id;
      this._cancelRenderFrame=()=>globalThis.cancelAnimationFrame?.(id)
    }else{
      const id=setTimeout(flush,16);this._renderFrame=id;
      this._cancelRenderFrame=()=>clearTimeout(id)
    }
  }
  cancelScheduledRender(){
    if(this._renderFrame===null)return;
    this._cancelRenderFrame?.();this._renderFrame=null;this._cancelRenderFrame=null
  }
  scheduleDayRefresh(now=new Date()){
    if(this._dayTimer)clearTimeout(this._dayTimer);
    const next=new Date(now.getFullYear(),now.getMonth(),now.getDate()+1,0,0,1,0);
    const delay=Math.max(1000,next.getTime()-now.getTime());
    this._dayTimer=setTimeout(()=>{this._dayTimer=null;if(this.isConnected!==false){this.scheduleRender();this.scheduleDayRefresh()}},delay);
  }
  connectedCallback(){
    if(this._renderPending)this.scheduleRender();
    if(!this._dayTimer)this.scheduleDayRefresh();
    if(!this._fullscreenListener){
      this._fullscreenListener=()=>{
        if(document.fullscreenElement===this&&this._fullscreenFallback)this.exitFullscreenFallback();
        else this.updateFullscreenButton()
      };
      document.addEventListener('fullscreenchange',this._fullscreenListener);
    }
    if(!this._visibilityListener){
      this._visibilityListener=()=>{
        if(globalThis.document?.hidden)return;
        this.scheduleDayRefresh();
        this.scheduleRender();
        this.loadCalendar(true);this.loadWeatherForecast(true);
      };
      document.addEventListener('visibilitychange',this._visibilityListener);
    }
    if(!this._clockTimer)this._clockTimer=setInterval(()=>{const clock=this.shadowRoot?.querySelector('.velto-clock');if(clock){const now=new Date();clock.textContent=now.toLocaleTimeString('pl-PL',{hour:'2-digit',minute:'2-digit'});clock.dateTime=now.toISOString()}},30000);
    if(!this._calendarTimer)this._calendarTimer=setInterval(()=>{if(!globalThis.document?.hidden)this.loadCalendar(true)},120000);
    this.loadWeatherForecast();
    if(!this._weatherTimer)this._weatherTimer=setInterval(()=>this.loadWeatherForecast(true),1800000);
    if(!this._storageListener){
      this._storageListener=e=>{
        if(e?.key==='velto:theme:override'){
          const next=e.newValue==='dark'||e.newValue==='light'?e.newValue:null;
          if(next!==this._themeOverride){this._themeOverride=next;this.render()}
          return
        }
        if(this._config?.layout_persistence==='config'||![this.layoutStorageKey(),this.layoutSizeStorageKey()].includes(e?.key))return;
        const local=this.readLocalLayout()||{},localSizes=this.readLocalSizes()||{};
        const merged={...(this._config.tile_order||{}),...local},mergedSizes={...(this._config.tile_sizes||{}),...localSizes};
        if(JSON.stringify(merged)===JSON.stringify(this._config.tile_order||{})&&JSON.stringify(mergedSizes)===JSON.stringify(this._config.tile_sizes||{}))return;
        this._config={...this._config,tile_order:merged,tile_sizes:mergedSizes};this._localLayoutOrder=local;this._localTileSizes=localSizes;this.render()
      };
      globalThis?.addEventListener?.('storage',this._storageListener)
    }
  }
  disconnectedCallback(){
    this.cancelScheduledRender();
    this._weatherForecastRequest++;this._weatherForecastPending=false;this._weatherForecastRetryAt=0;
    if(this._calendarTimer){clearInterval(this._calendarTimer);this._calendarTimer=null}
    if(this._clockTimer){clearInterval(this._clockTimer);this._clockTimer=null}
    if(this._dayTimer){clearTimeout(this._dayTimer);this._dayTimer=null}
    if(this._weatherTimer){clearInterval(this._weatherTimer);this._weatherTimer=null}
    if(this._weatherForecastUnsub){try{this._weatherForecastUnsub()}catch{}this._weatherForecastUnsub=null}
    if(this._fullscreenListener){document.removeEventListener('fullscreenchange',this._fullscreenListener);this._fullscreenListener=null}
    if(this._fullscreenFallbackKeyListener){document.removeEventListener('keydown',this._fullscreenFallbackKeyListener);this._fullscreenFallbackKeyListener=null}
    this._fullscreenFallback=false;
    if(this._visibilityListener){document.removeEventListener('visibilitychange',this._visibilityListener);this._visibilityListener=null}
    if(this._storageListener){globalThis?.removeEventListener?.('storage',this._storageListener);this._storageListener=null}
    this._closeDetails?.()
  }
  moveTile(roomId,entityId,targetId){
    if(!roomId||!entityId||!targetId||entityId===targetId)return;
    const room=this.getRooms().find(r=>r.id===roomId);
    if(!room)return;
    const available=[...new Set((room.entities||[]).map(t=>typeof t==='string'?t:t?.entity).filter(Boolean))];
    const saved=Array.isArray(this._config.tile_order?.[roomId])?this._config.tile_order[roomId]:[];
    const ids=[...saved.filter(id=>available.includes(id)),...available.filter(id=>!saved.includes(id))];
    const from=ids.indexOf(entityId),to=ids.indexOf(targetId);
    if(from<0||to<0)return;
    ids.splice(from,1);ids.splice(to,0,entityId);
    this.applyLayoutOrder({...this._config.tile_order,[roomId]:ids})
  }
  updateFullscreenButton(){
    const button=this.shadowRoot?.querySelector?.('.velto-fullscreen');
    if(!button)return;
    const active=document.fullscreenElement===this||!!this._fullscreenFallback;
    button.replaceChildren(this.icon(active?'compress':'expand'));
    button.title=active?'Zamknij pełny ekran':'Pełny ekran';button.setAttribute('aria-label',button.title);
    button.setAttribute('aria-pressed',String(active));
  }
  enableFullscreenFallback(){
    this._fullscreenFallback=true;
    if(!this._fullscreenFallbackKeyListener){
      this._fullscreenFallbackKeyListener=e=>{
        if(e?.key!=='Escape'||this.shadowRoot?.querySelector?.('.velto-modal-backdrop'))return;
        e.preventDefault?.();this.exitFullscreenFallback()
      };
      document.addEventListener('keydown',this._fullscreenFallbackKeyListener)
    }
    this.render();this.updateFullscreenButton()
  }
  exitFullscreenFallback(){
    if(!this._fullscreenFallback)return;
    this._fullscreenFallback=false;
    if(this._fullscreenFallbackKeyListener){document.removeEventListener('keydown',this._fullscreenFallbackKeyListener);this._fullscreenFallbackKeyListener=null}
    this.render();this.updateFullscreenButton()
  }
  async toggleFullscreen(){
    if(this._fullscreenFallback){this.exitFullscreenFallback();return}
    try{
      if(document.fullscreenElement===this){
        if(typeof document.exitFullscreen!=='function')throw Error('Fullscreen exit API unavailable');
        await document.exitFullscreen();
      }else{
        // A different element may already own fullscreen (for example a media player).
        // Exit it first, then enter VELTO instead of silently stopping.
        if(document.fullscreenElement){
          if(typeof document.exitFullscreen!=='function')throw Error('Fullscreen exit API unavailable');
          await document.exitFullscreen();
        }
        if(typeof this.requestFullscreen==='function')await this.requestFullscreen();
        else throw Error('Fullscreen API unavailable');
      }
    }catch(error){
      console.warn('VELTO native fullscreen unavailable; enabling expanded mode',error);
      this.enableFullscreenFallback();
    }
    this.updateFullscreenButton()
  }
  wasteCollectionInfo(today=new Date()){
    const cfg=this._config.waste_collection||{};
    if(cfg.enabled!==true||!today||typeof today.getTime!=='function'||!Number.isFinite(today.getTime()))return null;
    const anchorText=typeof cfg.anchor_date==='string'?cfg.anchor_date:'2026-11-06';
    const match=anchorText.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if(!match)return null;
    const year=Number(match[1]),month=Number(match[2])-1,day=Number(match[3]);
    const anchor=new Date(year,month,day);
    if(anchor.getFullYear()!==year||anchor.getMonth()!==month||anchor.getDate()!==day||anchor.getDay()!==5)return null;
    const dayNumber=date=>Math.floor(Date.UTC(date.getFullYear(),date.getMonth(),date.getDate())/86400000);
    const anchorDay=dayNumber(anchor),current=new Date(today.getFullYear(),today.getMonth(),today.getDate()),currentDay=dayNumber(current);
    const offset=(5-current.getDay()+7)%7;
    let pickup=new Date(current);pickup.setDate(pickup.getDate()+offset);
    let pickupDay=dayNumber(pickup);
    if(pickupDay<anchorDay){pickup=new Date(anchor);pickupDay=anchorDay}
    const weeks=Math.floor((pickupDay-anchorDay)/7);
    const anchorType=cfg.anchor_type==='recycling'?'recycling':'mixed';
    const type=weeks%2===0?anchorType:(anchorType==='mixed'?'recycling':'mixed');
    return {date:pickup,days:pickupDay-currentDay,type,label:type==='mixed'?'Zmieszane':'Segregowane'};
  }
  weatherForecastEntity(){
    const explicit=this._config.weather?.forecast_entity||this._config.weather?.entity;
    if(typeof explicit==='string'&&explicit.startsWith('weather.')&&this._hass?.states?.[explicit])return explicit;
    const available=Object.keys(this._hass?.states||{}).filter(id=>id.startsWith('weather.')&&!['unknown','unavailable'].includes(this._hass.states[id]?.state));
    const daily=available.filter(id=>(Number(this._hass.states[id]?.attributes?.supported_features)||0)&1);
    if(daily.length===1)return daily[0];
    return available.length===1?available[0]:null
  }
  weatherForecastType(entity){
    const features=Number(this._hass?.states?.[entity]?.attributes?.supported_features)||0;
    if(features&1)return 'daily';
    if(features&4)return 'twice_daily';
    return 'daily'
  }
  weatherConditionLabel(condition){
    return ({'clear-night':'Bezchmurnie','cloudy':'Pochmurno','fog':'Mgła','hail':'Grad','lightning':'Burze','lightning-rainy':'Burze z deszczem','partlycloudy':'Częściowe zachmurzenie','pouring':'Ulewa','rainy':'Deszcz','snowy':'Śnieg','snowy-rainy':'Śnieg z deszczem','sunny':'Słonecznie','windy':'Wietrznie','windy-variant':'Wietrznie i pochmurno','exceptional':'Nietypowe warunki'})[condition]||condition||'Brak danych'
  }
  weatherConditionIcon(condition){
    const icons={'clear-night':'moon','cloudy':'weather','fog':'fog','hail':'hail','lightning':'lightning','lightning-rainy':'lightning-rainy','partlycloudy':'partlycloudy','pouring':'pouring','rainy':'rainy','snowy':'snowy','snowy-rainy':'snowy-rainy','sunny':'weather-sun','windy':'windy','windy-variant':'windy-variant','exceptional':'exceptional'};
    return this.icon(icons[condition]||'weather')
  }
  normalizeDailyForecast(items,type='daily'){
    if(!Array.isArray(items))return [];
    const valid=[];
    for(const raw of items){
      if(!raw||typeof raw!=='object'||typeof raw.datetime!=='string')continue;
      const date=new Date(raw.datetime);if(Number.isNaN(date.getTime()))continue;
      const parseForecastNumber=value=>value===null||value===undefined||typeof value==='string'&&!value.trim()?null:(Number.isFinite(Number(value))?Number(value):null);const high=parseForecastNumber(raw.temperature),low=parseForecastNumber(raw.templow),precip=parseForecastNumber(raw.precipitation_probability);
      valid.push({datetime:raw.datetime,date,condition:typeof raw.condition==='string'?raw.condition:'',temperature:high,templow:low,precipitation_probability:precip===null?null:Math.max(0,Math.min(100,precip)),is_daytime:raw.is_daytime})
    }
    // Normalize unsorted and duplicate daily records before limiting the forecast.
    valid.sort((a,b)=>a.date-b.date);
    if(type!=='twice_daily'){
      const unique=new Map();
      for(const item of valid){
        const day=[item.date.getFullYear(),item.date.getMonth(),item.date.getDate()].join('-'),previous=unique.get(day);
        if(!previous){unique.set(day,item);continue}
        // Duplicate daily entries can contain complementary fields; preserve real zeros.
        unique.set(day,{...previous,
          condition:previous.condition||item.condition,
          temperature:previous.temperature??item.temperature,
          templow:previous.templow??item.templow,
          precipitation_probability:previous.precipitation_probability??item.precipitation_probability})
      }
      return [...unique.values()].slice(0,7).map(({date,is_daytime,...item})=>item)
    }
    const grouped=new Map();
    for(const item of valid){
      const key=[item.date.getFullYear(),item.date.getMonth(),item.date.getDate()].join('-'),current=grouped.get(key)||{datetime:item.datetime,condition:'',temperature:null,templow:null,precipitation_probability:null};
      const value=item.temperature;
      if(item.is_daytime!==false){
        if(value!==null)current.temperature=current.temperature===null?value:Math.max(current.temperature,value);
        if(item.condition)current.condition=item.condition
      }else if(value!==null)current.templow=current.templow===null?value:Math.min(current.templow,value);
      if(item.templow!==null)current.templow=current.templow===null?item.templow:Math.min(current.templow,item.templow);
      if(item.precipitation_probability!==null)current.precipitation_probability=current.precipitation_probability===null?item.precipitation_probability:Math.max(current.precipitation_probability,item.precipitation_probability);
      grouped.set(key,current)
    }
    return [...grouped.values()].slice(0,7)
  }
  async loadWeatherForecast(force=false){
    const entity=this._config.weather?.show_forecast===false?null:this.weatherForecastEntity(),connection=this._hass?.connection,forecastType=entity?this.weatherForecastType(entity):'daily';
    if(!entity||!connection?.subscribeMessage){
      this._weatherForecastRequest++;this._weatherForecastPending=false;this._weatherForecastRetryAt=0;this._weatherForecast=[];this._weatherForecastError=null;this._weatherForecastEntity=null;this._weatherForecastConnection=null;
      if(this._weatherForecastUnsub){try{this._weatherForecastUnsub()}catch{}this._weatherForecastUnsub=null}
      return
    }
    const sameSource=this._weatherForecastEntity===entity&&this._weatherForecastConnection===connection;
    if(!force&&sameSource&&(this._weatherForecastUnsub||this._weatherForecastPending||Date.now()<(this._weatherForecastRetryAt||0)))return;
    this._weatherForecastRetryAt=0;
    const request=++this._weatherForecastRequest;this._weatherForecastPending=true;
    if(this._weatherForecastUnsub){try{this._weatherForecastUnsub()}catch{}this._weatherForecastUnsub=null}
    this._weatherForecast=[];this._weatherForecastError=null;this._weatherForecastEntity=entity;this._weatherForecastConnection=connection;
    try{
      const unsub=await connection.subscribeMessage(event=>{
        if(request!==this._weatherForecastRequest||this._hass?.connection!==connection||this.weatherForecastEntity()!==entity)return;
        this._weatherForecast=this.normalizeDailyForecast(event?.forecast,event?.type||forecastType);
        this._weatherForecastError=null;this.render()
      },{type:'weather/subscribe_forecast',forecast_type:forecastType,entity_id:entity});
      if(request!==this._weatherForecastRequest||this._hass?.connection!==connection||this.weatherForecastEntity()!==entity){try{unsub?.()}catch{}return}
      this._weatherForecastUnsub=typeof unsub==='function'?unsub:null;this._weatherForecastRetryAt=this._weatherForecastUnsub?0:Date.now()+60000;this._weatherForecastPending=false;this._weatherForecastConnection=connection
    }catch(error){
      if(request!==this._weatherForecastRequest)return;
      this._weatherForecastPending=false;this._weatherForecastRetryAt=Date.now()+60000;this._weatherForecast=[];this._weatherForecastError=error;this._weatherForecastConnection=connection;console.warn('VELTO daily forecast unavailable',error);this.render()
    }
  }
  polishCount(n,one,few,many){const value=Math.abs(Number(n)||0),mod100=value%100,mod10=value%10;return value===1?one:mod100>=12&&mod100<=14?many:mod10>=2&&mod10<=4?few:many}
  async loadCalendar(force=false){
    const cfg=this._config.calendar,ids=[...new Set((Array.isArray(cfg?.entities)?cfg.entities:[cfg?.entity]).filter(x=>typeof x==='string'&&/^calendar\.[a-z0-9_]+$/.test(x)))];
    if(!ids.length){this._calendarEvents=[];this._calendarError=null;this._calendarKey='';this._calendarRequest++;this._calendarLoading=false;return}
    if(!this._hass?.callApi)return;
    const api=this._hass,connection=api.connection;
    const requestedDays=Number(cfg.days);const days=Number.isFinite(requestedDays)&&requestedDays>0?Math.max(1,Math.min(90,Math.floor(requestedDays))):14,key=ids.join('|')+'|'+days;
    if(!force&&this._calendarKey===key)return;
    if(this._calendarLoading&&this._calendarKey===key)return;
    this._calendarLoading=true;this._calendarKey=key;this._calendarConnection=connection;const request=++this._calendarRequest;
    const now=new Date(),start=new Date(now.getFullYear(),now.getMonth(),now.getDate()),end=new Date(start);end.setDate(end.getDate()+days);
    try{
      const result=await Promise.allSettled(ids.map(async id=>{
        const path='calendars/'+encodeURIComponent(id)+'?start='+encodeURIComponent(start.toISOString())+'&end='+encodeURIComponent(end.toISOString());
        const events=await api.callApi('GET',path);
        return (Array.isArray(events)?events:[]).filter(event=>event&&typeof event==='object'&&!Array.isArray(event)).map(event=>({...event,calendar:id}))
      }));
      if(request!==this._calendarRequest||this._hass?.connection!==connection)return;
      const successful=result.filter(item=>item.status==='fulfilled');
      const failures=result.filter(item=>item.status==='rejected');
      if(failures.length)console.warn('VELTO: '+failures.length+' calendar source(s) unavailable',failures.map(item=>item.reason));
      this._calendarEvents=successful.flatMap(item=>item.value).filter(event=>{
        const startDate=this.eventDate(event.start);
        if(!Number.isFinite(startDate.getTime()))return false;
        const endValue=event.end?.dateTime||event.end?.date||event.end;
        const endDate=endValue?this.eventDate(endValue):startDate;
        return Number.isFinite(endDate.getTime())&&endDate>=now&&endDate>=startDate
      }).sort((a,b)=>this.eventDate(a.start)-this.eventDate(b.start));
      this._calendarError=failures.length?new Error(failures.length+' calendar source(s) unavailable'):null;this._calendarLastChecked=successful.length?new Date():this._calendarLastChecked;
    }catch(err){if(request===this._calendarRequest&&this._hass?.connection===connection)this._calendarError=err;console.warn('VELTO calendar:',err)}
    finally{if(request===this._calendarRequest&&this._hass?.connection===connection){this._calendarLoading=false;this.render()}}
  }
  eventDate(value){const raw=value?.dateTime||value?.date||value;if(typeof raw==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(raw)){const [y,m,d]=raw.split('-').map(Number);const date=new Date(y,m-1,d);return date.getFullYear()===y&&date.getMonth()===m-1&&date.getDate()===d?date:new Date(NaN)}return raw==null||raw===''?new Date(NaN):new Date(raw)}
  eventAllDay(value){return Boolean(value?.date||typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value))}
  async loadRegistry(){
    const connection=this._hass?.connection;
    if(!this._config.auto_areas||!connection)return;
    if(this._registryLoading&&this._registryLoadingConnection===connection)return;
    if(this._registryConnection===connection||this._registryFailedConnection===connection)return;
    const request=++this._registryRequest;
    this._registryLoading=true;this._registryLoadingConnection=connection;
    try{const [areas,entities,devices]=await Promise.all([
      connection.sendMessagePromise({type:'config/area_registry/list'}),
      connection.sendMessagePromise({type:'config/entity_registry/list'}),
      connection.sendMessagePromise({type:'config/device_registry/list'})
    ]);
    if(request!==this._registryRequest||this._hass?.connection!==connection||!this._config.auto_areas)return;
    this._registry={areas,entities,devices};this._registryError=null;this._registryConnection=connection;this.render();
    }catch(error){
      if(request!==this._registryRequest||this._hass?.connection!==connection||!this._config.auto_areas)return;
      this._registryFailedConnection=connection;this._registryError=error;this.render();console.warn('VELTO: area discovery unavailable',error)
    }finally{if(request===this._registryRequest){this._registryLoading=false;this._registryLoadingConnection=null}}
  }
  autoRoomIcon(name){
    const n=String(name||'').toLowerCase();
    if(/kuchnia|kitchen/.test(n))return 'plug';
    if(/łazien|lazien|bath/.test(n))return 'water';
    if(/hall|korytarz|przedpok|hol\b|wejści|wejsci|entrance/.test(n))return 'sun';
    if(/garaż|garaz|garage/.test(n))return 'door';
    if(/ogród|ogrod|garden|taras|terrace|patio|balkon|balcony/.test(n))return 'leaf';
    if(/kids|dzieci|child|nursery/.test(n))return 'toy';
    if(/living|salon|pokój dzienny|pokoj dzienny/.test(n))return 'sofa';
    if(/rack|serwer|server/.test(n))return 'server';
    if(/storage|schowek|magazyn|spiżarnia|spizarnia/.test(n))return 'archive';
    if(/biuro|office|pracown/.test(n))return 'briefcase';
    if(/sypial|bedroom|pokój|pokoj|room/.test(n))return 'light';
    if(/kotł|boiler|utility|technicz/.test(n))return 'climate';
    return 'home'
  }
  autoTileSize(entityId){
    if(this._config.smart_layout===false)return 'small';
    const domain=String(entityId||'').split('.')[0];
    if(['media_player','camera','weather'].includes(domain))return 'large';
    if(['vacuum','climate','cover','alarm_control_panel','water_heater'].includes(domain))return 'medium';
    return 'small'
  }
  autoEntityVisible(entry){
    if(!entry?.entity_id)return false;
    if(entry.disabled_by||entry.hidden_by)return false;
    if(!this._config.show_diagnostics&&['diagnostic','config'].includes(entry.entity_category))return false;
    return true
  }
  roomContext(room){
    const ids=[...new Set((room?.entities||[]).map(item=>typeof item==='string'?item:item?.entity).filter(Boolean))];
    const live=ids.filter(id=>this.entity(id)&&!['unknown','unavailable'].includes(this.entity(id).state));
    const lights=live.filter(id=>id.startsWith('light.')),lightsOn=lights.filter(id=>this.entity(id)?.state==='on');
    const covers=live.filter(id=>id.startsWith('cover.')),coversOpen=covers.filter(id=>['open','opening'].includes(this.entity(id)?.state));
    const media=live.filter(id=>id.startsWith('media_player.')),mediaPlaying=media.filter(id=>this.entity(id)?.state==='playing');
    const actions=live.filter(id=>['scene','script'].includes(id.split('.')[0])).slice(0,6);
    const temperatures=[];
    for(const id of live){
      const state=this.entity(id),domain=id.split('.')[0];
      if(domain==='climate'&&Number.isFinite(Number(state.attributes?.current_temperature)))temperatures.push(Number(state.attributes.current_temperature));
      else if(domain==='sensor'&&state.attributes?.device_class==='temperature'&&Number.isFinite(Number(state.state)))temperatures.push(Number(state.state))
    }
    const temperature=temperatures.length?temperatures.reduce((sum,n)=>sum+n,0)/temperatures.length:null;
    const security=live.filter(id=>{const state=this.entity(id),domain=id.split('.')[0],dc=state.attributes?.device_class;return ['camera','lock','alarm_control_panel'].includes(domain)||(domain==='binary_sensor'&&['door','window','opening','garage_door','smoke','moisture','gas','problem','safety'].includes(dc))});
    const categories={lights:lights.length,media:media.length,climate:live.filter(id=>['climate','humidifier','water_heater'].includes(id.split('.')[0])).length,covers:covers.length,security:security.length};
    return {ids,lights,lightsOn,covers,coversOpen,media,mediaPlaying,actions,temperature,categories}
  }
  categoryMatch(id){
    const filter=this._categoryFilter||'all';if(filter==='all')return true;
    const state=this.entity(id),domain=id.split('.')[0],dc=state?.attributes?.device_class;
    if(filter==='lights')return domain==='light';
    if(filter==='media')return domain==='media_player';
    if(filter==='climate')return ['climate','humidifier','water_heater'].includes(domain)||(domain==='sensor'&&['temperature','humidity'].includes(dc));
    if(filter==='covers')return domain==='cover';
    if(filter==='security')return ['camera','lock','alarm_control_panel'].includes(domain)||(domain==='binary_sensor'&&['door','window','opening','garage_door','smoke','moisture','gas','problem','safety'].includes(dc));
    return true
  }
  async bulkAction(domain,service,ids){
    const entities=[...new Set((ids||[]).filter(id=>typeof id==='string'&&id.startsWith(domain+'.')))];
    if(!entities.length||!this._hass?.callService)return;
    try{await this._hass.callService(domain,service,{entity_id:entities})}catch(error){console.error('VELTO bulk control failed',error)}
  }
  homeHighlights(rooms){
    const maxRaw=Number(this._config.home_highlight_limit),limit=Number.isFinite(maxRaw)?Math.max(4,Math.min(12,Math.floor(maxRaw))):8;
    const pinned=Array.isArray(this._config.home_favorites)?this._config.home_favorites.filter(id=>typeof id==='string'):[];
    const seen=new Set(),candidates=[];
    for(const room of rooms||[])for(const raw of room.entities||[]){
      const item=typeof raw==='string'?{entity:raw}:raw,id=item?.entity;
      if(!id||seen.has(id))continue;seen.add(id);
      const state=this.entity(id);if(!state||['unknown','unavailable'].includes(state.state))continue;
      const domain=id.split('.')[0],dc=state.attributes?.device_class;
      let base={media_player:48,camera:44,vacuum:42,climate:40,alarm_control_panel:39,lock:34,cover:33,light:31,fan:29,switch:22,input_boolean:18}[domain];
      if(domain==='binary_sensor'){
        if(['smoke','moisture','gas','problem','safety'].includes(dc))base=46;
        else if(['door','window','opening','garage_door'].includes(dc))base=35;
      }
      if(base===undefined&&!pinned.includes(id))continue;
      const active=['on','open','opening','unlocked','heat','cool','heating','playing','cleaning','returning','triggered','pending'].includes(state.state);
      let score=base??10;
      if(active)score+=42;
      if(domain==='media_player'&&state.state==='playing')score+=22;
      if(domain==='vacuum'&&['cleaning','returning'].includes(state.state))score+=18;
      if(domain==='lock'&&state.state==='unlocked')score+=60;
      if(domain==='cover'&&['open','opening'].includes(state.state))score+=35;
      if(domain==='alarm_control_panel'&&['triggered','pending'].includes(state.state))score+=80;
      if(domain==='binary_sensor'&&state.state==='on')score+=['smoke','moisture','gas','problem','safety'].includes(dc)?80:35;
      const pinnedIndex=pinned.indexOf(id);if(pinnedIndex>=0)score=1000-pinnedIndex;
      const size=['media_player','camera','vacuum','climate','cover'].includes(domain)?'medium':'small';
      candidates.push({item:{...item,size},score,name:this.name(id)||id})
    }
    return candidates.sort((a,b)=>b.score-a.score||a.name.localeCompare(b.name,'pl')).slice(0,limit).map(x=>x.item)
  }
  getRooms(){
    const manual=Array.isArray(this._config.rooms)?this._config.rooms:[];
    if(!this._config.auto_areas||!this._registry)return manual;
    const {areas,entities,devices}=this._registry;
    const deviceArea=new Map((devices||[]).filter(d=>d?.id).map(d=>[d.id,d.area_id]));
    const ignored=new Set(['update','event','time','date','text','diagnostic','sun','zone','persistent_notification','device_tracker','person']);
    const included=new Set(Array.isArray(this._config.auto_domains)?this._config.auto_domains.filter(domain=>typeof domain==='string'):['light','switch','fan','cover','climate','sensor','binary_sensor','media_player','lock','vacuum','scene','script','button','input_boolean','automation','humidifier','water_heater','alarm_control_panel','remote','select','number','input_select','input_number','input_button','weather','camera']);
    const groups=(areas||[]).filter(area=>area&&(area.area_id||area.id)).map(area=>{const name=area.name||'Pomieszczenie';return {id:'area_'+(area.area_id||area.id),name,icon:this.autoRoomIcon(name),entities:[]}});
    const lookup=new Map(groups.map(r=>[r.id.slice(5),r]));const seen=new Set();
    const priority={vacuum:0,media_player:1,camera:2,climate:3,cover:4,light:5,fan:6,lock:7,switch:8,scene:9,script:10,binary_sensor:12,sensor:13};
    const maxRaw=Number(this._config.max_auto_entities),maxPerRoom=Number.isFinite(maxRaw)?Math.max(8,Math.min(60,Math.floor(maxRaw))):24;
    const sortedEntities=[...(entities||[])].sort((a,b)=>(priority[a?.entity_id?.split('.')[0]]??20)-(priority[b?.entity_id?.split('.')[0]]??20));
    for(const e of sortedEntities){
      if(!this.autoEntityVisible(e)||seen.has(e.entity_id)||!this._hass?.states?.[e.entity_id])continue;
      const domain=e.entity_id.split('.')[0];if(ignored.has(domain)||!included.has(domain))continue;
      const area=e.area_id||deviceArea.get(e.device_id),room=lookup.get(area);
      if(room&&room.entities.length<maxPerRoom){room.entities.push({entity:e.entity_id,size:this.autoTileSize(e.entity_id)});seen.add(e.entity_id)}
    }
    return [...manual,...groups.filter(g=>(!this._config.hide_empty_rooms||g.entities.length)&&!manual.some(r=>r.id===g.id||r.name===g.name))];
  }
  getCardSize(){return 8}
  static getStubConfig(){return {title:'Mój dom',auto_areas:true,hide_empty_rooms:true,theme:'auto',smart_layout:true,show_diagnostics:false,max_auto_entities:24,show_home_highlights:true,home_highlight_limit:8,room_controls:true,scene_shortcuts:true,layout_persistence:'hybrid',rooms:[]}}
  static getConfigElement(){return document.createElement('velto-dashboard-editor')}
  getGridOptions(){return {columns:12,min_columns:6,rows:8}}
  entity(id){return this._hass?.states?.[id]}
  text(id){const s=this.entity(id);return s&&!['unknown','unavailable'].includes(s.state)?s.state:null}
  name(id){return this.entity(id)?.attributes?.friendly_name||id}
  bindWeatherHistory(element,entityId,label){
    if(!entityId||!this.entity(entityId))return;
    element.classList.add('weather-history-target');element.tabIndex=0;element.setAttribute('role','button');element.setAttribute('aria-label',label+' — historia i szczegóły');element.title=label+' — dotknij, aby zobaczyć historię';
    const open=()=>this.showWeatherHistory(entityId,label);
    let timer=null,held=false;
    const cancel=()=>{if(timer!==null){clearTimeout(timer);timer=null}};
    element.addEventListener('pointerdown',e=>{if(e.button!==0)return;held=false;cancel();timer=setTimeout(()=>{held=true;open()},450)});
    element.addEventListener('pointerup',cancel);element.addEventListener('pointercancel',cancel);element.addEventListener('pointerleave',cancel);
    element.addEventListener('click',()=>{if(held){held=false;return}open()});
    element.addEventListener('contextmenu',e=>{e.preventDefault();cancel();if(!held){held=true;open()}});
    element.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}});
  }
  async showWeatherHistory(id,label){
    const root=this.shadowRoot;if(!root)return;
    this._closeDetails?.();
    const make=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n};
    const backdrop=make('div','velto-modal-backdrop'),panel=make('section','velto-modal velto-history-modal');
    panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-label','Historia: '+label);
    const previousFocus=root.activeElement||document.activeElement;let closed=false,request=0;
    const close=()=>{closed=true;request++;backdrop.remove();document.removeEventListener('keydown',onKey);if(this._closeDetails===close)this._closeDetails=null;previousFocus?.focus?.()};
    const onKey=e=>{if(e.key==='Escape'){e.preventDefault();close()}else if(e.key==='Tab'){const buttons=[...panel.querySelectorAll('button:not(:disabled)')];const active=root.activeElement;if(!panel.contains(active)){e.preventDefault();buttons[0]?.focus()}else if(e.shiftKey&&active===buttons[0]){e.preventDefault();buttons.at(-1)?.focus()}else if(!e.shiftKey&&active===buttons.at(-1)){e.preventDefault();buttons[0]?.focus()}}};
    this._closeDetails=close;document.addEventListener('keydown',onKey);backdrop.addEventListener('click',e=>{if(e.target===backdrop)close()});
    const header=make('div','velto-modal-head'),heading=make('div','velto-modal-heading');heading.append(make('small','','HISTORIA POMIARÓW'),make('h2','',label));
    const exit=make('button','velto-modal-close','×');exit.type='button';exit.setAttribute('aria-label','Zamknij');exit.addEventListener('click',close);header.append(heading,exit);panel.append(header);
    const current=this.entity(id),unit=current?.attributes?.unit_of_measurement||'';
    panel.append(make('p','velto-modal-status','Aktualnie: '+(current?.state??'—')+' '+unit));
    const ranges=make('div','velto-history-ranges'),body=make('div','velto-history-body');body.setAttribute('aria-live','polite');panel.append(ranges,body);backdrop.append(panel);root.append(backdrop);
    const buttons=[];
    const load=async days=>{
      const token=++request;buttons.forEach(([n,d])=>n.setAttribute('aria-pressed',String(d===days)));body.replaceChildren(make('p','','Wczytywanie historii…'));
      try{
        const end=new Date(),start=new Date(end.getTime()-days*86400000);
        const path='history/period/'+encodeURIComponent(start.toISOString())+'?filter_entity_id='+encodeURIComponent(id)+'&end_time='+encodeURIComponent(end.toISOString())+'&minimal_response&no_attributes';
        const data=await this._hass?.callApi?.('GET',path);
        if(closed||token!==request)return;
        const entries=(Array.isArray(data?.[0])?data[0]:[]).map(x=>({time:new Date(x.last_changed||x.last_updated).getTime(),value:Number(String(x.state).replace(',','.'))})).filter(x=>Number.isFinite(x.time)&&Number.isFinite(x.value));
        if(!entries.length){body.replaceChildren(make('p','','Brak zapisanych pomiarów w tym okresie. Sprawdź encję i integrację Recorder w Home Assistant.'));return}
        let min=Infinity,max=-Infinity;for(const entry of entries){if(entry.value<min)min=entry.value;if(entry.value>max)max=entry.value}const width=600,height=190,pad=16,range=max-min||1;
        const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 600 190');svg.setAttribute('role','img');svg.setAttribute('aria-label','Wykres '+label+' z '+days+' dni');svg.classList.add('velto-history-chart');
        const startTime=start.getTime(),duration=end.getTime()-startTime;
        const stride=Math.max(1,Math.ceil(entries.length/600));const samples=[];for(let i=0;i<entries.length;i+=stride){const bucket=entries.slice(i,i+stride);let low=bucket[0],high=bucket[0];for(const item of bucket){if(item.value<low.value)low=item;if(item.value>high.value)high=item}const selected=[bucket[0],low,high,bucket[bucket.length-1]].sort((a,b)=>a.time-b.time);for(const item of selected){if(samples.at(-1)!==item)samples.push(item)}}const points=samples.map(x=>[(pad+(x.time-startTime)/duration*(width-pad*2)).toFixed(1),(height-pad-(x.value-min)/range*(height-pad*2)).toFixed(1)]);
        const poly=document.createElementNS('http://www.w3.org/2000/svg','polyline');poly.setAttribute('points',points.map(x=>x.join(',')).join(' '));poly.setAttribute('fill','none');poly.setAttribute('stroke','#d58b28');poly.setAttribute('stroke-width','3');poly.setAttribute('stroke-linejoin','round');poly.setAttribute('stroke-linecap','round');svg.append(poly);
        const summary=make('p','velto-history-summary','Min: '+min.toLocaleString('pl-PL')+' '+unit+' · Max: '+max.toLocaleString('pl-PL')+' '+unit+' · Próbek: '+entries.length);
        const first=entries[0],last=entries.at(-1);const times=make('p','velto-history-times',new Date(first.time).toLocaleString('pl-PL')+' — '+new Date(last.time).toLocaleString('pl-PL'));
        body.replaceChildren(svg,summary,times);
      }catch(error){if(closed||token!==request)return;console.warn('VELTO weather history unavailable',error);body.replaceChildren(make('p','','Nie udało się pobrać historii. Sprawdź dostęp do Recorder i uprawnienia użytkownika.'))}
    };
    for(const [days,title] of [[1,'24 h'],[7,'7 dni'],[30,'30 dni']]){const b=make('button','velto-history-range',title);b.type='button';b.addEventListener('click',()=>load(days));ranges.append(b);buttons.push([b,days])}
    exit.focus();load(1);
  }
  weatherNumber(id){const raw=this.text(id);if(raw===null||raw===undefined)return null;const value=String(raw).trim();if(!value||['unknown','unavailable','none','null','nan'].includes(value.toLowerCase()))return null;const num=Number(value.replace(',','.'));return Number.isFinite(num)?num:null}
  async action(id,kind){
    if(typeof id!=='string'||!id.includes('.'))return;
    const domain=id.split('.')[0],state=this.entity(id);
    const details=()=>{if(['media_player','vacuum','light','camera','climate','cover'].includes(domain)&&state&&!['unknown','unavailable'].includes(state.state))this.showDetails(id);else this.dispatchEvent(new CustomEvent('hass-more-info',{detail:{entityId:id},bubbles:true,composed:true}))};
    if(kind==='more'||!state||['unknown','unavailable'].includes(state.state)||
      !['light','switch','fan','cover','scene','script','button','input_button','input_boolean','automation','media_player','vacuum','humidifier','remote'].includes(domain)){details();return}
    let service='toggle';
    if(domain==='scene'||domain==='script')service='turn_on';
    if(domain==='button'||domain==='input_button')service='press';
    if(domain==='media_player')service=state.state==='playing'?'media_pause':'media_play';
    if(domain==='humidifier'||domain==='remote'||domain==='automation')service='toggle';
    if(domain==='vacuum')service=state.state==='cleaning'?'return_to_base':'start';
    if(domain==='cover')service=['open','opening'].includes(state.state)?'close_cover':'open_cover';
    if(!this._hass?.callService)return;
    try{await this._hass.callService(domain,service,{entity_id:id})}catch(e){console.error('VELTO control failed',e)}
  }
  mediaArtwork(attrs){
    // Some media integrations expose artwork through media_image_url instead of
    // entity_picture. Validate each candidate independently so an invalid first
    // URL cannot suppress a valid fallback.
    for(const url of [attrs?.entity_picture,attrs?.media_image_url]){
      if(typeof url!=='string'||!url.trim())continue;
      const value=url.trim();
      if(/[\\\\\u0000-\u001f\u007f]/.test(value))continue;
      if(value.startsWith('/')&&!value.startsWith('//'))return value;
      if(/^https:\/\/[^\s/]+(?:[/?#]|$)/i.test(value))return value;
    }
    return null
  }
  showDetails(id){
    const state=this.entity(id),domain=id.split('.')[0],root=this.shadowRoot;
    if(!state||!root)return;
    this._closeDetails?.();
    const make=(tag,cls,content)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(content!==undefined)n.textContent=String(content);return n};
    const backdrop=make('div','velto-modal-backdrop'),panel=make('section','velto-modal');
    panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-label',this.name(id));
    const previousFocus=root.activeElement||document.activeElement;
    const close=()=>{backdrop.remove();document.removeEventListener('keydown',escape);if(this._closeDetails===close)this._closeDetails=null;if(previousFocus?.isConnected)previousFocus.focus?.()};this._closeDetails=close;
    const escape=e=>{
      if(e.key==='Escape'){e.preventDefault();close();return}
      if(e.key!=='Tab')return;
      const focusables=[...panel.querySelectorAll('button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),a[href],[tabindex]:not([tabindex="-1"])')].filter(n=>!n.hidden&&n.getAttribute('aria-hidden')!=='true'&&n.getClientRects().length);
      if(!focusables.length){e.preventDefault();return}
      const first=focusables[0],last=focusables[focusables.length-1];
      const active=root.activeElement||document.activeElement;
      if(!panel.contains(active)){e.preventDefault();(e.shiftKey?last:first).focus()}
      else if(e.shiftKey&&active===first){e.preventDefault();last.focus()}
      else if(!e.shiftKey&&active===last){e.preventDefault();first.focus()}
    };
    backdrop.addEventListener('click',e=>{if(e.target===backdrop)close()});
    document.addEventListener('keydown',escape);
    const header=make('div','velto-modal-head'),heading=make('div','velto-modal-heading'),x=make('button','velto-modal-close','×');
    heading.append(make('small','',domain.replace('_',' ').toUpperCase()),make('h2','',this.name(id)));x.type='button';x.setAttribute('aria-label','Zamknij');x.addEventListener('click',close);header.append(heading,x);panel.append(header);
    const status=make('p','velto-modal-status',state.state);status.setAttribute('role','status');status.setAttribute('aria-live','polite');panel.append(status);
    const attrs=state.attributes||{};
    const controls=make('div','velto-modal-controls');
    const control=(label,service,enabled=true)=>{const b=make('button','velto-modal-control',label);b.type='button';b.disabled=!enabled;b.addEventListener('click',async()=>{try{await this._hass?.callService?.(domain,service,{entity_id:id});close()}catch(err){status.textContent='Nie udało się wykonać polecenia';console.error('VELTO control failed',err)}});controls.append(b)};
    if(domain==='camera'){
      const cameraArt=this.mediaArtwork(attrs);const picture=cameraArt?.startsWith('/')?cameraArt:'/api/camera_proxy/'+encodeURIComponent(id);
      const preview=make('img','velto-modal-camera');preview.alt='Ostatni dostępny obraz z kamery';preview.loading='eager';
      const retry=make('button','velto-modal-control','Odśwież obraz');retry.type='button';
      let refreshCount=0;
      const refresh=()=>{
        // Put the cache-buster before the fragment, preserving existing query parameters.
        const hashAt=picture.indexOf('#'),base=hashAt<0?picture:picture.slice(0,hashAt),hash=hashAt<0?'':picture.slice(hashAt);
        preview.hidden=false;retry.disabled=true;status.textContent='Ładowanie podglądu…';
        preview.src=base+(base.includes('?')?'&':'?')+'_velto='+Date.now()+'_'+(++refreshCount)+hash;
      };
      retry.addEventListener('click',refresh);
      preview.addEventListener('error',()=>{retry.disabled=false;preview.hidden=true;status.textContent='Podgląd niedostępny — sprawdź uprawnienia kamery lub otwórz ją w Home Assistant'});
      preview.addEventListener('load',()=>{retry.disabled=false;preview.hidden=false;status.textContent=state.state});
      panel.append(preview,retry);refresh();
      panel.append(make('p','velto-modal-meta','Obraz statyczny z Home Assistant. Dostępność zależy od integracji i uprawnień kamery.'));
    }else if(domain==='media_player'){
      const artUrl=this.mediaArtwork(attrs);
      if(artUrl){const art=make('img','velto-modal-art');art.alt='Okładka odtwarzanego materiału';art.loading='lazy';art.src=artUrl;art.addEventListener('error',()=>art.remove());panel.append(art)}
            if(attrs.media_title)panel.append(make('div','velto-modal-title',attrs.media_title));
      if(attrs.media_artist||attrs.app_name)panel.append(make('p','velto-modal-meta',[attrs.media_artist,attrs.app_name].filter(Boolean).join(' · ')));
      const duration=Number(attrs.media_duration),position=Number(attrs.media_position);
      if(Number.isFinite(duration)&&duration>0&&Number.isFinite(position)&&position>=0){
        const track=make('div','velto-modal-track'),fill=make('span','velto-modal-track-fill');
        fill.style.width=Math.max(0,Math.min(100,position/duration*100))+'%';track.append(fill);panel.append(track)
      }
      const features=Number(attrs.supported_features)||0;
      control('Poprzedni','media_previous_track',Boolean(features&16));
      control(state.state==='playing'?'Pauza':'Odtwarzaj',state.state==='playing'?'media_pause':'media_play',Boolean(features&(state.state==='playing'?1:16384)));
      control('Następny','media_next_track',Boolean(features&32));
      if(attrs.volume_level!==undefined&&attrs.volume_level!==null&&Number.isFinite(Number(attrs.volume_level))&&(features&4)){
        const volume=make('label','velto-modal-meta','Głośność · '+Math.round(Math.max(0,Math.min(1,Number(attrs.volume_level)))*100)+'%');
        const slider=make('input','velto-modal-slider');slider.type='range';slider.min='0';slider.max='100';
        slider.value=String(Math.round(Math.max(0,Math.min(1,Number(attrs.volume_level)))*100));slider.setAttribute('aria-label','Głośność');
        slider.addEventListener('input',()=>{volume.firstChild&&(volume.firstChild.textContent='Głośność · '+slider.value+'%')});
        slider.addEventListener('change',async()=>{try{await this._hass?.callService?.('media_player','volume_set',{entity_id:id,volume_level:Number(slider.value)/100})}catch(err){status.textContent='Nie udało się zmienić głośności';console.error('VELTO volume failed',err)}});
        volume.append(slider);panel.append(volume)
      }
    }else if(domain==='vacuum'){
      if(attrs.battery_level!==undefined)panel.append(make('p','velto-modal-meta','Bateria: '+attrs.battery_level+'%'));
      control('Start','start',state.state!=='cleaning');control('Pauza','pause',state.state==='cleaning');control('Do stacji','return_to_base',state.state!=='docked');
    }else if(domain==='climate'){
      const current=Number(attrs.current_temperature),target=Number(attrs.temperature),unit=attrs.temperature_unit||'°C';
      if(Number.isFinite(current))panel.append(make('p','velto-modal-meta','Aktualnie: '+current.toLocaleString('pl-PL',{maximumFractionDigits:1})+' '+unit));
      if(Number.isFinite(target)){
        const min=Number.isFinite(Number(attrs.min_temp))?Number(attrs.min_temp):5,max=Number.isFinite(Number(attrs.max_temp))?Number(attrs.max_temp):35,step=Number.isFinite(Number(attrs.target_temp_step))&&Number(attrs.target_temp_step)>0?Number(attrs.target_temp_step):0.5;
        const label=make('label','velto-modal-meta','Temperatura docelowa · '+target.toLocaleString('pl-PL',{maximumFractionDigits:1})+' '+unit),slider=make('input','velto-modal-slider');
        slider.type='range';slider.min=String(min);slider.max=String(max);slider.step=String(step);slider.value=String(Math.max(min,Math.min(max,target)));slider.setAttribute('aria-label','Temperatura docelowa');
        slider.addEventListener('input',()=>{if(label.firstChild)label.firstChild.textContent='Temperatura docelowa · '+Number(slider.value).toLocaleString('pl-PL',{maximumFractionDigits:1})+' '+unit});
        slider.addEventListener('change',async()=>{const value=Number(slider.value);if(!Number.isFinite(value))return;try{await this._hass?.callService?.('climate','set_temperature',{entity_id:id,temperature:value});status.textContent='Ustawiono '+value.toLocaleString('pl-PL',{maximumFractionDigits:1})+' '+unit}catch(err){status.textContent='Nie udało się zmienić temperatury';console.error('VELTO climate control failed',err)}});
        label.append(slider);panel.append(label)
      }
      if(Array.isArray(attrs.hvac_modes)&&attrs.hvac_modes.length){
        const modeRow=make('div','velto-modal-controls');
        for(const mode of attrs.hvac_modes.slice(0,6)){const b=make('button','velto-modal-control',String(mode));b.type='button';b.disabled=state.state===mode;b.addEventListener('click',async()=>{try{await this._hass?.callService?.('climate','set_hvac_mode',{entity_id:id,hvac_mode:mode});close()}catch(err){status.textContent='Nie udało się zmienić trybu';console.error('VELTO climate mode failed',err)}});modeRow.append(b)}
        panel.append(modeRow)
      }
    }else if(domain==='cover'){
      const position=Number(attrs.current_position);
      if(Number.isFinite(position))panel.append(make('p','velto-modal-meta','Otwarcie: '+Math.round(Math.max(0,Math.min(100,position)))+'%'));
      const features=Number(attrs.supported_features)||0;
      control('Otwórz','open_cover',Boolean(features&1)||features===0);
      control('Stop','stop_cover',Boolean(features&8));
      control('Zamknij','close_cover',Boolean(features&2)||features===0);
      if(Number.isFinite(position)&&(features&4)){
        const label=make('label','velto-modal-meta','Pozycja · '+Math.round(position)+'%'),slider=make('input','velto-modal-slider');
        slider.type='range';slider.min='0';slider.max='100';slider.value=String(Math.round(Math.max(0,Math.min(100,position))));slider.setAttribute('aria-label','Pozycja rolety');
        slider.addEventListener('input',()=>{if(label.firstChild)label.firstChild.textContent='Pozycja · '+slider.value+'%'});
        slider.addEventListener('change',async()=>{const value=Number(slider.value);if(!Number.isFinite(value))return;try{await this._hass?.callService?.('cover','set_cover_position',{entity_id:id,position:value});status.textContent='Ustawiono '+value+'%'}catch(err){status.textContent='Nie udało się ustawić pozycji';console.error('VELTO cover position failed',err)}});
        label.append(slider);panel.append(label)
      }
    }else if(domain==='light'){
      control(state.state==='on'?'Wyłącz':'Włącz','toggle');
      if(state.state==='on'&&attrs.brightness!==undefined&&Number.isFinite(Number(attrs.brightness))){
        const label=make('label','velto-modal-meta','Jasność'),slider=make('input','velto-modal-slider');
        slider.type='range';slider.min='1';slider.max='100';slider.value=String(Math.max(1,Math.min(100,Math.round(Number(attrs.brightness)/255*100))));slider.setAttribute('aria-label','Jasność światła');
        slider.addEventListener('change',async()=>{try{const brightness=Math.max(1,Math.min(100,Number(slider.value)));if(!Number.isFinite(brightness))return;await this._hass?.callService?.('light','turn_on',{entity_id:id,brightness_pct:brightness})}catch(err){console.error('VELTO brightness failed',err)}});
        label.append(slider);panel.append(label)
      }
    }
    panel.append(controls);const native=make('button','velto-modal-native','Więcej w Home Assistant');native.type='button';
    native.addEventListener('click',()=>{close();this.dispatchEvent(new CustomEvent('hass-more-info',{detail:{entityId:id},bubbles:true,composed:true}))});
    panel.append(native);backdrop.append(panel);root.append(backdrop);x.focus()
  }
  phosphorRoomIcon(name){
    // Official Phosphor regular SVGs, vendored inline to keep HACS fully offline.
    const svgByName=this.constructor._phosphorSvgAssets||(this.constructor._phosphorSvgAssets={"house":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M219.31,108.68l-80-80a16,16,0,0,0-22.62,0l-80,80A15.87,15.87,0,0,0,32,120v96a8,8,0,0,0,8,8h64a8,8,0,0,0,8-8V160h32v56a8,8,0,0,0,8,8h64a8,8,0,0,0,8-8V120A15.87,15.87,0,0,0,219.31,108.68ZM208,208H160V152a8,8,0,0,0-8-8H104a8,8,0,0,0-8,8v56H48V120l80-80,80,80Z\"/></svg>","door-open":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M232,216H208V40a16,16,0,0,0-16-16H64A16,16,0,0,0,48,40V216H24a8,8,0,0,0,0,16H232a8,8,0,0,0,0-16Zm-40,0H176V40h16ZM64,40h96V216H64Zm80,92a12,12,0,1,1-12-12A12,12,0,0,1,144,132Z\"/></svg>","flower":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M210.35,129.36c-.81-.47-1.7-.92-2.62-1.36.92-.44,1.81-.89,2.62-1.36a40,40,0,1,0-40-69.28c-.81.47-1.65,1-2.48,1.59.08-1,.13-2,.13-3a40,40,0,0,0-80,0c0,.94,0,1.94.13,3-.83-.57-1.67-1.12-2.48-1.59a40,40,0,1,0-40,69.28c.81.47,1.7.92,2.62,1.36-.92.44-1.81.89-2.62,1.36a40,40,0,1,0,40,69.28c.81-.47,1.65-1,2.48-1.59-.08,1-.13,2-.13,2.95a40,40,0,0,0,80,0c0-.94-.05-1.94-.13-2.95.83.57,1.67,1.12,2.48,1.59A39.79,39.79,0,0,0,190.29,204a40.43,40.43,0,0,0,10.42-1.38,40,40,0,0,0,9.64-73.28ZM104,128a24,24,0,1,1,24,24A24,24,0,0,1,104,128Zm74.35-56.79a24,24,0,1,1,24,41.57c-6.27,3.63-18.61,6.13-35.16,7.19A40,40,0,0,0,154.53,98.1C163.73,84.28,172.08,74.84,178.35,71.21ZM128,32a24,24,0,0,1,24,24c0,7.24-4,19.19-11.36,34.06a39.81,39.81,0,0,0-25.28,0C108,75.19,104,63.24,104,56A24,24,0,0,1,128,32ZM44.86,80a24,24,0,0,1,32.79-8.79c6.27,3.63,14.62,13.07,23.82,26.89A40,40,0,0,0,88.81,120c-16.55-1.06-28.89-3.56-35.16-7.18A24,24,0,0,1,44.86,80ZM77.65,184.79a24,24,0,1,1-24-41.57c6.27-3.63,18.61-6.13,35.16-7.19a40,40,0,0,0,12.66,21.87C92.27,171.72,83.92,181.16,77.65,184.79ZM128,224a24,24,0,0,1-24-24c0-7.24,4-19.19,11.36-34.06a39.81,39.81,0,0,0,25.28,0C148,180.81,152,192.76,152,200A24,24,0,0,1,128,224Zm83.14-48a24,24,0,0,1-32.79,8.79c-6.27-3.63-14.62-13.07-23.82-26.89A40,40,0,0,0,167.19,136c16.55,1.06,28.89,3.56,35.16,7.18A24,24,0,0,1,211.14,176Z\"/></svg>","lego":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M243.58,72.84,197.29,49.7C191.54,39.24,177.21,32,160,32c-22.43,0-40,12.3-40,28a20.77,20.77,0,0,0,1.06,6.53l-19.52,9.76A53.69,53.69,0,0,0,80,72c-22.43,0-40,12.3-40,28a20.77,20.77,0,0,0,1.06,6.53L12.42,120.84A8,8,0,0,0,8,128v64a8,8,0,0,0,4.42,7.16l64,32a8,8,0,0,0,7.16,0l160-80A8,8,0,0,0,248,144V80A8,8,0,0,0,243.58,72.84ZM80,151.06,33.89,128,51,119.45c7.24,5.29,17.48,8.55,29,8.55,22.43,0,40-12.3,40-28a21.77,21.77,0,0,0-4.35-12.88L131,79.45c7.24,5.29,17.48,8.55,29,8.55,18.38,0,33.49-8.26,38.35-19.88L222.11,80ZM160,48c13.74,0,24,6.34,24,12s-10.26,12-24,12-24-6.34-24-12S146.26,48,160,48ZM80,88c13.74,0,24,6.34,24,12s-10.26,12-24,12c-9.67,0-17.61-3.14-21.47-7a8.29,8.29,0,0,0-.84-.93A6.62,6.62,0,0,1,56,100C56,94.34,66.26,88,80,88ZM24,140.94l48,24v46.12l-48-24Zm64,70.12V164.94l144-72v46.12Z\"/></svg>","armchair":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M216,88.8V72a40,40,0,0,0-40-40H80A40,40,0,0,0,40,72V88.8a40,40,0,0,0,0,78.4V200a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V167.2a40,40,0,0,0,0-78.4ZM80,48h96a24,24,0,0,1,24,24V88.8A40.07,40.07,0,0,0,168,128H88A40.07,40.07,0,0,0,56,88.8V72A24,24,0,0,1,80,48ZM208.39,152H208a8,8,0,0,0-8,8v40H56V160a8,8,0,0,0-8-8h-.39A24,24,0,1,1,72,128v40a8,8,0,0,0,16,0V144h80v24a8,8,0,0,0,16,0V128a24,24,0,1,1,24.39,24Z\"/></svg>","office-chair":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M248,128a8,8,0,0,1-8,8H223.33A48.08,48.08,0,0,1,176,176H136v24h24a32,32,0,0,1,32,32,8,8,0,0,1-16,0,16,16,0,0,0-16-16H136v16a8,8,0,0,1-16,0V216H96a16,16,0,0,0-16,16,8,8,0,0,1-16,0,32,32,0,0,1,32-32h24V176H80a48.08,48.08,0,0,1-47.33-40H16a8,8,0,0,1,0-16H40a8,8,0,0,1,8,8,32,32,0,0,0,32,32h96a32,32,0,0,0,32-32,8,8,0,0,1,8-8h24A8,8,0,0,1,248,128ZM67.91,138.48a16,16,0,0,1-3.75-12.74l13.72-96A16.08,16.08,0,0,1,93.72,16h68.56a16.08,16.08,0,0,1,15.84,13.74l13.72,96A16,16,0,0,1,176,144H80A16,16,0,0,1,67.91,138.48ZM80,128h96L162.28,32H93.71Z\"/></svg>","hard-drives":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M208,136H48a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V152A16,16,0,0,0,208,136Zm0,64H48V152H208v48Zm0-160H48A16,16,0,0,0,32,56v48a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V56A16,16,0,0,0,208,40Zm0,64H48V56H208v48ZM192,80a12,12,0,1,1-12-12A12,12,0,0,1,192,80Zm0,96a12,12,0,1,1-12-12A12,12,0,0,1,192,176Z\"/></svg>","archive":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M224,48H32A16,16,0,0,0,16,64V88a16,16,0,0,0,16,16v88a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V104a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48ZM208,192H48V104H208ZM224,88H32V64H224V88ZM96,136a8,8,0,0,1,8-8h48a8,8,0,0,1,0,16H104A8,8,0,0,1,96,136Z\"/></svg>","cooking-pot":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M88,48V16a8,8,0,0,1,16,0V48a8,8,0,0,1-16,0Zm40,8a8,8,0,0,0,8-8V16a8,8,0,0,0-16,0V48A8,8,0,0,0,128,56Zm32,0a8,8,0,0,0,8-8V16a8,8,0,0,0-16,0V48A8,8,0,0,0,160,56Zm92.8,46.4L224,124v60a32,32,0,0,1-32,32H64a32,32,0,0,1-32-32V124L3.2,102.4a8,8,0,0,1,9.6-12.8L32,104V80a8,8,0,0,1,8-8H216a8,8,0,0,1,8,8v24l19.2-14.4a8,8,0,0,1,9.6,12.8ZM208,88H48v96a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16Z\"/></svg>","bathtub":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M240,96H208a8,8,0,0,0-8-8H136a8,8,0,0,0-8,8H64V52A12,12,0,0,1,76,40a12.44,12.44,0,0,1,12.16,9.59,8,8,0,0,0,15.68-3.18A28.32,28.32,0,0,0,76,24,28,28,0,0,0,48,52V96H16a8,8,0,0,0-8,8v40a56.06,56.06,0,0,0,56,56v16a8,8,0,0,0,16,0V200h96v16a8,8,0,0,0,16,0V200a56.06,56.06,0,0,0,56-56V104A8,8,0,0,0,240,96Zm-48,8v32H144V104Zm40,40a40,40,0,0,1-40,40H64a40,40,0,0,1-40-40V112H128v32a8,8,0,0,0,8,8h64a8,8,0,0,0,8-8V112h24Z\"/></svg>","bed":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M216,72H32V48a8,8,0,0,0-16,0V208a8,8,0,0,0,16,0V176H240v32a8,8,0,0,0,16,0V112A40,40,0,0,0,216,72ZM32,88h72v72H32Zm88,72V88h96a24,24,0,0,1,24,24v48Z\"/></svg>","garage":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M240,192h-8V98.67a16,16,0,0,0-7.12-13.31l-88-58.67a16,16,0,0,0-17.75,0l-88,58.67A16,16,0,0,0,24,98.67V192H16a8,8,0,0,0,0,16H240a8,8,0,0,0,0-16ZM40,98.67,128,40l88,58.66V192H192V136a8,8,0,0,0-8-8H72a8,8,0,0,0-8,8v56H40ZM176,144v16H136V144Zm-56,16H80V144h40ZM80,176h40v16H80Zm56,0h40v16H136Z\"/></svg>","thermometer":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M212,56a28,28,0,1,0,28,28A28,28,0,0,0,212,56Zm0,40a12,12,0,1,1,12-12A12,12,0,0,1,212,96Zm-84,57V88a8,8,0,0,0-16,0v65a32,32,0,1,0,16,0Zm-8,47a16,16,0,1,1,16-16A16,16,0,0,1,120,200Zm40-66V48a40,40,0,0,0-80,0v86a64,64,0,1,0,80,0Zm-40,98a48,48,0,0,1-27.42-87.4A8,8,0,0,0,96,138V48a24,24,0,0,1,48,0v90a8,8,0,0,0,3.42,6.56A48,48,0,0,1,120,232Z\"/></svg>","lightbulb":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M176,232a8,8,0,0,1-8,8H88a8,8,0,0,1,0-16h80A8,8,0,0,1,176,232Zm40-128a87.55,87.55,0,0,1-33.64,69.21A16.24,16.24,0,0,0,176,186v6a16,16,0,0,1-16,16H96a16,16,0,0,1-16-16v-6a16,16,0,0,0-6.23-12.66A87.59,87.59,0,0,1,40,104.49C39.74,56.83,78.26,17.14,125.88,16A88,88,0,0,1,216,104Zm-16,0a72,72,0,0,0-73.74-72c-39,.92-70.47,33.39-70.26,72.39a71.65,71.65,0,0,0,27.64,56.3A32,32,0,0,1,96,186v6h64v-6a32.15,32.15,0,0,1,12.47-25.35A71.65,71.65,0,0,0,200,104Zm-16.11-9.34a57.6,57.6,0,0,0-46.56-46.55,8,8,0,0,0-2.66,15.78c16.57,2.79,30.63,16.85,33.44,33.45A8,8,0,0,0,176,104a9,9,0,0,0,1.35-.11A8,8,0,0,0,183.89,94.66Z\"/></svg>","plug":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M237.66,66.34a8,8,0,0,0-11.32,0L192,100.69,155.31,64l34.35-34.34a8,8,0,1,0-11.32-11.32L144,52.69,117.66,26.34a8,8,0,0,0-11.32,11.32L112.69,44l-53,53a40,40,0,0,0,0,56.57l15.71,15.71L26.34,218.34a8,8,0,0,0,11.32,11.32l49.09-49.09,15.71,15.71a40,40,0,0,0,56.57,0l53-53,6.34,6.35a8,8,0,0,0,11.32-11.32L203.31,112l34.35-34.34A8,8,0,0,0,237.66,66.34ZM147.72,185a24,24,0,0,1-33.95,0L71,142.23a24,24,0,0,1,0-33.95l53-53L200.69,132Z\"/></svg>","leaf":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M223.45,40.07a8,8,0,0,0-7.52-7.52C139.8,28.08,78.82,51,52.82,94a87.09,87.09,0,0,0-12.76,49c.57,15.92,5.21,32,13.79,47.85l-19.51,19.5a8,8,0,0,0,11.32,11.32l19.5-19.51C81,210.73,97.09,215.37,113,215.94q1.67.06,3.33.06A86.93,86.93,0,0,0,162,203.18C205,177.18,227.93,116.21,223.45,40.07ZM153.75,189.5c-22.75,13.78-49.68,14-76.71.77l88.63-88.62a8,8,0,0,0-11.32-11.32L65.73,179c-13.19-27-13-54,.77-76.71,22.09-36.47,74.6-56.44,141.31-54.06C210.2,114.89,190.22,167.41,153.75,189.5Z\"/></svg>","play":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M232.4,114.49,88.32,26.35a16,16,0,0,0-16.2-.3A15.86,15.86,0,0,0,64,39.87V216.13A15.94,15.94,0,0,0,80,232a16.07,16.07,0,0,0,8.36-2.35L232.4,141.51a15.81,15.81,0,0,0,0-27ZM80,215.94V40l143.83,88Z\"/></svg>","pause":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M200,32H160a16,16,0,0,0-16,16V208a16,16,0,0,0,16,16h40a16,16,0,0,0,16-16V48A16,16,0,0,0,200,32Zm0,176H160V48h40ZM96,32H56A16,16,0,0,0,40,48V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V48A16,16,0,0,0,96,32Zm0,176H56V48H96Z\"/></svg>","skip-back":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M199.81,34a16,16,0,0,0-16.24.43L64,109.23V40a8,8,0,0,0-16,0V216a8,8,0,0,0,16,0V146.77l119.57,74.78A15.95,15.95,0,0,0,208,208.12V47.88A15.86,15.86,0,0,0,199.81,34ZM192,208,64.16,128,192,48.07Z\"/></svg>","skip-forward":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M200,32a8,8,0,0,0-8,8v69.23L72.43,34.45A15.95,15.95,0,0,0,48,47.88V208.12a16,16,0,0,0,24.43,13.43L192,146.77V216a8,8,0,0,0,16,0V40A8,8,0,0,0,200,32ZM64,207.93V48.05l127.84,80Z\"/></svg>","television":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M216,64H147.31l34.35-34.34a8,8,0,1,0-11.32-11.32L128,60.69,85.66,18.34A8,8,0,0,0,74.34,29.66L108.69,64H40A16,16,0,0,0,24,80V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V80A16,16,0,0,0,216,64ZM40,80H144V200H40ZM216,200H160V80h56V200Zm-16-84a12,12,0,1,1-12-12A12,12,0,0,1,200,116Zm0,48a12,12,0,1,1-12-12A12,12,0,0,1,200,164Z\"/></svg>","monitor-play":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M208,40H48A24,24,0,0,0,24,64V176a24,24,0,0,0,24,24H208a24,24,0,0,0,24-24V64A24,24,0,0,0,208,40Zm8,136a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V64a8,8,0,0,1,8-8H208a8,8,0,0,1,8,8Zm-48,48a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,224Zm-3.56-110.66-48-32A8,8,0,0,0,104,88v64a8,8,0,0,0,12.44,6.66l48-32a8,8,0,0,0,0-13.32ZM120,137.05V103l25.58,17Z\"/></svg>"});
    const aliases={home:'house',sun:'door-open',door:'door-open',leaf:'flower',toy:'lego',sofa:'armchair',briefcase:'office-chair',server:'hard-drives',archive:'archive',plug:'cooking-pot',water:'bathtub',light:'bed',climate:'thermometer',garage:'garage',garden:'flower'};
    const asset=svgByName[aliases[name]||name];
    if(!asset)return this.icon(name);
    const cache=this.constructor._phosphorSvgNodes||(this.constructor._phosphorSvgNodes=new Map());
    let svg=cache.get(aliases[name]||name);
    if(!svg){svg=new DOMParser().parseFromString(asset,'image/svg+xml').documentElement;
      if(svg.localName!=='svg')return this.icon(name);
      svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');
      cache.set(aliases[name]||name,svg);
    }
    return document.importNode(svg,true)
  }
  icon(name,active=false){
    const paths={
      trash:['path|M3 6h18','path|M8 6V4h8v2','path|M19 6l-1 14H6L5 6','path|M10 11v5','path|M14 11v5'],
      recycle:['path|M12 3l3 5h-3','path|M15 8a7 7 0 0 1 5 5','path|M20 13l-1 4-4-1','path|M19 17a7 7 0 0 1-7 4','path|M12 21l-3-3 3-2','path|M9 18a7 7 0 0 1-4-7','path|M5 11l1-4 4 1','path|M6 7a7 7 0 0 1 6-4'],
      eye:['path|M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z','circle|12 12 3'],
      'eye-slash':['path|M3 3l18 18','path|M10.6 10.6a2 2 0 0 0 2.8 2.8','path|M9.9 5.2A10.9 10.9 0 0 1 12 5c6.4 0 10 7 10 7a15.7 15.7 0 0 1-3.1 3.8','path|M6.6 6.6C3.7 8.3 2 12 2 12s3.6 7 10 7c1.2 0 2.3-.2 3.3-.6'],
      'caret-down':['path|m6 9 6 6 6-6'],
      'caret-up':['path|m6 15 6-6 6 6'],
      'arrow-clockwise':['path|M20 7v5h-5','path|M20 12a8 8 0 1 0 1 4'],
      expand:['path|M3 8V3h5','path|M3 3l5 5','path|M16 3h5v5','path|M21 3l-5 5','path|M3 16v5h5','path|M3 21l5-5','path|M21 16v5h-5','path|M21 21l-5-5'],
      compress:['path|M8 3v5H3','path|M8 8 3 3','path|M16 3v5h5','path|M16 8l5-5','path|M8 21v-5H3','path|M8 16l-5 5','path|M16 21v-5h5','path|M16 16l5 5'],
      home:['path|m3 10 9-7 9 7','path|M5 9v12h14V9','path|M9 21v-7h6v7'],
      leaf:['path|M20 4C10 4 4 8 4 15a5 5 0 0 0 5 5c7 0 11-6 11-16Z','path|M5 19c3-5 7-8 12-11'],
      toy:['rect|3 12 8 8 1','rect|13 12 8 8 1','rect|8 4 8 8 1','path|M7 16h0.01','path|M17 16h0.01','path|M12 8h0.01'],
      sofa:['path|M5 12V8a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v4','path|M4 12a2 2 0 0 0-2 2v5h20v-5a2 2 0 0 0-2-2 2 2 0 0 0-2 2v1H6v-1a2 2 0 0 0-2-2Z','path|M5 19v2','path|M19 19v2'],
      briefcase:['rect|3 8 18 13 2','path|M8 8V5h8v3','path|M3 14h18','path|M3 14h18','rect|10 12 4 4 1'],
      server:['rect|3 3 18 8 2','rect|3 13 18 8 2','circle|7 7 1','circle|7 17 1','path|M12 7h6','path|M12 17h6'],
      archive:['path|M3 8h18v13H3Z','path|M2 3h20v5H2Z','path|M9 13h6','path|M10 16h4'],
      light:['path|M9 18h6','path|M10 22h4','path|M15.09 14a6 6 0 1 0-6.18 0c.7.6 1.09 1.36 1.09 2v1h4v-1c0-.64.39-1.4 1.09-2Z'],
      switch:['rect|3 3 18 18 5','path|M12 7v5','path|M8.5 9a5 5 0 1 0 7 0'],
      fan:['path|M12 12c-2-2-5-3-6-1-2 4 1 6 6 1Z','path|M12 12c2-2 3-5 1-6-4-2-6 1-1 6Z','path|M12 12c2 2 5 3 6 1 2-4-1-6-6-1Z','path|M12 12c-2 2-3 5-1 6 4 2 6-1 1-6Z','circle|12 12 2','circle|12 12 9'],
      cover:['rect|4 3 16 18 2','path|M4 8h16','path|M4 12h16','path|M4 16h16','path|M8 21v-3','path|M16 21v-3'],
      lock:['rect|5 10 14 11 2','path|M8 10V7a4 4 0 0 1 8 0v3','circle|12 15 1'],
      climate:['path|M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0Z','path|M12 10v7'],
      sensor:['circle|12 12 9','path|M5 12h3l2-4 4 8 2-4h3'],
      binary_sensor:['circle|12 12 9','path|m8 12 3 3 5-6'],
      scene:['path|m12 3 2.2 6.8L21 12l-6.8 2.2L12 21l-2.2-6.8L3 12l6.8-2.2Z'],
      camera:['rect|3 5 18 15 3','circle|12 12 4','path|M8 5l1-2h6l1 2'],
      input_boolean:['circle|12 12 9','path|M12 7v6','path|M8 10a5 5 0 1 0 8 0'],
      script:['path|M8 4h9l3 3v13H5V4Z','path|M8 9h8','path|M8 13h8','path|M8 17h5'],
      button:['rect|4 4 16 16 4','circle|12 12 4'],
      automation:['path|M4 7h12','path|m13 4 3 3-3 3','path|M20 17H8','path|m11 14-3 3 3 3'],
      humidifier:['path|M12 3C9 8 6 11 6 15a6 6 0 0 0 12 0c0-4-3-7-6-12Z','path|M9 16a3 3 0 0 0 3 3'],
      alarm_control_panel:['path|M12 3 3 7v5c0 5 4 8 9 10 5-2 9-5 9-10V7Z','path|M12 8v5','circle|12 17 1'],
      remote:['rect|7 2 10 20 4','circle|12 7 2','path|M10 13h4','path|M12 11v4'],
      number:['path|M4 17h16','circle|10 17 3','path|M4 7h16'],
      select:['rect|4 4 16 16 3','path|m8 10 4 4 4-4'],
      media_player:['rect|3 4 18 16 2','path|M8 8h8','path|m10 11 5 3-5 3Z'],
      vacuum:['circle|12 12 9','circle|12 12 6','rect|9 3 6 3 1','path|M7 12h3','path|M14 12h3','path|M10 16h4','circle|12 9 1'],
      weather:['path|M20 16.6A4.5 4.5 0 0 0 17 9a6 6 0 0 0-11.5 2A4 4 0 0 0 7 19h11a4 4 0 0 0 2-2.4Z'],
      moon:['path|M20.9 13.1A8.5 8.5 0 1 1 10.9 3.1a7 7 0 0 0 10 10Z'],
      partlycloudy:['circle|8 7 3','path|M8 1.5v2','path|M8 10.5v1','path|M2.5 7h1','path|M12.5 7h1','path|M4.1 3.1l.7.7','path|M11.2 10.2l.7.7','path|M21 18.5A4 4 0 0 0 18 12a5.5 5.5 0 0 0-10.5 2A3.5 3.5 0 0 0 8.5 21H18a3 3 0 0 0 3-2.5Z'],
      fog:['path|M20 15.5A4.5 4.5 0 0 0 17 8a6 6 0 0 0-11.5 2A4 4 0 0 0 7 18h11','path|M3 20h13','path|M7 23h13'],
      hail:['path|M20 15.5A4.5 4.5 0 0 0 17 8a6 6 0 0 0-11.5 2A4 4 0 0 0 7 18h11','circle|8 21 1','circle|14 22 1','circle|19 20 1'],
      lightning:['path|M20 15.5A4.5 4.5 0 0 0 17 8a6 6 0 0 0-11.5 2A4 4 0 0 0 7 18h11','path|M13 12l-3 5h3l-1 5 5-7h-3l2-3'],
      'lightning-rainy':['path|M20 14.5A4.5 4.5 0 0 0 17 7a6 6 0 0 0-11.5 2A4 4 0 0 0 7 17h11','path|M13 11l-3 5h3l-1 5 5-7h-3l2-3','path|M7 19l-1 2','path|M18 19l-1 2'],
      rainy:['path|M20 15.5A4.5 4.5 0 0 0 17 8a6 6 0 0 0-11.5 2A4 4 0 0 0 7 18h11','path|M8 19l-1 3','path|M14 19l-1 3','path|M20 19l-1 3'],
      pouring:['path|M20 14.5A4.5 4.5 0 0 0 17 7a6 6 0 0 0-11.5 2A4 4 0 0 0 7 17h11','path|M7 19l-1 3','path|M12 19l-1 3','path|M17 19l-1 3','path|M22 19l-1 3'],
      snowy:['path|M20 15.5A4.5 4.5 0 0 0 17 8a6 6 0 0 0-11.5 2A4 4 0 0 0 7 18h11','path|M12 18v5','path|M9.8 19.2l4.4 2.6','path|M14.2 19.2l-4.4 2.6'],
      'snowy-rainy':['path|M20 14.5A4.5 4.5 0 0 0 17 7a6 6 0 0 0-11.5 2A4 4 0 0 0 7 17h11','path|M7 19l-1 3','path|M12 18v5','path|M9.8 19.2l4.4 2.6','path|M14.2 19.2l-4.4 2.6'],
      windy:['path|M3 8h13a2.5 2.5 0 1 0-2.5-2.5','path|M2 13h17a2.5 2.5 0 1 1-2.5 2.5','path|M4 18h8'],
      'windy-variant':['path|M20 14.5A4.5 4.5 0 0 0 17 7a6 6 0 0 0-11.5 2A4 4 0 0 0 7 17h11','path|M3 20h12a2 2 0 1 0-2-2'],
      exceptional:['path|M12 3 2.5 20h19Z','path|M12 9v5','circle|12 17.5 .7'],
      motion:['path|M4 21v-4l5-5 3 3 4-2 4 4','circle|13 5 2','path|M8 7l3 3 4 1'],
      door:['rect|5 3 14 18 2','circle|15 12 1'],
      water:['path|M12 3C9 8 6 11 6 15a6 6 0 0 0 12 0c0-4-3-7-6-12Z'],
      smoke:['path|M4 17c0-3 4-3 4-6s-4-3-4-6','path|M11 19c0-3 4-3 4-6s-4-3-4-6','path|M18 19c0-3 3-3 3-6s-3-3-3-6'],
      sun:['circle|12 12 4','path|M12 2v2','path|M12 20v2','path|M4.9 4.9l1.4 1.4','path|m17.7 17.7 1.4 1.4','path|M2 12h2','path|M20 12h2','path|m4.9 19.1 1.4-1.4','path|m17.7 6.3 1.4-1.4'],
      'weather-sun':['circle|12 12 4','path|M12 2v2','path|M12 20v2','path|M4.9 4.9l1.4 1.4','path|m17.7 17.7 1.4 1.4','path|M2 12h2','path|M20 12h2','path|m4.9 19.1 1.4-1.4','path|m17.7 6.3 1.4-1.4'],
      plug:['path|M8 3v5','path|M16 3v5','path|M7 8h10v4a5 5 0 0 1-10 0Z','path|M12 17v4'],
      generic:['rect|4 4 16 16 4','circle|12 12 3']
    };
    const roomMdi={leaf:'mdi:leaf',toy:'mdi:toy-brick',sofa:'mdi:sofa',briefcase:'mdi:briefcase-outline',server:'mdi:server',archive:'mdi:archive-outline',sun:'mdi:weather-sunny',door:'mdi:door',home:'mdi:home-outline',light:'mdi:lightbulb-outline',plug:'mdi:power-plug-outline',water:'mdi:water-outline',climate:'mdi:thermometer'};
    if(Object.prototype.hasOwnProperty.call(roomMdi,name)){
      const haIcon=document.createElement('ha-icon');haIcon.setAttribute('icon',roomMdi[name]);haIcon.setAttribute('aria-hidden','true');return haIcon
    }
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('fill','none');svg.setAttribute('stroke','currentColor');svg.setAttribute('stroke-width','1.8');svg.setAttribute('stroke-linecap','round');svg.setAttribute('stroke-linejoin','round');svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');
    for(const entry of paths[name]||paths.generic){
      const [tag,...args]=entry.split('|');const el=document.createElementNS('http://www.w3.org/2000/svg',tag);
      if(tag==='path')el.setAttribute('d',args[0]);
      if(tag==='circle'){el.setAttribute('cx',args[0]);el.setAttribute('cy',args[1]);el.setAttribute('r',args[2])}
      if(tag==='rect'){['x','y','width','height','rx'].forEach((k,i)=>el.setAttribute(k,args[i]))}
      svg.append(el)
    }
    return svg
  }
  iconFor(id,state){
    const domain=id.split('.')[0],cls=state?.attributes?.device_class;
    if(cls==='motion'||cls==='occupancy')return 'motion';
    if(cls==='door'||cls==='window'||cls==='opening')return 'door';
    if(cls==='moisture'||cls==='water')return 'water';
    if(cls==='smoke'||cls==='gas'||cls==='carbon_monoxide')return 'smoke';
    if(cls==='temperature')return 'climate';
    if(cls==='humidity'||cls==='pressure')return 'weather';
    if(cls==='power'||cls==='energy'||cls==='current'||cls==='voltage')return 'plug';
    return ({light:'light',switch:'switch',fan:'fan',cover:'cover',lock:'lock',climate:'climate',sensor:'sensor',binary_sensor:'binary_sensor',scene:'scene',camera:'camera',input_boolean:'input_boolean',media_player:'media_player',vacuum:'vacuum',script:'script',button:'button',input_button:'button',automation:'automation',humidifier:'humidifier',water_heater:'climate',alarm_control_panel:'alarm_control_panel',remote:'remote',number:'number',input_number:'number',select:'select',input_select:'select',weather:'weather',sun:'sun'})[domain]||'generic'
  }
  render(){
    if(this.isConnected===true&&globalThis.document?.hidden===true){this._renderPending=true;return}
    const root=this.shadowRoot;if(!root)return;const openDialog=root.querySelector?.('.velto-modal-backdrop');const activeElement=root.activeElement;const dialogFocus=openDialog&&activeElement&&openDialog.contains?.(activeElement)?activeElement:null;const focusKey=activeElement?.getAttribute?.('data-velto-focus-key')||null;const scrollPositions=[];for(let node=this;node;node=node.parentNode||node.host){if(node.scrollTop>0||node.scrollLeft>0)scrollPositions.push([node,node.scrollTop,node.scrollLeft])}const innerScrollPositions=[];for(const node of root.querySelectorAll?.('[data-velto-scroll-key]')||[]){const key=node.getAttribute?.('data-velto-scroll-key');if(key&&(node.scrollTop>0||node.scrollLeft>0))innerScrollPositions.push([key,node.scrollTop,node.scrollLeft])}const pageY=globalThis.scrollY||0,pageX=globalThis.scrollX||0;root.replaceChildren();
    let css=this._styleElement;if(!css){css=document.createElement('style');css.textContent=`

.velto-modal-backdrop{position:fixed;inset:0;z-index:9999;background:#17120dc4;display:grid;place-items:center;padding:18px}.velto-modal{width:min(440px,100%);max-height:85vh;overflow:auto;background:#eeeae2;color:#352f29;border-radius:26px;padding:24px;box-shadow:0 24px 70px #0007}.velto-modal-head{display:flex;justify-content:space-between;align-items:start;gap:16px}.velto-modal-heading small{font-size:11px;letter-spacing:.14em;color:#96774b}.velto-modal-heading h2{font-size:23px;margin:6px 0}.velto-modal-close{border:0;background:#fff9;border-radius:12px;font-size:28px;width:40px;height:40px;cursor:pointer}.velto-modal-status,.velto-modal-meta{color:#82776a;font-size:13px}.velto-modal-camera{display:block;width:100%;max-height:320px;object-fit:contain;border-radius:16px;background:#24211e;margin:16px auto}.velto-modal-art{display:block;width:100%;max-height:220px;object-fit:contain;border-radius:16px;margin:16px auto;background:#ded7cd}.velto-modal-title{font-weight:750;margin-top:20px;overflow-wrap:anywhere}.velto-modal-controls{display:flex;flex-wrap:wrap;gap:9px;margin:22px 0}.velto-modal-control,.velto-modal-native{border:1px solid #d4c5af;background:#faf5ec;border-radius:13px;padding:12px 15px;color:#795628;font-weight:700;cursor:pointer}.velto-modal-control:disabled{opacity:.4;cursor:not-allowed}.velto-modal-native{width:100%;background:transparent}.velto-modal-track{height:6px;background:#d4cab9;border-radius:9px;margin:14px 0;overflow:hidden}.velto-modal-track-fill{display:block;height:100%;background:#e99524}.velto-modal-slider{display:block;width:100%;accent-color:#e99524;margin-top:10px}\n
:host{display:block;container-type:inline-size;min-width:0;color:#342f29;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
*{box-sizing:border-box}.layout{display:grid;grid-template-columns:205px minmax(0,1fr);gap:22px;min-height:540px;padding:20px;border-radius:30px;background:#eae7e0;box-shadow:9px 12px 28px #0002}
.sidebar{display:flex;flex-direction:column;gap:16px;border-right:1px solid #d3cec5;padding:12px 18px 12px 0}.brand{font-weight:850;font-size:26px;letter-spacing:-.07em}.brand span{color:#e99524}.sidebar .home-state{font-size:12px;line-height:1.5;padding:10px;border-radius:12px}.sidebar .overview{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:5px}.sidebar .overview span{font-size:10px;padding:7px 5px;white-space:normal}.sidebar .room-context{padding:9px;min-width:0}.sidebar .room-context-row,.sidebar .room-filters,.sidebar .room-actions{display:flex;flex-wrap:wrap;gap:5px}.sidebar .room-filter,.sidebar .room-quick{font-size:11px;padding:7px 8px}.sidebar .active-filter{font-size:11px;text-align:left;white-space:normal}.sidebar-collapsed .home-state,.sidebar-collapsed .overview,.sidebar-collapsed .room-context,.sidebar-collapsed .active-filter{display:none}.brand-row{display:flex;align-items:center;justify-content:space-between;gap:6px}.sidebar-collapse{border:1px solid #d5b989;border-radius:11px;background:#fff8ed;color:#ad6a15;cursor:pointer;min-width:30px;min-height:32px;font-size:22px}.layout.sidebar-collapsed{grid-template-columns:78px minmax(0,1fr)}.sidebar-collapsed .brand{font-size:17px}.sidebar-collapsed .brand-row{flex-direction:column;align-items:center}.sidebar-collapsed .nav button{font-size:0;display:flex;justify-content:center;padding:12px 5px}.sidebar-collapsed .nav-count,.sidebar-collapsed .nav-active,.sidebar-collapsed .sidebar-note{display:none}.nav{display:flex;flex-direction:column;gap:7px}
.nav button{border:0;background:transparent;text-align:left;border-radius:14px;padding:12px 13px;font:600 13px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;cursor:pointer;color:#736a5e;transition:background .2s;display:flex;align-items:center;gap:10px;white-space:nowrap}.nav svg{width:18px;height:18px;flex:none}.nav ha-icon{--mdc-icon-size:18px;width:18px;height:18px;flex:none;display:inline-flex;align-items:center;justify-content:center}
.nav button.selected{background:#f7f2e9;color:#8c5c21;box-shadow:inset 2px 2px 5px #c9c0b3, inset -2px -2px 5px #fff}.nav-count{margin-left:auto;font-size:10px;font-variant-numeric:tabular-nums;color:#897b67;background:#ffffff70;padding:3px 6px;border-radius:8px;min-width:22px;text-align:center}.nav-active{width:6px;height:6px;border-radius:50%;background:#e99524;box-shadow:0 0 0 3px #e9952426;flex:none}.nav button.selected .nav-count{color:#85571f;background:#e9952420}
.nav button:focus-visible,.tile:focus-visible,.brightness:focus-visible{outline:2px solid #e99524;outline-offset:2px}.nav button:hover:not(.selected){background:#ffffff70}.nav button{min-height:42px}
.sidebar-note{margin-top:auto;font-size:11px;line-height:1.5;color:#908679}
:host(:fullscreen){display:block;width:100vw;height:100vh;overflow:auto;background:var(--primary-background-color,#eeeae2)}:host(:fullscreen) .layout{min-height:100vh}
.velto-fullscreen{border:1px solid #cdbd9f;background:#fff8ec;color:#76542c;border-radius:12px;padding:9px 12px;font:inherit;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap}
.velto-fullscreen:focus-visible{outline:2px solid #e99524;outline-offset:3px}.velto-fullscreen svg{display:block;width:19px;height:19px}.dark .velto-fullscreen{background:#343941;color:#e8c58d;border-color:#65615c}
.layout.editing .tile{outline:1px dashed #e99524;outline-offset:-4px;cursor:grab}
.layout.editing .tile.drag-over{outline:3px solid #e99524}
.layout.editing .tile.touch-dragging{opacity:.75;transform:scale(1.025);z-index:4;touch-action:none}
.tile-edit-actions{display:flex;gap:5px;margin-top:8px;position:relative;z-index:2}
.tile-edit-actions button,.velto-edit{border:1px solid #e99524;background:#fff8e9;color:#775322;border-radius:9px;min-height:32px;min-width:34px;cursor:pointer}
.tile-edit-actions button:disabled{opacity:.35;cursor:default}
.tile-size-actions{display:flex;gap:4px;margin-top:6px;position:relative;z-index:2}.tile-size-actions button{border:1px solid #cbb791;background:#fff8e9;color:#775322;border-radius:8px;min-height:29px;min-width:30px;padding:4px 7px;font:800 10px inherit;cursor:pointer}.tile-size-actions button.selected{background:#e99524;color:#fff;border-color:#e99524}.dark .tile-size-actions button{background:#3b4149;color:#efc784;border-color:#626a73}.dark .tile-size-actions button.selected{background:#e99524;color:#1e1913}
.velto-edit{padding:8px 11px;font:inherit;font-size:12px;font-weight:700}
.layout-tools{display:flex;align-items:center;gap:7px;flex-wrap:wrap;margin:-10px 0 16px;padding:9px 10px;border:1px dashed #c9b793;border-radius:13px;background:#fff8ea80}.layout-tools span{font-size:11px;font-weight:700;color:#7b674d;margin-right:auto}.layout-tools button{border:1px solid #c7b48f;background:#fffaf0;color:#76572f;border-radius:9px;min-height:32px;padding:6px 9px;font:700 11px inherit;cursor:pointer}.layout-tools button.confirm{background:#a65f53;color:#fff;border-color:#a65f53}.layout-tools .layout-warning{color:#a65f53}.dark .layout-tools{background:#352f2880;border-color:#6b5b46}.dark .layout-tools span{color:#d2c5b5}.dark .layout-tools button{background:#3b4149;color:#efc784;border-color:#626a73}
.main{min-width:0;width:100%}.top{display:flex;align-items:center;justify-content:space-between;gap:15px;margin:3px 0 22px}
.eyebrow{font-size:10px;letter-spacing:.17em;font-weight:800;color:#978b7b;text-transform:uppercase}.top h2{font-size:27px;letter-spacing:-.055em;margin:5px 0 0}
.presence{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:17px;background:#f5f2eb;box-shadow:3px 4px 10px #a99e8c35}
.avatar{width:31px;height:31px;display:grid;place-items:center;border-radius:50%;background:#e8d3ae;color:#8a5c23;font-weight:750}.presence strong{font-size:12px}.presence small{display:block;color:#8c8376;font-size:11px;margin-top:2px}
.section-head{display:flex;justify-content:space-between;align-items:center;margin:22px 0 12px;gap:10px}.active-filter{display:inline-flex;align-items:center;border:1px solid #d5c5a8;background:#f7f2e9;color:#785c31;border-radius:12px;padding:9px 13px;margin:0 0 15px;font:650 12px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;cursor:pointer}.active-filter.selected{background:#e99524;color:#fff;border-color:#e99524}.active-filter:focus-visible{outline:2px solid #e99524;outline-offset:3px}.dark .active-filter{background:#39332b;color:#edc890;border-color:#6b563b}.dark .active-filter.selected{background:#e99524;color:#1e1913}.room-context{display:grid;gap:10px;margin:0 0 16px;padding:12px;border-radius:17px;background:#f5f1e9;border:1px solid #ffffffa0}.room-context-row,.room-filters,.room-actions{display:flex;gap:7px;flex-wrap:wrap;align-items:center}.room-chip{display:inline-flex;align-items:center;gap:5px;padding:7px 9px;border-radius:10px;background:#ffffff8c;color:#74695c;font-size:11px;font-weight:650}.room-filter,.room-quick{border:1px solid #d6c8b2;background:#fffaf1;color:#76572f;border-radius:10px;min-height:34px;padding:7px 10px;font:700 11px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;cursor:pointer}.room-filter.selected{background:#e99524;color:#fff;border-color:#e99524}.room-quick.attention{background:#fff0d7;border-color:#ddb777;color:#80561f}.room-quick.confirm{background:#a65f53;border-color:#a65f53;color:#fff}.dark .room-context{background:#2d333b;border-color:#454c55}.dark .room-chip{background:#ffffff0c;color:#d0c8bd}.dark .room-filter,.dark .room-quick{background:#393f47;color:#edc890;border-color:#62676d}.dark .room-filter.selected{background:#e99524;color:#1e1913}
.overview{display:flex;gap:9px;flex-wrap:wrap;margin:0 0 16px}.overview span{display:inline-flex;align-items:center;gap:6px;padding:8px 11px;background:#f4f0e9;border-radius:13px;color:#746a5d;font-size:11px;font-weight:650}.overview b{color:#3a342d;font-size:12px}.overview .overview-warning{background:#fff0d5;color:#865b20}.overview .overview-bad{background:#f6dfdc;color:#8a493f}.dark .overview .overview-warning{background:#5a472d;color:#ffd99a}.dark .overview .overview-bad{background:#5b3936;color:#f2b2aa}
.home-state{display:flex;align-items:center;gap:10px;padding:12px 14px;margin:0 0 15px;border-radius:16px;background:#f5f1e9;color:#6d6255;font-size:12px;font-weight:650}.home-state:before{content:'';width:8px;height:8px;border-radius:50%;background:#6f9b72;box-shadow:0 0 0 4px #6f9b7222}.home-state.attention:before{background:#c18b3b;box-shadow:0 0 0 4px #c18b3b22}.home-state.problem:before{background:#a55c52;box-shadow:0 0 0 4px #a55c5222}.dark .home-state{background:#303640;color:#d8d0c5}.section-head h3{font-size:16px;margin:0;letter-spacing:-.035em}.section-head small{font-size:11px;color:#91887c}
.tiles{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;min-width:0}
.tile{touch-action:pan-y;min-width:0;min-height:136px;border:1px solid #fff9;border-radius:22px;background:linear-gradient(145deg,#f8f6f1,#e5e1d9);box-shadow:5px 6px 12px #b2aa9b66,-4px -4px 12px #fff8;padding:16px;display:flex;flex-direction:column;justify-content:space-between;text-align:left;cursor:pointer;color:#34302a;font:inherit}
.tile.on{background:linear-gradient(145deg,#fff2d9,#e9cb98);border-color:#f7d9a7}.tile.missing{opacity:.53}.tile{transition:transform .2s ease,box-shadow .2s ease,background .2s ease;position:relative;overflow:hidden}.tile:hover{transform:translateY(-2px);box-shadow:6px 10px 18px #9c938666,-3px -3px 12px #fff9}.tile:active{transform:translateY(1px)}.tile.on:before{content:'';position:absolute;right:13px;top:13px;width:6px;height:6px;background:#c18b3b;border-radius:50%;box-shadow:0 0 0 4px #e8ba6a38}.tile.missing:before{display:none}.tile .glyph{flex-shrink:0}.tile.small{grid-column:span 1}.tile.medium{grid-column:span 2}.tile.large{grid-column:span 4}.tile .glyph{color:#75624a}.tile.on .glyph{color:#ac772c}.tile .tile-wrap{margin-top:14px}.tile-status{display:inline-flex;align-items:center;align-self:flex-start;gap:6px;padding:4px 8px;border-radius:9px;font-size:10px;font-weight:750;line-height:1.2}.tile-status:before{content:'';width:6px;height:6px;border-radius:50%;background:currentColor;flex:none}.tile-status-on{color:#85591f;background:#dcae5a35}.tile-status-offline{color:#8c665c;background:#b59b9250}.dark .tile-status-on{color:#f2c77d;background:#c69a4e24}.dark .tile-status-offline{color:#d6aaa2;background:#caa49d24}
.tile .glyph{width:38px;height:38px;display:grid;place-items:center;transform-origin:center;border-radius:12px;background:#ffffff80;transition:background .2s,transform .2s}.tile .glyph svg{width:25px;height:25px;display:block}.tile.on .glyph{background:#f9e1b7}.tile.on .glyph{color:#ac772c;filter:drop-shadow(0 0 5px #eab04d66)}
.tile[data-domain=fan].on .glyph svg{animation:velto-spin 2.4s linear infinite}.tile[data-domain=vacuum].on .glyph{animation:velto-bob 1.4s ease-in-out infinite}.tile[data-domain=climate].on .glyph{animation:velto-pulse 2s ease-in-out infinite}.tile[data-domain=media_player].on .glyph svg{animation:velto-pulse 1.8s ease-in-out infinite}.tile[data-domain=cover].on .glyph svg{animation:velto-rise 2.8s ease-in-out infinite}.tile[data-domain=light].on .glyph{animation:velto-light 3s ease-in-out infinite}.tile[data-domain=binary_sensor].on .glyph svg{animation:velto-pulse 2.2s ease-in-out infinite}@keyframes velto-spin{to{transform:rotate(360deg)}}@keyframes velto-bob{0%,100%{transform:translateX(-2px)}50%{transform:translateX(2px)}}@keyframes velto-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.65;transform:scale(1.08)}}@keyframes velto-rise{0%,100%{transform:translateY(1px)}50%{transform:translateY(-2px)}}@keyframes velto-light{0%,100%{box-shadow:0 0 0 0 #e9b45a00}50%{box-shadow:0 0 0 5px #e9b45a26}}
.media-progress{width:100%;height:5px;background:#b9b0a180;border-radius:99px;overflow:hidden;margin-top:4px}.media-progress-fill{display:block;height:100%;background:#e99524;border-radius:99px}.media-times{display:flex;justify-content:space-between;gap:8px;color:#81776b;font-size:10px}.dark .media-progress{background:#5a5248}.dark .media-progress-fill{background:#e2b36b}.media-title{font-size:12px;font-weight:750;overflow-wrap:anywhere}.media-app,.media-volume{font-size:11px;color:#81776b}.tile-controls{display:flex;gap:6px;margin-top:10px;position:relative;z-index:2}.tile-controls button{border:1px solid #d4c5af;background:#fff9;color:#75552d;border-radius:10px;min-width:34px;min-height:32px;padding:6px 9px;font:700 12px inherit;cursor:pointer}.tile-controls button:disabled{opacity:.35;cursor:default}.tile-controls button{min-width:44px;min-height:44px;display:inline-flex;align-items:center;justify-content:center;touch-action:manipulation}.tile-controls button:focus-visible{outline:2px solid #b77c32;outline-offset:3px}.tile-controls button[aria-busy=true]{opacity:.55;cursor:progress}.tile-controls button svg{width:18px;height:18px;display:block;fill:currentColor}.tile[data-domain=media_player] .glyph svg{fill:currentColor}.tile[data-domain=media_player] .glyph.media-playing svg{animation:velto-media-breathe 2.6s ease-in-out infinite;transform-origin:center}@keyframes velto-media-breathe{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.08);opacity:.78}}@media(prefers-reduced-motion:reduce){.tile,.tile .glyph,.tile .glyph svg{animation:none!important;transition:none!important}.tile:hover,.tile:active{transform:none!important}}.dark .tile-controls button{background:#3b4149;color:#efc784;border-color:#626a73}.device-meta{display:flex;gap:8px;flex-wrap:wrap;margin-top:7px;font-size:10px;color:#84796d}.device-meta span{background:#ffffff70;padding:4px 7px;border-radius:8px}.dark .device-meta span{background:#ffffff10;color:#c9c1b6}
.camera-tile-art{display:block;width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:13px;margin-top:10px;background:#292724}.camera-tile-art[hidden]{display:none}.dark .camera-tile-art{background:#171a1e}
.media-art{width:100%;max-height:110px;object-fit:cover;border-radius:12px}.tile b{display:block;font-size:13px;overflow-wrap:break-word;word-break:normal;hyphens:auto;line-height:1.35}.tile small{display:block;font-size:11px;color:#81776b;margin-top:5px;overflow-wrap:break-word;word-break:normal}.tile-wrap{min-width:0;display:flex;flex-direction:column;gap:7px}.brightness{width:100%;appearance:none;-webkit-appearance:none;cursor:pointer;touch-action:pan-x;height:10px;margin:9px 0;border:1px solid #d5c5a8;border-radius:999px;background:linear-gradient(to right,#e99524 0%,#e99524 var(--brightness,0%),#d9d2c6 var(--brightness,0%),#d9d2c6 100%)}.brightness::-webkit-slider-thumb{appearance:none;-webkit-appearance:none;width:22px;height:22px;border-radius:50%;border:3px solid #fff9;background:#e99524;box-shadow:0 2px 6px #0003}.brightness::-moz-range-thumb{width:16px;height:16px;border-radius:50%;border:3px solid #fff9;background:#e99524;box-shadow:0 2px 6px #0003}.dark .brightness{border-color:#6a5a46;background:linear-gradient(to right,#e3b66d 0%,#e3b66d var(--brightness,0%),#4b4b4b var(--brightness,0%),#4b4b4b 100%)}.dark .brightness::-webkit-slider-thumb,.dark .brightness::-moz-range-thumb{background:#e3b66d}.brightness:focus-visible{outline:2px solid #e99524;outline-offset:3px}.brightness-label{font-size:10px;color:#846b49}.tile:has(.brightness){min-height:160px}
.weather{display:grid;grid-template-columns:minmax(120px,1fr) 2fr;gap:16px;padding:19px;border-radius:24px;background:linear-gradient(145deg,#f9f6f0,#e8e3da);box-shadow:inset 2px 2px 6px #c8c0b5,inset -2px -2px 8px #fff}
.weather .temperature{font-size:38px;font-weight:800;letter-spacing:-.06em;margin:8px 0}.weather .air{font-size:12px;font-weight:650;color:#77736e}.weather .air-good{color:#317b50}.weather .air-moderate{color:#aa6800}.weather .air-bad{color:#b13f37}.dark .weather .air-good{color:#87d4a2}.dark .weather .air-moderate{color:#f3c477}.dark .weather .air-bad{color:#ff9d91}
.metrics{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.metric{border-radius:13px;background:#ebe6dd;padding:10px 12px;min-width:0}.metric small{display:block;font-size:10px;color:#81786d}.metric strong{font-size:15px;display:block;margin-top:6px;overflow-wrap:anywhere}.pm-metric{border:1px solid #e6ddcf;border-radius:16px}.pm-good{background:#e3f5e9}.pm-moderate{background:#fff0cd}.pm-bad{background:#ffe5d4}.pm-very-bad{background:#ffe0dc}.pm-unknown{background:#f0ede8}.pm-label{display:block;font-size:11px;font-weight:700;margin-top:5px;color:#51483f}.dark .pm-good{background:#204333}.dark .pm-moderate{background:#514023}.dark .pm-bad{background:#583b2b}.dark .pm-very-bad{background:#542d30}.dark .pm-label{color:#fff1dc}
.weather-forecast{grid-column:1/-1;margin-top:4px}.forecast-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:0 0 9px}.forecast-head strong{font-size:12px}.forecast-head small{font-size:10px;color:#8a8176}.forecast-strip{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:7px;overflow-x:auto;padding-bottom:2px;scroll-snap-type:x proximity;overscroll-behavior-x:contain}.forecast-day{min-width:0;padding:10px 8px;border-radius:14px;background:#f2ede5;border:1px solid #ffffffb0;text-align:center;display:grid;gap:5px;scroll-snap-align:start}@container (max-width:780px){.forecast-strip{grid-template-columns:repeat(7,minmax(105px,1fr))}.forecast-day{min-width:105px}}.forecast-day .forecast-name{font-size:10px;font-weight:800;text-transform:capitalize;color:#766d62}.forecast-day .forecast-symbol{font-size:28px;line-height:1.2;color:#d8871a;display:inline-block;transform-origin:center}.forecast-day .forecast-symbol svg{width:28px;height:28px;display:block;margin:auto}.forecast-sunny .forecast-symbol{color:#f59e0b;animation:velto-weather-glow 3.5s ease-in-out infinite}.forecast-wet .forecast-symbol{color:#4b9bd3;animation:velto-weather-float 2.7s ease-in-out infinite}.forecast-cloudy .forecast-symbol{color:#8399ad;animation:velto-weather-float 4s ease-in-out infinite}.forecast-snowy .forecast-symbol{color:#63b5df;animation:velto-weather-float 3.4s ease-in-out infinite}@keyframes velto-weather-glow{50%{transform:scale(1.14);filter:drop-shadow(0 0 5px #fbbf24aa)}}@keyframes velto-weather-float{50%{transform:translateY(-3px)}}@media(prefers-reduced-motion:reduce){.forecast-day .forecast-symbol{animation:none!important}}.forecast-day .forecast-temp{font-size:13px;font-weight:800}.forecast-day .forecast-low{font-size:10px;color:#8c8378}.forecast-day .forecast-rain{font-size:9px;color:#6f7d89}.forecast-status{grid-column:1/-1;padding:9px 10px;border-radius:11px;background:#f4f0e9;font-size:11px;color:#80766a}.dark .forecast-day{background:#303640;border-color:#454c55}.dark .forecast-day .forecast-name,.dark .forecast-day .forecast-low,.dark .forecast-head small{color:#b9b1a7}.dark .forecast-day .forecast-symbol{color:#efc784}.dark .forecast-status{background:#303640;color:#c9c1b7}
 .empty{padding:18px;color:#8b8173;font-size:13px}.empty-start{margin:10px 0 18px;border:1px dashed #c4b7a6;border-radius:17px;background:#f6f2eb;line-height:1.6}.dark .empty-start{background:#303640;border-color:#60646a;color:#d6cec1}.hint{margin-top:18px;font-size:11px;color:#8f867a}
@media(max-width:900px){.layout{grid-template-columns:145px minmax(0,1fr);gap:15px}.tiles{grid-template-columns:repeat(2,minmax(0,1fr))}.tile.large{grid-column:span 2}.sidebar{padding-right:10px}}
@media(max-width:600px){.layout{display:block;padding:14px;border-radius:23px}.sidebar{border-right:0;padding:0 0 12px;margin-bottom:14px}.brand{font-size:22px}.nav{flex-direction:row;overflow-x:auto;gap:6px}.nav button{white-space:nowrap;padding:10px;scroll-snap-align:start;flex:none}.nav-count{margin-left:4px}.nav{scroll-snap-type:x proximity;overscroll-behavior-x:contain;scrollbar-width:thin}.sidebar-note{display:none}.top h2{font-size:23px}.presence{padding:7px}.tiles{gap:9px}.tile{min-height:122px;padding:13px;border-radius:19px}.weather{grid-template-columns:1fr}.metrics{grid-template-columns:repeat(2,minmax(0,1fr))}}
@container (max-width:820px){.layout{grid-template-columns:150px minmax(0,1fr);gap:14px;padding:15px}.sidebar{padding-right:10px}.tiles{grid-template-columns:repeat(2,minmax(0,1fr))}.tile.large{grid-column:span 2}.tile.medium{grid-column:span 2}}
@container (max-width:600px){.layout{display:block;padding:14px;border-radius:23px}.sidebar{border-right:0;padding:0 0 12px;margin:0 0 12px}.brand{font-size:22px}.nav{flex-direction:row;overflow-x:auto;gap:6px}.nav button{white-space:nowrap;padding:10px}.nav-count{margin-left:4px}.sidebar-note{display:none}.top h2{font-size:23px}.presence{padding:7px}.tiles{grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.tile{min-height:122px;padding:13px;border-radius:19px}.tile.small{grid-column:span 1}.tile.medium,.tile.large{grid-column:span 2}.weather{grid-template-columns:1fr}.metrics{grid-template-columns:repeat(2,minmax(0,1fr))}}
@container (max-width:340px){.tiles{grid-template-columns:1fr}.tile.small,.tile.medium,.tile.large{grid-column:span 1}.tile{min-height:108px}.top{flex-wrap:wrap}.weather{padding:13px}.metric{padding:9px}}
.layout.dark{background:#1e232b;color:#f1ede6;box-shadow:8px 10px 28px #0005}
.dark .sidebar{border-color:#3a4149}.dark .nav button{color:#b6b3ad}.dark .nav button.selected{background:#373d43;color:#f0bc6a;box-shadow:inset 2px 2px 6px #14171a,inset -2px -2px 6px #4a5057}
.dark .nav-count{color:#d2c6b7;background:#ffffff12}.dark .nav-active{background:#e6b86d}.dark .sidebar-note,.dark .eyebrow,.dark .section-head small,.dark .hint{color:#a7a29a}.dark .nav button:hover:not(.selected){background:#ffffff12}.dark .tile .glyph{color:#d7c8b4}
.dark .top h2,.dark .section-head h3{color:#f4efe8}.dark .presence{background:#303640;box-shadow:3px 4px 10px #0005}.dark .presence small{color:#b1aba1}
.dark .tile{background:linear-gradient(145deg,#353c45,#262c34);border-color:#4c535c;color:#f2ece4;box-shadow:5px 6px 12px #0006,-3px -3px 10px #ffffff08}
.dark .tile.on{background:linear-gradient(145deg,#665034,#3e352b);border-color:#997449}.dark .tile .glyph{background:#ffffff0d}.dark .tile.on .glyph{background:#b8873d33}.dark .tile:hover{box-shadow:6px 10px 18px #0008,-3px -3px 12px #ffffff10}.dark .tile.on:before{background:#e6b86d;box-shadow:0 0 0 4px #d4a24c30}.dark .tile small{color:#c6beb1}
.dark .weather{background:linear-gradient(145deg,#353b43,#282e36);box-shadow:inset 2px 2px 6px #151a20,inset -2px -2px 8px #4a515a}
.dark .metric{background:#222830}.dark .metric small{color:#bab2a8}.dark .metric strong{color:#f5efe5}
.dark .overview span{background:#303640;color:#b9b3aa}.dark .overview b{color:#f4e8d8}.dark .empty{color:#b5aea4}
.calendar-refresh{border:1px solid #e9952460;border-radius:10px;background:transparent;color:inherit;padding:7px 10px;cursor:pointer;font:600 11px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}.calendar-refresh:hover{background:#e9952420}.calendar-refresh:disabled{opacity:.45;cursor:wait}.calendar-refresh:focus-visible{outline:2px solid #e99524;outline-offset:2px}.waste-section{margin-top:18px}.waste-card{display:flex;align-items:center;gap:14px;min-width:0;padding:15px 17px;border-radius:20px;background:#f7f4ee;border:1px solid #ffffffb0;box-shadow:3px 4px 10px #0000000a}.waste-bin{width:48px;height:48px;flex:none;display:grid;place-items:center;border-radius:15px;font-size:29px;background:#e5dfd6;color:#292724}.waste-bin svg{width:27px;height:27px;display:block;flex:none}.waste-recycling .waste-bin{background:linear-gradient(135deg,#f0d8d3 0 25%,#f1e6c5 25% 50%,#d5e7d8 50% 75%,#d5e2f0 75%);color:#98702f}.waste-copy{display:grid;gap:4px;min-width:0}.waste-copy small,.waste-next{font-size:11px;color:#82786d}.waste-copy strong{font-size:18px;line-height:1.15}.waste-copy span{font-size:12px;color:#776e64}.waste-countdown{margin-left:auto;flex:none;padding:8px 11px;border-radius:12px;background:#e995241c;color:#95611f;font-size:12px;font-weight:800;white-space:nowrap}.waste-next{margin:8px 2px 0}.dark .waste-card{background:#303640;border-color:#454c55;color:#f1ece5}.dark .waste-bin{background:#242930;color:#d6d0c7}.dark .waste-recycling .waste-bin{background:#51432f;color:#efc784}.dark .waste-copy span,.dark .waste-copy small,.dark .waste-next{color:#c0b9ae}.dark .waste-countdown{background:#e9952428;color:#efc784}@container(max-width:520px){.waste-card{gap:10px;padding:12px}.waste-bin{width:42px;height:42px;font-size:25px}.waste-copy strong{font-size:16px}.waste-countdown{padding:7px 8px;font-size:11px}}.calendar-section{margin-top:18px}.calendar-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.calendar-event{display:flex;gap:12px;align-items:center;background:#f7f4ee;border:1px solid #ffffffb0;padding:13px;border-radius:18px;min-width:0;box-shadow:3px 4px 10px #0000000a}.calendar-date{min-width:48px;border-radius:12px;padding:8px 6px;background:#e9dfce;text-align:center;display:grid;gap:2px}.calendar-date b{font-size:20px;line-height:1}.calendar-date small{font-size:11px;color:#8c7658;text-transform:uppercase}.calendar-copy{display:grid;gap:5px;min-width:0}.calendar-copy strong{font-size:13px;overflow-wrap:anywhere}.calendar-copy small{font-size:11px;color:#776e64}.calendar-location{opacity:.85}.calendar-empty{padding:20px;border-radius:16px;background:#f7f4ee;color:#746c61;font-size:13px}.dark .calendar-event,.dark .calendar-empty{background:#303640;border-color:#454c55;color:#f1ece5}.dark .calendar-date{background:#55432c}.dark .calendar-date small{color:#f0c17e}.dark .calendar-copy small{color:#c0b9ae}@container(max-width:620px){.calendar-list{grid-template-columns:1fr}}.registry-warning{border:1px solid #d8b16f;background:#fff3dc;color:#79531d;padding:12px 16px;border-radius:14px;margin:14px 0;font-size:13px}.dark .registry-warning{background:#423626;color:#f1d29e;border-color:#866b41}.retry-button{border:1px solid currentColor;border-radius:10px;padding:6px 10px;margin-left:8px;background:transparent;color:inherit;font:inherit;font-weight:700;cursor:pointer}.retry-button:focus-visible{outline:2px solid #e99524;outline-offset:2px}@media(prefers-reduced-motion:reduce){.tile,.tile .glyph,.tile .glyph svg,.nav button{animation:none!important;transition:none!important}.tile:hover,.tile:active{transform:none!important}}
/* VELTO navigation and control density */
.weather>.weather-forecast{grid-column:1 / -1;width:100%;min-width:0;max-width:100%}
.weather>.weather-forecast .forecast-strip{width:100%;min-width:0}
@media(max-width:680px){.weather{grid-template-columns:minmax(0,1fr)}.weather>.weather-forecast{grid-column:1}}

.layout .sidebar{gap:10px;min-width:0}.layout .sidebar-tools{order:0;min-width:0;border:1px solid #ffffff25;border-radius:14px;padding:7px;background:#ffffff0b}.layout .nav{order:1}.layout .sidebar-note{order:2;margin-top:auto}.sidebar-tools summary{font-size:12px;font-weight:750;cursor:pointer;padding:8px 5px;list-style-position:inside;overflow-wrap:anywhere}.sidebar-tools[open]{max-height:min(62vh,560px);overflow:auto;overscroll-behavior:contain}.sidebar-tools .home-state{margin:8px 0}.sidebar-tools .overview{margin:8px 0;grid-template-columns:repeat(2,minmax(0,1fr))}.sidebar-tools .overview span{min-width:0;overflow-wrap:anywhere}.sidebar-tools .room-context{margin:8px 0;padding:7px}.sidebar-tools .room-filter,.sidebar-tools .room-quick,.sidebar-tools .active-filter{max-width:100%;white-space:normal;overflow-wrap:anywhere;line-height:1.3}.sidebar-tools .active-filter{width:100%;margin-top:6px;padding:9px}.sidebar-collapsed .sidebar-tools{display:none!important}.layout.sidebar-collapsed{grid-template-columns:90px minmax(0,1fr);gap:14px}.sidebar-collapsed .sidebar{padding-right:10px}.sidebar-collapsed .nav{width:100%;align-items:center}.sidebar-collapsed .nav button{position:relative;width:56px;height:56px;min-height:56px;padding:0!important;margin:0 auto;justify-content:center!important;align-items:center;gap:0;font-size:0!important}.sidebar-collapsed .nav button svg{display:block;width:23px;height:23px;margin:0!important;flex:none}.sidebar-collapsed .nav button ha-icon{--mdc-icon-size:23px;width:23px;height:23px;margin:0!important;flex:none}.sidebar-collapsed .nav-active{display:block!important;position:absolute;right:6px;top:7px;width:8px;height:8px;background:#f7a531;box-shadow:0 0 0 3px #f7a53144}.sidebar-collapsed .nav-count{display:none!important}.sidebar-collapsed .brand-row{width:100%}.sidebar-collapsed .brand{font-size:17px}.top .velto-fullscreen,.top .velto-edit,.top .velto-theme{width:38px;height:38px;min-width:38px;min-height:38px;display:grid;place-items:center;padding:0;border-radius:12px;font-size:21px;line-height:1;cursor:pointer}.velto-top-actions{display:flex;align-items:center;gap:6px;flex:none}.top{justify-content:flex-start;gap:10px;flex-wrap:wrap}.top h2{margin-right:auto}.top .velto-top-actions button{width:34px;height:34px;min-width:34px;min-height:34px;font-size:18px}.top .presence{flex:none}@media(max-width:520px){.top{gap:8px}.top h2{font-size:24px}.velto-top-actions{gap:4px}.top .velto-top-actions button{width:32px;height:32px;min-width:32px;min-height:32px}.top .presence{padding:6px 8px;gap:6px}.top .presence .avatar{width:27px;height:27px}}.top .velto-theme{border:1px solid #d2a35d;background:#fff4dd;color:#b16e12}.dark .top .velto-theme{background:#343941;color:#f7bd61;border-color:#706047}.top h2{margin-right:auto}.weather-forecast{min-width:0;width:100%;grid-column:1/-1;display:block;box-sizing:border-box}.weather{min-width:0;width:100%;box-sizing:border-box}.forecast-strip{width:100%;grid-template-columns:repeat(7,minmax(0,1fr))}.forecast-day{width:100%;min-width:0}.forecast-missing{opacity:.52}.pm-metric{border:1px solid #dcd5ca!important;border-left:1px solid #dcd5ca!important;position:relative}.pm-metric .pm-label{display:inline-block;border-radius:8px;padding:6px 9px;font-size:11px;line-height:1.35;font-weight:800;margin-top:9px;max-width:100%}.pm-metric .pm-explain{font-size:10px;margin-top:5px;opacity:.85}.pm-good .pm-label{background:#087647;color:white}.pm-moderate .pm-label{background:#a87900;color:white}.pm-bad .pm-label{background:#c44b10;color:white}.pm-very-bad .pm-label{background:#a81235;color:white}.pm-unknown .pm-label{background:#626872;color:white}@container (max-width:780px){.forecast-strip{grid-template-columns:repeat(7,minmax(105px,1fr))}.forecast-day{min-width:105px}}@media(prefers-reduced-motion:reduce){.sidebar-collapsed .nav button{transition:none}}

/* VELTO desktop density and consistent navigation */
.top{display:flex;align-items:center;flex-wrap:nowrap}.top>div:first-child{display:flex;align-items:baseline;gap:12px;min-width:0;margin-right:auto}.top h2{margin-right:0}.velto-clock{font-size:15px;font-weight:650;color:#8b7f70;font-variant-numeric:tabular-nums;white-space:nowrap}.top .velto-top-actions{margin-left:auto}.top .presence{margin-left:0}.sidebar .overview{grid-template-columns:1fr}.sidebar .overview span,.sidebar .room-context,.sidebar .room-filter,.sidebar .room-quick,.sidebar .active-filter,.sidebar .nav button{width:100%;max-width:100%;box-sizing:border-box}.sidebar .nav button{min-width:0}.sidebar .nav button .nav-name{min-width:0;overflow:hidden;text-overflow:ellipsis}.weather{grid-template-columns:minmax(145px,.9fr) minmax(190px,1.3fr) minmax(300px,2.6fr);gap:12px;align-items:start}.weather .metrics{grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}.weather .metric{padding:8px 10px}.weather .metric strong{font-size:13px}.weather .pm-label{font-size:10px;padding:5px 7px}.weather .weather-forecast{grid-column:3;grid-row:1;margin-top:0}.weather .forecast-strip{grid-template-columns:repeat(7,minmax(0,1fr))}.weather-condition-symbol{display:inline-flex;align-items:center;margin-right:7px;vertical-align:middle;color:#d89120}.weather-condition-symbol svg{display:block;width:18px;height:18px}.calendar-section .section-head{display:flex;align-items:center;gap:12px}.calendar-actions{display:flex;align-items:center;gap:12px;margin-left:auto;white-space:nowrap}.calendar-actions small{color:#8b8175}.calendar-list{grid-template-columns:repeat(auto-fit,minmax(205px,max-content));justify-content:start;align-items:stretch}.calendar-event{width:auto;max-width:340px;min-width:205px}.calendar-last-checked{display:block;margin-bottom:8px;color:#82786d}@container(max-width:1120px){.weather{grid-template-columns:minmax(130px,1fr) minmax(180px,2fr)}.weather .weather-forecast{grid-column:1/-1;grid-row:auto}.calendar-list{grid-template-columns:repeat(auto-fit,minmax(205px,1fr))}.calendar-event{max-width:none}}@container(max-width:620px){.top{flex-wrap:wrap}.top>div:first-child{width:100%;margin-right:0}.top .velto-top-actions{margin-left:auto}.weather{grid-template-columns:1fr}.weather .weather-forecast{grid-column:1}.calendar-list{grid-template-columns:1fr}.calendar-event{width:100%}.sidebar .overview{grid-template-columns:1fr}}

/* Sidebar labels and compact context chips */
.sidebar .room-context-row{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:5px}.sidebar .room-context-row .room-chip{min-width:0;width:100%;padding:6px 7px;font-size:10px;overflow-wrap:anywhere}.sidebar .room-context-row .room-chip:only-child{grid-column:1/-1}
/* Forecast fills the remaining row and shares a baseline with PM measurements */
@container(min-width:1121px){.weather{grid-template-columns:minmax(145px,.85fr) minmax(190px,1.2fr) minmax(0,3fr);align-items:stretch}.weather>.weather-forecast{grid-column:3;grid-row:1;display:flex;flex-direction:column;min-width:0;width:100%;align-self:stretch}.weather .forecast-strip{flex:1;display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:6px;min-width:0;width:100%;align-items:stretch;overflow-x:auto}.weather .forecast-day{min-width:0;width:100%;height:100%;align-content:center}.weather .metrics{align-self:stretch}.weather .metric{display:flex;flex-direction:column;justify-content:center}.weather .pm-label{margin-top:auto}}
@container(min-width:621px) and (max-width:1120px){.weather .forecast-strip{grid-template-columns:repeat(6,minmax(0,1fr))}}

/* Mobile compact sidebar and fullscreen fallback for iOS WebKit */
.layout.fullscreen-fallback{position:fixed!important;inset:0!important;z-index:99999!important;width:100vw!important;height:100vh!important;height:100dvh!important;box-sizing:border-box!important;overflow:auto!important;overscroll-behavior:contain;-webkit-overflow-scrolling:touch!important;border-radius:0!important;padding:calc(14px + env(safe-area-inset-top,0px)) calc(14px + env(safe-area-inset-right,0px)) calc(14px + env(safe-area-inset-bottom,0px)) calc(14px + env(safe-area-inset-left,0px))!important;background:var(--primary-background-color,#eeeae2)}
.layout.fullscreen-fallback .top{position:sticky;top:0;z-index:20;padding:8px 0;background:var(--card-background-color,#fff)}
.layout.fullscreen-fallback.dark .top{background:#252a31}
@media(max-width:600px){.brand-row,.sidebar-collapsed .brand-row{flex-direction:row!important;align-items:center!important;justify-content:space-between!important;width:100%}.layout.sidebar-collapsed{display:block!important}.sidebar-collapsed .sidebar{width:100%;padding:0 0 10px!important}.sidebar-collapsed .nav{display:flex;flex-direction:row;width:100%;overflow-x:auto;align-items:center;gap:6px}.sidebar-collapsed .nav button{flex:0 0 44px;width:44px;height:44px;min-height:44px;margin:0;padding:0!important}.sidebar-collapsed .brand{font-size:22px}}
@container (max-width:600px){.brand-row,.sidebar-collapsed .brand-row{flex-direction:row!important;align-items:center!important;justify-content:space-between!important;width:100%}.layout.sidebar-collapsed{display:block!important}.sidebar-collapsed .sidebar{width:100%;padding:0 0 10px!important}.sidebar-collapsed .nav{display:flex;flex-direction:row;width:100%;overflow-x:auto;align-items:center;gap:6px}.sidebar-collapsed .nav button{flex:0 0 44px;width:44px;height:44px;min-height:44px;margin:0;padding:0!important}.sidebar-collapsed .brand{font-size:22px}}
.weather-history-target{cursor:pointer;touch-action:pan-y}.weather-history-target:focus-visible{outline:2px solid #e99524;outline-offset:3px}
.velto-history-modal{max-width:min(640px,94vw)}.velto-history-ranges{display:flex;gap:8px;margin:12px 0}.velto-history-range{border:1px solid #d9c5a8;border-radius:10px;padding:9px 13px;background:transparent;color:inherit;cursor:pointer}.velto-history-range[aria-pressed=true]{background:#e99524;color:#241b0e}.velto-history-body{min-height:120px}.velto-history-chart{display:block;width:100%;height:auto;max-height:220px;background:#ffffff12;border-radius:12px}.velto-history-summary,.velto-history-times{font-size:12px;line-height:1.6;overflow-wrap:anywhere}

/* Mobile dashboard: compact rooms, one-line status, readable horizontal forecast */
@media(max-width:780px){
.layout .sidebar .nav,.layout.sidebar-collapsed .sidebar .nav{display:flex!important;flex-direction:row!important;flex-wrap:nowrap!important;overflow-x:auto!important;gap:7px!important;scroll-snap-type:x proximity;padding:4px 1px 9px!important;width:100%;-webkit-overflow-scrolling:touch}
.layout .sidebar .nav button,.layout.sidebar-collapsed .sidebar .nav button{display:inline-flex!important;flex:0 0 auto!important;width:auto!important;max-width:160px;min-width:44px!important;height:44px!important;min-height:44px!important;padding:8px 12px!important;font-size:12px!important;gap:6px!important;white-space:nowrap!important;scroll-snap-align:start}
.layout.sidebar-collapsed .sidebar .nav button{font-size:0!important;padding:8px 11px!important;width:44px!important}
.layout .sidebar .nav button svg{width:19px;height:19px;flex:none}
.layout .top{display:flex!important;flex-wrap:nowrap!important;align-items:center!important;gap:6px!important;width:100%;min-width:0}
.layout .top>div:first-child{display:flex;align-items:baseline;gap:5px;min-width:0;flex:1 1 auto;white-space:nowrap}
.layout .top h2{font-size:clamp(14px,3.9vw,21px)!important;margin:0!important;white-space:nowrap}
.layout .top .velto-clock{font-size:11px!important;white-space:nowrap}
.layout .top .velto-top-actions{display:flex!important;flex:0 0 auto;gap:3px!important}
.layout .top .velto-top-actions button{width:29px!important;height:31px!important;min-width:29px!important;min-height:31px!important;font-size:16px!important;padding:0!important}
.layout .top .presence{flex:0 0 auto!important;padding:4px!important;gap:4px!important;min-width:0}
.layout .top .presence .avatar{width:25px!important;height:25px!important}
.layout .top .presence strong{font-size:11px!important}
.layout .top .presence small{font-size:9px!important}
.layout .forecast-strip{display:grid!important;grid-auto-flow:column!important;grid-auto-columns:112px!important;grid-template-columns:none!important;align-items:stretch!important;gap:8px!important;min-width:0!important;max-width:100%!important;overflow-x:auto!important;overscroll-behavior-x:contain!important;width:100%!important;padding:4px 1px 12px!important;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch}
.layout .forecast-strip .forecast-day{display:grid!important;box-sizing:border-box!important;width:100%!important;min-width:0!important;max-width:112px!important;overflow:hidden!important;padding:10px 6px!important;scroll-snap-align:start}
.layout .forecast-day>*{min-width:0;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
}
.calendar-actions{display:flex;align-items:center;gap:6px;flex-wrap:wrap}.calendar-privacy,.calendar-compact-toggle{border:1px solid #d2a35d;border-radius:10px;background:transparent;color:inherit;padding:7px 9px;cursor:pointer;font:inherit;font-size:11px}.calendar-privacy:focus-visible,.calendar-compact-toggle:focus-visible{outline:2px solid #e99524;outline-offset:2px}.calendar-compact .calendar-list{display:none!important}.calendar-private .calendar-event-title{filter:blur(5px);user-select:none;-webkit-user-select:none}.calendar-private .calendar-location{display:none!important}
@media(max-width:780px){.calendar-list{grid-template-columns:minmax(0,1fr)!important}.calendar-actions{justify-content:flex-end}.calendar-event{min-width:0}}


/* Final mobile overrides: keep room buttons compact, forecast cards isolated and calendar actions legible */
@media(max-width:780px){.layout .sidebar .nav button{max-width:140px!important}.layout.sidebar-collapsed .sidebar .nav button{width:44px!important;max-width:44px!important}.layout .forecast-strip{grid-auto-columns:112px!important;grid-auto-flow:column!important;grid-template-columns:none!important;justify-content:start!important}.layout .forecast-strip .forecast-day{margin:0!important;transform:none!important;position:relative!important;left:auto!important;right:auto!important}}
.calendar-privacy,.calendar-compact-toggle{color:#a96a17!important;background:#fff7e9!important;border-color:#dfb977!important;min-width:34px;min-height:34px;font-size:19px!important;font-weight:700!important}.calendar-privacy:disabled,.calendar-compact-toggle:disabled{opacity:.4;cursor:default}.calendar-private .calendar-event-title{filter:blur(7px)!important;opacity:.9!important}.calendar-private .calendar-event-title::selection{background:transparent}
/* Unified accessible calendar toolbar, including dark mode */
.calendar-actions{gap:6px}.calendar-actions button.calendar-refresh,.calendar-actions button.calendar-privacy,.calendar-actions button.calendar-compact-toggle{display:inline-flex!important;align-items:center;justify-content:center;box-sizing:border-box;flex:0 0 32px;width:32px;height:32px;min-height:32px;padding:0!important;border:1px solid #bfa57c!important;border-radius:9px!important;background:#f5f0e7!important;color:#514333!important;font:700 19px/1 system-ui,sans-serif!important;box-shadow:none!important;opacity:1!important}.calendar-actions button.calendar-privacy[aria-pressed=true]{background:#f5deb9!important}.dark .calendar-actions button.calendar-refresh,.dark .calendar-actions button.calendar-privacy,.dark .calendar-actions button.calendar-compact-toggle{background:#343b45!important;border-color:#7e8997!important;color:#f4e9d8!important}.dark .calendar-actions button.calendar-privacy[aria-pressed=true]{background:#594a31!important;color:#ffe4a5!important}.calendar-actions button:focus-visible{outline:2px solid #e99524;outline-offset:2px}.calendar-actions button.calendar-refresh svg,.calendar-actions button.calendar-privacy svg,.calendar-actions button.calendar-compact-toggle svg{width:17px;height:17px;display:block;flex:none}

`;this._styleElement=css}root.append(css);
    const h=this._hass,c=this._config;
    const el=(tag,cls,txt)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(txt!==undefined)n.textContent=txt;return n};
    const shell=el('div','layout'+(((this._themeOverride||c.theme)==='dark'||!this._themeOverride&&c.theme==='auto'&&this._hass?.themes?.darkMode)?' dark':'')),side=el('aside','sidebar'),brand=el('div','brand');brand.append('VEL',el('span','', 'TO'));const collapse=el('button','sidebar-collapse',this._sidebarCollapsed?'›':'‹');collapse.type='button';collapse.title=this._sidebarCollapsed?'Rozwiń menu':'Zwiń menu';collapse.setAttribute('aria-label',collapse.title);collapse.setAttribute('aria-expanded',String(!this._sidebarCollapsed));collapse.addEventListener('click',()=>{this._sidebarCollapsed=!this._sidebarCollapsed;try{globalThis.localStorage?.setItem?.('velto:sidebar:collapsed',this._sidebarCollapsed?'1':'0')}catch{}this.render()});const brandRow=el('div','brand-row');brandRow.append(brand,collapse);side.append(brandRow);if(this._sidebarCollapsed)shell.classList.add('sidebar-collapsed');if(this._fullscreenFallback)shell.classList.add('fullscreen-fallback');
    const nav=el('nav','nav');nav.setAttribute('aria-label','Pomieszczenia');nav.setAttribute('data-velto-scroll-key','room-navigation');const discoveredRooms=this.getRooms();const rooms=[{id:'all',name:'Wszystkie',icon:'home'},...discoveredRooms];
    nav.addEventListener('keydown',e=>{
      if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
      const buttons=[...nav.querySelectorAll('button')],index=buttons.indexOf(e.target);
      if(index<0)return;
      e.preventDefault();
      const next=e.key==='Home'?0:e.key==='End'?buttons.length-1:(index+(e.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length;
      buttons[next]?.click();this.shadowRoot?.querySelectorAll('.nav button')?.[next]?.focus();
    });
    const roomStats=room=>{const ids=[...new Set((room.entities||[]).map(item=>typeof item==='string'?item:item?.entity).filter(Boolean))];return {total:ids.length,active:ids.filter(id=>['light','switch','fan','input_boolean'].includes(id.split('.')[0])&&this.entity(id)?.state==='on').length}};
    if(!rooms.some(r=>r.id===this._room))this._room='all';
    for(const room of rooms){const b=el('button',room.id===this._room?'selected':'');const roomName=(room.name||'').toLowerCase();const inferred=this.autoRoomIcon(room.name);const roomIcon=room.id==='all'?'home':(room.icon&&room.icon!=='home'&&room.icon!=='light'&&room.icon!=='plug'&&room.icon!=='sun'&&room.icon!=='door'?room.icon:inferred);b.append(this.phosphorRoomIcon(roomIcon),document.createTextNode(room.name));if(room.id!=='all'){const stats=roomStats(room),count=el('span','nav-count',String(stats.total));count.setAttribute('aria-hidden','true');b.append(count);if(stats.active){const dot=el('span','nav-active');dot.setAttribute('aria-hidden','true');b.append(dot)}}b.type='button';b.title=room.name;b.setAttribute('aria-label',room.name);b.setAttribute('data-velto-focus-key','room:'+room.id);if(room.id===this._room)b.setAttribute('aria-current','page');b.addEventListener('click',()=>{this._room=room.id;this._categoryFilter='all';this.render()});nav.append(b)}
    side.append(nav);const sidebarTools=el('details','sidebar-tools');sidebarTools.setAttribute('data-velto-scroll-key','sidebar-tools');sidebarTools.open=this._sidebarToolsOpen;sidebarTools.addEventListener('toggle',()=>{this._sidebarToolsOpen=sidebarTools.open});sidebarTools.append(el('summary','','Sterowanie i status'));side.insertBefore(sidebarTools,nav);side.append(el('div','sidebar-note','VELTO · Home Assistant'));shell.append(side);
    const main=el('main','main'),top=el('header','top'),heading=el('div');if(this._editLayout)shell.classList.add('editing');heading.append(el('h2','',this._room==='all'?(!c.title||c.title==='Mój dom'?'Mój dom':c.title):(rooms.find(r=>r.id===this._room)?.name||'Pokój')));top.append(heading);const clock=el('time','velto-clock');const updateClock=()=>{clock.textContent=new Date().toLocaleTimeString('pl-PL',{hour:'2-digit',minute:'2-digit'});clock.dateTime=new Date().toISOString()};updateClock();heading.append(clock);
    const fullscreen=el('button','velto-fullscreen');fullscreen.type='button';fullscreen.title='Pełny ekran';fullscreen.setAttribute('aria-label','Przełącz pełny ekran');fullscreen.addEventListener('click',()=>this.toggleFullscreen());
    const topActions=el('div','velto-top-actions');topActions.append(fullscreen);
    const edit=el('button','velto-edit',this._editLayout?'✓':'▦');edit.title=this._editLayout?'Zakończ układanie':'Ułóż kafelki';edit.setAttribute('aria-label',edit.title);
    edit.type='button';edit.setAttribute('aria-pressed',String(this._editLayout));
    edit.addEventListener('click',()=>{this._editLayout=!this._editLayout;this.render()});
    topActions.append(edit);
    const themeDark=shell.classList.contains('dark');const themeToggle=el('button','velto-theme',themeDark?'☀':'☾');themeToggle.type='button';themeToggle.title=themeDark?'Włącz jasny motyw':'Włącz ciemny motyw';themeToggle.setAttribute('aria-label',themeToggle.title);themeToggle.setAttribute('aria-pressed',String(themeDark));themeToggle.addEventListener('click',()=>{this._themeOverride=themeDark?'light':'dark';try{globalThis.localStorage?.setItem?.('velto:theme:override',this._themeOverride)}catch{}this.render()});topActions.append(themeToggle);
    if(c.presence?.entity){const p=el('div','presence'),state=this.text(c.presence.entity);p.append(el('span','avatar',c.presence.initials||'D'));const lines=el('div');lines.append(el('strong','',c.presence.name||'Domownik'),el('small','',state==='home'?'W domu':state==='not_home'?'Poza domem':state||'Brak danych'));p.append(lines);top.append(topActions,p)}else top.append(topActions)
    // Swipe between rooms on touch devices without hijacking sliders, buttons or vertical scrolling.
    let swipeStart=null;
    main.addEventListener('pointerdown',e=>{
      if(this._editLayout||e.pointerType!=='touch'||!e.isPrimary||e.target?.closest?.('button,input,select,textarea,a,[role="slider"],.velto-modal-backdrop')){swipeStart=null;return}
      swipeStart={id:e.pointerId,x:e.clientX,y:e.clientY};
    },{passive:true});
    main.addEventListener('pointercancel',()=>{swipeStart=null},{passive:true});
    main.addEventListener('pointerup',e=>{
      const start=swipeStart;swipeStart=null;
      if(!start||e.pointerId!==start.id||root.querySelector('.velto-modal-backdrop'))return;
      const dx=e.clientX-start.x,dy=e.clientY-start.y;
      if(Math.abs(dx)<85||Math.abs(dx)<Math.abs(dy)*1.5)return;
      const index=rooms.findIndex(r=>r.id===this._room),next=rooms[index+(dx<0?1:-1)];
      if(next){this._room=next.id;this._categoryFilter='all';this.render()}
    },{passive:true});
    main.append(top);
    if(this._editLayout){
      const tools=el('div','layout-tools'),mode=c.layout_persistence||'hybrid';
      const labels={hybrid:'Zapis: Home Assistant + to urządzenie',config:'Zapis: tylko konfiguracja HA',local:'Zapis: tylko to urządzenie'};
      const label=el('span',this._layoutStorageWarning?'layout-warning':'',this._layoutStorageWarning?'Lokalny zapis niedostępny':(labels[mode]||labels.hybrid));tools.append(label);
      if(this._room!=='all'){
        const resetRoom=el('button','','Resetuj pokój');resetRoom.type='button';resetRoom.addEventListener('click',()=>this.resetLayout(this._room));tools.append(resetRoom)
      }
      const resetAll=el('button','','Resetuj cały układ');resetAll.type='button';let armed=false,timer=null;
      resetAll.addEventListener('click',()=>{
        if(!armed){armed=true;resetAll.classList.add('confirm');resetAll.textContent='Potwierdź reset';clearTimeout(timer);timer=setTimeout(()=>{armed=false;resetAll.classList.remove('confirm');resetAll.textContent='Resetuj cały układ'},3500);return}
        clearTimeout(timer);this.resetLayout('all')
      });tools.append(resetAll);main.append(tools)
    }
    if(c.auto_areas&&this._registryError&&!this._registry){
      const warning=el('div','registry-warning');
      warning.append(el('span','', 'Nie udało się pobrać pomieszczeń z Home Assistant. Sprawdź uprawnienia użytkownika lub spróbuj ponownie. '));
      const retry=el('button','retry-button','Ponów próbę');retry.type='button';
      retry.addEventListener('click',()=>{this._registryFailedConnection=null;this._registryError=null;this.loadRegistry();this.render()});
      warning.append(retry);main.append(warning)
    }
    if(this._room==='all'&&discoveredRooms.length){
      const ids=[...new Set(discoveredRooms.flatMap(room=>(room.entities||[]).map(item=>typeof item==='string'?item:item?.entity).filter(Boolean)))];
      const active=ids.filter(id=>['light','switch','fan','input_boolean'].includes(id.split('.')[0])&&this.entity(id)?.state==='on').length;
      const open=ids.filter(id=>{const state=this.entity(id),domain=id.split('.')[0],dc=state?.attributes?.device_class;return domain==='lock'?state?.state==='unlocked':domain==='cover'?['open','opening'].includes(state?.state):domain==='binary_sensor'&&['door','window','opening','garage_door'].includes(dc)&&state?.state==='on'}).length;
      const playing=ids.filter(id=>id.startsWith('media_player.')&&this.entity(id)?.state==='playing').length;
      const offline=ids.filter(id=>{const state=this.entity(id);return !state||['unknown','unavailable'].includes(state.state)}).length;
      const status=el('div','home-state'+(offline?' problem':open?' attention':''));
      status.textContent=offline?offline+' urządzeń niedostępnych'+(open?' · '+open+' otwarte':''):open?open+' otwarte / odblokowane'+(playing?' · '+playing+' odtwarza':''):playing?playing+' urządzeń odtwarza':'Dom bez aktywnych ostrzeżeń';
      sidebarTools.append(status);
      const overview=el('div','overview');
      for(const [label,value,cls] of [['Pomieszczenia',discoveredRooms.length,''],['Urządzenia',ids.length,''],['Aktywne',active,''],['Otwarte',open,open?'overview-warning':''],['Media',playing,''],['Offline',offline,offline?'overview-bad':'']]){
        if((label==='Otwarte'||label==='Media'||label==='Offline')&&!value)continue;
        const caption=label==='Pomieszczenia'?this.polishCount(value,'pomieszczenie','pomieszczenia','pomieszczeń'):label==='Urządzenia'?this.polishCount(value,'urządzenie','urządzenia','urządzeń'):label==='Aktywne'?this.polishCount(value,'aktywny','aktywnych','aktywnych'):label==='Otwarte'?this.polishCount(value,'otwarta','otwarte','otwartych'):label.toLowerCase();const chip=el('span',cls);chip.append(el('b','',String(value)),' '+caption);overview.append(chip)
      }
      sidebarTools.append(overview)
    }
    if(!this._editLayout&&c.room_controls!==false&&discoveredRooms.length){
      const contextRoom=this._room==='all'?{id:'all',name:'Cały dom',entities:discoveredRooms.flatMap(room=>room.entities||[])}:discoveredRooms.find(room=>room.id===this._room);
      if(contextRoom){
        const context=this.roomContext(contextRoom),panel=el('section','room-context');
        const chips=el('div','room-context-row');
        if(Number.isFinite(context.temperature))chips.append(el('span','room-chip','🌡 '+context.temperature.toLocaleString('pl-PL',{maximumFractionDigits:1})+'°C'));
        if(context.lights.length)chips.append(el('span','room-chip',context.lightsOn.length+'/'+context.lights.length+' światła'));
        if(context.media.length)chips.append(el('span','room-chip',context.mediaPlaying.length+'/'+context.media.length+' media'));
        if(context.covers.length)chips.append(el('span','room-chip',context.coversOpen.length+'/'+context.covers.length+' otwarte osłony'));
        if(chips.children.length)panel.append(chips);
        const filters=el('div','room-filters'),filterDefs=[['all','Wszystko',context.ids.length],['lights','Światła',context.categories.lights],['media','Media',context.categories.media],['climate','Klimat',context.categories.climate],['covers','Osłony',context.categories.covers],['security','Bezpieczeństwo',context.categories.security]];
        for(const [key,label,count] of filterDefs){
          if(key!=='all'&&!count)continue;
          const b=el('button','room-filter'+(this._categoryFilter===key?' selected':''),label+(key==='all'?'':' · '+count));b.type='button';b.setAttribute('aria-pressed',String(this._categoryFilter===key));
          b.addEventListener('click',()=>{this._categoryFilter=key;this.render()});filters.append(b)
        }
        panel.append(filters);
        const actions=el('div','room-actions');
        const addBulk=(label,ids,domain,service)=>{
          if(!ids.length)return;
          const b=el('button','room-quick attention',label+' · '+ids.length);b.type='button';let armed=false,timer=null;
          b.addEventListener('click',()=>{
            if(this._room==='all'&&!armed){armed=true;b.classList.add('confirm');b.textContent='Potwierdź · '+label;clearTimeout(timer);timer=setTimeout(()=>{armed=false;b.classList.remove('confirm');b.textContent=label+' · '+ids.length},3500);return}
            clearTimeout(timer);this.bulkAction(domain,service,ids)
          });actions.append(b)
        };
        addBulk('Wyłącz światła',context.lightsOn,'light','turn_off');
        addBulk('Zamknij osłony',context.coversOpen,'cover','close_cover');
        if(c.scene_shortcuts!==false)for(const id of context.actions){
          const domain=id.split('.')[0],b=el('button','room-quick',(domain==='scene'?'Scena · ':'Skrypt · ')+(this.name(id)||id));b.type='button';b.addEventListener('click',()=>this.action(id,'toggle'));actions.append(b)
        }
        if(actions.children.length)panel.append(actions);
        sidebarTools.append(panel)
      }
    }
    const activeFilter=el('button','active-filter'+(this._activeOnly?' selected':''),this._activeOnly?'Pokaż wszystkie urządzenia':'Tylko włączone urządzenia');
    activeFilter.type='button';activeFilter.setAttribute('aria-pressed',String(this._activeOnly));activeFilter.addEventListener('click',()=>{this._activeOnly=!this._activeOnly;this.render()});
    sidebarTools.append(activeFilter);
    const technicalFilter=el('button','active-filter'+(this._hideTechnical?' selected':''),this._hideTechnical?'Pokaż urządzenia systemowe':'Ukryj urządzenia systemowe');
    technicalFilter.type='button';technicalFilter.setAttribute('aria-pressed',String(this._hideTechnical));
    technicalFilter.title='Wyświetl lub ukryj dodatkowe czujniki i elementy systemu. Nie usuwa urządzeń z Home Assistant';
    technicalFilter.addEventListener('click',()=>{this._hideTechnical=!this._hideTechnical;this.render()});
    sidebarTools.append(technicalFilter);
    const isTechnicalEntity=id=>{
      const domain=id.split('.')[0],name=(this.name(id)||'').toLowerCase(),state=this.entity(id);
      if(['update','number','select','input_number','input_select','button','input_button'].includes(domain))return true;
      if(['sensor','binary_sensor'].includes(domain)){
        if(state?.attributes?.entity_category==='diagnostic'||state?.attributes?.entity_category==='config')return true;
        return /(?:roborock|vacuum|brush|filter|mop|water box|cleaning count|charging|attached|time left|odkurzacz)/i.test(name)&&!/(?:battery|bateria|error|błąd)/i.test(name);
      }
      return false
    };
    const isActiveEntity=id=>['light','switch','fan','input_boolean'].includes(id.split('.')[0])&&this.entity(id)?.state==='on';
    const selected=discoveredRooms.filter(r=>(this._room==='all'||r.id===this._room)&&(!c.hide_empty_rooms||(r.entities||[]).length));
    if(this._room==='all'&&c.show_home_highlights!==false&&!this._editLayout){
      const highlights=this.homeHighlights(discoveredRooms);
      if(highlights.length)selected.unshift({id:'velto_highlights',name:'Najważniejsze',icon:'home',entities:highlights,_highlights:true})
    }
    if(this._activeOnly&&!selected.some(r=>(r.entities||[]).some(item=>isActiveEntity(typeof item==='string'?item:item?.entity||''))))main.append(el('div','empty empty-start','Brak włączonych urządzeń w wybranych pomieszczeniach.'));
    if(!selected.length&&!discoveredRooms.length&&!this._registryLoading){main.append(el('div','empty empty-start','Brak pomieszczeń do wyświetlenia. Włącz automatyczne wykrywanie obszarów lub dodaj pomieszczenia w edytorze karty.'))}
    for(const room of selected){
      const order=Array.isArray(c.tile_order?.[room.id])?c.tile_order[room.id]:[];
      const orderedEntities=[...(room.entities||[])].sort((a,b)=>{
        const idA=typeof a==='string'?a:a?.entity,idB=typeof b==='string'?b:b?.entity;
        const ia=order.indexOf(idA),ib=order.indexOf(idB);
        return (ia<0?Number.MAX_SAFE_INTEGER:ia)-(ib<0?Number.MAX_SAFE_INTEGER:ib)
      });
      const visibleEntities=orderedEntities.filter(item=>{const id=typeof item==='string'?item:item?.entity,domain=id?.split('.')[0];return id&&(!this._activeOnly||isActiveEntity(id))&&(!this._hideTechnical||!isTechnicalEntity(id))&&this.categoryMatch(id)&&(this._editLayout||c.room_controls===false||c.scene_shortcuts===false||!['scene','script'].includes(domain))});if((this._activeOnly||this._hideTechnical||this._categoryFilter!=='all'||c.scene_shortcuts!==false)&&!visibleEntities.length)continue;const header=el('div','section-head'),stats=roomStats(room);
      header.append(el('h3','',room.name),el('small','',room._highlights?'Automatycznie dobrane do bieżącego stanu domu':stats.total+' urządzeń'+(stats.active?' · '+stats.active+' aktywne':'')));main.append(header);
      const grid=el('div','tiles');for(const item of visibleEntities){const t=typeof item==='string'?{entity:item}:item;if(!t?.entity)continue;const s=this.entity(t.entity),domain=t.entity.split('.')[0],on=['on','open','unlocked','heat','cool','heating','playing','cleaning'].includes(s?.state),missing=!s||['unavailable','unknown'].includes(s.state),savedSize=c.tile_sizes?.[room.id]?.[t.entity],tileSize=['small','medium','large'].includes(savedSize)?savedSize:(['small','medium','large'].includes(t.size)?t.size:'small');
        const tile=el('div','tile '+tileSize+(on?' on':'')+(missing?' missing':''));tile.setAttribute('role',this._editLayout?'group':'button');tile.tabIndex=this._editLayout?-1:0;tile.dataset.entity=t.entity;tile.dataset.domain=domain;tile.setAttribute('aria-label',(t.name||this.name(t.entity))+': '+(s?.state||'brak danych'));if(['light','switch','fan','input_boolean'].includes(domain)&&!missing)tile.setAttribute('aria-pressed',String(on));
        const glyph=el('span','glyph');if(domain==='media_player'){
          const mediaName=String(t.name||this.name(t.entity)||'').toLowerCase();
          const mediaIcon=/monitor|display|screen/.test(mediaName)?'monitor-play':'television';
          glyph.append(this.phosphorRoomIcon(mediaIcon));
          if(s.state==='playing')glyph.classList.add('media-playing')
        }else glyph.append(this.icon(t.icon&&['light','switch','fan','cover','lock','climate','sensor','binary_sensor','scene','camera','input_boolean','media_player','vacuum','script','button','automation','humidifier','alarm_control_panel','remote','number','select','weather','motion','door','water','smoke','sun','plug'].includes(t.icon)?t.icon:this.iconFor(t.entity,s)));tile.append(glyph);const desc=el('div','tile-wrap');const labels=el('div');labels.append(el('b','',t.name||this.name(t.entity)),el('small','',missing?'Niedostępne':({on:'Włączone',off:'Wyłączone',open:'Otwarte',closed:'Zamknięte',opening:'Otwieranie',closing:'Zamykanie',home:'W domu',not_home:'Poza domem'}[s?.state]||s?.state||'Brak danych')+(s?.attributes?.unit_of_measurement?' '+s.attributes.unit_of_measurement:'')));desc.append(labels);
        if(domain==='media_player'&&!missing){
          const a=s.attributes||{},title=[a.media_title,a.media_artist].filter(x=>typeof x==='string'&&x.trim()).join(' · '),app=typeof a.app_name==='string'?a.app_name:typeof a.source==='string'?a.source:'';
          if(title)desc.append(el('span','media-title',title));
          if(app)desc.append(el('span','media-app',app));
          const duration=Number(a.media_duration),position=Number(a.media_position);
          if(s.state==='playing'&&Number.isFinite(duration)&&duration>0&&Number.isFinite(position)&&position>=0){
            const progress=Math.min(100,Math.max(0,position/duration*100));
            const clock=seconds=>{const n=Math.floor(seconds),h=Math.floor(n/3600),m=Math.floor(n%3600/60),sec=String(n%60).padStart(2,'0');return h?h+':'+String(m).padStart(2,'0')+':'+sec:m+':'+sec};
            const track=el('div','media-progress');track.setAttribute('role','progressbar');track.setAttribute('aria-label','Postęp odtwarzania');track.setAttribute('aria-valuemin','0');track.setAttribute('aria-valuemax','100');track.setAttribute('aria-valuenow',String(Math.round(progress)));
            const fill=el('span','media-progress-fill');fill.style.width=progress+'%';track.append(fill);
            const times=el('div','media-times');times.append(el('span','',clock(position)),el('span','',clock(duration)));desc.append(track,times)
          }
          if(Number.isFinite(Number(a.volume_level))&&a.volume_level!==null&&a.volume_level!==undefined)desc.append(el('span','media-volume','Głośność · '+Math.round(Math.max(0,Math.min(1,Number(a.volume_level)))*100)+'%'));
          const artUrl=this.mediaArtwork(a);if(artUrl){const art=document.createElement('img');art.className='media-art';art.alt='Okładka odtwarzanych multimediów';art.loading='lazy';art.src=artUrl;art.addEventListener('error',()=>art.remove());desc.append(art)}
          if(!this._editLayout){
            const features=Number(a.supported_features)||0,controls=el('div','tile-controls');
            const add=(iconName,service,enabled=true)=>{const b=el('button');b.type='button';b.setAttribute('aria-label',service==='media_previous_track'?'Poprzedni utwór':service==='media_next_track'?'Następny utwór':service==='media_pause'?'Pauza':'Odtwórz');b.title=b.getAttribute('aria-label');b.append(this.phosphorRoomIcon(iconName));b.disabled=!enabled;b.addEventListener('click',async e=>{e.stopPropagation();if(b.disabled||!this._hass?.callService)return;b.disabled=true;b.setAttribute('aria-busy','true');try{await this._hass.callService('media_player',service,{entity_id:t.entity})}catch(err){console.error('VELTO media control failed',err)}finally{b.removeAttribute('aria-busy');if(b.isConnected)b.disabled=!enabled}});controls.append(b)};
            add('skip-back','media_previous_track',Boolean(features&16));add(s.state==='playing'?'pause':'play',s.state==='playing'?'media_pause':'media_play',Boolean(features&(s.state==='playing'?1:16384)));add('skip-forward','media_next_track',Boolean(features&32));
            if(controls.children.length)desc.append(controls)
          }
        }
        if(domain==='vacuum'&&!missing){
          const a=s.attributes||{},meta=el('div','device-meta');
          if(a.battery_level!==undefined)meta.append(el('span','',String(a.battery_level)+'% bateria'));
          if(a.status)meta.append(el('span','',String(a.status)));
          if(meta.children.length)desc.append(meta);
          if(!this._editLayout){const controls=el('div','tile-controls');
            const add=(label,service,enabled=true)=>{const b=el('button','',label);b.type='button';b.disabled=!enabled;b.addEventListener('click',e=>{e.stopPropagation();if(!b.disabled)Promise.resolve(this._hass?.callService?.('vacuum',service,{entity_id:t.entity})).catch(err=>console.error('VELTO vacuum control failed',err))});controls.append(b)};
            add('▶','start',s.state!=='cleaning');add('Ⅱ','pause',s.state==='cleaning');add('⌂','return_to_base',s.state!=='docked');desc.append(controls)
          }
        }
        if(domain==='climate'&&!missing){
          const a=s.attributes||{},meta=el('div','device-meta'),current=Number(a.current_temperature),target=Number(a.temperature);
          if(Number.isFinite(current))meta.append(el('span','','Teraz '+current.toLocaleString('pl-PL',{maximumFractionDigits:1})+'°'));
          if(Number.isFinite(target))meta.append(el('span','','Cel '+target.toLocaleString('pl-PL',{maximumFractionDigits:1})+'°'));
          if(a.hvac_action)meta.append(el('span','',String(a.hvac_action)));
          if(meta.children.length)desc.append(meta)
        }
        if(domain==='cover'&&!missing){
          const a=s.attributes||{},position=Number(a.current_position),meta=el('div','device-meta');
          if(Number.isFinite(position))meta.append(el('span','',Math.round(position)+'% otwarcia'));
          if(meta.children.length)desc.append(meta);
          if(!this._editLayout){const features=Number(a.supported_features)||0,controls=el('div','tile-controls');
            const add=(label,service,enabled=true)=>{const b=el('button','',label);b.type='button';b.disabled=!enabled;b.addEventListener('click',e=>{e.stopPropagation();if(!b.disabled)Promise.resolve(this._hass?.callService?.('cover',service,{entity_id:t.entity})).catch(err=>console.error('VELTO cover control failed',err))});controls.append(b)};
            add('↑','open_cover',Boolean(features&1)||features===0);add('■','stop_cover',Boolean(features&8));add('↓','close_cover',Boolean(features&2)||features===0);desc.append(controls)
          }
        }
        if(domain==='camera'&&!missing&&tileSize!=='small'){
          const a=s.attributes||{},art=this.mediaArtwork(a),src=art?.startsWith('/')?art:'/api/camera_proxy/'+encodeURIComponent(t.entity);
          const preview=document.createElement('img');preview.className='camera-tile-art';preview.alt='Podgląd '+(t.name||this.name(t.entity));preview.loading='lazy';preview.src=src;
          preview.addEventListener('error',()=>{preview.hidden=true});desc.append(preview)
        }
        if(missing){const status=el('span','tile-status tile-status-offline','Brak połączenia');status.setAttribute('aria-hidden','true');desc.append(status)}
        else if(on&&['light','switch','fan','input_boolean','cover','media_player','vacuum'].includes(domain)){const status=el('span','tile-status tile-status-on',domain==='cover'?'Otwarta':domain==='media_player'?'Odtwarzanie':domain==='vacuum'?'Pracuje':'Aktywne');status.setAttribute('aria-hidden','true');desc.append(status)}
        if(domain==='light'&&!missing&&((Array.isArray(s.attributes?.supported_color_modes)&&s.attributes.supported_color_modes.some(mode=>mode!=='onoff'&&mode!=='unknown'))||s.attributes?.supported_features&1)){
          const brightness=Number(s.attributes?.brightness),pct=Number.isFinite(brightness)?Math.round(Math.max(0,Math.min(255,brightness))/255*100):0,slider=document.createElement('input'),brightnessValue=el('span','brightness-label');
          slider.type='range';slider.className='brightness';slider.min='0';slider.max='100';slider.value=String(on?Math.max(1,pct):0);slider.disabled=!on;slider.setAttribute('aria-label','Jasność '+(t.name||this.name(t.entity)));
          const updateBrightness=()=>{brightnessValue.textContent=on?'Jasność · '+slider.value+'%':'Jasność · wyłączone';slider.style.setProperty('--brightness',on?slider.value+'%':'0%')};
          updateBrightness();
          for(const event of ['pointerdown','pointerup','click','keydown','keyup'])slider.addEventListener(event,e=>e.stopPropagation());
          slider.addEventListener('input',e=>{e.stopPropagation();updateBrightness()});
          slider.addEventListener('change',e=>{
            e.stopPropagation();const value=Number(slider.value),api=this._hass;
            if(!api?.callService||!Number.isFinite(value)||value<1||value>100)return;
            Promise.resolve().then(()=>api.callService('light','turn_on',{entity_id:t.entity,brightness_pct:value})).catch(err=>console.error('VELTO brightness failed',err))
          });
          desc.append(slider,brightnessValue);
        }
        tile.append(desc);
        if(this._editLayout&&!room._highlights){
          tile.draggable=true;
          const ids=visibleEntities.map(v=>typeof v==='string'?v:v.entity);
          const index=ids.indexOf(t.entity),actions=el('div','tile-edit-actions');
          const move=(offset,label)=>{
            const button=el('button','',label);button.type='button';
            button.setAttribute('aria-label',(offset<0?'Przesuń wcześniej: ':'Przesuń później: ')+(t.name||this.name(t.entity)));
            button.disabled=index+offset<0||index+offset>=ids.length;
            button.addEventListener('click',e=>{e.stopPropagation();if(!button.disabled)this.moveTile(room.id,t.entity,ids[index+offset])});
            actions.append(button)
          };
          move(-1,'←');move(1,'→');tile.append(actions);
          const sizes=el('div','tile-size-actions');
          for(const [value,label] of [['small','S'],['medium','M'],['large','L']]){
            const b=el('button',tileSize===value?'selected':'',label);b.type='button';b.setAttribute('aria-label','Rozmiar '+label+': '+(t.name||this.name(t.entity)));b.setAttribute('aria-pressed',String(tileSize===value));
            b.addEventListener('click',e=>{e.stopPropagation();if(tileSize!==value)this.applyTileSize(room.id,t.entity,value)});sizes.append(b)
          }
          tile.append(sizes);
          // Touch reordering: hold briefly, then drag over another tile in the same room.
          let touchHold=null,touchDrag=null;
          const clearTouch=()=>{if(touchHold!==null){clearTimeout(touchHold);touchHold=null}};
          tile.addEventListener('pointerdown',e=>{
            if(e.pointerType!=='touch'||!e.isPrimary||e.target?.closest?.('button,input'))return;
            clearTouch();touchDrag={pointer:e.pointerId,x:e.clientX,y:e.clientY,active:false,target:null};
            touchHold=setTimeout(()=>{
              touchHold=null;
              if(!touchDrag)return;
              touchDrag.active=true;tile.classList.add('touch-dragging');
              try{tile.setPointerCapture(touchDrag.pointer)}catch{}
            },350);
          });
          tile.addEventListener('pointermove',e=>{
            if(!touchDrag||e.pointerId!==touchDrag.pointer)return;
            if(!touchDrag.active){
              if(Math.hypot(e.clientX-touchDrag.x,e.clientY-touchDrag.y)>12){clearTouch();touchDrag=null}
              return
            }
            const hit=root.elementFromPoint?.(e.clientX,e.clientY)?.closest?.('.tile');
            const target=hit?.dataset?.entity&&hit!==tile&&hit.closest('.tiles')===grid?hit:null;
            if(touchDrag.target!==target){
              touchDrag.target?.classList.remove('drag-over');
              touchDrag.target=target;target?.classList.add('drag-over')
            }
          });
          const finishTouch=e=>{
            if(!touchDrag||e.pointerId!==touchDrag.pointer)return;
            clearTouch();
            const target=touchDrag.target,active=touchDrag.active;
            target?.classList.remove('drag-over');tile.classList.remove('touch-dragging');
            touchDrag=null;
            if(active&&e.type==='pointerup'&&target)this.moveTile(room.id,t.entity,target.dataset.entity);
          };
          tile.addEventListener('pointerup',finishTouch);
          tile.addEventListener('pointercancel',finishTouch);
          tile.addEventListener('dragstart',e=>{e.dataTransfer?.setData('text/plain',t.entity);if(e.dataTransfer)e.dataTransfer.effectAllowed='move';this._dragTile={room:room.id,id:t.entity}});
          tile.addEventListener('dragover',e=>{if(this._dragTile?.room===room.id&&this._dragTile.id!==t.entity){e.preventDefault();tile.classList.add('drag-over')}});
          tile.addEventListener('dragleave',()=>tile.classList.remove('drag-over'));
          tile.addEventListener('drop',e=>{e.preventDefault();tile.classList.remove('drag-over');if(this._dragTile?.room===room.id)this.moveTile(room.id,this._dragTile.id,t.entity);this._dragTile=null});
          tile.addEventListener('dragend',()=>{this._dragTile=null;tile.classList.remove('drag-over')});
        }
        let timer,held=false,dragged=false,origin=null;
        const stopHold=()=>{clearTimeout(timer);timer=null};
        tile.addEventListener('pointerdown',e=>{
          if(this._editLayout||e.button!==0||e.target?.closest?.('input,button'))return;
          stopHold();held=false;dragged=false;origin={x:e.clientX,y:e.clientY};
          timer=setTimeout(()=>{timer=null;if(!dragged){held=true;this.action(t.entity,'more')}},600)
        });
        tile.addEventListener('pointermove',e=>{
          if(origin&&Math.hypot(e.clientX-origin.x,e.clientY-origin.y)>10){dragged=true;stopHold()}
        });
        tile.addEventListener('pointerup',stopHold);
        tile.addEventListener('pointercancel',()=>{dragged=true;stopHold()});
        tile.addEventListener('pointerleave',stopHold);
        tile.addEventListener('click',e=>{
          if(this._editLayout||e.target?.closest?.('input,button'))return;
          if(held||dragged){e.preventDefault();e.stopPropagation();held=false;dragged=false;origin=null;return}
          origin=null;this.action(t.entity,missing||domain==='media_player'||domain==='vacuum'||domain==='camera'?'more':'toggle')
        });
        tile.addEventListener('keydown',e=>{if(e.target!==tile||this._editLayout)return;if(e.key==='Enter'||e.key===' '){e.preventDefault();this.action(t.entity,missing||domain==='media_player'||domain==='vacuum'||domain==='camera'?'more':'toggle')}else if(e.key==='F2'){e.preventDefault();this.action(t.entity,'more')}});
        tile.addEventListener('contextmenu',e=>{if(this._editLayout)return;e.preventDefault();stopHold();if(!held){held=true;this.action(t.entity,'more')}});
        grid.append(tile)}
      if(!grid.children.length)grid.append(el('div','empty','Brak urządzeń. Dodaj je w edytorze wizualnym lub przypisz do obszaru w Home Assistant.'));main.append(grid)}
    if((c.weather?.entities||this.weatherForecastEntity())&&(this._room==='all'||c.weather?.show_in_rooms)){
      const wh=c.weather?.entities||{},forecastEntity=this.weatherForecastEntity(),hasLocalSensors=Object.values(wh).some(Boolean),sec=el('div','section-head');sec.append(el('h3','',c.weather?.title||'Pogoda lokalna'),el('small','',c.weather?.source||(hasLocalSensors?'InPost':'Home Assistant')));main.append(sec);
      const w=el('section','weather'),lead=el('div'),weatherState=forecastEntity?this.entity(forecastEntity):null;
      const sensorTemp=this.weatherNumber(wh.temperature),nativeTemp=this.weatherNumber(weatherState?.attributes?.temperature),temp=sensorTemp!==null?sensorTemp:(nativeTemp!==null?nativeTemp:null);
      lead.append(el('div','eyebrow','Na zewnątrz'));const temperatureTile=el('div','temperature',temp!==null?temp.toLocaleString('pl-PL',{maximumFractionDigits:1})+'°C':'—°C');this.bindWeatherHistory(temperatureTile,wh.temperature||forecastEntity,'Temperatura');lead.append(temperatureTile);
      const a=this.text(wh.air_index),airKey=typeof a==='string'?a.trim().toUpperCase().replace(/[\s-]+/g,'_'):null,labels={VERY_GOOD:'Bardzo dobre powietrze',GOOD:'Dobre powietrze',MODERATE:'Umiarkowane powietrze',BAD:'Zła jakość powietrza',VERY_BAD:'Bardzo zła jakość powietrza'};const air=el('div','air '+(airKey==='BAD'||airKey==='VERY_BAD'?'air-bad':airKey==='MODERATE'?'air-moderate':airKey==='GOOD'||airKey==='VERY_GOOD'?'air-good':'air-unknown'),a?labels[airKey]||'Brak oceny':this.weatherConditionLabel(weatherState?.state));air.setAttribute('role','status');lead.append(air);const condition=weatherState?.state;if(condition&&condition!=='unknown'&&condition!=='unavailable'){const icon=el('span','weather-condition-symbol');icon.append(this.weatherConditionIcon(condition));icon.setAttribute('aria-hidden','true');air.prepend(icon)}w.append(lead);
      const metrics=el('div','metrics');for(const [key,label,unit] of [['humidity','Wilgotność','%'],['pressure','Ciśnienie','hPa'],['pm25','PM2.5','µg/m³'],['pm10','PM10','µg/m³']]){let num=this.weatherNumber(wh[key]);if(num===null&&weatherState&&['humidity','pressure'].includes(key)){const raw=weatherState.attributes?.[key];const native=raw===null||raw===undefined||raw===''?NaN:Number(raw);if(Number.isFinite(native))num=native}const v=num!==null?num.toLocaleString('pl-PL',{maximumFractionDigits:1})+' '+unit:'—';const m=el('div','metric');m.append(el('small','',label),el('strong','',v));if(key==='pm25'||key==='pm10'){const limits=key==='pm25'?[15,30,55]:[25,50,90];const level=num===null||num<0?'unknown':num<=limits[0]?'good':num<=limits[1]?'moderate':num<=limits[2]?'bad':'very-bad';const labelText={good:'● Dobre powietrze',moderate:'● Umiarkowane zanieczyszczenie',bad:'● Zanieczyszczone powietrze','very-bad':'● Bardzo zanieczyszczone',unknown:'● Brak pomiaru'}[level];m.classList.add('pm-metric','pm-'+level);m.append(el('span','pm-label',labelText),el('small','pm-explain','Pył zawieszony · '+(key==='pm25'?'drobny':'grubszy')));m.title=label+' · '+labelText+' (orientacyjna skala stężeń, µg/m³)'}this.bindWeatherHistory(m,wh[key]||(['humidity','pressure'].includes(key)?forecastEntity:null),label);metrics.append(m)}w.append(metrics);
      if(forecastEntity&&c.weather?.show_forecast!==false){
        const forecast=el('div','weather-forecast'),head=el('div','forecast-head');head.append(el('strong','','Prognoza na '+Math.min(this._weatherForecast.length||7,7)+' dni'),el('small','',this.name(forecastEntity)));forecast.append(head);
        if(this._weatherForecast.length){
          const strip=el('div','forecast-strip');strip.setAttribute('data-velto-scroll-key','weather-forecast');const today=new Date(),todayKey=[today.getFullYear(),today.getMonth(),today.getDate()].join('-');
          for(const item of this._weatherForecast.slice(0,7)){
            const date=new Date(item.datetime),key=[date.getFullYear(),date.getMonth(),date.getDate()].join('-'),day=el('div','forecast-day');
            const name=key===todayKey?'Dziś':date.toLocaleDateString('pl-PL',{weekday:'short'});
            day.title=this.weatherConditionLabel(item.condition);day.setAttribute('role','group');const condition=String(item.condition||'').toLowerCase();day.classList.add(/sun|clear/.test(condition)?'forecast-sunny':/rain|pour|shower/.test(condition)?'forecast-wet':/snow|snowy/.test(condition)?'forecast-snowy':/cloud|overcast/.test(condition)?'forecast-cloudy':'forecast-neutral');
            day.append(el('div','forecast-name',name));const symbol=el('div','forecast-symbol');symbol.append(this.weatherConditionIcon(item.condition));day.append(symbol);
            const high=item.temperature!==null?item.temperature.toLocaleString('pl-PL',{maximumFractionDigits:0})+'°':'—',low=item.templow!==null?item.templow.toLocaleString('pl-PL',{maximumFractionDigits:0})+'°':'';
            day.append(el('div','forecast-temp',high));
            if(low)day.append(el('div','forecast-low','min '+low));
            if(item.precipitation_probability!==null)day.append(el('div','forecast-rain','opady '+Math.round(item.precipitation_probability)+'%'));
            const accessible=[name,this.weatherConditionLabel(item.condition),high!=='—'?'maksymalna '+high:null,low?'minimalna '+low:null,item.precipitation_probability!==null?'opady '+Math.round(item.precipitation_probability)+'%':null].filter(Boolean).join(', ');
            day.setAttribute('aria-label',accessible);strip.append(day)
          }

          if(this._weatherForecast.length<7)forecast.append(el('div','forecast-status','Źródło pogody udostępnia '+this._weatherForecast.length+' dni prognozy.'));forecast.append(strip)
        }else forecast.append(el('div','forecast-status',this._weatherForecastError?'Prognoza dzienna niedostępna dla tej encji pogodowej.':'Ładowanie prognozy 7-dniowej…'));
        w.append(forecast)
      }
      main.insertBefore(sec,top.nextSibling);main.insertBefore(w,sec.nextSibling)}
    if(c.waste_collection?.enabled===true&&(this._room==='all'||c.waste_collection.show_in_rooms)){
      const info=this.wasteCollectionInfo(),cfg=c.waste_collection||{};
      if(info){
        const section=el('section','waste-section'),head=el('div','section-head');
        head.append(el('h3','',cfg.title||'Odpady'),el('small','','Odbiór w piątek'));section.append(head);
        const card=el('div','waste-card '+(info.type==='mixed'?'waste-mixed':'waste-recycling'));
        const icon=el('div','waste-bin');icon.append(this.icon(info.type==='mixed'?'trash':'recycle'));icon.setAttribute('aria-hidden','true');
        const copy=el('div','waste-copy'),date=info.date.toLocaleDateString('pl-PL',{day:'numeric',month:'long'});
        copy.append(el('small','',info.days===0?'Dzisiaj wystaw:':info.days===1?'Jutro wystaw:':'Najbliższy odbiór · '+date),el('strong','',info.label));
        const details=info.type==='mixed'?'Czarny pojemnik':'Kolorowe pojemniki';
        copy.append(el('span','',details));
        const countdown=el('div','waste-countdown',info.days===0?'Dziś':info.days===1?'1 dzień':'Za '+info.days+' dni');
        card.append(icon,copy,countdown);section.append(card);
        if(cfg.show_next!==false){
          const nextDate=new Date(info.date);nextDate.setDate(nextDate.getDate()+7);
          const nextType=info.type==='mixed'?'Segregowane':'Zmieszane';
          const next=el('div','waste-next','Następny piątek · '+nextDate.toLocaleDateString('pl-PL',{day:'numeric',month:'long'})+' · '+nextType);
          section.append(next)
        }
        main.insertBefore(section,top.nextSibling)
      }
    }
    if((c.calendar?.entity||c.calendar?.entities?.length)&&(this._room==='all'||c.calendar.show_in_rooms)){
      const cfg=c.calendar,section=el('section','calendar-section'),head=el('div','section-head');
      head.append(el('h3','',cfg.title||'Najbliższe wydarzenia'));const calendarActions=el('div','calendar-actions');calendarActions.append(el('small','',cfg.days?cfg.days+' dni':'14 dni'));const refresh=el('button','calendar-refresh');refresh.append(this.icon('arrow-clockwise'));refresh.title='Odśwież wydarzenia';refresh.type='button';refresh.disabled=!!this._calendarLoading;refresh.setAttribute('aria-label','Odśwież wydarzenia kalendarza');refresh.setAttribute('data-velto-focus-key','calendar:refresh');refresh.addEventListener('click',()=>{if(!this._calendarLoading)this.loadCalendar(true)});calendarActions.append(refresh);head.append(calendarActions);section.append(head);if(this._calendarLastChecked){const checked=el('small','calendar-last-checked','Pobrano z HA: '+this._calendarLastChecked.toLocaleTimeString('pl-PL',{hour:'2-digit',minute:'2-digit'})+' · sprawdzanie co 2 min · synchronizacja Google zależy od HA');section.append(checked)}
      const events=this._calendarEvents.slice(0,Math.max(1,Math.min(30,Number(cfg.limit)||6)));
      const privacy=el('button','calendar-privacy');privacy.append(this.icon(this._calendarPrivate?'eye-slash':'eye'));privacy.title=this._calendarPrivate?'Odkryj tytuły wydarzeń':'Rozmyj tytuły wydarzeń';privacy.type='button';privacy.setAttribute('aria-pressed',String(this._calendarPrivate));privacy.setAttribute('aria-label','Tryb prywatności tytułów kalendarza');privacy.setAttribute('data-velto-focus-key','calendar:privacy');privacy.addEventListener('click',()=>{this._calendarPrivate=!this._calendarPrivate;try{globalThis.localStorage?.setItem?.('velto:calendar:private',this._calendarPrivate?'1':'0')}catch{}this.render()});calendarActions.insertBefore(privacy,refresh);
      const compact=el('button','calendar-compact-toggle');compact.append(this.icon(this._calendarCompact?'caret-down':'caret-up'));compact.title=this._calendarCompact?'Rozwiń listę wydarzeń':'Zwiń listę wydarzeń';compact.setAttribute('aria-label',compact.title);compact.setAttribute('data-velto-focus-key','calendar:compact');compact.type='button';compact.setAttribute('aria-expanded',String(!this._calendarCompact));compact.addEventListener('click',()=>{this._calendarCompact=!this._calendarCompact;this.render()});calendarActions.insertBefore(compact,refresh);
      if(this._calendarError)section.append(el('div','registry-warning',events.length?'Nie udało się pobrać części kalendarzy. Wyświetlam dostępne wydarzenia.':'Nie udało się pobrać kalendarza. Sprawdź integrację i uprawnienia w Home Assistant.'));
      else if(!events.length)section.append(el('div','calendar-empty',this._calendarLoading?'Ładowanie wydarzeń…':'Brak nadchodzących wydarzeń.'));
      const list=el('div','calendar-list');list.id='velto-calendar-list';list.setAttribute('role','list');list.setAttribute('data-velto-scroll-key','calendar-events');compact.setAttribute('aria-controls',list.id);
      for(const [eventIndex,event] of events.entries()){
        const date=this.eventDate(event.start),allDay=this.eventAllDay(event.start),item=el('div','calendar-event');item.setAttribute('role','listitem');
        const dateBox=el('div','calendar-date');
        dateBox.append(el('b','',date.toLocaleDateString('pl-PL',{day:'2-digit'})),el('small','',date.toLocaleDateString('pl-PL',{month:'short'})));
        const content=el('div','calendar-copy');const eventTitle=el('strong','calendar-event-title',event.summary||'Wydarzenie');if(this._calendarPrivate)eventTitle.setAttribute('aria-label','Tytuł ukryty');content.append(eventTitle);
        const when=allDay?'Cały dzień':date.toLocaleTimeString('pl-PL',{hour:'2-digit',minute:'2-digit'});
        const source='';
        content.append(el('small','',date.toLocaleDateString('pl-PL',{weekday:'short'})+' · '+when+(source?' · '+source:'')));
        if(event.location&&!this._calendarPrivate)content.append(el('small','calendar-location',event.location));
        item.append(dateBox,content);list.append(item)
      }
      if(this._calendarCompact)section.classList.add('calendar-compact');if(this._calendarPrivate)section.classList.add('calendar-private');section.append(list);const weatherPanel=main.querySelector('section.weather');const header=main.querySelector('.top');if(weatherPanel)weatherPanel.after(section);else if(header)header.after(section);else main.prepend(section)
    }
    main.append(el('div','hint','Przytrzymaj kafelek lub kliknij prawym przyciskiem, aby otworzyć szczegóły urządzenia.'));shell.append(main);root.append(shell);for(const [node,top,left] of scrollPositions){node.scrollTop=top;node.scrollLeft=left}for(const [key,top,left] of innerScrollPositions){const node=[...(root.querySelectorAll?.('[data-velto-scroll-key]')||[])].find(item=>item.getAttribute?.('data-velto-scroll-key')===key);if(node){node.scrollTop=top;node.scrollLeft=left}}if((globalThis.scrollY||0)!==pageY&&typeof globalThis.scrollTo==='function')globalThis.scrollTo(pageX,pageY);this.updateFullscreenButton();if(openDialog)root.append(openDialog);if(dialogFocus){try{dialogFocus.focus({preventScroll:true})}catch{dialogFocus.focus?.()}}else if(focusKey){const target=[...(root.querySelectorAll?.('[data-velto-focus-key]')||[])].find(item=>item.getAttribute?.('data-velto-focus-key')===focusKey);if(target){try{target.focus({preventScroll:true})}catch{target.focus?.()}}}
  }
}
if(!customElements.get('velto-dashboard'))customElements.define('velto-dashboard',VeltoDashboard);
window.customCards=window.customCards||[];
if(!window.customCards.some(c=>c.type==='velto-dashboard'))window.customCards.push({type:'velto-dashboard',name:'VELTO Dashboard',description:'Pokoje, urządzenia, obecność i lokalna pogoda w jednym panelu'});


/* Visual configuration editor: rooms, entities, presence. Weather YAML remains supported. */
class VeltoDashboardEditor extends HTMLElement {
  constructor(){super();this.attachShadow({mode:'open'});this._config={rooms:[]};this._hass=null;this._selectedRoom=0;this._advanced=false;this._setupRegistry=null;this._setupRegistryConnection=null;this._setupRegistryLoading=false;this._setupRegistryLoadingConnection=null;this._setupRegistryRequest=0;this._setupRegistryError=null}
  setConfig(c){this._config={...c,rooms:Array.isArray(c.rooms)?c.rooms:[]};this.render()}
  set hass(h){
    const oldIds=Object.keys(this._hass?.states||{}),newIds=Object.keys(h?.states||{});
    const previousConnection=this._hass?.connection;
    this._hass=h;
    if(previousConnection!==h?.connection){this._setupRegistryRequest++;this._setupRegistry=null;this._setupRegistryConnection=null;this._setupRegistryLoading=false;this._setupRegistryLoadingConnection=null;this._setupRegistryError=null}
    this.loadSetupRegistry();
    if(!this.shadowRoot?.children.length||oldIds.length!==newIds.length)this.render()
  }
  async loadSetupRegistry(force=false){
    const connection=this._hass?.connection;
    if(!connection?.sendMessagePromise)return;
    if(!force&&this._setupRegistryConnection===connection&&this._setupRegistry)return;
    if(this._setupRegistryLoading&&this._setupRegistryLoadingConnection===connection)return;
    const request=++this._setupRegistryRequest;
    this._setupRegistryLoading=true;this._setupRegistryLoadingConnection=connection;this._setupRegistryError=null;
    try{
      const results=await Promise.allSettled([
        connection.sendMessagePromise({type:'config/area_registry/list'}),
        connection.sendMessagePromise({type:'config/entity_registry/list'}),
        connection.sendMessagePromise({type:'config/device_registry/list'})
      ]);
      if(request!==this._setupRegistryRequest||this._hass?.connection!==connection)return;
      const labels=['pomieszczeń','encji','urządzeń'],failed=[];
      const lists=results.map((result,index)=>{
        if(result.status!=='fulfilled'||!Array.isArray(result.value)){failed.push(labels[index]);return []}
        return result.value;
      });
      this._setupRegistry={areas:lists[0],entities:lists[1],devices:lists[2]};
      this._setupRegistryConnection=connection;this._setupRegistryError=failed.length?failed:null;
      if(failed.length)console.warn('VELTO setup registry partially unavailable',failed);
    }catch(error){
      if(request===this._setupRegistryRequest&&this._hass?.connection===connection){this._setupRegistryError=['niektórych rejestrów'];console.warn('VELTO setup discovery unavailable',error)}
    }finally{
      if(request===this._setupRegistryRequest){
        this._setupRegistryLoading=false;this._setupRegistryLoadingConnection=null;
        if(this.isConnected)this.render()
      }
    }
  }
  setupSummary(){
    const states=this._hass?.states||{},registry=this._setupRegistry;
    const people=Object.keys(states).filter(id=>id.startsWith('person.'));
    const trackers=Object.keys(states).filter(id=>id.startsWith('device_tracker.'));
    const calendars=Object.keys(states).filter(id=>id.startsWith('calendar.'));
    const weathers=Object.keys(states).filter(id=>id.startsWith('weather.')&&!['unknown','unavailable'].includes(states[id]?.state));
    const cameras=Object.keys(states).filter(id=>id.startsWith('camera.'));
    const media=Object.keys(states).filter(id=>id.startsWith('media_player.'));
    const lights=Object.keys(states).filter(id=>id.startsWith('light.'));
    if(!registry)return {areas:null,assigned:null,people,trackers,calendars,weathers,cameras,media,lights};
    const deviceArea=new Map(registry.devices.filter(d=>d?.id).map(d=>[d.id,d.area_id]));
    const supported=new Set(['light','switch','fan','cover','climate','sensor','binary_sensor','media_player','lock','vacuum','scene','script','button','input_boolean','automation','humidifier','water_heater','alarm_control_panel','remote','select','number','input_select','input_number','input_button','weather','camera']);
    const includeTechnical=!!this._config.show_diagnostics;
    const visible=e=>e?.entity_id&&!e.disabled_by&&!e.hidden_by&&(includeTechnical||!['diagnostic','config'].includes(e.entity_category))&&states[e.entity_id]&&supported.has(e.entity_id.split('.')[0]);
    const assigned=registry.entities.filter(e=>visible(e)&&(e.area_id||deviceArea.get(e.device_id))).length;
    const usedAreas=new Set(registry.entities.filter(visible).map(e=>e.area_id||deviceArea.get(e.device_id)).filter(Boolean));
    return {areas:usedAreas.size,registeredAreas:registry.areas.length,assigned,people,trackers,calendars,weathers,cameras,media,lights}
  }
  commit(c){this._config=c;this.dispatchEvent(new CustomEvent('config-changed',{detail:{config:c},bubbles:true,composed:true}));this.render()}
  render(){
    const root=this.shadowRoot;if(!root)return;root.replaceChildren();
    const style=document.createElement('style');style.textContent=`
:host{display:block;font:inherit;color:var(--primary-text-color,#333)}*{box-sizing:border-box}
.wrap{display:grid;gap:14px;padding:8px 0}.field{display:grid;gap:5px;font-size:13px;font-weight:600}
input,select,button{font:inherit;min-height:38px;border-radius:10px;padding:8px 10px;border:1px solid var(--divider-color,#ccc);background:var(--card-background-color,#fff);color:inherit;max-width:100%}
input,select{width:100%}button{cursor:pointer}.actions{display:flex;gap:8px;flex-wrap:wrap}.actions button{flex:1}.primary{background:var(--primary-color,#c18c43);color:#fff;border:0}
.room{border:1px solid var(--divider-color,#ddd);border-radius:15px;padding:12px;display:grid;gap:12px}.row{display:grid;grid-template-columns:minmax(0,1fr) 90px 42px;gap:7px;align-items:center}.row small{display:block;font-size:11px;opacity:.65;overflow-wrap:anywhere}
.muted{font-size:12px;opacity:.7}.section{font-weight:750;margin:5px 0 0}
.setup{padding:16px;border:1px solid var(--divider-color,#ddd);border-radius:18px;background:var(--card-background-color,#fff);display:grid;gap:13px}.setup h3{margin:0;font-size:19px}.setup p{margin:0;line-height:1.45}.setup-ok{font-size:12px;font-weight:700;color:var(--success-color,#4b8b54)}.advanced-toggle{background:transparent}
.discovery{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.discovery div{padding:10px;border-radius:12px;background:color-mix(in srgb,var(--card-background-color,#fff) 80%,var(--primary-color,#c18c43) 8%);text-align:center}.discovery b{display:block;font-size:18px}.discovery small{font-size:10px;opacity:.7}.setup-status{font-size:12px;padding:9px 10px;border-radius:10px;background:var(--secondary-background-color,#f5f5f5)}@media(max-width:520px){.discovery{grid-template-columns:repeat(2,minmax(0,1fr))}}

`;root.append(style);
    const wrap=document.createElement('div');wrap.className='wrap';root.append(wrap);
    const node=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n};
    const field=(label,value,fn)=>{const l=node('label',undefined,'field');l.append(node('span',label));const i=document.createElement('input');i.value=value||'';i.addEventListener('change',()=>fn(i.value));l.append(i);return l};
    const button=(label,fn,cls)=>{const b=node('button',label,cls);b.type='button';b.addEventListener('click',fn);return b};
    const choose=(options,value,fn)=>{const s=document.createElement('select');for(const [v,label] of options){const o=document.createElement('option');o.value=v;o.textContent=label;s.append(o)}s.value=value||'';s.addEventListener('change',()=>fn(s.value));return s};
    const c=this._config,rooms=c.rooms||[],set=(patch)=>this.commit({...this._config,...patch});
    const summary=this.setupSummary();
    const setup=node('section',undefined,'setup');
    setup.append(node('h3','Uruchom VELTO'));
    setup.append(node('p','Minimum konfiguracji: nadaj nazwę dashboardu i wybierz sposób tworzenia pomieszczeń. Resztę możesz zmienić później.','muted'));
    if(this._setupRegistryLoading)setup.append(node('div','Wykrywam strukturę Home Assistant…','setup-status'));
    if(this._setupRegistryError){
      const status=node('div',undefined,'setup-status');
      status.append(document.createTextNode('Nie udało się odczytać rejestru: '+this._setupRegistryError.join(', ')+'. Wyniki automatycznego wykrywania mogą być niepełne. '),button('Spróbuj ponownie',()=>this.loadSetupRegistry(true)));
      setup.append(status)
    }
    if(summary.areas!==null){
      const found=node('div',undefined,'discovery');
      for(const [value,label] of [[summary.areas,'pomieszczeń'],[summary.assigned,'urządzeń'],[summary.lights.length,'świateł'],[summary.media.length,'media'],[summary.cameras.length,'kamer'],[summary.people.length,'osób']]){
        const item=node('div');item.append(node('b',String(value)),node('small',label));found.append(item)
      }
      setup.append(found);
      if(!this._setupRegistryError&&(summary.areas===0||summary.assigned===0))setup.append(node('div','VELTO nie znalazł urządzeń przypisanych do Areas. Przypisz urządzenia do pomieszczeń w Home Assistant albo wybierz tryb ręczny.','setup-status'));
      else if(!this._setupRegistryError)setup.append(node('div','✓ Struktura Home Assistant jest gotowa do automatycznego utworzenia dashboardu.','setup-ok'))
    }
    setup.append(field('Nazwa domu / dashboardu',c.title||'Mój dom',v=>set({title:v||'Mój dom'})));
    const modeLabel=node('label',undefined,'field');modeLabel.append(node('span','Pomieszczenia'));
    modeLabel.append(choose([['auto','Automatycznie z Home Assistant (zalecane)'],['manual','Utworzę ręcznie']],c.auto_areas===false?'manual':'auto',v=>set({auto_areas:v==='auto',hide_empty_rooms:v==='auto'?true:c.hide_empty_rooms,rooms:Array.isArray(c.rooms)?c.rooms:[]})));setup.append(modeLabel);
    const themeQuick=node('label',undefined,'field');themeQuick.append(node('span','Wygląd'));
    themeQuick.append(choose([['auto','Automatycznie jak Home Assistant'],['light','Jasny'],['dark','Ciemny']],c.theme||'auto',v=>set({theme:v})));setup.append(themeQuick);
    const quickPresence=[...summary.people,...summary.trackers];
    if(quickPresence.length){
      const presence=c.presence||{},presenceLabel=node('label',undefined,'field');presenceLabel.append(node('span','Obecność na górnym pasku (opcjonalnie)'));
      presenceLabel.append(choose([['','Bez obecności'],...quickPresence.map(id=>[id,(this._hass?.states?.[id]?.attributes?.friendly_name||id)+' · '+id])],presence.entity||'',v=>set({presence:{...presence,entity:v,name:v?(this._hass?.states?.[v]?.attributes?.friendly_name||presence.name||'Domownik'):''}})));
      setup.append(presenceLabel)
    }
    if(summary.calendars.length){
      const cal=c.calendar||{},selected=Array.isArray(cal.entities)?cal.entities:cal.entity?[cal.entity]:[],calendarLabel=node('label',undefined,'field');calendarLabel.append(node('span','Kalendarz na ekranie głównym (opcjonalnie)'));
      calendarLabel.append(choose([['','Bez kalendarza'],...summary.calendars.map(id=>[id,(this._hass?.states?.[id]?.attributes?.friendly_name||id)+' · '+id])],selected[0]||'',v=>set({calendar:v?{...cal,entity:'',entities:[v],days:cal.days||14}:{...cal,entity:'',entities:[]}})));
      setup.append(calendarLabel)
    }
    if(summary.weathers.length){
      const weather=c.weather||{},weatherLabel=node('label',undefined,'field');weatherLabel.append(node('span','Prognoza pogody 7 dni'));
      weatherLabel.append(choose([['','Automatycznie (gdy dostępna jest jedna)'],...summary.weathers.map(id=>[id,(this._hass?.states?.[id]?.attributes?.friendly_name||id)+' · '+id])],weather.forecast_entity||'',v=>set({weather:{...weather,forecast_entity:v,show_forecast:true}})));
      setup.append(weatherLabel)
    }
    if(c.auto_areas!==false)setup.append(node('div','✓ VELTO automatycznie użyje Areas i przypisanych do nich urządzeń.','setup-ok'));
    setup.append(button(this._advanced?'Ukryj ustawienia zaawansowane':'Pokaż ustawienia zaawansowane',()=>{this._advanced=!this._advanced;this.render()},'advanced-toggle'));
    wrap.append(setup);
    if(!this._advanced){
      if(c.auto_areas===false&&!rooms.length){
        const manual=node('div',undefined,'actions');manual.append(button('＋ Dodaj pierwszy pokój',()=>{this._advanced=true;const next=[{id:'room_'+Date.now(),name:'Nowy pokój',icon:'home',entities:[]}];this._selectedRoom=0;set({rooms:next})},'primary'));wrap.append(manual)
      }
      return
    }
    wrap.append(field('Tytuł dashboardu',c.title||'Mój dom',v=>set({title:v})));
    const auto=node('label',undefined,'field');const autoLabel=node('span','Automatycznie wykrywaj pomieszczenia i urządzenia z Home Assistant');const autoCheck=document.createElement('input');autoCheck.type='checkbox';autoCheck.checked=!!c.auto_areas;autoCheck.style.width='auto';autoCheck.addEventListener('change',()=>set({auto_areas:autoCheck.checked}));auto.append(autoLabel,autoCheck);wrap.append(auto);
    const hide=node('label',undefined,'field');hide.append(node('span','Ukryj puste pokoje'));const hideCheck=document.createElement('input');hideCheck.type='checkbox';hideCheck.style.width='auto';hideCheck.checked=!!c.hide_empty_rooms;hideCheck.addEventListener('change',()=>set({hide_empty_rooms:hideCheck.checked}));hide.append(hideCheck);wrap.append(hide);
    const themeLabel=node('label',undefined,'field');themeLabel.append(node('span','Motyw VELTO'));
    themeLabel.append(choose([['light','Jasny'],['dark','Ciemny'],['auto','Automatyczny (motyw Home Assistant)']],c.theme||'light',v=>set({theme:v})));wrap.append(themeLabel);
    const smart=node('label',undefined,'field');smart.append(node('span','Inteligentny układ automatycznych kafelków'));
    const smartCheck=document.createElement('input');smartCheck.type='checkbox';smartCheck.style.width='auto';smartCheck.checked=c.smart_layout!==false;smartCheck.addEventListener('change',()=>set({smart_layout:smartCheck.checked}));smart.append(smartCheck);wrap.append(smart);
    const diag=node('label',undefined,'field');diag.append(node('span','Pokaż encje diagnostyczne i konfiguracyjne'));
    const diagCheck=document.createElement('input');diagCheck.type='checkbox';diagCheck.style.width='auto';diagCheck.checked=!!c.show_diagnostics;diagCheck.addEventListener('change',()=>set({show_diagnostics:diagCheck.checked}));diag.append(diagCheck);wrap.append(diag);
    const maxAuto=node('label',undefined,'field');maxAuto.append(node('span','Maksymalnie automatycznych urządzeń w pokoju'));
    maxAuto.append(choose([['12','12 — bardzo czysto'],['24','24 — zalecane'],['40','40 — dużo'],['60','60 — maksimum']],String(c.max_auto_entities||24),v=>set({max_auto_entities:Number(v)})));wrap.append(maxAuto);
    wrap.append(node('div','Zapisywanie układu kafelków','section'));
    const persistence=node('label',undefined,'field');persistence.append(node('span','Gdzie zapisywać przeciągnięty układ'));
    persistence.append(choose([['hybrid','Home Assistant + lokalny backup (zalecane)'],['config','Tylko konfiguracja Home Assistant'],['local','Tylko na tym urządzeniu']],c.layout_persistence||'hybrid',v=>set({layout_persistence:v})));wrap.append(persistence);
    wrap.append(field('ID układu (opcjonalnie, dla wielu dashboardów)',c.layout_id||'',v=>set({layout_id:v.trim()})));
    wrap.append(node('p','Tryb hybrydowy wysyła zmianę do Lovelace i równocześnie zachowuje kopię w tej przeglądarce. Dzięki temu kolejność kafelków może przetrwać odświeżenie nawet wtedy, gdy dany widok HA nie zapisze config-changed.','muted'));
    const roomControls=node('label',undefined,'field');roomControls.append(node('span','Pokaż inteligentny pasek sterowania pokojem'));
    const roomControlsCheck=document.createElement('input');roomControlsCheck.type='checkbox';roomControlsCheck.style.width='auto';roomControlsCheck.checked=c.room_controls!==false;roomControlsCheck.addEventListener('change',()=>set({room_controls:roomControlsCheck.checked}));roomControls.append(roomControlsCheck);wrap.append(roomControls);
    const scenesQuick=node('label',undefined,'field');scenesQuick.append(node('span','Pokazuj sceny i skrypty jako szybkie akcje'));
    const scenesQuickCheck=document.createElement('input');scenesQuickCheck.type='checkbox';scenesQuickCheck.style.width='auto';scenesQuickCheck.checked=c.scene_shortcuts!==false;scenesQuickCheck.addEventListener('change',()=>set({scene_shortcuts:scenesQuickCheck.checked}));scenesQuick.append(scenesQuickCheck);wrap.append(scenesQuick);
    const highlightsToggle=node('label',undefined,'field');highlightsToggle.append(node('span','Pokaż sekcję „Najważniejsze” na ekranie głównym'));
    const highlightsCheck=document.createElement('input');highlightsCheck.type='checkbox';highlightsCheck.style.width='auto';highlightsCheck.checked=c.show_home_highlights!==false;highlightsCheck.addEventListener('change',()=>set({show_home_highlights:highlightsCheck.checked}));highlightsToggle.append(highlightsCheck);wrap.append(highlightsToggle);
    const highlightLimit=node('label',undefined,'field');highlightLimit.append(node('span','Liczba kafelków w „Najważniejsze”'));
    highlightLimit.append(choose([['4','4'],['6','6'],['8','8 — zalecane'],['12','12']],String(c.home_highlight_limit||8),v=>set({home_highlight_limit:Number(v)})));wrap.append(highlightLimit);
    wrap.append(node('div','Przypięte do „Najważniejsze”','section'));
    const pinned=Array.isArray(c.home_favorites)?c.home_favorites.filter(id=>typeof id==='string'):[];
    const favoriteDomains=new Set(['light','switch','fan','cover','climate','media_player','lock','vacuum','camera','input_boolean','alarm_control_panel','binary_sensor','sensor','weather']);
    const favoriteIds=Object.keys(this._hass?.states||{}).filter(id=>favoriteDomains.has(id.split('.')[0])).sort();
    const favoritePicker=choose([['','Wybierz urządzenie…'],...favoriteIds.filter(id=>!pinned.includes(id)).map(id=>[id,(this._hass.states[id]?.attributes?.friendly_name||id)+' · '+id])],'',()=>{});
    wrap.append(favoritePicker);
    wrap.append(button('＋ Przypnij urządzenie',()=>{if(favoritePicker.value)set({home_favorites:[...pinned,favoritePicker.value]})}));
    for(const id of pinned){
      const entry=node('div',undefined,'row'),label=node('div');
      label.append(node('strong',this._hass?.states?.[id]?.attributes?.friendly_name||id),node('small',id));entry.append(label);
      entry.append(node('span','Ulubione','muted'));
      entry.append(button('×',()=>set({home_favorites:pinned.filter(item=>item!==id)})));
      wrap.append(entry)
    }
    wrap.append(node('div','Pomieszczenia','section'));
    const selector=choose(rooms.map((r,i)=>[String(i),r.name||r.id]),String(Math.min(this._selectedRoom,Math.max(rooms.length-1,0))),v=>{this._selectedRoom=Number(v);this.render()});
    if(rooms.length)wrap.append(selector);
    const bar=node('div',undefined,'actions');
    bar.append(button('＋ Dodaj pokój',()=>{const next=[...rooms,{id:'room_'+Date.now(),name:'Nowy pokój',icon:'home',entities:[]}];this._selectedRoom=next.length-1;set({rooms:next})},'primary'));
    if(rooms.length)bar.append(button('Usuń pokój',()=>{const next=rooms.filter((_,i)=>i!==this._selectedRoom);this._selectedRoom=Math.max(0,this._selectedRoom-1);set({rooms:next})}));
    wrap.append(bar);
    if(rooms.length){
      const idx=Math.min(this._selectedRoom,rooms.length-1),room=rooms[idx],panel=node('div',undefined,'room');
      const updateRoom=patch=>set({rooms:(this._config.rooms||[]).map((r,i)=>i===idx?{...r,...patch}:r)});
      panel.append(field('Nazwa pokoju',room.name,v=>updateRoom({name:v})));
      const iconLabel=node('label',undefined,'field');iconLabel.append(node('span','Ikona pomieszczenia'));
      iconLabel.append(choose([['home','Dom'],['light','Światło'],['plug','Kuchnia / urządzenia'],['water','Łazienka'],['door','Garaż / wejście'],['sun','Ogród / taras'],['climate','Temperatura'],['fan','Wentylacja'],['camera','Kamera']],room.icon||'home',v=>updateRoom({icon:v})));panel.append(iconLabel);
      panel.append(node('div','Urządzenia w pokoju','section'));
      for(let i=0;i<(room.entities||[]).length;i++){
        const raw=room.entities[i],item=typeof raw==='string'?{entity:raw}:raw,entry=node('div',undefined,'row');
        const label=node('div');label.append(node('strong',item.name||this._hass?.states?.[item.entity]?.attributes?.friendly_name||item.entity),node('small',item.entity));entry.append(label);
        entry.append(choose([['small','Mały'],['medium','Średni'],['large','Duży']],item.size||'small',v=>updateRoom({entities:room.entities.map((e,j)=>j===i?{...(typeof e==='string'?{entity:e}:e),size:v}:e)})));
        entry.append(button('×',()=>updateRoom({entities:room.entities.filter((_,j)=>i!==j)})));
        panel.append(entry);
      }
      const ids=Object.keys(this._hass?.states||{}).sort(),existing=new Set((room.entities||[]).map(e=>typeof e==='string'?e:e.entity));
      const picker=choose([['','Wybierz urządzenie…'],...ids.filter(id=>!existing.has(id)).map(id=>[id,(this._hass.states[id]?.attributes?.friendly_name||id)+' · '+id])],'',()=>{});
      panel.append(picker);
      panel.append(button('＋ Dodaj urządzenie',()=>{if(picker.value)updateRoom({entities:[...(room.entities||[]),{entity:picker.value,size:'small'}]})},'primary'));
      wrap.append(panel);
    }
    wrap.append(node('div','Obecność domownika','section'));
    const trackers=Object.keys(this._hass?.states||{}).filter(id=>id.startsWith('person.')||id.startsWith('device_tracker.')).sort();
    const presence=c.presence||{};
    const presenceOptions=[['','Bez obecności'],...trackers.map(id=>[id,(this._hass.states[id]?.attributes?.friendly_name||id)+' · '+id])];
    if(presence.entity&&!trackers.includes(presence.entity))presenceOptions.push([presence.entity,presence.entity]);
    wrap.append(choose(presenceOptions,presence.entity||'',v=>set({presence:{...presence,entity:v}})));
    if(presence.entity)wrap.append(field('Nazwa domownika',presence.name||'',v=>set({presence:{...presence,name:v}})));
    wrap.append(node('div','Kalendarz Google / Home Assistant','section'));
    const calendars=Object.keys(this._hass?.states||{}).filter(id=>id.startsWith('calendar.')).sort();
    const cal=c.calendar||{},selected=Array.isArray(cal.entities)?cal.entities:cal.entity?[cal.entity]:[];
    const calOptions=[['','Wyłącz kalendarz'],...calendars.map(id=>[id,(this._hass.states[id].attributes.friendly_name||id)+' · '+id])];
    for(const id of selected)if(!calendars.includes(id))calOptions.push([id,id]);
    const calendarField=node('label',undefined,'field');calendarField.append(node('span','Dodaj kalendarz'));
    const available=calOptions.filter(([id])=>!id||!selected.includes(id));
    const selectable=available.filter(([id])=>id);
    const calendarPicker=choose([['','Wybierz kalendarz…'],...selectable],selectable.length===1?selectable[0][0]:'',()=>{});
    calendarField.append(calendarPicker);wrap.append(calendarField);
    if(!calendars.length)wrap.append(node('p','Brak encji calendar.*. Dodaj integrację kalendarza w Home Assistant i odśwież edytor.','muted'));
    else if(!selectable.length)wrap.append(node('p','Wszystkie dostępne kalendarze są już dodane.','muted'));
    wrap.append(button('＋ Dodaj kalendarz',()=>{
      const id=calendarPicker.value;if(!id||selected.includes(id)){calendarPicker.focus();return;}
      set({calendar:{...this._config.calendar,entity:'',entities:[...selected,id]}})
    }));
    for(const id of selected){
      const entry=node('div',undefined,'row'),label=node('div');
      label.append(node('strong',this._hass?.states?.[id]?.attributes?.friendly_name||id),node('small',id));entry.append(label);
      entry.append(node('span','Aktywny','muted'));
      entry.append(button('×',()=>set({calendar:{...this._config.calendar,entity:'',entities:selected.filter(item=>item!==id)}})));
      wrap.append(entry);
    }
    const calendarRooms=node('label',undefined,'field');calendarRooms.append(node('span','Pokazuj wydarzenia także w widokach pokoi'));
    const calendarRoomsCheck=document.createElement('input');calendarRoomsCheck.type='checkbox';calendarRoomsCheck.checked=!!cal.show_in_rooms;calendarRoomsCheck.style.width='auto';
    calendarRoomsCheck.addEventListener('change',()=>set({calendar:{...this._config.calendar,show_in_rooms:calendarRoomsCheck.checked}}));
    calendarRooms.append(calendarRoomsCheck);wrap.append(calendarRooms);
    wrap.append(field('Tytuł karty wydarzeń',cal.title||'Najbliższe wydarzenia',v=>set({calendar:{...this._config.calendar,title:v}})));
    const daysField=node('label',undefined,'field');daysField.append(node('span','Ile dni do przodu?'));
    daysField.append(choose([['7','7 dni'],['14','14 dni'],['30','30 dni'],['60','60 dni']],String(cal.days||14),v=>set({calendar:{...this._config.calendar,days:Number(v)}})));wrap.append(daysField);
    wrap.append(node('p','Wybierz kalendarz udostępniony przez integrację Google Calendar w Home Assistant. Możesz dodać kilka kalendarzy bezpośrednio w edytorze. Wydarzenia zostaną połączone i uporządkowane chronologicznie.','muted'));
    wrap.append(node('div','Pogoda i zaawansowane ustawienia','section'));
    const weather=c.weather||{},current=weather.entities||{};
    wrap.append(field('Tytuł pogody',weather.title||'Warunki na zewnątrz',v=>set({weather:{...this._config.weather,title:v}})));
    const weatherEntities=Object.keys(this._hass?.states||{}).filter(id=>id.startsWith('weather.')).sort(),forecastCurrent=weather.forecast_entity||'';
    const forecastSource=node('label',undefined,'field');forecastSource.append(node('span','Źródło prognozy 7-dniowej'));
    forecastSource.append(choose([['','Automatycznie (jeśli jest jedna encja weather.*)'],...weatherEntities.map(id=>[id,(this._hass.states[id]?.attributes?.friendly_name||id)+' · '+id])],forecastCurrent,v=>set({weather:{...this._config.weather,forecast_entity:v}})));wrap.append(forecastSource);
    const showForecast=node('label',undefined,'field');showForecast.append(node('span','Pokazuj prognozę na kolejne 7 dni'));
    const showForecastCheck=document.createElement('input');showForecastCheck.type='checkbox';showForecastCheck.style.width='auto';showForecastCheck.checked=weather.show_forecast!==false;showForecastCheck.addEventListener('change',()=>set({weather:{...this._config.weather,show_forecast:showForecastCheck.checked}}));showForecast.append(showForecastCheck);wrap.append(showForecast);
    const weatherRooms=node('label',undefined,'field');weatherRooms.append(node('span','Pokazuj pogodę także w widokach pokoi'));const weatherRoomsCheck=document.createElement('input');weatherRoomsCheck.type='checkbox';weatherRoomsCheck.style.width='auto';weatherRoomsCheck.checked=!!weather.show_in_rooms;weatherRoomsCheck.addEventListener('change',()=>set({weather:{...this._config.weather,show_in_rooms:weatherRoomsCheck.checked}}));weatherRooms.append(weatherRoomsCheck);wrap.append(weatherRooms);
    const sensors=Object.keys(this._hass?.states||{}).filter(id=>id.startsWith('sensor.')).sort();
    for(const [key,label] of [['temperature','Temperatura'],['humidity','Wilgotność'],['pressure','Ciśnienie'],['pm25','PM2.5'],['pm10','PM10'],['air_index','Jakość powietrza']]){
      const currentId=current[key]||'',options=[['','Brak'],...sensors.map(id=>[id,(this._hass.states[id].attributes.friendly_name||id)+' · '+id])];
      if(currentId&&!sensors.includes(currentId))options.push([currentId,currentId]);
      const l=node('label',undefined,'field');l.append(node('span',label));
      l.append(choose(options,currentId,v=>{
        const old=this._config.weather||{};set({weather:{...old,entities:{...(old.entities||{}),[key]:v}}})
      }));wrap.append(l)
    }
    wrap.append(node('p','Pola pogodowe można teraz konfigurować wizualnie. Zmiany zapisują się w YAML karty.','muted'));
    wrap.append(node('div','Odbiór odpadów','section'));
    const waste=c.waste_collection||{},wasteEnabled=node('label',undefined,'field');
    wasteEnabled.append(node('span','Włącz kafelek odbioru odpadów'));
    const wasteCheck=document.createElement('input');wasteCheck.type='checkbox';wasteCheck.style.width='auto';wasteCheck.checked=waste.enabled===true;
    wasteCheck.addEventListener('change',()=>set({waste_collection:{...this._config.waste_collection,enabled:wasteCheck.checked,anchor_date:waste.anchor_date||'2026-11-06',anchor_type:waste.anchor_type||'mixed'}}));
    wasteEnabled.append(wasteCheck);wrap.append(wasteEnabled);
    const anchor=node('label',undefined,'field');anchor.append(node('span','Data bazowa — piątek, od którego liczymy cykl'));
    const anchorInput=document.createElement('input');anchorInput.type='date';anchorInput.value=waste.anchor_date||'2026-11-06';anchorInput.addEventListener('change',()=>{if(!anchorInput.value)return;const selected=new Date(anchorInput.value+'T12:00:00');if(!Number.isFinite(selected.getTime()))return;selected.setDate(selected.getDate()+(5-selected.getDay()+7)%7);const normalized=[selected.getFullYear(),String(selected.getMonth()+1).padStart(2,'0'),String(selected.getDate()).padStart(2,'0')].join('-');anchorInput.value=normalized;set({waste_collection:{...this._config.waste_collection,anchor_date:normalized}})});anchor.append(anchorInput);wrap.append(anchor);
    const firstType=node('label',undefined,'field');firstType.append(node('span','Rodzaj odpadów w dniu bazowym'));
    firstType.append(choose([['mixed','Zmieszane — czarny kosz'],['recycling','Segregowane — kolorowe kosze']],waste.anchor_type||'mixed',v=>set({waste_collection:{...this._config.waste_collection,anchor_type:v}})));wrap.append(firstType);
    const wasteRooms=node('label',undefined,'field');wasteRooms.append(node('span','Pokazuj kafelek także w widokach pokoi'));
    const wasteRoomsCheck=document.createElement('input');wasteRoomsCheck.type='checkbox';wasteRoomsCheck.style.width='auto';wasteRoomsCheck.checked=!!waste.show_in_rooms;wasteRoomsCheck.addEventListener('change',()=>set({waste_collection:{...this._config.waste_collection,show_in_rooms:wasteRoomsCheck.checked}}));wasteRooms.append(wasteRoomsCheck);wrap.append(wasteRooms);
    const wasteNext=node('label',undefined,'field');wasteNext.append(node('span','Pokaż także kolejny termin odbioru'));const wasteNextCheck=document.createElement('input');wasteNextCheck.type='checkbox';wasteNextCheck.style.width='auto';wasteNextCheck.checked=waste.show_next!==false;wasteNextCheck.addEventListener('change',()=>set({waste_collection:{...this._config.waste_collection,show_next:wasteNextCheck.checked}}));wasteNext.append(wasteNextCheck);wrap.append(wasteNext);
    wrap.append(node('p','Ustaw piątek bazowy i rodzaj odbioru. Jeśli wybierzesz inny dzień, zostanie przesunięty do najbliższego piątku. Kolejne piątki będą wyliczane naprzemiennie.','muted'));
  }
}
if(!customElements.get('velto-dashboard-editor'))customElements.define('velto-dashboard-editor',VeltoDashboardEditor);
