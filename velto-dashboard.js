/* VELTO Dashboard v0.1 — native Home Assistant Lovelace custom card, no dependencies. */
const VELTO_TILE_ICON_OPTIONS=Object.freeze([
  ['','Automatycznie'],['light','Światło'],['switch','Przełącznik'],['fan','Wentylator'],['cover','Roleta'],['lock','Zamek'],
  ['climate','Klimat'],['sensor','Czujnik'],['binary_sensor','Czujnik binarny'],['scene','Scena'],['camera','Kamera'],
  ['input_boolean','Przełącznik pomocniczy'],['media_player','Odtwarzacz multimediów'],['vacuum','Odkurzacz'],['script','Skrypt'],
  ['button','Przycisk'],['automation','Automatyzacja'],['humidifier','Nawilżacz'],['water_heater','Podgrzewacz wody'],['valve','Zawór'],['alarm_control_panel','Alarm'],
  ['remote','Pilot'],['number','Liczba'],['select','Lista wyboru'],['input_text','Tekst'],['counter','Licznik'],['timer','Odliczanie'],['weather','Pogoda'],['motion','Ruch'],['door','Drzwi'],
  ['water','Woda'],['smoke','Dym'],['sun','Słońce'],['plug','Gniazdko'],['calendar','Data i czas']
].map(option=>Object.freeze(option)));
const VELTO_TILE_ICON_NAMES=new Set(VELTO_TILE_ICON_OPTIONS.map(([value])=>value).filter(Boolean));
const VELTO_BINARY_SENSOR_STATE_LABELS=Object.freeze({
  battery:Object.freeze({off:'Bateria w normie',on:'Niski poziom baterii'}),
  battery_charging:Object.freeze({off:'Nie ładuje',on:'Ładuje'}),
  carbon_monoxide:Object.freeze({off:'Powietrze czyste',on:'Wykryto tlenek węgla'}),
  cold:Object.freeze({off:'Temperatura prawidłowa',on:'Zimno'}),
  connectivity:Object.freeze({off:'Brak połączenia',on:'Połączono'}),
  door:Object.freeze({off:'Zamknięte',on:'Otwarte'}),
  garage_door:Object.freeze({off:'Zamknięta',on:'Otwarta'}),
  gas:Object.freeze({off:'Brak wykrytego gazu',on:'Wykryto gaz'}),
  glass_break:Object.freeze({off:'Brak wykrycia stłuczenia',on:'Wykryto stłuczenie szyby'}),
  heat:Object.freeze({off:'Temperatura prawidłowa',on:'Gorąco'}),
  light:Object.freeze({off:'Ciemno',on:'Wykryto światło'}),
  lock:Object.freeze({off:'Zablokowany',on:'Odblokowany'}),
  moisture:Object.freeze({off:'Sucho',on:'Wykryto wilgoć'}),
  motion:Object.freeze({off:'Brak ruchu',on:'Wykryto ruch'}),
  moving:Object.freeze({off:'Nieruchome',on:'W ruchu'}),
  occupancy:Object.freeze({off:'Pusto',on:'Zajęte'}),
  opening:Object.freeze({off:'Zamknięte',on:'Otwarte'}),
  plug:Object.freeze({off:'Odłączono',on:'Podłączono'}),
  power:Object.freeze({off:'Brak zasilania',on:'Zasilanie dostępne'}),
  presence:Object.freeze({off:'Poza domem',on:'W domu'}),
  problem:Object.freeze({off:'Brak problemu',on:'Wykryto problem'}),
  running:Object.freeze({off:'Nie pracuje',on:'Pracuje'}),
  safety:Object.freeze({off:'Bezpiecznie',on:'Niebezpiecznie'}),
  smoke:Object.freeze({off:'Brak dymu',on:'Wykryto dym'}),
  sound:Object.freeze({off:'Cisza',on:'Wykryto dźwięk'}),
  tamper:Object.freeze({off:'Brak naruszenia',on:'Wykryto naruszenie'}),
  update:Object.freeze({off:'Aktualne',on:'Dostępna aktualizacja'}),
  vibration:Object.freeze({off:'Brak drgań',on:'Wykryto drgania'}),
  window:Object.freeze({off:'Zamknięte',on:'Otwarte'})
});
const VELTO_BINARY_SENSOR_ALERT_CLASSES=new Set(['carbon_monoxide','gas','glass_break','heat','moisture','problem','safety','smoke','tamper','vibration']);
const VELTO_BINARY_SENSOR_ENTRY_CLASSES=new Set(['door','window','opening','garage_door']);
const VELTO_BINARY_SENSOR_SECURITY_CLASSES=new Set([...VELTO_BINARY_SENSOR_ALERT_CLASSES,...VELTO_BINARY_SENSOR_ENTRY_CLASSES,'lock']);
const VELTO_LOW_BATTERY_THRESHOLD=20;
const VELTO_LOW_BATTERY_THRESHOLDS=Object.freeze([10,15,20,25,30,40,50]);
const VELTO_COMMON_STATE_LABELS=Object.freeze({
  on:'Włączone',off:'Wyłączone',open:'Otwarte',closed:'Zamknięte',opening:'Otwieranie',closing:'Zamykanie',stopped:'Zatrzymany',
  home:'W domu',not_home:'Poza domem',cleaning:'Sprząta',docked:'W stacji dokującej',idle:'Gotowy',
  paused:'Wstrzymany',returning:'Wraca do stacji',error:'Błąd',triggered:'Alarm aktywny',pending:'Oczekuje',
  arming:'Uzbrajanie',disarming:'Rozbrajanie',armed_away:'Uzbrojony · poza domem',armed_home:'Uzbrojony · w domu',
  armed_night:'Uzbrojony · nocny',armed_vacation:'Uzbrojony · tryb wakacyjny',armed_custom_bypass:'Uzbrojony · tryb niestandardowy',disarmed:'Rozbrojony'
});
const VELTO_VACUUM_FEATURES=Object.freeze({PAUSE:4,STOP:8,RETURN_HOME:16,FAN_SPEED:32,LOCATE:512,CLEAN_SPOT:1024,START:8192});
const VELTO_HUMIDIFIER_FEATURES=Object.freeze({MODES:1});
const VELTO_WATER_HEATER_FEATURES=Object.freeze({TARGET_TEMPERATURE:1,OPERATION_MODE:2,AWAY_MODE:4,ON_OFF:8});
const VELTO_PHOSPHOR_TILE_ALIASES=Object.freeze({light:'lightbulb',fan:'fan',lock:'lock-key',door:'door-open',water:'drop',motion:'footprints',window:'app-window',water_heater:'thermometer',valve:'drop',input_text:'text-t',counter:'hash',timer:'timer'});
const VELTO_ROOM_ICON_OPTIONS=Object.freeze([
  ['','Automatycznie'],['house','Dom'],['door-open','Korytarz / wejście'],['flower','Ogród / taras'],
  ['lego','Pokój dziecięcy'],['armchair','Salon'],['office-chair','Biuro'],['hard-drives','Serwerownia / rack'],
  ['archive','Schowek / magazyn'],['cooking-pot','Kuchnia'],['bathtub','Łazienka'],['bed','Sypialnia'],
  ['garage','Garaż'],['thermometer','Kotłownia / techniczne'],['lightbulb','Oświetlenie'],
  ['fan','Wentylacja (zgodność)'],['camera','Kamera (zgodność)']
].map(option=>Object.freeze(option)));
const VELTO_ROOM_ICON_NAMES=new Set(VELTO_ROOM_ICON_OPTIONS.map(([value])=>value).filter(value=>value&&value!=='fan'&&value!=='camera'));
const VELTO_ROOM_ICON_COMPAT_NAMES=new Set(['fan','camera']);
const VELTO_ROOM_ICON_LEGACY_AUTO=new Set(['home','light','plug','sun','door']);
const VELTO_ROOM_ICON_LEGACY_MAP=Object.freeze({
  water:'bathtub',climate:'thermometer',leaf:'flower',toy:'lego',sofa:'armchair',
  briefcase:'office-chair',server:'hard-drives',garden:'flower'
});
class VeltoDashboard extends HTMLElement {
  constructor(){super();this.attachShadow({mode:'open'});this._config={};this._room='all';this._editLayout=false;this._activeOnly=false;this._hideTechnical=false;this._themeOverride=null;try{this._themeOverride=globalThis.localStorage?.getItem?.('velto:theme:override')||null}catch{}this._calendarCompact=false;this._calendarCompactUserSet=false;this._wasteCollapsed=true;this._calendarPrivate=true;try{const saved=globalThis.localStorage?.getItem?.('velto:calendar:private');if(saved!==null&&saved!==undefined)this._calendarPrivate=saved==='1'}catch{};this._sidebarToolsOpen=false;this._sidebarCollapsed=!!globalThis.matchMedia?.('(max-width: 600px)')?.matches;try{if(!this._sidebarCollapsed)this._sidebarCollapsed=globalThis.localStorage?.getItem?.('velto:sidebar:collapsed')==='1'}catch{}this._categoryFilter='all';this._hass=null;this._hassStateCount=null;this._roomsCache=null;this._roomsCacheConfig=null;this._roomsCacheRegistry=null;this._roomsCacheStateCount=-1;this._signatureModel=null;this._attributeSignatureCache=new WeakMap();this._signatureStateRefs=new Map();this._lastTemperatureUnitSignature=null;this._registry=null;this._registryLoading=false;this._registryLoadingConnection=null;this._registryRequest=0;this._registryConnection=null;this._registryFailedConnection=null;this._registryError=null;this._calendarEvents=[];this._calendarSourceEvents=new Map();this._calendarStaleSourceIds=[];this._calendarError=null;this._calendarLoading=false;this._calendarKey='';this._calendarTimer=null;this._clockTimer=null;this._dayTimer=null;this._visibilityListener=null;this._calendarLastChecked=null;this._calendarRequest=0;this._calendarConnection=null;this._weatherForecast=[];this._weatherForecastError=null;this._weatherForecastAwaitingUpdate=false;this._weatherForecastEntity=null;this._weatherForecastConnection=null;this._weatherForecastUnsub=null;this._weatherForecastPending=false;this._weatherForecastRequest=0;this._weatherForecastRetryAt=0;this._localLayoutOrder=null;this._localTileSizes=null;this._layoutStorageWarning=false;this._renderFrame=null;this._cancelRenderFrame=null;this._renderPending=false;this._serviceActionLocks=new Map();this._serviceActionNotice=null;this._serviceActionNoticeMessage=null;this._serviceActionNoticeEntities=new Map();this._responsiveObserverUnavailable=false;this._iconPathDefinitions=null;this._iconTemplateCache=new Map();this._tileAnimationObserver=null;this._tileAnimationTargets=new Set();this._tileAnimationVisibilityUnavailable=false;this._layoutLiveRegion=null}
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
    this._localLayoutOrder=local;this._localTileSizes=localSizes;const wasteDefaults={enabled:true,anchor_date:'2026-11-06',anchor_type:'mixed',show_next:true};const wasteConfig={...wasteDefaults,...(config.waste_collection||{})};this._config={...config,title:!config.title||config.title==='Mój dom'?'Księstwo':config.title,waste_collection:wasteConfig,tile_order:local?{...configured,...local}:configured,tile_sizes:localSizes?{...configuredSizes,...localSizes}:configuredSizes};this._calendarCompact=false;this._calendarCompactUserSet=false;const savedCalendarCompact=this.readCalendarCompact(this._config);if(savedCalendarCompact!==null){this._calendarCompact=savedCalendarCompact;this._calendarCompactUserSet=true}this._wasteCollapsed=true;try{this._wasteCollapsed=globalThis.localStorage?.getItem?.(this.wasteStorageKey(this._config))!=='0'}catch{}this._lastSignature=null;this._lastRoomSignature=null;this._lastThemeSignature=null;this._lastTemperatureUnitSignature=null;this._registryRequest++;this._registryLoading=false;this._registryLoadingConnection=null;this._registry=null;this._registryConnection=null;this._registryFailedConnection=null;this._registryError=null;this._calendarKey='';this._calendarEvents=[];this._calendarSourceEvents.clear();this._calendarStaleSourceIds=[];this._calendarError=null;this._calendarConnection=null;this._calendarLastChecked=null;this._calendarRequest++;if(this.isConnected!==false){this.loadRegistry();this.loadCalendar();this.loadWeatherForecast()}this.render()}
  set hass(value){
    const previousConnection=this._hass?.connection,nextConnection=value?.connection;
    this._hass=value;
    this._hassStateCount=Object.keys(value?.states||{}).length;
    if(previousConnection!==nextConnection){this._closeDetails?.();this.resetServiceActionLocks();this._roomsCache=null;this._signatureModel=null;this._lastRoomSignature=null;this._calendarKey='';this._calendarConnection=null;this._calendarEvents=[];this._calendarSourceEvents.clear();this._calendarStaleSourceIds=[];this._calendarError=null;this._calendarLastChecked=null;this._calendarRequest++;this._calendarLoading=false}
    if(this.isConnected!==false){this.loadRegistry();this.loadCalendar();this.loadWeatherForecast()}
    const model=this.signatureModel(),themeSignature=this._config.theme==='auto'?String(value?.themes?.darkMode):'',temperatureUnitSignature=String(value?.config?.unit_system?.temperature??'');
    let changed=this._lastRoomSignature!==model.roomSignature||this._lastThemeSignature!==themeSignature||this._lastTemperatureUnitSignature!==temperatureUnitSignature||this._signatureStateRefs.size!==model.entityIds.length;
    for(const id of model.entityIds){
      const state=value?.states?.[id],attributes=state?.attributes;
      const previous=this._signatureStateRefs.get(id);
      if(previous?.state!==state||previous?.attributes!==attributes)changed=true;
      this._signatureStateRefs.set(id,{state,attributes});
    }
    if(changed){
      const activeIds=new Set(model.entityIds);
      for(const id of this._signatureStateRefs.keys())if(!activeIds.has(id))this._signatureStateRefs.delete(id);
      this._lastRoomSignature=model.roomSignature;this._lastThemeSignature=themeSignature;this._lastTemperatureUnitSignature=temperatureUnitSignature;
      const signature=[this._room,themeSignature,temperatureUnitSignature,model.roomSignature,
        ...model.entityIds.map(id=>{const s=value?.states?.[id];return id+':'+(s?.state??'')+':'+this.attributeSignature(s?.attributes)})].join(';');
      if(signature!==this._lastSignature){this._lastSignature=signature;this.scheduleRender()}
    }
  }
  startResponsiveFallback(){
    if(this._responsiveFallbackActive)return;
    const supportsContainerQueries=globalThis.CSS?.supports?.('container-type: inline-size')===true;
    if(supportsContainerQueries){this.removeAttribute?.('data-velto-width');return}
    this._responsiveFallbackActive=true;
    this._responsiveMeasure=()=>this.updateResponsiveFallback();
    if(!this._responsiveObserverUnavailable&&typeof globalThis.ResizeObserver==='function'){
      let observer=null;
      try{
        observer=new globalThis.ResizeObserver(this._responsiveMeasure);
        observer.observe(this);
        this._responsiveObserver=observer
      }catch{
        this._responsiveObserverUnavailable=true;
        try{observer?.disconnect?.()}catch{}
        this._responsiveObserver=null;
        globalThis.addEventListener?.('resize',this._responsiveMeasure,{passive:true})
      }
    }else globalThis.addEventListener?.('resize',this._responsiveMeasure,{passive:true});
    this.updateResponsiveFallback()
  }
  updateResponsiveFallback(){
    if(!this._responsiveFallbackActive)return;
    const fullscreenLayout=this._fullscreenFallback?this.shadowRoot?.querySelector?.('.layout'):null;
    const fullscreenWidth=fullscreenLayout?.getBoundingClientRect?.().width;
    const hostWidth=this.getBoundingClientRect?.().width||this.clientWidth||0;
    const width=Number.isFinite(Number(fullscreenWidth))&&Number(fullscreenWidth)>0?Number(fullscreenWidth):Number(hostWidth);
    if(!Number.isFinite(width)||width<=0)return;
    const next=width<=340?'narrow':width<=520?'compact':width<=620?'mobile':width<=900?'tablet':width<=1280?'wide':'desktop';
    if(next===this._responsiveWidth)return;
    this._responsiveWidth=next;
    this.setAttribute?.('data-velto-width',next)
  }
  stopResponsiveFallback(){
    const observer=this._responsiveObserver;
    this._responsiveObserver=null;
    try{observer?.disconnect?.()}catch{this._responsiveObserverUnavailable=true}
    if(this._responsiveMeasure)globalThis.removeEventListener?.('resize',this._responsiveMeasure);
    this._responsiveMeasure=null;this._responsiveFallbackActive=false
  }
  disableTileAnimationVisibility(){
    this._tileAnimationVisibilityUnavailable=true;
    const observer=this._tileAnimationObserver;
    this._tileAnimationObserver=null;
    try{observer?.disconnect?.()}catch{}
    for(const tile of this._tileAnimationTargets)tile.removeAttribute('data-velto-visible');
    this._tileAnimationTargets.clear();
    this.removeAttribute('data-velto-visibility-managed')
  }
  syncTileAnimationVisibility(){
    if(this.isConnected!==true||!this.shadowRoot||this._tileAnimationVisibilityUnavailable||typeof globalThis.IntersectionObserver!=='function')return;
    if(!this._tileAnimationObserver){
      let observer;
      try{
        observer=new globalThis.IntersectionObserver(entries=>{
          if(this._tileAnimationObserver!==observer)return;
          for(const entry of entries){
            if(!this._tileAnimationTargets.has(entry.target))continue;
            if(entry.isIntersecting)entry.target.setAttribute('data-velto-visible','');
            else entry.target.removeAttribute('data-velto-visible')
          }
        },{root:null,rootMargin:'120px 0px',threshold:0.01});
      }catch{this.disableTileAnimationVisibility();return}
      this._tileAnimationObserver=observer;
      this.setAttribute('data-velto-visibility-managed','')
    }
    const observer=this._tileAnimationObserver;
    const tiles=this.shadowRoot.querySelectorAll?.('.tile')||[],current=new Set(tiles);
    for(const tile of this._tileAnimationTargets){
      if(current.has(tile))continue;
      try{observer.unobserve(tile)}catch{this.disableTileAnimationVisibility();return}
      tile.removeAttribute('data-velto-visible');
      this._tileAnimationTargets.delete(tile)
    }
    for(const tile of tiles){
      if(this._tileAnimationTargets.has(tile))continue;
      this._tileAnimationTargets.add(tile);
      try{observer.observe(tile)}catch{this.disableTileAnimationVisibility();return}
    }
  }
  stopTileAnimationVisibility(){
    const observer=this._tileAnimationObserver;
    this._tileAnimationObserver=null;
    try{observer?.disconnect?.()}catch{this._tileAnimationVisibilityUnavailable=true}
    for(const tile of this._tileAnimationTargets)tile.removeAttribute('data-velto-visible');
    this._tileAnimationTargets.clear();
    this.removeAttribute('data-velto-visibility-managed')
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
  startPeriodicUpdates(){
    if(this.isConnected===false||globalThis.document?.hidden===true)return;
    if(!this._clockTimer)this._clockTimer=setInterval(()=>{if(globalThis.document?.hidden===true)return;const clock=this.shadowRoot?.querySelector('.weather-clock');if(clock){const now=new Date();clock.textContent=now.toLocaleTimeString('pl-PL',{hour:'2-digit',minute:'2-digit'});clock.dateTime=now.toISOString()}},30000);
    if(!this._calendarTimer)this._calendarTimer=setInterval(()=>{if(!globalThis.document?.hidden)this.loadCalendar(true)},120000);
    if(!this._weatherTimer)this._weatherTimer=setInterval(()=>{if(!globalThis.document?.hidden)this.loadWeatherForecast(true)},1800000)
  }
  stopPeriodicUpdates(){
    if(this._clockTimer){clearInterval(this._clockTimer);this._clockTimer=null}
    if(this._calendarTimer){clearInterval(this._calendarTimer);this._calendarTimer=null}
    if(this._weatherTimer){clearInterval(this._weatherTimer);this._weatherTimer=null}
  }
  connectedCallback(){
    this.startResponsiveFallback();
    if(this._renderPending)this.scheduleRender();
    if(!this._dayTimer)this.scheduleDayRefresh();
    if(!this._fullscreenListener){
      this._fullscreenListener=()=>{
        if(document.fullscreenElement===this&&this._fullscreenFallback)this.exitFullscreenFallback();
        else{this.updateResponsiveFallback();this.updateFullscreenButton()}
      };
      document.addEventListener('fullscreenchange',this._fullscreenListener);
    }
    if(!this._visibilityListener){
      this._visibilityListener=()=>{
        if(globalThis.document?.hidden===true){this.stopPeriodicUpdates();return}
        this.scheduleDayRefresh();
        this.scheduleRender();
        this.loadCalendar(true);this.loadWeatherForecast(true);
        this.startPeriodicUpdates();
      };
      document.addEventListener('visibilitychange',this._visibilityListener);
    }
    // Resume HA data sources whenever Lovelace reattaches this custom card.
    this.loadRegistry();this.loadCalendar();this.loadWeatherForecast();
    this.startPeriodicUpdates();
    if(!this._storageListener){
      this._storageListener=e=>{
        if(e?.key==='velto:theme:override'){
          const next=e.newValue==='dark'||e.newValue==='light'?e.newValue:null;
          if(next!==this._themeOverride){this._themeOverride=next;this.scheduleRender()}
          return
        }
        if(e?.key==='velto:calendar:private'){
          const next=e.newValue===null||e.newValue==='1';
          if(next!==this._calendarPrivate){this._calendarPrivate=next;this.scheduleRender()}
          return
        }
        if(e?.key===this.calendarCompactStorageKey()){
          const saved=e.newValue==='1'?true:e.newValue==='0'?false:null;
          this._calendarCompactUserSet=saved!==null;
          const next=saved??(this._calendarEvents.length>3&&!!globalThis.matchMedia?.('(max-width: 780px)')?.matches);
          if(next!==this._calendarCompact){this._calendarCompact=next;this.scheduleRender()}
          return
        }
        if(e?.key===this.wasteStorageKey()){
          const next=e.newValue!=='0';
          if(next!==this._wasteCollapsed){this._wasteCollapsed=next;this.scheduleRender()}
          return
        }
        if(this._config?.layout_persistence==='config'||![this.layoutStorageKey(),this.layoutSizeStorageKey()].includes(e?.key))return;
        const local=this.readLocalLayout()||{},localSizes=this.readLocalSizes()||{};
        const merged={...(this._config.tile_order||{}),...local},mergedSizes={...(this._config.tile_sizes||{}),...localSizes};
        if(JSON.stringify(merged)===JSON.stringify(this._config.tile_order||{})&&JSON.stringify(mergedSizes)===JSON.stringify(this._config.tile_sizes||{}))return;
        this._config={...this._config,tile_order:merged,tile_sizes:mergedSizes};this._localLayoutOrder=local;this._localTileSizes=localSizes;this.scheduleRender()
      };
      globalThis?.addEventListener?.('storage',this._storageListener)
    }
    this.syncTileAnimationVisibility()
  }
  disconnectedCallback(){
    this.stopResponsiveFallback();
    this.stopTileAnimationVisibility();
    this.cancelScheduledRender();
    // Invalidate asynchronous work tied to the detached Lovelace lifecycle.
    this._calendarRequest++;this._calendarLoading=false;this._calendarKey='';this._calendarConnection=null;
    this._registryRequest++;this._registryLoading=false;this._registryLoadingConnection=null;this._registryFailedConnection=null;this._registryError=null;
    this._weatherForecastRequest++;this._weatherForecastPending=false;this._weatherForecastRetryAt=0;
    this.stopPeriodicUpdates();
    if(this._dayTimer){clearTimeout(this._dayTimer);this._dayTimer=null}
    if(this._weatherForecastUnsub){try{this._weatherForecastUnsub()}catch{}this._weatherForecastUnsub=null}
    if(this._fullscreenListener){document.removeEventListener('fullscreenchange',this._fullscreenListener);this._fullscreenListener=null}
    if(this._fullscreenFallbackKeyListener){document.removeEventListener('keydown',this._fullscreenFallbackKeyListener);this._fullscreenFallbackKeyListener=null}
    this._fullscreenFallback=false;
    if(this._visibilityListener){document.removeEventListener('visibilitychange',this._visibilityListener);this._visibilityListener=null}
    if(this._storageListener){globalThis?.removeEventListener?.('storage',this._storageListener);this._storageListener=null}
    this.resetServiceActionLocks();
    this._closeDetails?.()
  }
  orderedRoomEntities(room,order=[]){
    const orderIndex=new Map();
    for(let i=0;i<order.length;i++)if(!orderIndex.has(order[i]))orderIndex.set(order[i],i);
    return [...(room.entities||[])].sort((a,b)=>{
      const idA=typeof a==='string'?a:a?.entity,idB=typeof b==='string'?b:b?.entity;
      const ia=orderIndex.get(idA)??-1,ib=orderIndex.get(idB)??-1;
      return (ia<0?Number.MAX_SAFE_INTEGER:ia)-(ib<0?Number.MAX_SAFE_INTEGER:ib)
    })
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
    this.applyLayoutOrder({...this._config.tile_order,[roomId]:ids});
    this.announceLayoutChange('Kafelek '+this.name(entityId)+' przeniesiono na pozycję '+(to+1)+' z '+ids.length+' w pokoju '+(room.name||room.id||'wybranym')+'.')
  }
  announceLayoutChange(message){
    let region=this._layoutLiveRegion;
    if(!region){
      const create=globalThis.document?.createElement;
      if(typeof create!=='function')return;
      region=create.call(globalThis.document,'div');
      if(typeof region?.setAttribute!=='function')return;
      region.className='sr-only';
      region.setAttribute('role','status');region.setAttribute('aria-live','polite');region.setAttribute('aria-atomic','true');region.setAttribute('data-velto-layout-announcement','true');
      this._layoutLiveRegion=region
    }
    region.textContent=String(message||'');
    if(region.parentNode!==this.shadowRoot)this.shadowRoot?.append?.(region)
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
    this.render();this.updateResponsiveFallback();this.updateFullscreenButton()
  }
  exitFullscreenFallback(){
    if(!this._fullscreenFallback)return;
    this._fullscreenFallback=false;
    if(this._fullscreenFallbackKeyListener){document.removeEventListener('keydown',this._fullscreenFallbackKeyListener);this._fullscreenFallbackKeyListener=null}
    this.render();this.updateResponsiveFallback();this.updateFullscreenButton()
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
  wasteStorageKey(config=this._config){return 'velto:waste:collapsed:'+this.layoutStorageKey(config)}
  calendarCompactStorageKey(config=this._config){return 'velto:calendar:compact:'+this.layoutStorageKey(config)}
  readCalendarCompact(config=this._config){try{const saved=globalThis.localStorage?.getItem?.(this.calendarCompactStorageKey(config));return saved==='1'?true:saved==='0'?false:null}catch{return null}}
  toggleWasteSection(){this._wasteCollapsed=!this._wasteCollapsed;try{globalThis.localStorage?.setItem?.(this.wasteStorageKey(),this._wasteCollapsed?'1':'0')}catch(error){console.warn('VELTO could not persist waste section state',error)}this.render()}
  toggleCalendarCompact(){this._calendarCompact=!this._calendarCompact;this._calendarCompactUserSet=true;try{globalThis.localStorage?.setItem?.(this.calendarCompactStorageKey(),this._calendarCompact?'1':'0')}catch(error){console.warn('VELTO could not persist calendar compact state',error)}this.render()}
  weatherForecastEntity(){
    const explicit=this._config.weather?.forecast_entity||this._config.weather?.entity;
    if(typeof explicit==='string'&&/^weather\.[a-z0-9_]+$/.test(explicit))return explicit;
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
  handleForecastKeydown(strip,event){
    const key=event?.key;
    if(!['ArrowLeft','ArrowRight','Home','End'].includes(key)||!strip)return false;
    const days=Array.from(strip.querySelectorAll?.('.forecast-day')||[]);
    if(!days.length)return false;
    const currentIndex=days.indexOf(this.shadowRoot?.activeElement);
    const nextIndex=key==='Home'?0:key==='End'?days.length-1:currentIndex<0?(key==='ArrowRight'?0:days.length-1):Math.max(0,Math.min(days.length-1,currentIndex+(key==='ArrowRight'?1:-1)));
    const target=days[nextIndex];if(!target)return false;
    event.preventDefault?.();
    try{target.focus({preventScroll:true})}catch{target.focus?.()}
    const viewport=strip.getBoundingClientRect?.(),bounds=target.getBoundingClientRect?.();
    if(viewport&&bounds){
      const delta=bounds.left<viewport.left?bounds.left-viewport.left-8:bounds.right>viewport.right?bounds.right-viewport.right+8:0;
      if(delta){
        const reducedMotion=globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches===true;
        if(typeof strip.scrollBy==='function')strip.scrollBy({left:delta,behavior:reducedMotion?'auto':'smooth'});
        else strip.scrollLeft=(Number(strip.scrollLeft)||0)+delta
      }
    }
    return true
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
    if(!entity){
      this._weatherForecastRequest++;this._weatherForecastPending=false;this._weatherForecastRetryAt=0;this._weatherForecast=[];this._weatherForecastError=null;this._weatherForecastAwaitingUpdate=false;this._weatherForecastEntity=null;this._weatherForecastConnection=null;
      if(this._weatherForecastUnsub){try{this._weatherForecastUnsub()}catch{}this._weatherForecastUnsub=null}
      return
    }
    const sameEntity=this._weatherForecastEntity===entity;
    if(!connection?.subscribeMessage){
      this._weatherForecastRequest++;this._weatherForecastPending=false;this._weatherForecastRetryAt=0;this._weatherForecastAwaitingUpdate=false;
      if(this._weatherForecastUnsub){try{this._weatherForecastUnsub()}catch{}this._weatherForecastUnsub=null}
      if(!sameEntity)this._weatherForecast=[];
      this._weatherForecastEntity=entity;this._weatherForecastConnection=null;
      this._weatherForecastError=new Error('Home Assistant forecast connection unavailable');
      this.scheduleRender();
      return
    }
    const sameSource=sameEntity&&this._weatherForecastConnection===connection;
    if(!force&&sameSource&&(this._weatherForecastUnsub||this._weatherForecastPending||Date.now()<(this._weatherForecastRetryAt||0)))return;
    this._weatherForecastRetryAt=0;
    const request=++this._weatherForecastRequest;this._weatherForecastPending=true;
    if(this._weatherForecastUnsub){try{this._weatherForecastUnsub()}catch{}this._weatherForecastUnsub=null}
    const hasLastKnownGood=sameEntity&&this._weatherForecast.length>0;
    if(!sameEntity)this._weatherForecast=[];
    this._weatherForecastAwaitingUpdate=hasLastKnownGood;
    if(!hasLastKnownGood)this._weatherForecastError=null;
    this._weatherForecastEntity=entity;this._weatherForecastConnection=connection;
    try{
      const unsub=await connection.subscribeMessage(event=>{
        if(request!==this._weatherForecastRequest||this._hass?.connection!==connection||this.weatherForecastEntity()!==entity)return;
        if(!Array.isArray(event?.forecast)){
          this._weatherForecastAwaitingUpdate=false;
          this._weatherForecastError=new TypeError('Weather forecast subscription returned an invalid response');
          this.scheduleRender();
          return
        }
        const normalized=this.normalizeDailyForecast(event.forecast,event?.type||forecastType);
        if(!normalized.length){
          this._weatherForecastAwaitingUpdate=false;
          this._weatherForecastError=new TypeError('Weather forecast subscription returned no valid forecast days');
          this.scheduleRender();
          return
        }
        this._weatherForecast=normalized;
        this._weatherForecastAwaitingUpdate=false;this._weatherForecastError=null;this.scheduleRender()
      },{type:'weather/subscribe_forecast',forecast_type:forecastType,entity_id:entity});
      if(request!==this._weatherForecastRequest||this._hass?.connection!==connection||this.weatherForecastEntity()!==entity){try{unsub?.()}catch{}return}
      this._weatherForecastUnsub=typeof unsub==='function'?unsub:null;this._weatherForecastRetryAt=this._weatherForecastUnsub?0:Date.now()+60000;this._weatherForecastPending=false;this._weatherForecastConnection=connection
    }catch(error){
      if(request!==this._weatherForecastRequest)return;
      this._weatherForecastPending=false;this._weatherForecastAwaitingUpdate=false;this._weatherForecastRetryAt=Date.now()+60000;this._weatherForecastError=error;this._weatherForecastConnection=connection;console.warn('VELTO daily forecast unavailable',error);this.scheduleRender()
    }
  }
  weatherForecastStaleLabel(){return this._weatherForecastAwaitingUpdate?'Odświeżam prognozę — na razie pokazuję ostatnie dostępne dane.':'Pokazuję ostatnią dostępną prognozę — nie udało się jej odświeżyć.'}
  polishCount(n,one,few,many){const value=Math.abs(Number(n)||0),mod100=value%100,mod10=value%10;return value===1?one:mod100>=12&&mod100<=14?many:mod10>=2&&mod10<=4?few:many}
  async loadCalendar(force=false){
    const cfg=this._config.calendar,configuredIds=Array.isArray(cfg?.entities)&&cfg.entities.length?cfg.entities:[cfg?.entity],ids=[...new Set(configuredIds.filter(x=>typeof x==='string'&&/^calendar\.[a-z0-9_]+$/.test(x)))];
    if(!ids.length){this._calendarEvents=[];this._calendarSourceEvents.clear();this._calendarStaleSourceIds=[];this._calendarError=null;this._calendarKey='';this._calendarLastChecked=null;this._calendarRequest++;this._calendarLoading=false;return}
    if(!this._hass?.callApi)return;
    const api=this._hass,connection=api.connection;
    const requestedDays=Number(cfg.days);const days=Number.isFinite(requestedDays)&&requestedDays>0?Math.max(1,Math.min(90,Math.floor(requestedDays))):14,key=ids.join('|')+'|'+days;
    if(!force&&this._calendarKey===key)return;
    if(this._calendarLoading&&this._calendarKey===key)return;
    if(this._calendarKey&&this._calendarKey!==key){this._calendarSourceEvents.clear();this._calendarStaleSourceIds=[];this._calendarEvents=[];this._calendarLastChecked=null}
    this._calendarLoading=true;this._calendarKey=key;this._calendarConnection=connection;const request=++this._calendarRequest;
    const now=new Date(),start=new Date(now.getFullYear(),now.getMonth(),now.getDate()),end=new Date(start);end.setDate(end.getDate()+days);
    try{
      const result=await Promise.allSettled(ids.map(async id=>{
        const path='calendars/'+encodeURIComponent(id)+'?start='+encodeURIComponent(start.toISOString())+'&end='+encodeURIComponent(end.toISOString());
        const response=await api.callApi('GET',path);
        if(!Array.isArray(response))throw new TypeError('Calendar API returned an invalid response');
        const events=response.filter(event=>event&&typeof event==='object'&&!Array.isArray(event)).map(event=>({...event,calendar:id}));
        return {id,events}
      }));
      if(request!==this._calendarRequest||this._hass?.connection!==connection)return;
      const failures=result.filter(item=>item.status==='rejected'),staleSourceIds=[];
      let successfulCount=0;
      for(let index=0;index<result.length;index++){
        const item=result[index],id=ids[index];
        if(item.status==='fulfilled'){successfulCount++;this._calendarSourceEvents.set(id,item.value.events)}
        else if(this._calendarSourceEvents.has(id))staleSourceIds.push(id)
      }
      if(failures.length)console.warn('VELTO: '+failures.length+' calendar source(s) unavailable',ids.filter((id,index)=>result[index].status==='rejected'));
      this._calendarStaleSourceIds=staleSourceIds;
      this._calendarEvents=ids.flatMap(id=>this._calendarSourceEvents.get(id)||[]).filter(event=>{
        const startDate=this.eventDate(event.start);
        if(!Number.isFinite(startDate.getTime())||startDate>=end)return false;
        const endValue=event.end?.dateTime||event.end?.date||event.end;
        const endDate=endValue?this.eventDate(endValue):startDate;
        return Number.isFinite(endDate.getTime())&&endDate>=now&&endDate>=startDate
      }).sort((a,b)=>this.eventDate(a.start)-this.eventDate(b.start));
      if(!this._calendarCompactUserSet)this._calendarCompact=this._calendarEvents.length>3&&!!globalThis.matchMedia?.('(max-width: 780px)')?.matches;
      this._calendarError=failures.length?new Error(failures.length+' calendar source(s) unavailable'):null;this._calendarLastChecked=successfulCount?new Date():this._calendarLastChecked;
    }catch(err){
      if(request===this._calendarRequest&&this._hass?.connection===connection){this._calendarError=err;this._calendarStaleSourceIds=ids.filter(id=>this._calendarSourceEvents.has(id))}
      console.warn('VELTO calendar:',err)
    }
    finally{if(request===this._calendarRequest&&this._hass?.connection===connection){this._calendarLoading=false;this.scheduleRender()}}
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
    this._registry={areas,entities,devices};this._registryError=null;this._registryConnection=connection;this.scheduleRender();
    }catch(error){
      if(request!==this._registryRequest||this._hass?.connection!==connection||!this._config.auto_areas)return;
      this._registryFailedConnection=connection;this._registryError=error;this.scheduleRender();console.warn('VELTO: area discovery unavailable',error)
    }finally{if(request===this._registryRequest){this._registryLoading=false;this._registryLoadingConnection=null}}
  }
  autoRoomIcon(name){
    const n=String(name||'').toLowerCase();
    if(/kuchnia|kitchen/.test(n))return 'cooking-pot';
    if(/łazien|lazien|bath/.test(n))return 'bathtub';
    if(/hall|korytarz|przedpok|hol\b|wejści|wejsci|entrance/.test(n))return 'door-open';
    if(/garaż|garaz|garage/.test(n))return 'garage';
    if(/ogród|ogrod|garden|taras|terrace|patio|balkon|balcony/.test(n))return 'flower';
    if(/kids|dzieci|child|nursery/.test(n))return 'lego';
    if(/living|salon|pokój dzienny|pokoj dzienny/.test(n))return 'armchair';
    if(/rack|serwer|server/.test(n))return 'hard-drives';
    if(/storage|schowek|magazyn|spiżarnia|spizarnia/.test(n))return 'archive';
    if(/biuro|office|pracown/.test(n))return 'office-chair';
    if(/sypial|bedroom|pokój|pokoj|room/.test(n))return 'bed';
    if(/kotł|boiler|utility|technicz/.test(n))return 'thermometer';
    return 'house'
  }
  roomIconFor(room){
    const configured=typeof room?.icon==='string'?room.icon:'';
    if(VELTO_ROOM_ICON_NAMES.has(configured)||VELTO_ROOM_ICON_COMPAT_NAMES.has(configured))return configured;
    if(!configured||VELTO_ROOM_ICON_LEGACY_AUTO.has(configured))return this.autoRoomIcon(room?.name);
    return VELTO_ROOM_ICON_LEGACY_MAP[configured]||this.autoRoomIcon(room?.name)
  }
  autoTileSize(entityId){
    if(this._config.smart_layout===false)return 'small';
    const domain=String(entityId||'').split('.')[0];
    if(['media_player','camera','weather'].includes(domain))return 'large';
    if(['vacuum','climate','cover','humidifier','alarm_control_panel','water_heater','valve'].includes(domain))return 'medium';
    return 'small'
  }
  autoEntityVisible(entry){
    if(!entry?.entity_id)return false;
    if(entry.disabled_by||entry.hidden_by)return false;
    if(!this._config.show_diagnostics&&['diagnostic','config'].includes(entry.entity_category))return false;
    return true
  }
  roomMetricValue(value,min=-Infinity,max=Infinity){
    if(value===null||value===undefined||typeof value==='boolean')return null;
    const raw=String(value).trim();if(!raw)return null;
    const number=Number(raw.replace(',','.'));
    return Number.isFinite(number)&&number>=min&&number<=max?number:null
  }
  roomTemperatureUnit(value){
    const unit=String(value??'').trim().toLowerCase().replace(/\s+/g,'');
    if(['°c','c','celsius','degc'].includes(unit))return '°C';
    if(['°f','f','fahrenheit','degf'].includes(unit))return '°F';
    if(['k','°k','kelvin'].includes(unit))return 'K';
    return null
  }
  roomTemperatureInUnit(value,sourceUnit,targetUnit){
    const number=this.roomMetricValue(value);
    const source=this.roomTemperatureUnit(sourceUnit),target=this.roomTemperatureUnit(targetUnit);
    if(number===null||!source||!target)return null;
    const celsius=source==='°F'?(number-32)*5/9:source==='K'?number-273.15:number;
    const converted=target==='°F'?celsius*9/5+32:target==='K'?celsius+273.15:celsius;
    return Number.isFinite(converted)?converted:null
  }
  roomBatteryLevel(state){
    if(!state||['unknown','unavailable'].includes(state.state)||String(state.attributes?.device_class||'').trim().toLowerCase()!=='battery')return null;
    const unit=String(state.attributes?.unit_of_measurement??state.attributes?.native_unit_of_measurement??'').trim().toLowerCase();
    if(!['%','percent','percentage'].includes(unit))return null;
    return this.roomMetricValue(state.state,0,100)
  }
  roomBatteryThreshold(){
    const threshold=Number(this._config?.low_battery_threshold);
    return VELTO_LOW_BATTERY_THRESHOLDS.includes(threshold)?threshold:VELTO_LOW_BATTERY_THRESHOLD
  }
  roomEntityNeedsAttention(id,state=this.entity(id)){
    if(typeof id!=='string'||!state||['unknown','unavailable'].includes(state.state))return false;
    const domain=id.split('.')[0],deviceClass=String(state.attributes?.device_class||'').trim().toLowerCase(),value=state.state;
    if(domain==='lock')return ['unlocked','jammed'].includes(value);
    if(domain==='alarm_control_panel')return ['triggered','pending'].includes(value);
    if(domain==='valve'&&deviceClass==='gas')return ['open','opening','closing'].includes(value);
    if(domain==='sensor'&&deviceClass==='battery'){
      const level=this.roomBatteryLevel(state);
      return level!==null&&level<=this.roomBatteryThreshold()
    }
    if(domain!=='binary_sensor')return false;
    if(VELTO_BINARY_SENSOR_ALERT_CLASSES.has(deviceClass)||VELTO_BINARY_SENSOR_ENTRY_CLASSES.has(deviceClass)||deviceClass==='lock')return value==='on';
    if(deviceClass==='battery')return value==='on';
    if(deviceClass==='connectivity')return value==='off';
    return false
  }
  roomAttentionLabel(count){
    const numeric=Number(count),value=Number.isFinite(numeric)?Math.max(0,Math.floor(numeric)):0;
    const few=value%10>=2&&value%10<=4&&!(value%100>=12&&value%100<=14);
    return value+' '+(value===1?'uwaga':few?'uwagi':'uwag')
  }
  roomContext(room){
    const ids=[...new Set((room?.entities||[]).map(item=>typeof item==='string'?item:item?.entity).filter(Boolean))];
    const live=ids.filter(id=>this.entity(id)&&!['unknown','unavailable'].includes(this.entity(id).state));
    const lights=live.filter(id=>id.startsWith('light.')),lightsOn=lights.filter(id=>this.entity(id)?.state==='on');
    const covers=live.filter(id=>id.startsWith('cover.')),coversOpen=covers.filter(id=>['open','opening'].includes(this.entity(id)?.state));
    const media=live.filter(id=>id.startsWith('media_player.')),mediaPlaying=media.filter(id=>this.entity(id)?.state==='playing');
    const actions=live.filter(id=>['scene','script'].includes(id.split('.')[0])).slice(0,6);
    const temperatures=[],humidities=[];
    const configuredTemperatureUnit=this.roomTemperatureUnit(this._hass?.config?.unit_system?.temperature);
    for(const id of live){
      const state=this.entity(id),domain=id.split('.')[0],attributes=state.attributes||{};
      if(domain==='climate'){
        const reportedUnit=attributes.temperature_unit??attributes.unit_of_measurement;
        const sourceUnit=reportedUnit===null||reportedUnit===undefined||String(reportedUnit).trim()===''?configuredTemperatureUnit:this.roomTemperatureUnit(reportedUnit);
        const temperature=this.roomMetricValue(attributes.current_temperature);
        if(temperature!==null&&sourceUnit)temperatures.push({value:temperature,unit:sourceUnit});
        const humidity=this.roomMetricValue(attributes.current_humidity,0,100);
        if(humidity!==null)humidities.push(humidity)
      }else if(domain==='sensor'&&attributes.device_class==='temperature'){
        const sourceUnit=this.roomTemperatureUnit(attributes.unit_of_measurement);
        const temperature=this.roomMetricValue(state.state);
        if(temperature!==null&&sourceUnit)temperatures.push({value:temperature,unit:sourceUnit})
      }else if(domain==='sensor'&&attributes.device_class==='humidity'){
        const humidity=this.roomMetricValue(state.state,0,100);
        if(humidity!==null)humidities.push(humidity)
      }
    }
    const temperatureUnit=configuredTemperatureUnit||temperatures[0]?.unit||null;
    const normalizedTemperatures=temperatureUnit?temperatures.map(item=>this.roomTemperatureInUnit(item.value,item.unit,temperatureUnit)).filter(value=>Number.isFinite(value)):[];
    const temperature=normalizedTemperatures.length?normalizedTemperatures.reduce((sum,n)=>sum+n,0)/normalizedTemperatures.length:null;
    const humidity=humidities.length?humidities.reduce((sum,n)=>sum+n,0)/humidities.length:null;
    const security=live.filter(id=>{const state=this.entity(id),domain=id.split('.')[0],dc=state.attributes?.device_class;return ['camera','lock','alarm_control_panel'].includes(domain)||(domain==='binary_sensor'&&VELTO_BINARY_SENSOR_SECURITY_CLASSES.has(dc))||(domain==='valve'&&dc==='gas')}),attention=live.filter(id=>this.roomEntityNeedsAttention(id));
    const offline=ids.filter(id=>{const state=this.entity(id);return !state||['unknown','unavailable'].includes(state.state)});
    const categories={lights:lights.length,media:media.length,climate:live.filter(id=>['climate','humidifier','water_heater'].includes(id.split('.')[0])).length,covers:covers.length,security:security.length,offline:offline.length};
    return {ids,lights,lightsOn,covers,coversOpen,media,mediaPlaying,actions,temperature,temperatureUnit:normalizedTemperatures.length?temperatureUnit:null,humidity,offline,attention,categories}
  }
  categoryMatch(id){
    const filter=this._categoryFilter||'all';if(filter==='all')return true;
    const state=this.entity(id),domain=id.split('.')[0],dc=state?.attributes?.device_class;
    if(filter==='offline')return !state||['unknown','unavailable'].includes(state.state);
    if(filter==='lights')return domain==='light';
    if(filter==='media')return domain==='media_player';
    if(filter==='climate')return ['climate','humidifier','water_heater'].includes(domain)||(domain==='sensor'&&['temperature','humidity'].includes(dc));
    if(filter==='covers')return domain==='cover';
    if(filter==='security')return ['camera','lock','alarm_control_panel'].includes(domain)||(domain==='binary_sensor'&&VELTO_BINARY_SENSOR_SECURITY_CLASSES.has(dc))||(domain==='valve'&&dc==='gas');
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
      const domain=id.split('.')[0],dc=state.attributes?.device_class,batteryLevel=domain==='sensor'&&dc==='battery'?this.roomBatteryLevel(state):null;
      let base={media_player:48,camera:44,vacuum:42,climate:40,water_heater:39,alarm_control_panel:39,valve:36,lock:34,cover:33,light:31,fan:29,switch:22,input_boolean:18}[domain];
      if(batteryLevel!==null&&batteryLevel<=this.roomBatteryThreshold())base=34;
      if(domain==='binary_sensor'){
        if(VELTO_BINARY_SENSOR_ALERT_CLASSES.has(dc))base=46;
        else if(VELTO_BINARY_SENSOR_ENTRY_CLASSES.has(dc))base=35;
        else if(dc==='battery'&&state.state==='on')base=34;
        else if(dc==='connectivity'&&state.state==='off')base=32;
        else if(dc==='lock'&&state.state==='on')base=34;
      }
      if(base===undefined&&!pinned.includes(id))continue;
      const active=['on','open','opening','closing','unlocked','heat','cool','heating','playing','cleaning','returning','triggered','pending'].includes(state.state);
      let score=base??10;
      if(active)score+=42;
      if(domain==='media_player'&&state.state==='playing')score+=22;
      if(domain==='vacuum'&&['cleaning','returning'].includes(state.state))score+=18;
      if(domain==='lock'&&state.state==='unlocked')score+=60;
      if(domain==='cover'&&['open','opening'].includes(state.state))score+=35;
      if(domain==='valve'&&['open','opening','closing'].includes(state.state))score+=35;
      if(domain==='valve'&&dc==='gas'&&['open','opening'].includes(state.state))score+=60;
      if(domain==='alarm_control_panel'&&['triggered','pending'].includes(state.state))score+=80;
      if(domain==='binary_sensor'){
        if(state.state==='on'){
          if(VELTO_BINARY_SENSOR_ALERT_CLASSES.has(dc))score+=80;
          else if(dc==='battery')score+=68;
          else if(dc==='lock')score+=55;
          else if(VELTO_BINARY_SENSOR_ENTRY_CLASSES.has(dc))score+=35;
        }else if(dc==='connectivity'&&state.state==='off')score+=65;
      }
      if(domain==='sensor'&&batteryLevel!==null&&batteryLevel<=this.roomBatteryThreshold())score+=80;
      const pinnedIndex=pinned.indexOf(id);if(pinnedIndex>=0)score=1000-pinnedIndex;
      const size=['media_player','camera','vacuum','climate','cover','humidifier','water_heater','valve'].includes(domain)?'medium':'small';
      candidates.push({item:{...item,size},score,name:this.name(id)||id})
    }
    return candidates.sort((a,b)=>b.score-a.score||a.name.localeCompare(b.name,'pl')).slice(0,limit).map(x=>x.item)
  }
  getRooms(){
    const manual=Array.isArray(this._config.rooms)?this._config.rooms:[];
    if(!this._config.auto_areas||!this._registry)return manual;
    const states=this._hass?.states||{},stateCount=this._hassStateCount??Object.keys(states).length;
    if(manual.length===0&&this._roomsCache&&this._roomsCacheConfig===this._config&&this._roomsCacheRegistry===this._registry&&this._roomsCacheStateCount===stateCount)return this._roomsCache;
    const {areas,entities,devices}=this._registry;
    const deviceArea=new Map((devices||[]).filter(d=>d?.id).map(d=>[d.id,d.area_id]));
    const ignored=new Set(['update','event','time','date','text','diagnostic','sun','zone','persistent_notification','device_tracker','person']);
    const included=new Set(Array.isArray(this._config.auto_domains)?this._config.auto_domains.filter(domain=>typeof domain==='string'):['light','switch','fan','cover','climate','sensor','binary_sensor','media_player','lock','vacuum','scene','script','button','input_boolean','automation','humidifier','water_heater','alarm_control_panel','remote','select','number','input_select','input_number','input_button','input_datetime','counter','timer','weather','camera']);
    const groups=(areas||[]).filter(area=>area&&(area.area_id||area.id)).map(area=>{const name=area.name||'Pomieszczenie';return {id:'area_'+(area.area_id||area.id),name,icon:this.autoRoomIcon(name),entities:[]}});
    const lookup=new Map(groups.map(r=>[r.id.slice(5),r]));const seen=new Set();
    const priority={vacuum:0,media_player:1,camera:2,climate:3,cover:4,light:5,fan:6,lock:7,switch:8,scene:9,script:10,counter:11,timer:12,input_datetime:13,binary_sensor:14,sensor:14};
    const maxRaw=Number(this._config.max_auto_entities),maxPerRoom=Number.isFinite(maxRaw)?Math.max(8,Math.min(60,Math.floor(maxRaw))):24;
    const sortedEntities=[...(entities||[])].sort((a,b)=>(priority[a?.entity_id?.split('.')[0]]??20)-(priority[b?.entity_id?.split('.')[0]]??20));
    for(const e of sortedEntities){
      if(!this.autoEntityVisible(e)||seen.has(e.entity_id)||!this._hass?.states?.[e.entity_id])continue;
      const domain=e.entity_id.split('.')[0];if(ignored.has(domain)||!included.has(domain))continue;
      const area=e.area_id||deviceArea.get(e.device_id),room=lookup.get(area);
      if(room&&room.entities.length<maxPerRoom){room.entities.push({entity:e.entity_id,size:this.autoTileSize(e.entity_id)});seen.add(e.entity_id)}
    }
    const result=[...manual,...groups.filter(g=>(!this._config.hide_empty_rooms||g.entities.length)&&!manual.some(r=>r.id===g.id||r.name===g.name))];
    if(manual.length===0){this._roomsCache=result;this._roomsCacheConfig=this._config;this._roomsCacheRegistry=this._registry;this._roomsCacheStateCount=stateCount}
    return result;
  }
  attributeSignature(attributes){
    if(!attributes||typeof attributes!=='object')return '';
    const cached=this._attributeSignatureCache?.get(attributes);
    if(cached!==undefined)return cached;
    const signature=[attributes.friendly_name,attributes.unit_of_measurement,attributes.device_class,attributes.entity_picture,attributes.media_image_url,attributes.media_title,attributes.media_artist,attributes.app_name,attributes.source,Array.isArray(attributes.source_list)?attributes.source_list.join(','):attributes.source_list,attributes.shuffle,attributes.repeat,attributes.is_volume_muted,Array.isArray(attributes.sound_mode_list)?attributes.sound_mode_list.join(','):attributes.sound_mode_list,attributes.sound_mode,attributes.volume_level,attributes.media_duration,attributes.media_position,attributes.supported_features,Array.isArray(attributes.supported_color_modes)?attributes.supported_color_modes.join(','):attributes.supported_color_modes,attributes.color_mode,attributes.color_temp_kelvin,attributes.color_temp,attributes.min_color_temp_kelvin,attributes.max_color_temp_kelvin,attributes.min_mireds,attributes.max_mireds,Array.isArray(attributes.rgb_color)?attributes.rgb_color.join(','):attributes.rgb_color,Array.isArray(attributes.hs_color)?attributes.hs_color.join(','):attributes.hs_color,Array.isArray(attributes.xy_color)?attributes.xy_color.join(','):attributes.xy_color,attributes.brightness,attributes.percentage,attributes.percentage_step,Array.isArray(attributes.preset_modes)?attributes.preset_modes.join(','):attributes.preset_modes,attributes.preset_mode,attributes.direction,attributes.oscillating,attributes.code_format,attributes.temperature,attributes.current_temperature,attributes.native_temperature,attributes.native_current_temperature,attributes.native_target_temperature,attributes.temperature_unit,attributes.native_temperature_unit,attributes.min_temp,attributes.max_temp,attributes.target_temp_step,Array.isArray(attributes.operation_list)?attributes.operation_list.join(','):attributes.operation_list,attributes.operation_mode,attributes.away_mode,attributes.is_away_mode_on,attributes.hvac_action,attributes.current_position,attributes.battery_level,attributes.status,attributes.min,attributes.max,attributes.step,attributes.minimum,attributes.maximum,attributes.initial,attributes.duration,attributes.remaining,attributes.finishes_at,Array.isArray(attributes.options)?attributes.options.join(','):attributes.options,attributes.mode,attributes.pattern,attributes.has_date,attributes.has_time,attributes.year,attributes.month,attributes.day,attributes.hour,attributes.minute,attributes.second,attributes.timestamp,attributes.editable].map(value=>value==null?'':String(value)).join('|');
    this._attributeSignatureCache.set(attributes,signature);return signature
  }
  signatureModel(){
    const rooms=this.getRooms(),cacheable=Boolean(this._config.auto_areas&&this._registry&&(!Array.isArray(this._config.rooms)||this._config.rooms.length===0));
    if(cacheable&&this._signatureModel?.rooms===rooms&&this._signatureModel?.config===this._config)return this._signatureModel;
    const ids=new Set(rooms.flatMap(r=>(r.entities||[]).map(e=>typeof e==='string'?e:e.entity)));
    if(this._config.presence?.entity)ids.add(this._config.presence.entity);
    for(const id of Object.values(this._config.weather?.entities||{}))if(id)ids.add(id);
    const forecastWeatherId=this.weatherForecastEntity();if(forecastWeatherId)ids.add(forecastWeatherId);
    const model={rooms,config:this._config,entityIds:[...ids].sort(),roomSignature:rooms.map(r=>[r.id,r.name,(r.entities||[]).map(e=>typeof e==='string'?e:e.entity).join(',')].join(':')).join('|')};
    if(cacheable)this._signatureModel=model;return model;
  }
  getCardSize(){return 8}
  static getStubConfig(){return {title:'Księstwo',auto_areas:true,hide_empty_rooms:true,theme:'auto',smart_layout:true,show_diagnostics:false,max_auto_entities:24,show_home_highlights:true,home_highlight_limit:8,room_controls:true,scene_shortcuts:true,layout_persistence:'hybrid',rooms:[]}}
  static getConfigElement(){return document.createElement('velto-dashboard-editor')}
  getGridOptions(){return {columns:12,min_columns:6,rows:8}}
  entity(id){return this._hass?.states?.[id]}
  tileIsActive(id,state=this.entity(id)){
    const domain=typeof id==='string'?id.split('.')[0]:'';
    if(!domain||domain==='input_text'||!state||['unknown','unavailable'].includes(state.state))return false;
    const value=state.state;
    return ['on','open','unlocked','heat','cool','heating','playing','cleaning'].includes(value)||domain==='valve'&&['opening','closing'].includes(value)
  }
  text(id){const s=this.entity(id);return s&&!['unknown','unavailable'].includes(s.state)?s.state:null}
  name(id){return this.entity(id)?.attributes?.friendly_name||id}
  entityStateLabel(id,state=this.entity(id)){
    if(!state)return 'Niedostępne';
    const value=typeof state.state==='string'?state.state:'';
    if(value==='unknown'||value==='unavailable')return 'Niedostępne';
    if(String(id||'').startsWith('update.')){
      if(value==='on')return 'Aktualizacja dostępna';
      if(value==='off')return 'Aktualne';
    }
    if(String(id||'').startsWith('binary_sensor.')&&(value==='on'||value==='off')){
      const deviceClass=String(state.attributes?.device_class||'').trim().toLowerCase(),labels=VELTO_BINARY_SENSOR_STATE_LABELS[deviceClass];
      if(labels)return labels[value]
    }
    return VELTO_COMMON_STATE_LABELS[value]||value||'Brak danych'
  }
  hasNumericSensorHistory(id,state=this.entity(id)){
    if(typeof id!=='string'||!id.includes('.')||id.endsWith('.')||!['sensor','number','input_number','counter'].includes(id.split('.')[0])||!state||['unknown','unavailable'].includes(state.state))return false;
    const raw=state.state;if(raw===null||raw===undefined||String(raw).trim()==='')return false;
    return Number.isFinite(Number(String(raw).trim().replace(',','.')))
  }
  hasBinarySensorHistory(id,state=this.entity(id)){
    if(typeof id!=='string'||!id.startsWith('binary_sensor.')||!state)return false;
    return state.state==='on'||state.state==='off'
  }
  binarySensorHistoryEntries(data){
    const raw=Array.isArray(data?.[0])?data[0]:Array.isArray(data)?data:[];
    const ordered=raw.map(x=>({time:new Date(x?.last_changed||x?.last_updated).getTime(),state:typeof x?.state==='string'?x.state.trim().toLowerCase():''})).filter(x=>Number.isFinite(x.time)&&['on','off','unknown','unavailable'].includes(x.state)).sort((a,b)=>a.time-b.time);
    const entries=[];for(const entry of ordered)if(entries[entries.length-1]?.state!==entry.state)entries.push(entry);
    return entries
  }
  binarySensorDurationLabel(milliseconds,ongoing=false){
    if(milliseconds===null||milliseconds===undefined)return '';
    const duration=Number(milliseconds);
    if(!Number.isFinite(duration)||duration<0)return '';
    let totalMinutes=Math.floor(duration/60000);
    if(totalMinutes<1)return ongoing?'Stan trwa: krócej niż minutę':'Czas stanu: poniżej minuty';
    const days=Math.floor(totalMinutes/1440);totalMinutes-=days*1440;
    const hours=Math.floor(totalMinutes/60),minutes=totalMinutes%60;
    const parts=[];
    const plural=(value,one,few,many)=>value===1?one:value%10>=2&&value%10<=4&&!(value%100>=12&&value%100<=14)?few:many;
    if(days)parts.push(days+' '+plural(days,'dzień','dni','dni'));
    if(hours)parts.push(hours+' godz.');
    if(minutes)parts.push(minutes+' min');
    return (ongoing?'Stan trwa: ':'Czas stanu: ')+parts.join(' ');
  }
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
    const previousFocus=root.activeElement||document.activeElement;
    this._closeDetails?.();
    const make=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n};
    const backdrop=make('div','velto-modal-backdrop'),panel=make('section','velto-modal velto-history-modal');
    panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-label','Historia: '+label);
    const api=this._hass,connection=api?.connection;let closed=false,request=0;
    const close=()=>{if(closed)return;closed=true;request++;backdrop.remove();document.removeEventListener('keydown',onKey);if(this._closeDetails===close)this._closeDetails=null;if(previousFocus?.isConnected)previousFocus.focus?.()};
    const onKey=e=>{if(e.key==='Escape'){e.preventDefault();close();return}if(e.key!=='Tab')return;const focusable=[...panel.querySelectorAll('button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),a[href],[tabindex]:not([tabindex="-1"])')].filter(node=>!node.hidden&&node.getAttribute('aria-hidden')!=='true'&&node.getClientRects().length);const active=root.activeElement||document.activeElement;if(!focusable.length){e.preventDefault();exit.focus();return}const first=focusable[0],last=focusable[focusable.length-1];if(!panel.contains(active)){e.preventDefault();(e.shiftKey?last:first).focus()}else if(e.shiftKey&&active===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&active===last){e.preventDefault();first.focus()}};
    this._closeDetails=close;document.addEventListener('keydown',onKey);backdrop.addEventListener('click',e=>{if(e.target===backdrop)close()});
    const header=make('div','velto-modal-head'),heading=make('div','velto-modal-heading'),historyDomain=String(id||'').split('.')[0],historyHeading=['number','input_number','counter'].includes(historyDomain)?'HISTORIA WARTOŚCI':'HISTORIA POMIARÓW';heading.append(make('small','',historyHeading),make('h2','',label));
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
        const data=await api?.callApi?.('GET',path);
        if(closed||token!==request)return;
        if(this._hass?.connection!==connection){body.replaceChildren(make('p','','Połączenie Home Assistant zmieniło się. Zamknij okno i spróbuj ponownie.'));return}
        const entries=(Array.isArray(data?.[0])?data[0]:[]).map(x=>({time:new Date(x.last_changed||x.last_updated).getTime(),value:Number(String(x.state).replace(',','.'))})).filter(x=>Number.isFinite(x.time)&&Number.isFinite(x.value));
        if(!entries.length){body.replaceChildren(make('p','','Brak zapisanych pomiarów w tym okresie. Sprawdź wybrany element i integrację Recorder w Home Assistant.'));return}
        let min=Infinity,max=-Infinity;for(const entry of entries){if(entry.value<min)min=entry.value;if(entry.value>max)max=entry.value}const width=600,height=190,pad=16,range=max-min||1;
        const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 600 190');svg.setAttribute('role','img');svg.setAttribute('aria-label','Wykres '+label+' z '+days+' dni');svg.classList.add('velto-history-chart');
        const startTime=start.getTime(),duration=end.getTime()-startTime;
        const stride=Math.max(1,Math.ceil(entries.length/600));const samples=[];for(let i=0;i<entries.length;i+=stride){const bucket=entries.slice(i,i+stride);let low=bucket[0],high=bucket[0];for(const item of bucket){if(item.value<low.value)low=item;if(item.value>high.value)high=item}const selected=[bucket[0],low,high,bucket[bucket.length-1]].sort((a,b)=>a.time-b.time);for(const item of selected){if(samples[samples.length-1]!==item)samples.push(item)}}const points=samples.map(x=>[(pad+(x.time-startTime)/duration*(width-pad*2)).toFixed(1),(height-pad-(x.value-min)/range*(height-pad*2)).toFixed(1)]);
        const poly=document.createElementNS('http://www.w3.org/2000/svg','polyline');poly.setAttribute('points',points.map(x=>x.join(',')).join(' '));poly.setAttribute('fill','none');poly.setAttribute('stroke','#d58b28');poly.setAttribute('stroke-width','3');poly.setAttribute('stroke-linejoin','round');poly.setAttribute('stroke-linecap','round');svg.append(poly);
        const summary=make('p','velto-history-summary','Min: '+min.toLocaleString('pl-PL')+' '+unit+' · Max: '+max.toLocaleString('pl-PL')+' '+unit+' · Próbek: '+entries.length);
        const first=entries[0],last=entries[entries.length-1];const times=make('p','velto-history-times',new Date(first.time).toLocaleString('pl-PL')+' — '+new Date(last.time).toLocaleString('pl-PL'));
        body.replaceChildren(svg,summary,times);
      }catch(error){if(closed||token!==request)return;if(this._hass?.connection!==connection){body.replaceChildren(make('p','','Połączenie Home Assistant zmieniło się. Zamknij okno i spróbuj ponownie.'));return}console.warn('VELTO sensor history unavailable',error);body.replaceChildren(make('p','','Nie udało się pobrać historii. Sprawdź dostęp do Recorder i uprawnienia użytkownika.'))}
    };
    for(const [days,title] of [[1,'24 h'],[7,'7 dni'],[30,'30 dni']]){const b=make('button','velto-history-range',title);b.type='button';b.addEventListener('click',()=>load(days));ranges.append(b);buttons.push([b,days])}
    exit.focus();load(1);
  }
  async showBinarySensorHistory(id,label){
    if(!this.hasBinarySensorHistory(id)){this.action(id,'more');return}
    const root=this.shadowRoot;if(!root)return;
    const previousFocus=root.activeElement||document.activeElement;
    this._closeDetails?.();
    const make=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n};
    const backdrop=make('div','velto-modal-backdrop'),panel=make('section','velto-modal velto-history-modal');
    panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-label','Historia zdarzeń: '+label);
    const api=this._hass,connection=api?.connection;let closed=false,request=0;
    const close=()=>{if(closed)return;closed=true;request++;backdrop.remove();document.removeEventListener('keydown',onKey);if(this._closeDetails===close)this._closeDetails=null;if(previousFocus?.isConnected)previousFocus.focus?.()};
    const onKey=e=>{if(e.key==='Escape'){e.preventDefault();close();return}if(e.key!=='Tab')return;const focusable=[...panel.querySelectorAll('button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),a[href],[tabindex]:not([tabindex="-1"])')].filter(node=>!node.hidden&&node.getAttribute('aria-hidden')!=='true'&&node.getClientRects().length);const active=root.activeElement||document.activeElement;if(!focusable.length){e.preventDefault();exit.focus();return}const first=focusable[0],last=focusable[focusable.length-1];if(!panel.contains(active)){e.preventDefault();(e.shiftKey?last:first).focus()}else if(e.shiftKey&&active===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&active===last){e.preventDefault();first.focus()}};
    this._closeDetails=close;document.addEventListener('keydown',onKey);backdrop.addEventListener('click',e=>{if(e.target===backdrop)close()});
    const header=make('div','velto-modal-head'),heading=make('div','velto-modal-heading');heading.append(make('small','','HISTORIA ZDARZEŃ'),make('h2','',label));
    const exit=make('button','velto-modal-close','×');exit.type='button';exit.setAttribute('aria-label','Zamknij');exit.addEventListener('click',close);header.append(heading,exit);panel.append(header);
    const current=this.entity(id);panel.append(make('p','velto-modal-status','Aktualnie: '+this.entityStateLabel(id,current)));
    const ranges=make('div','velto-history-ranges'),body=make('div','velto-history-body');body.setAttribute('aria-live','polite');panel.append(ranges,body);backdrop.append(panel);root.append(backdrop);
    const buttons=[];
    const load=async days=>{
      const token=++request;buttons.forEach(([n,d])=>n.setAttribute('aria-pressed',String(d===days)));body.replaceChildren(make('p','','Wczytywanie historii…'));
      try{
        const end=new Date(),start=new Date(end.getTime()-days*86400000);
        const path='history/period/'+encodeURIComponent(start.toISOString())+'?filter_entity_id='+encodeURIComponent(id)+'&end_time='+encodeURIComponent(end.toISOString())+'&minimal_response&no_attributes';
        const data=await api?.callApi?.('GET',path);
        if(closed||token!==request)return;
        if(this._hass?.connection!==connection){body.replaceChildren(make('p','','Połączenie Home Assistant zmieniło się. Zamknij okno i spróbuj ponownie.'));return}
        const entries=this.binarySensorHistoryEntries(data);
        if(!entries.length){body.replaceChildren(make('p','','Brak zapisanych zdarzeń w tym okresie. Sprawdź Recorder i uprawnienia użytkownika Home Assistant.'));return}
        const list=make('ol','velto-event-history');list.setAttribute('aria-label','Zmiany stanu: '+label);
        const now=Date.now(),visibleEntries=entries.slice(-20);
        for(let index=visibleEntries.length-1;index>=0;index--){
          const entry=visibleEntries[index],sourceIndex=entries.length-visibleEntries.length+index,next=entries[sourceIndex+1],duration=Math.max(0,(next?.time??now)-entry.time);
          const stateLabel=this.entityStateLabel(id,{state:entry.state,attributes:current?.attributes}),item=make('li','velto-event-history-item '+(entry.state==='on'?'is-on':entry.state==='off'?'is-off':'is-unknown'));
          const copy=make('div','velto-event-history-copy');copy.append(make('strong','',stateLabel),make('small','velto-event-history-duration',this.binarySensorDurationLabel(duration,!next)));
          item.append(copy);
          const time=make('time','',new Date(entry.time).toLocaleString('pl-PL',{dateStyle:'medium',timeStyle:'short'}));time.dateTime=new Date(entry.time).toISOString();item.append(time);list.append(item)
        }
        const summary=make('p','velto-history-summary',entries.length>20?'Pokazano 20 z '+entries.length+' zmian.':'Liczba zapisanych zmian: '+entries.length);
        body.replaceChildren(list,summary)
      }catch(error){if(closed||token!==request)return;if(this._hass?.connection!==connection){body.replaceChildren(make('p','','Połączenie Home Assistant zmieniło się. Zamknij okno i spróbuj ponownie.'));return}console.warn('VELTO binary sensor history unavailable',error);body.replaceChildren(make('p','','Nie udało się pobrać historii. Sprawdź dostęp do Recorder i uprawnienia użytkownika.'))}
    };
    for(const [days,title] of [[1,'24 h'],[7,'7 dni'],[30,'30 dni']]){const b=make('button','velto-history-range',title);b.type='button';b.addEventListener('click',()=>load(days));ranges.append(b);buttons.push([b,days])}
    exit.focus();load(1);
  }
  calendarTitleText(summary){return this._calendarPrivate?'••••••••':String(summary||'Wydarzenie')}
  weatherNumber(id){const raw=this.text(id);if(raw===null||raw===undefined)return null;const value=String(raw).trim();if(!value||['unknown','unavailable','none','null','nan'].includes(value.toLowerCase()))return null;const num=Number(value.replace(',','.'));return Number.isFinite(num)?num:null}
  airQualityLevel(key,value){
    if(!['pm25','pm10'].includes(key)||value===null||value===undefined||String(value).trim()==='')return 'unknown';
    const num=typeof value==='number'?value:Number(String(value).trim().replace(',','.'));
    if(!Number.isFinite(num)||num<0)return 'unknown';
    const limits=key==='pm25'?[13,35,55,75,110]:[20,50,80,110,150];
    return num<=limits[0]?'very-good':num<=limits[1]?'good':num<=limits[2]?'moderate':num<=limits[3]?'sufficient':num<=limits[4]?'bad':'very-bad';
  }
  vacuumSupports(state,feature,fallback=false){
    const raw=state?.attributes?.supported_features;
    if(raw===undefined||raw===null||String(raw).trim()==='')return Boolean(fallback);
    const features=Number(raw);
    return Number.isInteger(features)&&features>=0?Boolean(features&feature):false
  }
  humidifierSupports(state,feature,fallback=false){
    const raw=state?.attributes?.supported_features;
    if(raw===undefined||raw===null||String(raw).trim()==='')return Boolean(fallback);
    const features=Number(raw);
    return Number.isInteger(features)&&features>=0?Boolean(features&feature):false
  }
  waterHeaterSupports(state,feature,fallback=false){
    const raw=state?.attributes?.supported_features;
    if(raw===undefined||raw===null||String(raw).trim()==='')return Boolean(fallback);
    const features=Number(raw);
    return Number.isInteger(features)&&features>=0?Boolean(features&feature):false
  }
  async action(id,kind){
    if(typeof id!=='string'||!id.includes('.'))return;
    const domain=id.split('.')[0],state=this.entity(id);
    const details=(preferVelto=false)=>{if((['media_player','vacuum','light','camera','climate','cover','fan','humidifier','water_heater','switch'].includes(domain)||preferVelto&&['lock','valve','alarm_control_panel','update'].includes(domain)||['number','input_number','select','input_select','input_datetime','input_text','counter','timer','input_boolean','automation'].includes(domain)||['button','input_button'].includes(domain))&&state&&!['unknown','unavailable'].includes(state.state))this.showDetails(id);else this.dispatchEvent(new CustomEvent('hass-more-info',{detail:{entityId:id},bubbles:true,composed:true}))};
    if(kind==='more'||!state||['unknown','unavailable'].includes(state.state)||
      !['light','switch','fan','cover','scene','script','button','input_button','input_boolean','automation','media_player','vacuum','humidifier','remote'].includes(domain)){details(kind==='more');return}
    let service='toggle';
    if(domain==='scene'||domain==='script')service='turn_on';
    if(domain==='button'||domain==='input_button')service='press';
    if(domain==='media_player')service=state.state==='playing'?'media_pause':'media_play';
    if(domain==='humidifier'||domain==='remote'||domain==='automation')service='toggle';
    if(domain==='vacuum')service=state.state==='cleaning'?'return_to_base':'start';
    if(domain==='cover')service=['open','opening'].includes(state.state)?'close_cover':'open_cover';
    if(!this._hass?.callService)return;
    await this.runEntityService(domain,service,id)
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
  mediaPlayerSupports(state,feature){
    const raw=state?.attributes?.supported_features,features=Number(raw);
    return raw!==undefined&&raw!==null&&Number.isSafeInteger(features)&&features>=0&&Boolean(features&feature)
  }
  mediaPlayerSeekModel(state){
    if(!this.mediaPlayerSupports(state,2))return null;
    const attrs=state?.attributes||{},durationRaw=attrs.media_duration,positionRaw=attrs.media_position;
    if(durationRaw===null||durationRaw===undefined||String(durationRaw).trim()===''||positionRaw===null||positionRaw===undefined||String(positionRaw).trim()==='')return null;
    const durationValue=Number(durationRaw),positionValue=Number(positionRaw);
    if(!Number.isFinite(durationValue)||durationValue<1||!Number.isFinite(positionValue)||positionValue<0)return null;
    const duration=Math.floor(durationValue);
    if(duration<1||!Number.isSafeInteger(duration))return null;
    return {duration,position:Math.min(duration,Math.round(positionValue))}
  }
  formatMediaTime(value){
    const raw=Number(value),seconds=Number.isFinite(raw)?Math.floor(Math.max(0,raw)):0;
    const hours=Math.floor(seconds/3600),minutes=Math.floor(seconds%3600/60),remaining=seconds%60;
    const pad=part=>String(part).padStart(2,'0');
    return hours>0?hours+':'+pad(minutes)+':'+pad(remaining):minutes+':'+pad(remaining)
  }
  mediaPlayerOptionList(state,feature,listKey,currentKey){
    if(!this.mediaPlayerSupports(state,feature))return [];
    const attrs=state?.attributes||{},raw=attrs[listKey];if(!Array.isArray(raw))return [];
    const values=[],seen=new Set();
    for(const item of raw){
      if(typeof item!=='string')continue;
      const value=item.trim();if(!value||seen.has(value))continue;
      seen.add(value);values.push(value)
    }
    const current=typeof attrs[currentKey]==='string'?attrs[currentKey].trim():'';
    const result=values.slice(0,40);
    if(current&&seen.has(current)&&!result.includes(current))result[39]=current;
    return result
  }
  numericEntityControlModel(state){
    const attrs=state?.attributes||{},rawValue=state?.state,minRaw=attrs.min,maxRaw=attrs.max,stepRaw=attrs.step;
    if(rawValue===null||rawValue===undefined||String(rawValue).trim()===''||minRaw===null||minRaw===undefined||String(minRaw).trim()===''||maxRaw===null||maxRaw===undefined||String(maxRaw).trim()===''||stepRaw===null||stepRaw===undefined||String(stepRaw).trim()==='')return null;
    const min=Number(minRaw),max=Number(maxRaw),step=Number(stepRaw),value=Number(rawValue),span=max-min;
    if(!Number.isFinite(min)||!Number.isFinite(max)||!Number.isFinite(step)||!Number.isFinite(value)||!Number.isFinite(span)||span<=0||step<=0||step>span)return null;
    const bounded=Math.max(min,Math.min(max,value)),aligned=min+Math.round((bounded-min)/step)*step;
    return {min,max,step,value:Number(Math.max(min,Math.min(max,aligned)).toPrecision(12))}
  }
  inputDatetimeModel(state){
    const attrs=state?.attributes||{},hasDate=attrs.has_date===true,hasTime=attrs.has_time===true;
    if((!hasDate&&!hasTime)||attrs.editable===false)return null;
    const raw=typeof state?.state==='string'?state.state.trim():'';
    const dateTime=/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?$/.exec(raw);
    const timeOnly=/^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(raw);
    let date='',time='';
    if(hasDate){
      if(!dateTime)return null;
      const year=Number(dateTime[1]),month=Number(dateTime[2]),day=Number(dateTime[3]),check=new Date(Date.UTC(year,month-1,day));
      if(year<1||check.getUTCFullYear()!==year||check.getUTCMonth()!==month-1||check.getUTCDate()!==day)return null;
      date=dateTime[1]+'-'+dateTime[2]+'-'+dateTime[3]
    }
    if(hasTime){
      const match=hasDate?dateTime:timeOnly;
      if(!match||(hasDate&&!dateTime[4]))return null;
      const offset=hasDate?4:1,hour=Number(match[offset]),minute=Number(match[offset+1]),second=Number(match[offset+2]??'0');
      if(!Number.isInteger(hour)||hour<0||hour>23||!Number.isInteger(minute)||minute<0||minute>59||!Number.isInteger(second)||second<0||second>59)return null;
      time=[match[offset],match[offset+1],String(second).padStart(2,'0')].join(':')
    }
    return {hasDate,hasTime,date,time}
  }
  inputDatetimePayload(model,date,time){
    if(!model||(!model.hasDate&&!model.hasTime))return null;
    let safeDate='',safeTime='';
    if(model.hasDate){
      if(typeof date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(date))return null;
      const [year,month,day]=date.split('-').map(Number),check=new Date(Date.UTC(year,month-1,day));
      if(year<1||check.getUTCFullYear()!==year||check.getUTCMonth()!==month-1||check.getUTCDate()!==day)return null;
      safeDate=date
    }
    if(model.hasTime){
      if(typeof time!=='string')return null;
      const match=/^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/.exec(time);
      if(!match)return null;
      safeTime=match[1]+':'+match[2]+':'+(match[3]||'00')
    }
    if(model.hasDate&&model.hasTime)return {datetime:safeDate+' '+safeTime};
    if(model.hasDate)return {date:safeDate};
    return {time:safeTime}
  }
  selectEntityOptions(state){
    const raw=state?.attributes?.options;if(!Array.isArray(raw))return [];
    const values=[],seen=new Set();
    for(const item of raw){
      if(typeof item!=='string')continue;
      const value=item.trim();if(!value||seen.has(value))continue;
      seen.add(value);values.push(value)
    }
    const current=typeof state?.state==='string'?state.state.trim():'',result=values.slice(0,40);
    if(current&&seen.has(current)&&!result.includes(current))result[39]=current;
    return result
  }
  inputTextModel(state){
    const attrs=state?.attributes||{},value=state?.state;
    if(typeof value!=='string'||attrs.editable===false)return null;
    const mode=attrs.mode==null||attrs.mode===''?'text':attrs.mode;
    if(mode!=='text'&&mode!=='password')return null;
    const minRaw=attrs.min==null?0:attrs.min,maxRaw=attrs.max==null?100:attrs.max;
    const min=Number(minRaw),max=Number(maxRaw);
    if(!Number.isInteger(min)||!Number.isInteger(max)||min<0||max<min||max>255)return null;
    const patternRaw=attrs.pattern==null?'':attrs.pattern;
    if(typeof patternRaw!=='string'||patternRaw.length>128)return null;
    if(patternRaw){try{new RegExp('^(?:'+patternRaw+')$','u')}catch{return null}}
    return {value,min,max,mode,pattern:patternRaw}
  }
  inputTextValueValid(model,value){
    if(!model||typeof value!=='string')return false;
    const length=Array.from(value).length;
    if(length<model.min||length>model.max)return false;
    if(!model.pattern)return true;
    try{return new RegExp('^(?:'+model.pattern+')$','u').test(value)}catch{return false}
  }
  counterModel(state){
    const attrs=state?.attributes||{};
    const integer=raw=>{
      if(typeof raw==='number')return Number.isSafeInteger(raw)?raw:null;
      if(typeof raw!=='string'||!/^[-+]?\d+$/.test(raw.trim()))return null;
      const value=Number(raw);return Number.isSafeInteger(value)?value:null
    };
    const value=integer(state?.state);
    if(value===null||attrs.editable!==true)return null;
    const step=attrs.step==null?1:integer(attrs.step);
    const minimum=attrs.minimum==null?null:integer(attrs.minimum);
    const maximum=attrs.maximum==null?null:integer(attrs.maximum);
    if(step===null||step<=0)return null;
    if((attrs.minimum!=null&&minimum===null)||(attrs.maximum!=null&&maximum===null))return null;
    if(minimum!==null&&maximum!==null&&minimum>maximum)return null;
    const rawInitial=attrs.initial==null?0:integer(attrs.initial);
    const initial=rawInitial!==null&&(minimum===null||rawInitial>=minimum)&&(maximum===null||rawInitial<=maximum)?rawInitial:null;
    return {value,step,minimum,maximum,initial}
  }
  timerDurationSeconds(raw){
    if(typeof raw==='number')return Number.isSafeInteger(raw)&&raw>=0?raw:null;
    if(typeof raw!=='string')return null;
    const value=raw.trim();if(!value)return null;
    if(/^\d+$/.test(value)){const seconds=Number(value);return Number.isSafeInteger(seconds)&&seconds>=0?seconds:null}
    const match=/^(\d{1,6}):([0-5]\d):([0-5]\d)(?:\.(\d+))?$/.exec(value);
    if(!match)return null;
    const seconds=Number(match[1])*3600+Number(match[2])*60+Number(match[3])+(match[4]?Number('0.'+match[4]):0);
    const rounded=Math.ceil(seconds);
    return Number.isSafeInteger(rounded)&&rounded>=0?rounded:null
  }
  timerModel(state,now=Date.now()){
    const status=state?.state;if(!['idle','active','paused'].includes(status))return null;
    const attrs=state?.attributes||{},duration=this.timerDurationSeconds(attrs.duration),reported=this.timerDurationSeconds(attrs.remaining);
    const finishesRaw=typeof attrs.finishes_at==='string'?attrs.finishes_at.trim():'';
    const hasOffset=/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(finishesRaw);
    const finishAt=hasOffset?Date.parse(finishesRaw):NaN,live=status==='active'&&Number.isFinite(finishAt);
    const currentTime=Number.isFinite(now)?now:Date.now();
    const remaining=status==='active'?(live?Math.max(0,Math.ceil((finishAt-currentTime)/1000)):reported):status==='paused'?reported:duration;
    return {state:status,duration,remaining,live}
  }
  buttonLastPressedTimestamp(state){
    const raw=typeof state?.state==='string'?state.state.trim():'';
    const match=/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?(Z|([+-])(\d{2}):?(\d{2}))?$/.exec(raw);
    if(!match)return null;
    const year=Number(match[1]),month=Number(match[2]),day=Number(match[3]);
    const hour=Number(match[4]),minute=Number(match[5]),second=Number(match[6]);
    const calendarDate=new Date(0);calendarDate.setUTCFullYear(year,month-1,day);calendarDate.setUTCHours(0,0,0,0);
    if(year<1||calendarDate.getUTCFullYear()!==year||calendarDate.getUTCMonth()!==month-1||calendarDate.getUTCDate()!==day||hour>23||minute>59||second>59)return null;
    const zone=match[8]||'';
    if(zone&&zone!=='Z'&&(Number(match[10])>23||Number(match[11])>59))return null;
    const fraction=match[7]?'.'+match[7].slice(0,3).padEnd(3,'0'):'';
    const offset=zone==='Z'?'Z':zone?match[9]+String(Number(match[10])).padStart(2,'0')+':'+String(Number(match[11])).padStart(2,'0'):'';
    const normalized=match[1]+'-'+match[2]+'-'+match[3]+'T'+match[4]+':'+match[5]+':'+match[6]+fraction+offset;
    const timestamp=Date.parse(normalized);
    return Number.isFinite(timestamp)?timestamp:null
  }
  lightBrightnessPercent(state){
    const raw=Number(state?.attributes?.brightness);
    return Number.isFinite(raw)?Math.max(1,Math.min(100,Math.round(raw/255*100))):50
  }
  showDetails(id){
    const state=this.entity(id),domain=id.split('.')[0],root=this.shadowRoot;
    if(!state||!root)return;
    const previousFocus=root.activeElement||document.activeElement;
    this._closeDetails?.();
    const make=(tag,cls,content)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(content!==undefined)n.textContent=String(content);return n};
    const backdrop=make('div','velto-modal-backdrop'),panel=make('section','velto-modal');if(domain==='light')panel.classList.add('velto-light-modal');
    panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-labelledby','velto-detail-title');panel.setAttribute('aria-describedby','velto-detail-status');
    let closed=false,timerInterval=null,timerVisibility=null,automationConfirmTimeout=null;
    const close=()=>{if(closed)return;closed=true;backdrop.remove();document.removeEventListener('keydown',escape);if(timerInterval!==null){clearInterval(timerInterval);timerInterval=null}if(timerVisibility){document.removeEventListener('visibilitychange',timerVisibility);timerVisibility=null}if(automationConfirmTimeout!==null){clearTimeout(automationConfirmTimeout);automationConfirmTimeout=null}if(this._closeDetails===close)this._closeDetails=null;if(previousFocus?.isConnected)previousFocus.focus?.()};this._closeDetails=close;
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
    const dialogTitle=make('h2','',this.name(id));dialogTitle.id='velto-detail-title';heading.append(make('small','',domain.replace('_',' ').toUpperCase()),dialogTitle);x.type='button';x.setAttribute('aria-label','Zamknij');x.addEventListener('click',close);header.append(heading,x);panel.append(header);
    const status=make('p','velto-modal-status',domain==='input_text'?(state.attributes?.mode==='password'?'Wartość chroniona':'Wartość tekstowa'):this.entityStateLabel(id,state));status.id='velto-detail-status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');panel.append(status);
    const attrs=state.attributes||{};
    const controls=make('div','velto-modal-controls');
    const registerDetailControl=(element,enabled=true)=>{
      const lock=this.serviceActionLock(domain,id).lock;
      element._veltoEnabled=Boolean(enabled);element.disabled=!element._veltoEnabled||lock.pending;
      if(lock.pending)element.setAttribute('aria-busy','true');
      lock.controls.add(element);return lock
    };
    const control=(label,service,enabled=true,serviceData=null,closeOnSuccess=true,pressed=null,toggleLabels=null)=>{
      const b=make('button','velto-modal-control',label);b.type='button';if(pressed!==null)b.setAttribute('aria-pressed',String(pressed));const lock=registerDetailControl(b,enabled);
      b.addEventListener('click',async()=>{
        if(b.disabled||!b.isConnected||lock.pending)return;
        status.textContent='Wysyłanie polecenia…';
        const payload=typeof serviceData==='function'?serviceData(b):serviceData||{};
        const ok=await this.runEntityService(domain,service,id,payload);
        if(ok){status.textContent='Polecenie wysłane';if(toggleLabels){const next=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',String(next));b.textContent=toggleLabels[next?'on':'off']}if(closeOnSuccess)close()}
        else status.textContent='Nie udało się wykonać polecenia'
      });
      controls.append(b)
    };
    if(domain==='switch'||domain==='input_boolean'){
      const helper=domain==='input_boolean',validState=state.state==='on'||state.state==='off',isOn=state.state==='on';
      const hero=make('div','velto-counter-hero'),value=make('strong','velto-counter-value',isOn?'Włączony':'Wyłączony');
      hero.append(value,make('small','velto-counter-meta',helper?'Przełącznik pomocniczy':'Przełącznik urządzenia'));
      hero.setAttribute('role','status');hero.setAttribute('aria-live','polite');panel.append(hero);
      if(validState){
        const toggle=make('button','velto-modal-control',isOn?(helper?'Wyłącz przełącznik':'Wyłącz urządzenie'):(helper?'Włącz przełącznik':'Włącz urządzenie'));
        toggle.type='button';toggle.setAttribute('aria-pressed',String(isOn));
        const lock=registerDetailControl(toggle,true);
        toggle.addEventListener('click',async()=>{
          if(toggle.disabled||!toggle.isConnected||lock.pending)return;
          const turningOn=toggle.getAttribute('aria-pressed')!=='true';
          status.textContent='Wysyłanie polecenia…';
          const ok=await this.runEntityService(domain,turningOn?'turn_on':'turn_off',id);
          if(ok){
            toggle.setAttribute('aria-pressed',String(turningOn));
            toggle.textContent=turningOn?(helper?'Wyłącz przełącznik':'Wyłącz urządzenie'):(helper?'Włącz przełącznik':'Włącz urządzenie');
            value.textContent=turningOn?'Włączony':'Wyłączony';
            status.textContent=helper?(turningOn?'Przełącznik włączony':'Przełącznik wyłączony'):(turningOn?'Urządzenie włączone':'Urządzenie wyłączone')
          }else status.textContent=helper?'Nie udało się zmienić stanu przełącznika':'Nie udało się zmienić stanu urządzenia'
        });
        controls.append(toggle)
      }else panel.append(make('p','velto-modal-meta','Stan przełącznika nie jest dostępny — odśwież dane Home Assistant.'))
    }else if(domain==='alarm_control_panel'){
      const hero=make('div','velto-counter-hero'),value=make('strong','velto-counter-value',this.entityStateLabel(id,state));
      hero.append(value,make('small','velto-counter-meta','Panel alarmowy Home Assistant'));
      hero.setAttribute('role','status');hero.setAttribute('aria-live','polite');panel.append(hero);
      if(attrs.code_arm_required===true)panel.append(make('p','velto-modal-meta','Uzbrajanie wymaga kodu.'));
      else if(attrs.code_arm_required===false)panel.append(make('p','velto-modal-meta','Uzbrajanie nie wymaga kodu.'));
      else panel.append(make('p','velto-modal-meta','Wymagania dotyczące kodu określa integracja Home Assistant.'));
      const codeFormat=typeof attrs.code_format==='string'?attrs.code_format.trim().toLowerCase():'';
      if(codeFormat==='number')panel.append(make('p','velto-modal-meta','Format kodu · numeryczny'));
      else if(codeFormat==='text')panel.append(make('p','velto-modal-meta','Format kodu · tekstowy'));
      panel.append(make('p','velto-modal-warning','Ze względów bezpieczeństwa VELTO nie uzbraja ani nie rozbraja alarmu i nie przechowuje kodów. Wymagane kody i dodatkowe potwierdzenia obsługuje Home Assistant.'));
      const native=make('button','velto-modal-control','Otwórz sterowanie Home Assistant');
      native.type='button';native.setAttribute('aria-label','Otwórz natywne sterowanie alarmem w Home Assistant');
      native.addEventListener('click',()=>{close();this.dispatchEvent(new CustomEvent('hass-more-info',{detail:{entityId:id},bubbles:true,composed:true}))});
      controls.append(native)
    }else if(domain==='update'){
      const progressActive=attrs.in_progress===true;
      const hero=make('div','velto-counter-hero');
      const value=make('strong','velto-counter-value',progressActive?'Trwa aktualizacja':state.state==='on'?'Aktualizacja dostępna':'Aktualne');
      const updateKind=attrs.device_class==='firmware'?'Aktualizacja oprogramowania sprzętowego':'Aktualizacja oprogramowania';
      hero.append(value,make('small','velto-counter-meta',updateKind));
      hero.setAttribute('role','status');hero.setAttribute('aria-live','polite');panel.append(hero);
      const title=typeof attrs.title==='string'?attrs.title.trim().slice(0,120):'';
      if(title)panel.append(make('p','velto-modal-meta','Komponent · '+title));
      const installed=typeof attrs.installed_version==='string'?attrs.installed_version.trim().slice(0,120):'';
      const latest=typeof attrs.latest_version==='string'?attrs.latest_version.trim().slice(0,120):'';
      if(installed)panel.append(make('p','velto-modal-meta','Zainstalowana wersja · '+installed));
      if(latest)panel.append(make('p','velto-modal-meta','Dostępna wersja · '+latest));
      if(typeof attrs.skipped_version==='string'&&attrs.skipped_version.trim())panel.append(make('p','velto-modal-meta','Pominięta wersja · '+attrs.skipped_version.trim().slice(0,120)));
      if(progressActive){
        panel.append(make('p','velto-modal-meta','Trwa instalacja aktualizacji.'));
        const rawProgress=attrs.update_percentage;
        const percentage=rawProgress!==null&&rawProgress!==undefined&&String(rawProgress).trim()!==''?Number(rawProgress):NaN;
        if(Number.isFinite(percentage)&&percentage>=0&&percentage<=100){
          const progress=make('progress','velto-update-progress');
          progress.max=100;progress.value=percentage;progress.style.width='100%';progress.style.accentColor='#e99524';
          progress.setAttribute('aria-label','Postęp instalacji aktualizacji');
          progress.setAttribute('aria-valuetext',Math.round(percentage)+'%');
          panel.append(progress,make('p','velto-modal-meta','Postęp aktualizacji · '+Math.round(percentage)+'%'));
        }
      }
      if(attrs.restart_required===true)panel.append(make('p','velto-modal-meta','Po instalacji Home Assistant będzie wymagał restartu.'));
      if(attrs.auto_update===true)panel.append(make('p','velto-modal-meta','To urządzenie lub usługa aktualizuje się automatycznie.'));
      const summary=typeof attrs.release_summary==='string'?attrs.release_summary.trim():'';
      if(summary)panel.append(make('p','velto-modal-meta',summary.slice(0,255)+(summary.length>255?'…':'')));
      panel.append(make('p','velto-modal-warning','Instalacja i pomijanie aktualizacji pozostają w Home Assistant. VELTO nie uruchamia tych operacji.'));
      const native=make('button','velto-modal-control','Otwórz szczegóły w Home Assistant');
      native.type='button';native.setAttribute('aria-label','Otwórz natywne szczegóły aktualizacji w Home Assistant');
      native.addEventListener('click',()=>{close();this.dispatchEvent(new CustomEvent('hass-more-info',{detail:{entityId:id},bubbles:true,composed:true}))});
      controls.append(native)
    }else if(domain==='automation'){
      const validState=state.state==='on'||state.state==='off',enabled=state.state==='on';
      const hero=make('div','velto-counter-hero'),value=make('strong','velto-counter-value',enabled?'Włączona':'Wyłączona');
      hero.append(value,make('small','velto-counter-meta','Automatyzacja Home Assistant'));
      hero.setAttribute('role','status');hero.setAttribute('aria-live','polite');panel.append(hero);
      const currentRaw=attrs.current,current=currentRaw!==null&&currentRaw!==undefined&&String(currentRaw).trim()!==''?Number(currentRaw):NaN;
      if(Number.isSafeInteger(current)&&current>=0)panel.append(make('p','velto-modal-meta','Uruchomienia teraz · '+current));
      const modeLabels={single:'Pojedynczy',restart:'Restart',queued:'Kolejkowanie',parallel:'Równoległy'};
      if(typeof attrs.mode==='string'&&modeLabels[attrs.mode])panel.append(make('p','velto-modal-meta','Tryb · '+modeLabels[attrs.mode]));
      const lastTriggered=this.buttonLastPressedTimestamp({state:attrs.last_triggered});
      if(lastTriggered!==null){
        const date=new Date(lastTriggered),formatted=new Intl.DateTimeFormat('pl-PL',{year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}).format(date);
        const time=make('time','velto-button-last-time',formatted);time.dateTime=date.toISOString();
        const last=make('p','velto-modal-meta','Ostatnie uruchomienie · ');last.append(time);panel.append(last)
      }else panel.append(make('p','velto-modal-meta',attrs.last_triggered==null?'Jeszcze nie uruchomiono':'Brak poprawnej informacji o ostatnim uruchomieniu.'));
      if(validState){
        const toggle=make('button','velto-modal-control',enabled?'Wyłącz automatyzację':'Włącz automatyzację');
        toggle.type='button';toggle.setAttribute('aria-pressed',String(enabled));
        const lock=registerDetailControl(toggle,true);
        const trigger=make('button','velto-modal-control','Uruchom z warunkami');
        trigger.type='button';const triggerLock=registerDetailControl(trigger,enabled);
        let triggerArmed=false;
        const resetTriggerConfirmation=()=>{
          triggerArmed=false;
          if(automationConfirmTimeout!==null){clearTimeout(automationConfirmTimeout);automationConfirmTimeout=null}
          if(trigger.isConnected)trigger.textContent='Uruchom z warunkami'
        };
        toggle.addEventListener('click',async()=>{
          if(toggle.disabled||!toggle.isConnected||lock.pending)return;
          const turningOn=toggle.getAttribute('aria-pressed')!=='true';
          status.textContent='Zmiana stanu automatyzacji…';
          const ok=await this.runEntityService('automation',turningOn?'turn_on':'turn_off',id);
          if(ok){
            toggle.setAttribute('aria-pressed',String(turningOn));
            toggle.textContent=turningOn?'Wyłącz automatyzację':'Włącz automatyzację';
            value.textContent=turningOn?'Włączona':'Wyłączona';
            trigger._veltoEnabled=turningOn;trigger.disabled=!turningOn||lock.pending;
            if(!turningOn)resetTriggerConfirmation();
            status.textContent=turningOn?'Automatyzacja włączona':'Automatyzacja wyłączona'
          }else status.textContent='Nie udało się zmienić stanu automatyzacji'
        });
        trigger.addEventListener('click',async()=>{
          if(trigger.disabled||!trigger.isConnected||triggerLock.pending)return;
          if(!triggerArmed){
            triggerArmed=true;trigger.textContent='Potwierdź uruchomienie';
            status.textContent='Kliknij ponownie w ciągu 3,5 s. Warunki automatyzacji zostaną sprawdzone.';
            if(automationConfirmTimeout!==null)clearTimeout(automationConfirmTimeout);
            automationConfirmTimeout=setTimeout(resetTriggerConfirmation,3500);
            return
          }
          resetTriggerConfirmation();
          status.textContent='Uruchamianie automatyzacji…';
          const ok=await this.runEntityService('automation','trigger',id,{skip_condition:false});
          status.textContent=ok?'Wysłano uruchomienie — Home Assistant sprawdzi warunki':'Nie udało się uruchomić automatyzacji'
        });
        controls.append(toggle,trigger)
      }else panel.append(make('p','velto-modal-meta','Stan automatyzacji nie jest dostępny — odśwież dane Home Assistant.'));
      panel.append(make('p','velto-modal-meta',enabled?'Ręczne uruchomienie sprawdza warunki, ale nie przekazuje danych wyzwalacza (np. trigger.id).':'Włącz automatyzację, aby udostępnić ręczne uruchomienie.'))
    }else if(domain==='button'||domain==='input_button'){
      const timestamp=this.buttonLastPressedTimestamp(state),hero=make('div','velto-button-hero');
      hero.append(make('strong','','Ostatnie naciśnięcie'));
      if(timestamp!==null){
        const date=new Date(timestamp),formatted=new Intl.DateTimeFormat('pl-PL',{year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}).format(date);
        const time=make('time','velto-button-last-time',formatted);time.dateTime=date.toISOString();hero.append(time)
      }else hero.append(make('small','velto-button-last-time','Brak poprawnej informacji o ostatnim naciśnięciu.'));
      panel.append(hero);
      control('Naciśnij przycisk','press',true,null,false);
      panel.append(make('p','velto-modal-meta','Naciśnięcie uruchamia działanie skonfigurowane w Home Assistant. Używaj tylko wtedy, gdy znasz jego skutek.'));
    }else if(domain==='camera'){
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
      const duration=Number(attrs.media_duration),position=Number(attrs.media_position),seekModel=this.mediaPlayerSeekModel(state);
      if(seekModel){
        const field=make('label','velto-modal-field','Pozycja odtwarzania');
        const slider=make('input','velto-modal-slider'),time=make('small','velto-modal-meta velto-modal-seek-time','');
        const describe=value=>this.formatMediaTime(value)+' / '+this.formatMediaTime(seekModel.duration);
        slider.type='range';slider.min='0';slider.max=String(seekModel.duration);slider.step='1';slider.value=String(seekModel.position);
        slider.setAttribute('aria-label','Pozycja odtwarzania');slider.setAttribute('aria-valuetext',describe(seekModel.position));
        time.textContent=describe(seekModel.position);
        slider.addEventListener('input',()=>{
          const value=Number(slider.value);if(!Number.isFinite(value))return;
          time.textContent=describe(value);slider.setAttribute('aria-valuetext',describe(value))
        });
        const seekLock=registerDetailControl(slider,true);
        slider.addEventListener('change',async()=>{
          if(slider.disabled||seekLock.pending)return;
          const value=Number(slider.value);if(!Number.isFinite(value))return;
          const seekPosition=Math.max(0,Math.min(seekModel.duration,Math.round(value)));
          status.textContent='Przewijanie materiału…';
          const ok=await this.runEntityService('media_player','media_seek',id,{seek_position:seekPosition});
          status.textContent=ok?'Pozycja odtwarzania ustawiona · '+this.formatMediaTime(seekPosition):'Nie udało się przewinąć materiału'
        });
        field.append(slider,time);panel.append(field)
      }else if(Number.isFinite(duration)&&duration>0&&Number.isFinite(position)&&position>=0){
        const track=make('div','velto-modal-track'),fill=make('span','velto-modal-track-fill');
        fill.style.width=Math.max(0,Math.min(100,position/duration*100))+'%';track.append(fill);panel.append(track)
      }
      control('Poprzedni','media_previous_track',this.mediaPlayerSupports(state,16));
      control(state.state==='playing'?'Pauza':'Odtwarzaj',state.state==='playing'?'media_pause':'media_play',this.mediaPlayerSupports(state,state.state==='playing'?1:16384));
      if(this.mediaPlayerSupports(state,4096))control('Zatrzymaj','media_stop');
      control('Następny','media_next_track',this.mediaPlayerSupports(state,32));
      const sourceOptions=this.mediaPlayerOptionList(state,2048,'source_list','source');
      if(sourceOptions.length){
        const currentSource=typeof attrs.source==='string'?attrs.source.trim():'';
        const field=make('label','velto-modal-field','Źródło odtwarzania'),select=make('select','velto-modal-select');
        select.setAttribute('aria-label','Źródło odtwarzania');
        const placeholder=make('option','',sourceOptions.includes(currentSource)?'Wybierz inne źródło':'Wybierz źródło');
        placeholder.value='';placeholder.disabled=true;placeholder.selected=!sourceOptions.includes(currentSource);select.append(placeholder);
        for(const source of sourceOptions){const option=make('option','',source);option.value=source;option.selected=source===currentSource;select.append(option)}
        select.value=sourceOptions.includes(currentSource)?currentSource:'';
        registerDetailControl(select,true);
        select.addEventListener('change',async()=>{
          const source=select.value;if(!sourceOptions.includes(source))return;
          status.textContent='Zmiana źródła…';
          const ok=await this.runEntityService('media_player','select_source',id,{source});
          status.textContent=ok?'Źródło ustawione · '+source:'Nie udało się zmienić źródła'
        });
        field.append(select);panel.append(field)
      }
      const soundModes=this.mediaPlayerOptionList(state,65536,'sound_mode_list','sound_mode');
      if(soundModes.length){
        const currentMode=typeof attrs.sound_mode==='string'?attrs.sound_mode.trim():'';
        const field=make('label','velto-modal-field','Tryb dźwięku'),select=make('select','velto-modal-select');
        select.setAttribute('aria-label','Tryb dźwięku');
        const placeholder=make('option','',soundModes.includes(currentMode)?'Wybierz inny tryb':'Wybierz tryb');
        placeholder.value='';placeholder.disabled=true;placeholder.selected=!soundModes.includes(currentMode);select.append(placeholder);
        for(const mode of soundModes){const option=make('option','',mode);option.value=mode;option.selected=mode===currentMode;select.append(option)}
        select.value=soundModes.includes(currentMode)?currentMode:'';
        registerDetailControl(select,true);
        select.addEventListener('change',async()=>{
          const soundMode=select.value;if(!soundModes.includes(soundMode))return;
          status.textContent='Zmiana trybu dźwięku…';
          const ok=await this.runEntityService('media_player','select_sound_mode',id,{sound_mode:soundMode});
          status.textContent=ok?'Tryb dźwięku ustawiony · '+soundMode:'Nie udało się zmienić trybu dźwięku'
        });
        field.append(select);panel.append(field)
      }
      if(this.mediaPlayerSupports(state,32768)&&typeof attrs.shuffle==='boolean'){
        control(attrs.shuffle?'Wyłącz losowanie':'Włącz losowanie','shuffle_set',true,button=>({shuffle:button.getAttribute('aria-pressed')!=='true'}),false,attrs.shuffle,{on:'Wyłącz losowanie',off:'Włącz losowanie'})
      }
      if(this.mediaPlayerSupports(state,262144)&&['off','one','all'].includes(attrs.repeat)){
        const repeatModes=[['off','Wyłączone'],['one','Jeden utwór'],['all','Cała kolejka']];
        const field=make('label','velto-modal-field','Powtarzanie'),select=make('select','velto-modal-select');
        select.setAttribute('aria-label','Tryb powtarzania');
        for(const [value,label] of repeatModes){const option=make('option','',label);option.value=value;option.selected=value===attrs.repeat;select.append(option)}
        select.value=attrs.repeat;registerDetailControl(select,true);
        select.addEventListener('change',async()=>{
          const repeat=select.value;if(!repeatModes.some(([value])=>value===repeat))return;
          status.textContent='Zmiana trybu powtarzania…';
          const ok=await this.runEntityService('media_player','repeat_set',id,{repeat});
          status.textContent=ok?'Tryb powtarzania ustawiony':'Nie udało się zmienić trybu powtarzania'
        });
        field.append(select);panel.append(field)
      }
      if(this.mediaPlayerSupports(state,8)&&typeof attrs.is_volume_muted==='boolean'){
        control(attrs.is_volume_muted?'Wyłącz wyciszenie':'Wycisz','volume_mute',true,button=>({is_volume_muted:button.getAttribute('aria-pressed')!=='true'}),false,attrs.is_volume_muted,{on:'Wyłącz wyciszenie',off:'Wycisz'})
      }
      if(attrs.volume_level!==undefined&&attrs.volume_level!==null&&Number.isFinite(Number(attrs.volume_level))&&this.mediaPlayerSupports(state,4)){
        const volume=make('label','velto-modal-meta','Głośność · '+Math.round(Math.max(0,Math.min(1,Number(attrs.volume_level)))*100)+'%');
        const slider=make('input','velto-modal-slider');slider.type='range';slider.min='0';slider.max='100';
        slider.value=String(Math.round(Math.max(0,Math.min(1,Number(attrs.volume_level)))*100));slider.setAttribute('aria-label','Głośność');
        slider.addEventListener('input',()=>{volume.firstChild&&(volume.firstChild.textContent='Głośność · '+slider.value+'%')});
        registerDetailControl(slider,true);
        slider.addEventListener('change',async()=>{
          const value=Math.max(0,Math.min(100,Number(slider.value)))/100;if(!Number.isFinite(value))return;
          status.textContent='Zmiana głośności…';
          const ok=await this.runEntityService('media_player','volume_set',id,{volume_level:value});
          status.textContent=ok?'Głośność ustawiona · '+Math.round(value*100)+'%':'Nie udało się zmienić głośności'
        });
        volume.append(slider);panel.append(volume)
      }
    }else if(domain==='vacuum'){
      const activityLabels={cleaning:'Sprząta',docked:'W stacji dokującej',idle:'Gotowy',paused:'Wstrzymany',returning:'Wraca do stacji',error:'Wymaga uwagi'};
      panel.append(make('p','velto-modal-meta','Aktywność · '+(activityLabels[state.state]||state.state)));
      const batteryRaw=attrs.battery_level,battery=Number(batteryRaw);
      if(batteryRaw!==undefined&&batteryRaw!==null&&String(batteryRaw).trim()!==''&&Number.isFinite(battery))panel.append(make('p','velto-modal-meta','Bateria · '+Math.round(Math.max(0,Math.min(100,battery)))+'%'));
      if(typeof attrs.status==='string'&&attrs.status.trim()&&attrs.status!==state.state)panel.append(make('p','velto-modal-meta','Status · '+attrs.status.trim().slice(0,80)));
      const cleaning=state.state==='cleaning',paused=state.state==='paused',returning=state.state==='returning',docked=state.state==='docked';
      const startable=['idle','docked','paused'].includes(state.state),stoppable=cleaning||paused||returning,returnable=cleaning||paused||state.state==='idle'||state.state==='error';
      if(startable&&this.vacuumSupports(state,VELTO_VACUUM_FEATURES.START,true))control('Uruchom / wznów','start');
      if(cleaning&&this.vacuumSupports(state,VELTO_VACUUM_FEATURES.PAUSE,true))control('Wstrzymaj','pause');
      if(stoppable&&this.vacuumSupports(state,VELTO_VACUUM_FEATURES.STOP,false))control('Zatrzymaj','stop');
      if(returnable&&!docked&&!returning&&this.vacuumSupports(state,VELTO_VACUUM_FEATURES.RETURN_HOME,true))control('Do stacji','return_to_base');
      if(!cleaning&&!returning&&state.state!=='error'&&this.vacuumSupports(state,VELTO_VACUUM_FEATURES.CLEAN_SPOT,false))control('Sprzątanie punktowe','clean_spot');
      if(this.vacuumSupports(state,VELTO_VACUUM_FEATURES.LOCATE,false))control('Znajdź odkurzacz','locate',true,null,false);
      const speedList=Array.isArray(attrs.fan_speed_list)?[...new Set(attrs.fan_speed_list.filter(value=>typeof value==='string'&&value.trim()).slice(0,12))]:[];
      const currentSpeed=typeof attrs.fan_speed==='string'?attrs.fan_speed:'';
      if(speedList.length&&this.vacuumSupports(state,VELTO_VACUUM_FEATURES.FAN_SPEED,true)){
        const wrapper=make('label','velto-modal-field'),caption=make('span','','Moc ssania'),select=make('select','velto-modal-select');
        select.setAttribute('aria-label','Moc ssania');
        if(currentSpeed&&!speedList.includes(currentSpeed))speedList.unshift(currentSpeed);
        for(const speed of speedList){const option=make('option','',speed);option.value=speed;option.selected=speed===currentSpeed;select.append(option)}
        if(!currentSpeed&&speedList.length)select.value=speedList[0];
        const lock=registerDetailControl(select,true);
        select.addEventListener('change',async()=>{
          if(select.disabled||lock.pending||!speedList.includes(select.value))return;
          const value=select.value;status.textContent='Zmiana mocy ssania…';
          const ok=await this.runEntityService('vacuum','set_fan_speed',id,{fan_speed:value});
          status.textContent=ok?'Moc ssania ustawiona · '+value:'Nie udało się zmienić mocy ssania'
        });
        wrapper.append(caption,select);panel.append(wrapper)
      }
    }else if(domain==='water_heater'){
      const numeric=value=>value!==undefined&&value!==null&&String(value).trim()!==''&&Number.isFinite(Number(value));
      const supports=(bit,fallback)=>this.waterHeaterSupports(state,bit,fallback);
      const currentRaw=[attrs.current_temperature,attrs.native_current_temperature].find(numeric);
      const targetRaw=[attrs.temperature,attrs.target_temperature,attrs.native_target_temperature].find(numeric);
      const unit=typeof attrs.temperature_unit==='string'&&attrs.temperature_unit.trim()?attrs.temperature_unit.trim():typeof attrs.native_temperature_unit==='string'&&attrs.native_temperature_unit.trim()?attrs.native_temperature_unit.trim():'';
      const formatTemperature=value=>Number(value).toLocaleString('pl-PL',{maximumFractionDigits:1})+(unit?' '+unit:'');
      const temperatureToCelsius=value=>{
        const normalizedUnit=unit.replace(/\s/g,'').toUpperCase();
        if(normalizedUnit==='°C'||normalizedUnit==='C')return Number(value);
        if(normalizedUnit==='°F'||normalizedUnit==='F')return (Number(value)-32)*5/9;
        if(normalizedUnit==='K')return Number(value)-273.15;
        return null
      };
      const belowSafetyTemperature=value=>{const celsius=temperatureToCelsius(value);return celsius!==null&&celsius<60};
      if(currentRaw!==undefined)panel.append(make('p','velto-modal-meta','Aktualna temperatura wody · '+formatTemperature(currentRaw)));
      if(targetRaw!==undefined)panel.append(make('p','velto-modal-meta','Temperatura docelowa · '+formatTemperature(targetRaw)));
      const safetyNote=make('p','velto-modal-warning','Uwaga: Home Assistant zaleca utrzymywanie temperatury wody na poziomie co najmniej 60°C ze względu na ryzyko Legionella. Uwzględnij zalecenia producenta.');
      safetyNote.hidden=targetRaw===undefined||!belowSafetyTemperature(targetRaw);
      if(targetRaw!==undefined)panel.append(safetyNote);
      if(targetRaw!==undefined&&supports(VELTO_WATER_HEATER_FEATURES.TARGET_TEMPERATURE,true)){
        const min=numeric(attrs.min_temp)?Number(attrs.min_temp):null,max=numeric(attrs.max_temp)?Number(attrs.max_temp):null;
        if(min!==null&&max!==null&&max>min){
          const target=Number(targetRaw),initial=Math.max(min,Math.min(max,target)),rawStep=Number(attrs.target_temp_step),step=Number.isFinite(rawStep)&&rawStep>0?rawStep:0.5;
          const label=make('label','velto-modal-field'),caption=make('span','','Temperatura docelowa · '+formatTemperature(initial)),slider=make('input','velto-modal-slider');
          slider.type='range';slider.min=String(min);slider.max=String(max);slider.step=String(step);slider.value=String(initial);slider.setAttribute('aria-label','Temperatura wody docelowa');
          const lock=registerDetailControl(slider,true);
          slider.addEventListener('input',()=>{caption.textContent='Temperatura docelowa · '+formatTemperature(slider.value);safetyNote.hidden=!belowSafetyTemperature(slider.value)});
          slider.addEventListener('change',async()=>{
            if(slider.disabled||lock.pending)return;
            const value=Number(slider.value);if(!Number.isFinite(value)||value<min||value>max)return;
            status.textContent='Ustawianie temperatury wody…';
            const ok=await this.runEntityService('water_heater','set_temperature',id,{temperature:value});
            status.textContent=ok?'Temperatura wody ustawiona · '+formatTemperature(value):'Nie udało się ustawić temperatury wody'
          });
          label.append(caption,slider);panel.append(label)
        }
      }
      const modes=Array.isArray(attrs.operation_list)?[...new Set(attrs.operation_list.filter(value=>typeof value==='string'&&value.trim()).map(value=>value.trim()))].slice(0,12):[];
      const currentMode=typeof attrs.operation_mode==='string'&&attrs.operation_mode.trim()?attrs.operation_mode.trim():String(state.state||'');
      if(modes.length&&supports(VELTO_WATER_HEATER_FEATURES.OPERATION_MODE,true)){
        const wrapper=make('label','velto-modal-field'),caption=make('span','','Tryb pracy'),select=make('select','velto-modal-select');
        select.setAttribute('aria-label','Tryb podgrzewacza');
        const placeholder=make('option','','Wybierz tryb');placeholder.value='';placeholder.disabled=true;placeholder.selected=!modes.includes(currentMode);select.append(placeholder);
        for(const mode of modes){const option=make('option','',mode);option.value=mode;option.selected=mode===currentMode;select.append(option)}
        select.value=modes.includes(currentMode)?currentMode:'';
        const lock=registerDetailControl(select,true);
        select.addEventListener('change',async()=>{
          if(select.disabled||lock.pending||!modes.includes(select.value))return;
          const value=select.value;status.textContent='Zmiana trybu podgrzewacza…';
          const ok=await this.runEntityService('water_heater','set_operation_mode',id,{operation_mode:value});
          status.textContent=ok?'Ustawiono tryb · '+value:'Nie udało się zmienić trybu podgrzewacza'
        });
        wrapper.append(caption,select);panel.append(wrapper)
      }
      const awayRaw=attrs.away_mode??attrs.is_away_mode_on,hasAwayState=awayRaw!==undefined&&awayRaw!==null&&String(awayRaw).trim()!=='';
      const awayOn=awayRaw===true||['on','true','1'].includes(String(awayRaw).trim().toLowerCase());
      if(supports(VELTO_WATER_HEATER_FEATURES.AWAY_MODE,hasAwayState)){
        control(awayOn?'Wyłącz tryb nieobecności':'Włącz tryb nieobecności','set_away_mode',true,{away_mode:!awayOn},false)
      }
      const onOffFallback=state.state==='on'||state.state==='off';
      const featureMaskPresent=attrs.supported_features!==undefined&&attrs.supported_features!==null&&String(attrs.supported_features).trim()!=='';
      const canInferPowerState=supports(VELTO_WATER_HEATER_FEATURES.OPERATION_MODE,modes.length>0)||(!featureMaskPresent&&onOffFallback);
      if(supports(VELTO_WATER_HEATER_FEATURES.ON_OFF,onOffFallback)){
        // Without OPERATION_MODE, some ON_OFF-only entities report "off" even
        // while powered. Keep both idempotent actions available instead of
        // deriving power from an ambiguous operation-mode state.
        control('Włącz podgrzewacz','turn_on',!canInferPowerState||state.state==='off',null,false);
        control('Wyłącz podgrzewacz','turn_off',!canInferPowerState||state.state!=='off',null,false)
      }
      const modeLabels={eco:'Eco',electric:'Elektryczny',performance:'Wydajny',high_demand:'Duże zapotrzebowanie',heat_pump:'Pompa ciepła',gas:'Gaz',off:'Wyłączony',on:'Włączony'};
      status.textContent='Tryb · '+(modeLabels[currentMode]||currentMode||state.state);
      if(currentRaw===undefined&&targetRaw===undefined&&!modes.length&&!hasAwayState&&!onOffFallback)panel.append(make('p','velto-modal-meta','Urządzenie udostępnia tylko podstawowy stan.'));
    }else if(domain==='humidifier'){
      const actionLabels={humidifying:'Nawilżanie',drying:'Osuszanie',idle:'Bezczynny',off:'Wyłączony'};
      if(typeof attrs.action==='string'&&attrs.action.trim())panel.append(make('p','velto-modal-meta','Praca · '+(actionLabels[attrs.action]||attrs.action)));
      const numeric=value=>value!==undefined&&value!==null&&String(value).trim()!==''&&Number.isFinite(Number(value));
      if(numeric(attrs.current_humidity))panel.append(make('p','velto-modal-meta','Aktualna wilgotność · '+Number(attrs.current_humidity).toLocaleString('pl-PL',{maximumFractionDigits:1})+'%'));
      if(numeric(attrs.target_humidity)){
        let min=numeric(attrs.min_humidity)?Number(attrs.min_humidity):0;
        let max=numeric(attrs.max_humidity)?Number(attrs.max_humidity):100;
        if(max<=min){min=0;max=100}
        const target=Number(attrs.target_humidity),initial=Math.max(min,Math.min(max,target));
        const label=make('label','velto-modal-meta','Wilgotność docelowa · '+Math.round(initial)+'%'),slider=make('input','velto-modal-slider');
        slider.type='range';slider.min=String(min);slider.max=String(max);slider.step='1';slider.value=String(initial);slider.setAttribute('aria-label','Wilgotność docelowa');const lock=registerDetailControl(slider,true);
        slider.addEventListener('input',()=>{label.textContent='Wilgotność docelowa · '+Math.round(Number(slider.value))+'%'});
        slider.addEventListener('change',async()=>{
          if(slider.disabled||lock.pending)return;
          const value=Math.max(min,Math.min(max,Math.round(Number(slider.value))));
          status.textContent='Ustawianie wilgotności…';
          const ok=await this.runEntityService('humidifier','set_humidity',id,{humidity:value});
          status.textContent=ok?'Ustawiono wilgotność · '+value+'%':'Nie udało się ustawić wilgotności'
        });
        panel.append(label,slider)
      }
      const modes=Array.isArray(attrs.available_modes)?[...new Set(attrs.available_modes.filter(value=>typeof value==='string'&&value.trim()).map(value=>value.trim()))].slice(0,12):[];
      const currentMode=typeof attrs.mode==='string'?attrs.mode.trim():'';
      if(modes.length&&this.humidifierSupports(state,VELTO_HUMIDIFIER_FEATURES.MODES,true)){
        if(currentMode&&!modes.includes(currentMode))modes.unshift(currentMode);
        if(modes.length>12)modes.length=12;
        const wrapper=make('label','velto-modal-field'),caption=make('span','','Tryb pracy'),select=make('select','velto-modal-select');
        select.setAttribute('aria-label','Tryb pracy');
        for(const mode of modes){const option=make('option','',mode);option.value=mode;option.selected=mode===currentMode;select.append(option)}
        if(!currentMode&&modes.length)select.value=modes[0];
        const lock=registerDetailControl(select,true);
        select.addEventListener('change',async()=>{
          if(select.disabled||lock.pending||!modes.includes(select.value))return;
          const value=select.value;status.textContent='Zmiana trybu…';
          const ok=await this.runEntityService('humidifier','set_mode',id,{mode:value});
          status.textContent=ok?'Ustawiono tryb · '+value:'Nie udało się zmienić trybu'
        });
        wrapper.append(caption,select);panel.append(wrapper)
      }
      control('Włącz','turn_on',state.state==='off');
      control('Wyłącz','turn_off',state.state==='on');
    }else if(domain==='fan'){
      const rawFeatures=attrs.supported_features,hasFeatures=rawFeatures!==undefined&&rawFeatures!==null&&Number.isFinite(Number(rawFeatures)),features=hasFeatures?Number(rawFeatures):0;
      const supports=(bit,fallback)=>hasFeatures?Boolean(features&bit):Boolean(fallback);
      const rawPercentage=attrs.percentage,percentage=Number(rawPercentage),hasPercentage=rawPercentage!==undefined&&rawPercentage!==null&&rawPercentage!==''&&Number.isFinite(percentage);
      if(hasPercentage&&supports(1,true)){
        const initial=Math.max(0,Math.min(100,percentage)),rawStep=Number(attrs.percentage_step),step=Number.isFinite(rawStep)&&rawStep>0?Math.min(100,rawStep):1;
        const label=make('label','velto-modal-field'),caption=make('span','','Prędkość · '+Math.round(initial)+'%'),slider=make('input','velto-modal-slider');
        slider.type='range';slider.min='0';slider.max='100';slider.step=String(step);slider.value=String(initial);slider.setAttribute('aria-label','Prędkość wentylatora');registerDetailControl(slider,true);
        slider.addEventListener('input',()=>{caption.textContent='Prędkość · '+Math.round(Number(slider.value))+'%'});
        slider.addEventListener('change',async()=>{
          const value=Number(slider.value);if(!Number.isFinite(value))return;
          status.textContent='Ustawianie prędkości…';
          const ok=await this.runEntityService('fan','set_percentage',id,{percentage:Math.max(0,Math.min(100,value))});
          status.textContent=ok?'Ustawiono prędkość · '+Math.round(value)+'%':'Nie udało się ustawić prędkości'
        });
        label.append(caption,slider);panel.append(label)
      }
      const addFanSelect=(label,options,currentValue,service,field,bit,fallback)=>{
        if(!Array.isArray(options)||!options.length||!supports(bit,fallback))return;
        const wrapper=make('label','velto-modal-field'),caption=make('span','',label),select=make('select','velto-modal-select');
        select.setAttribute('aria-label',label);
        const values=[...new Set(options.filter(value=>typeof value==='string'&&value.trim()).slice(0,12))],selected=typeof currentValue==='string'?currentValue:'';
        if(selected&&!values.includes(selected))values.unshift(selected);
        for(const value of values){const option=make('option','',value);option.value=value;option.selected=value===selected;select.append(option)}
        if(!selected&&values.length)select.value=values[0];
        const lock=registerDetailControl(select,true);
        select.addEventListener('change',async()=>{
          if(select.disabled||lock.pending)return;
          const value=select.value;if(!value)return;
          status.textContent='Aktualizowanie ustawień…';
          const ok=await this.runEntityService('fan',service,id,{[field]:value});
          status.textContent=ok?'Zmieniono ustawienie · '+label:'Nie udało się zmienić · '+label
        });
        wrapper.append(caption,select);panel.append(wrapper)
      };
      addFanSelect('Program',attrs.preset_modes,attrs.preset_mode,'set_preset_mode','preset_mode',8,Array.isArray(attrs.preset_modes));
      if(supports(4,typeof attrs.direction==='string')){
        const wrapper=make('label','velto-modal-field'),caption=make('span','','Kierunek obrotu'),select=make('select','velto-modal-select');
        select.setAttribute('aria-label','Kierunek obrotu');
        const directions=['forward','reverse'],selected=directions.includes(attrs.direction)?attrs.direction:'forward';
        for(const value of directions){const option=make('option','',value);option.value=value;option.selected=value===selected;select.append(option)}
        const lock=registerDetailControl(select,true);
        select.addEventListener('change',async()=>{
          if(select.disabled||lock.pending)return;
          status.textContent='Zmienianie kierunku…';
          const ok=await this.runEntityService('fan','set_direction',id,{direction:select.value});
          status.textContent=ok?'Zmieniono kierunek':'Nie udało się zmienić kierunku'
        });
        wrapper.append(caption,select);panel.append(wrapper)
      }
      if(supports(2,typeof attrs.oscillating==='boolean')){
        const oscillating=attrs.oscillating===true;
        control(oscillating?'Wyłącz oscylację':'Włącz oscylację','oscillate',true,{oscillating:!oscillating})
      }
      control('Włącz','turn_on',state.state!=='on');control('Wyłącz','turn_off',state.state==='on');
    }else if(domain==='lock'){
      const locked=state.state==='locked',unlocked=['unlocked','open'].includes(state.state),requiresCode=typeof attrs.code_format==='string'&&attrs.code_format.trim().length>0;
      const labels={locked:'Zablokowane',unlocked:'Odblokowane',open:'Otwarte',locking:'Zamykanie…',unlocking:'Otwieranie…',jammed:'Zacięte'};
      panel.append(make('p','velto-modal-meta','Stan zamka · '+(labels[state.state]||state.state)));
      control('Zablokuj','lock',unlocked);
      control('Odblokuj','unlock',locked&&!requiresCode);
      if(requiresCode)panel.append(make('p','velto-modal-meta','Ta blokada wymaga kodu. Wprowadź go w natywnym oknie Home Assistant — VELTO nie przechowuje ani nie wysyła kodów dostępu.'));
      else if(!locked&&!unlocked)panel.append(make('p','velto-modal-meta','Zamek nie zgłasza stabilnego stanu. Sterowanie jest chwilowo zablokowane.'));
    }else if(domain==='climate'){
      const features=Number(attrs.supported_features)||0;
      const current=Number(attrs.current_temperature),target=Number(attrs.temperature),unit=attrs.temperature_unit||'°C';
      const actionLabels={heating:'Grzanie',cooling:'Chłodzenie',idle:'Bezczynny',drying:'Osuszanie',fan:'Wentylacja'};
      if(attrs.hvac_action)panel.append(make('p','velto-modal-meta','Praca: '+(actionLabels[attrs.hvac_action]||attrs.hvac_action)));
      if(Number.isFinite(current))panel.append(make('p','velto-modal-meta','Aktualnie: '+current.toLocaleString('pl-PL',{maximumFractionDigits:1})+' '+unit));
      if(Number.isFinite(target)){
        let min=Number.isFinite(Number(attrs.min_temp))?Number(attrs.min_temp):5;
        let max=Number.isFinite(Number(attrs.max_temp))?Number(attrs.max_temp):35;
        if(max<=min){min=5;max=35}
        const step=Number.isFinite(Number(attrs.target_temp_step))&&Number(attrs.target_temp_step)>0?Number(attrs.target_temp_step):0.5;
        const label=make('label','velto-modal-meta','Temperatura docelowa · '+target.toLocaleString('pl-PL',{maximumFractionDigits:1})+' '+unit),slider=make('input','velto-modal-slider');
        slider.type='range';slider.min=String(min);slider.max=String(max);slider.step=String(step);slider.value=String(Math.max(min,Math.min(max,target)));slider.setAttribute('aria-label','Temperatura docelowa');registerDetailControl(slider,true);
        slider.addEventListener('input',()=>{if(label.firstChild)label.firstChild.textContent='Temperatura docelowa · '+Number(slider.value).toLocaleString('pl-PL',{maximumFractionDigits:1})+' '+unit});
        slider.addEventListener('change',async()=>{
          const value=Number(slider.value);if(!Number.isFinite(value))return;
          status.textContent='Ustawianie temperatury…';
          const ok=await this.runEntityService('climate','set_temperature',id,{temperature:value});
          status.textContent=ok?'Temperatura ustawiona · '+value.toLocaleString('pl-PL',{maximumFractionDigits:1})+' '+unit:'Nie udało się zmienić temperatury'
        });
        label.append(slider);panel.append(label)
      }
      const addSelect=(label,options,currentValue,service,field,featureBit)=>{
        if(!Array.isArray(options)||!options.length||features&&featureBit&&!(features&featureBit))return;
        const wrapper=make('label','velto-modal-field'),caption=make('span','',label),select=make('select','velto-modal-select');
        select.setAttribute('aria-label',label);
        const values=[...new Set(options.filter(value=>typeof value==='string'&&value.trim()).slice(0,12))],selected=typeof currentValue==='string'?currentValue:'';
        if(selected&&!values.includes(selected))values.unshift(selected);
        for(const value of values){const option=make('option','',value);option.value=value;option.selected=value===selected;select.append(option)}
        if(!selected&&values.length)select.value=values[0];
        const lock=registerDetailControl(select,true);
        select.addEventListener('change',async()=>{
          if(select.disabled||lock.pending)return;
          const value=select.value;if(!value)return;
          status.textContent='Aktualizowanie ustawień…';
          const ok=await this.runEntityService('climate',service,id,{[field]:value});
          status.textContent=ok?'Zmieniono ustawienie · '+label:'Nie udało się zmienić · '+label
        });
        wrapper.append(caption,select);panel.append(wrapper)
      };
      if(Number.isFinite(Number(attrs.target_humidity))&&(!features||(features&4))){
        const humidity=Number(attrs.target_humidity);
        const min=Number.isFinite(Number(attrs.min_humidity))?Number(attrs.min_humidity):30;
        const maxValue=Number(attrs.max_humidity),max=Number.isFinite(maxValue)&&maxValue>min?maxValue:80;
        const initial=Math.max(min,Math.min(max,humidity)),label=make('label','velto-modal-field'),caption=make('span','','Wilgotność docelowa · '+Math.round(initial)+'%'),slider=make('input','velto-modal-slider');
        slider.type='range';slider.min=String(min);slider.max=String(max);slider.step='1';slider.value=String(initial);slider.setAttribute('aria-label','Wilgotność docelowa');registerDetailControl(slider,true);
        slider.addEventListener('input',()=>{caption.textContent='Wilgotność docelowa · '+Math.round(Number(slider.value))+'%'});
        slider.addEventListener('change',async()=>{
          const value=Number(slider.value);if(!Number.isFinite(value))return;
          status.textContent='Ustawianie wilgotności…';
          const ok=await this.runEntityService('climate','set_humidity',id,{humidity:value});
          status.textContent=ok?'Wilgotność ustawiona · '+Math.round(value)+'%':'Nie udało się zmienić wilgotności'
        });
        label.append(caption,slider);panel.append(label)
      }
      if(Array.isArray(attrs.hvac_modes)&&attrs.hvac_modes.length){
        for(const mode of attrs.hvac_modes.slice(0,8))control(String(mode),'set_hvac_mode',state.state!==mode,{hvac_mode:mode},false)
      }
      addSelect('Tryb wentylatora',attrs.fan_modes,attrs.fan_mode,'set_fan_mode','fan_mode',8);
      addSelect('Program',attrs.preset_modes,attrs.preset_mode,'set_preset_mode','preset_mode',16);
      addSelect('Ruch żaluzji',attrs.swing_modes,attrs.swing_mode,'set_swing_mode','swing_mode',32);
      addSelect('Poziomy ruch żaluzji',attrs.swing_horizontal_modes,attrs.swing_horizontal_mode,'set_swing_horizontal_mode','swing_horizontal_mode',512)
    }else if(domain==='cover'){
      const position=Number(attrs.current_position),features=Number(attrs.supported_features)||0;
      if(Number.isFinite(position))panel.append(make('p','velto-modal-meta','Otwarcie: '+Math.round(Math.max(0,Math.min(100,position)))+'%'));
      control('Otwórz','open_cover',Boolean(features&1)||features===0);
      control('Stop','stop_cover',Boolean(features&8));
      control('Zamknij','close_cover',Boolean(features&2)||features===0);
      if(Number.isFinite(position)&&(features&4)){
        const label=make('label','velto-modal-meta','Pozycja · '+Math.round(position)+'%'),slider=make('input','velto-modal-slider');
        slider.type='range';slider.min='0';slider.max='100';slider.value=String(Math.round(Math.max(0,Math.min(100,position))));slider.setAttribute('aria-label','Pozycja rolety');registerDetailControl(slider,true);
        slider.addEventListener('input',()=>{if(label.firstChild)label.firstChild.textContent='Pozycja · '+slider.value+'%'});
        slider.addEventListener('change',async()=>{
          const value=Number(slider.value);if(!Number.isFinite(value))return;
          status.textContent='Ustawianie pozycji…';
          const ok=await this.runEntityService('cover','set_cover_position',id,{position:value});
          status.textContent=ok?'Ustawiono pozycję · '+value+'%':'Nie udało się ustawić pozycji'
        });
        label.append(slider);panel.append(label)
      }
      const tilt=Number(attrs.current_tilt_position);
      if(Number.isFinite(tilt)&&(features&128)){
        const label=make('label','velto-modal-field'),caption=make('span','','Nachylenie lameli · '+Math.round(Math.max(0,Math.min(100,tilt)))+'%'),slider=make('input','velto-modal-slider');
        slider.type='range';slider.min='0';slider.max='100';slider.value=String(Math.round(Math.max(0,Math.min(100,tilt))));slider.setAttribute('aria-label','Pozycja lameli');registerDetailControl(slider,true);
        slider.addEventListener('input',()=>{caption.textContent='Nachylenie lameli · '+slider.value+'%'});
        slider.addEventListener('change',async()=>{
          const value=Number(slider.value);if(!Number.isFinite(value))return;
          status.textContent='Ustawianie lameli…';
          const ok=await this.runEntityService('cover','set_cover_tilt_position',id,{tilt_position:value});
          status.textContent=ok?'Ustawiono nachylenie · '+value+'%':'Nie udało się ustawić nachylenia'
        });
        label.append(caption,slider);panel.append(label)
      }
      if(features&16)control('Otwórz lamele','open_cover_tilt',true,{},false);
      if(features&64)control('Stop lameli','stop_cover_tilt',true,{},false);
      if(features&32)control('Zamknij lamele','close_cover_tilt',true,{},false)
    }else if(domain==='valve'){
      const rawFeatures=attrs.supported_features,features=Number(rawFeatures),hasFeatures=rawFeatures!==undefined&&rawFeatures!==null&&String(rawFeatures).trim()!==''&&Number.isSafeInteger(features)&&features>=0;
      const rawPosition=attrs.current_position,position=rawPosition!==undefined&&rawPosition!==null&&String(rawPosition).trim()!==''?Number(rawPosition):NaN;
      const className=attrs.device_class==='gas'?'gazowy':attrs.device_class==='water'?'wodny':'ogólny';
      const stateLabels={open:'Otwarty',opening:'Otwieranie',closed:'Zamknięty',closing:'Zamykanie',stopped:'Zatrzymany'};
      panel.append(make('p','velto-modal-meta','Rodzaj zaworu · '+className));
      panel.append(make('p','velto-modal-meta','Stan zaworu · '+(stateLabels[state.state]||state.state)));
      if(Number.isFinite(position))panel.append(make('p','velto-modal-meta','Pozycja · '+Math.round(Math.max(0,Math.min(100,position)))+'%'));
      let actionCount=0;
      if(!hasFeatures)panel.append(make('p','velto-modal-meta','Home Assistant nie udostępnia obsługiwanych poleceń. Sterowanie pozostaje wyłączone.'));
      else{
        if(features&1){
          actionCount++;
          if(attrs.device_class==='gas'){
            const openButton=make('button','velto-modal-control','Otwórz zawór gazu');openButton.type='button';
            const lock=registerDetailControl(openButton,true);let armed=false;
            const resetGasConfirmation=()=>{armed=false;if(automationConfirmTimeout!==null){clearTimeout(automationConfirmTimeout);automationConfirmTimeout=null}if(openButton.isConnected)openButton.textContent='Otwórz zawór gazu'};
            openButton.addEventListener('click',async()=>{
              if(openButton.disabled||!openButton.isConnected||lock.pending)return;
              if(!armed){
                armed=true;openButton.textContent='Potwierdź otwarcie gazu';status.textContent='Kliknij ponownie w ciągu 3,5 s, aby otworzyć zawór gazowy.';
                if(automationConfirmTimeout!==null)clearTimeout(automationConfirmTimeout);
                automationConfirmTimeout=setTimeout(resetGasConfirmation,3500);return
              }
              resetGasConfirmation();status.textContent='Otwieranie zaworu gazowego…';
              const ok=await this.runEntityService('valve','open_valve',id);
              status.textContent=ok?'Wysłano polecenie otwarcia zaworu gazowego':'Nie udało się otworzyć zaworu gazowego'
            });
            controls.append(openButton)
          }else control('Otwórz zawór','open_valve',true,{},false)
        }
        if(features&8){actionCount++;control('Zatrzymaj zawór','stop_valve',['opening','closing'].includes(state.state),{},false)}
        if(features&2){actionCount++;control('Zamknij zawór','close_valve',true,{},false)}
        if(features&4){
          actionCount++;
          if(attrs.device_class==='gas')panel.append(make('p','velto-modal-meta','Regulacja pośredniej pozycji zaworu gazowego pozostaje dostępna w natywnym oknie Home Assistant.'));
          else if(Number.isFinite(position)){
            const initial=Math.round(Math.max(0,Math.min(100,position))),field=make('label','velto-modal-field'),caption=make('span','','Pozycja zaworu · '+initial+'%'),slider=make('input','velto-modal-slider');
            slider.type='range';slider.min='0';slider.max='100';slider.step='1';slider.value=String(initial);slider.setAttribute('aria-label','Pozycja zaworu');slider.setAttribute('aria-valuetext',initial+'%');registerDetailControl(slider,true);
            slider.addEventListener('input',()=>{caption.textContent='Pozycja zaworu · '+slider.value+'%';slider.setAttribute('aria-valuetext',slider.value+'%')});
            slider.addEventListener('change',async()=>{
              const value=Number(slider.value);if(!Number.isInteger(value)||value<0||value>100)return;
              status.textContent='Ustawianie pozycji zaworu…';
              const ok=await this.runEntityService('valve','set_valve_position',id,{position:value});
              status.textContent=ok?'Ustawiono pozycję zaworu · '+value+'%':'Nie udało się ustawić pozycji zaworu'
            });
            field.append(caption,slider);panel.append(field)
          }else panel.append(make('p','velto-modal-meta','Zawór obsługuje regulację pozycji, ale Home Assistant nie raportuje bieżącego położenia.'))
        }
        if(!actionCount)panel.append(make('p','velto-modal-meta','Ten zawór nie udostępnia sterowania w VELTO.'))
      }
      if(attrs.device_class==='gas')panel.append(make('p','velto-modal-warning','Zawór gazowy. Otwarcie wymaga dwukrotnego potwierdzenia; regulacja pośrednia pozostaje w natywnym Home Assistant.'));
      else panel.append(make('p','velto-modal-meta','Otwieranie zaworu może uruchomić przepływ. Polecenia są wysyłane wyłącznie po wybraniu odpowiedniego przycisku.'));
    }else if(domain==='number'||domain==='input_number'){
      const model=this.numericEntityControlModel(state),unit=typeof attrs.unit_of_measurement==='string'?attrs.unit_of_measurement.trim():'';
      const format=value=>Number(value).toLocaleString('pl-PL',{maximumFractionDigits:6})+(unit?' '+unit:'');
      if(model){
        const field=make('label','velto-modal-field',unit?'Wartość · '+unit:'Wartość'),slider=make('input','velto-modal-slider'),value=make('output','velto-modal-meta',format(model.value));
        slider.type='range';slider.min=String(model.min);slider.max=String(model.max);slider.step=String(model.step);slider.value=String(model.value);
        slider.setAttribute('aria-label','Wartość');slider.setAttribute('aria-valuetext',format(model.value));
        const lock=registerDetailControl(slider,true);
        slider.addEventListener('input',()=>{
          const next=Number(slider.value);if(!Number.isFinite(next))return;
          value.textContent=format(next);slider.setAttribute('aria-valuetext',format(next))
        });
        slider.addEventListener('change',async()=>{
          if(slider.disabled||lock.pending)return;
          const raw=Number(slider.value);if(!Number.isFinite(raw))return;
          const next=Math.max(model.min,Math.min(model.max,raw));
          status.textContent='Ustawianie wartości…';
          const ok=await this.runEntityService(domain,'set_value',id,{value:next});
          if(ok){value.textContent=format(next);slider.setAttribute('aria-valuetext',format(next));status.textContent='Wartość ustawiona · '+format(next)}
          else{slider.value=String(model.value);value.textContent=format(model.value);slider.setAttribute('aria-valuetext',format(model.value));status.textContent='Nie udało się ustawić wartości'}
        });
        field.append(slider,value);panel.append(field)
      }else panel.append(make('p','velto-modal-meta','Zakres sterowania nie jest dostępny. Aktualna wartość: '+state.state+(unit?' '+unit:'')))
    }else if(domain==='select'||domain==='input_select'){
      const options=this.selectEntityOptions(state),current=typeof state.state==='string'?state.state.trim():'';
      if(options.length){
        const field=make('label','velto-modal-field','Wybierz opcję'),select=make('select','velto-modal-select');
        select.setAttribute('aria-label','Wybierz opcję');
        const placeholder=make('option','',options.includes(current)?'Wybierz inną opcję':current?'Aktualna wartość: '+current:'Wybierz opcję…');
        placeholder.value='';placeholder.disabled=true;placeholder.selected=!options.includes(current);select.append(placeholder);
        for(const optionValue of options){const option=make('option','',optionValue);option.value=optionValue;option.selected=optionValue===current;select.append(option)}
        select.value=options.includes(current)?current:'';
        const lock=registerDetailControl(select,true);let selectedOption=options.includes(current)?current:'';
        select.addEventListener('change',async()=>{
          const optionValue=select.value;if(!options.includes(optionValue)||optionValue===selectedOption||select.disabled||lock.pending)return;
          status.textContent='Zmienianie opcji…';
          const ok=await this.runEntityService(domain,'select_option',id,{option:optionValue});
          if(ok){selectedOption=optionValue;status.textContent='Ustawiono opcję · '+optionValue}
          else{select.value=selectedOption;status.textContent='Nie udało się zmienić opcji'}
        });
        field.append(select);panel.append(field)
      }else panel.append(make('p','velto-modal-meta','Brak dostępnych opcji w atrybucie Home Assistant. Aktualna wartość: '+(current||'—')))
    }else if(domain==='input_datetime'){
      const model=this.inputDatetimeModel(state);
      if(model){
        const form=make('div','velto-modal-datetime');
        let dateInput=null,timeInput=null;
        if(model.hasDate){
          const field=make('label','velto-modal-field','Data');
          dateInput=make('input','velto-modal-date');dateInput.type='date';dateInput.value=model.date;dateInput.setAttribute('aria-label','Data');registerDetailControl(dateInput,true);
          field.append(dateInput);form.append(field)
        }
        if(model.hasTime){
          const field=make('label','velto-modal-field','Godzina');
          timeInput=make('input','velto-modal-time');timeInput.type='time';timeInput.step='1';timeInput.value=model.time;timeInput.setAttribute('aria-label','Godzina');registerDetailControl(timeInput,true);
          field.append(timeInput);form.append(field)
        }
        const saveLabel=model.hasDate&&model.hasTime?'Zapisz datę i czas':model.hasDate?'Zapisz datę':'Zapisz godzinę';
        const save=make('button','velto-modal-control',saveLabel);save.type='button';
        const lock=registerDetailControl(save,false);
        const syncSave=()=>{const dirty=(dateInput?.value??model.date)!==model.date||(timeInput?.value??model.time)!==model.time;save._veltoEnabled=dirty;save.disabled=!dirty||lock.pending};
        dateInput?.addEventListener('input',syncSave);timeInput?.addEventListener('input',syncSave);
        save.addEventListener('click',async()=>{
          if(save.disabled||lock.pending)return;
          const payload=this.inputDatetimePayload(model,dateInput?.value??'',timeInput?.value??'');
          if(!payload){status.textContent='Wprowadź prawidłową datę i godzinę';return}
          status.textContent='Zapisywanie daty i godziny…';
          const ok=await this.runEntityService(domain,'set_datetime',id,payload);
          if(ok){
            if(dateInput)model.date=dateInput.value;
            if(timeInput)model.time=payload.time||payload.datetime?.slice(11)||timeInput.value;
            status.textContent=model.hasDate&&model.hasTime?'Data i godzina zapisane':model.hasDate?'Data zapisana':'Godzina zapisana'
          }else{
            if(dateInput)dateInput.value=model.date;
            if(timeInput)timeInput.value=model.time;
            status.textContent='Nie udało się zapisać daty i godziny'
          }
          syncSave()
        });
        form.append(save);panel.append(form);syncSave()
      }else panel.append(make('p','velto-modal-meta','Brak poprawnych danych daty lub czasu. Zmień wartość w Home Assistant.'))
    }else if(domain==='input_text'){
      const model=this.inputTextModel(state);
      if(model){
        const form=make('div','velto-modal-text-form'),field=make('label','velto-modal-field',model.mode==='password'?'Wartość chroniona':'Wartość tekstowa');
        const input=make('input','velto-modal-text');input.type=model.mode==='password'?'password':'text';input.value=model.value;
        input.maxLength=Math.min(510,model.max*2);input.required=model.min>0;input.autocomplete=model.mode==='password'?'new-password':'off';
        input.autocapitalize='off';input.spellcheck=false;input.inputMode='text';
        if(model.pattern)input.pattern=model.pattern;
        input.setAttribute('aria-label',model.mode==='password'?'Wartość chroniona':'Wartość tekstowa');
        const hint=make('p','velto-modal-meta',model.mode==='password'?'Wartość jest maskowana w VELTO.':'Wartość jest zapisywana dopiero po potwierdzeniu.');
        hint.id='velto-input-text-hint';input.setAttribute('aria-describedby',hint.id);
        const counter=model.mode==='password'?null:make('output','velto-modal-text-count',Array.from(model.value).length+' / '+model.max+' znaków');
        registerDetailControl(input,true);
        const save=make('button','velto-modal-control','Zapisz wartość');save.type='button';
        const lock=registerDetailControl(save,false);
        const syncSave=()=>{
          const valid=this.inputTextValueValid(model,input.value),dirty=input.value!==model.value;
          save._veltoEnabled=dirty&&valid;save.disabled=!save._veltoEnabled||lock.pending;
          if(counter)counter.textContent=Array.from(input.value).length+' / '+model.max+' znaków';
          hint.textContent=valid
            ?(model.mode==='password'?'Wartość jest maskowana w VELTO.':'Wartość jest zapisywana dopiero po potwierdzeniu.')
            :'Wartość nie spełnia ograniczeń długości lub wzorca Home Assistant.'
        };
        input.addEventListener('input',syncSave);
        save.addEventListener('click',async()=>{
          if(save.disabled||lock.pending)return;
          const next=input.value;if(!this.inputTextValueValid(model,next)){syncSave();return}
          status.textContent='Zapisywanie wartości…';
          const ok=await this.runEntityService('input_text','set_value',id,{value:next});
          if(ok){model.value=next;status.textContent=model.mode==='password'?'Wartość chroniona zapisana':'Wartość zapisana'}
          else{input.value=model.value;status.textContent='Nie udało się zapisać wartości'}
          syncSave()
        });
        field.append(input);form.append(field,hint);if(counter)form.append(counter);form.append(save);panel.append(form);syncSave()
      }else panel.append(make('p','velto-modal-meta','Brak poprawnych danych helpera. Sprawdź ograniczenia w Home Assistant.'))
    }else if(domain==='counter'){
      const model=this.counterModel(state);
      if(model){
        const bounds=[];
        if(model.minimum!==null)bounds.push('min. '+model.minimum);
        if(model.maximum!==null)bounds.push('maks. '+model.maximum);
        const hero=make('div','velto-counter-hero'),value=make('strong','velto-counter-value',String(model.value));
        const meta=make('small','velto-counter-meta','Krok: '+model.step+(bounds.length?' · '+bounds.join(' · '):''));
        hero.append(value,meta);panel.append(hero);
        control('Zmniejsz o '+model.step,'decrement',model.minimum===null||model.value>model.minimum,null,false);
        control('Zwiększ o '+model.step,'increment',model.maximum===null||model.value<model.maximum,null,false);
        if(model.initial!==null)control('Przywróć wartość początkową','reset',model.value!==model.initial,null,false)
      }else panel.append(make('p','velto-modal-meta',attrs.editable!==true?'Ten licznik jest tylko do odczytu.':'Brak poprawnych danych licznika. Sprawdź wartość i konfigurację helpera w Home Assistant.'))
    }else if(domain==='timer'){
      const model=this.timerModel(state);
      if(model){
        const labels={idle:'Gotowy',active:'Aktywny',paused:'Wstrzymany'};
        const hero=make('div','velto-timer-hero velto-counter-hero'),value=make('strong','velto-timer-value velto-counter-value',model.remaining===null?'—':this.formatMediaTime(model.remaining));
        const meta=make('small','velto-timer-meta velto-counter-meta',labels[model.state]+(model.state==='idle'&&model.duration!==null?' · Czas startowy: '+this.formatMediaTime(model.duration):model.state==='paused'&&model.remaining!==null?' · Pozostało: '+this.formatMediaTime(model.remaining):''));
        hero.append(value,meta);panel.append(hero);
        if(model.state==='active'){
          control('Wstrzymaj','pause');
          control('Anuluj','cancel')
        }else if(model.state==='paused'){
          control('Wznów','start',model.remaining!==null&&model.remaining>0);
          control('Anuluj','cancel')
        }else control('Uruchom','start',model.duration!==null&&model.duration>0);
        const hint=model.state==='active'
          ?(model.live?'Pozostały czas jest liczony lokalnie na podstawie finishes_at z Home Assistant.':model.remaining!==null?'Pokazano ostatni raportowany czas; Home Assistant nie udostępnia prawidłowego finishes_at.':'Home Assistant nie udostępnia wiarygodnego czasu pozostałego.')
          :model.state==='paused'
            ?'Wznów kontynuuje od pozostałego czasu. Anuluj zatrzymuje timer bez wywoływania zdarzenia timer.finished.'
            :model.duration!==null&&model.duration>0
              ?'Uruchom używa czasu skonfigurowanego w Home Assistant.'
              :'Ustaw dodatni czas startowy w konfiguracji timera Home Assistant, aby go uruchomić.';
        panel.append(make('p','velto-modal-meta',hint));
        if(model.live&&model.remaining!==null&&model.remaining>0){
          const stopTimerTick=()=>{if(timerInterval!==null){clearInterval(timerInterval);timerInterval=null}};
          const tick=()=>{
            const current=this.timerModel(this.entity(id));
            if(!current){stopTimerTick();return}
            if(current.state!=='active'){
              stopTimerTick();
              if(current.state==='paused'&&current.remaining!==null){value.textContent=this.formatMediaTime(current.remaining);meta.textContent='Wstrzymany · Pozostało: '+this.formatMediaTime(current.remaining)}
              else if(current.state==='idle'){value.textContent='0:00';meta.textContent='Zakończono lub anulowano'}
              return
            }
            if(current.remaining===null)return;
            value.textContent=this.formatMediaTime(current.remaining);
            if(current.remaining<=0){status.textContent='Odliczanie dobiegło końca; oczekiwanie na stan Home Assistant.';stopTimerTick()}
          };
          timerVisibility=()=>{
            if(document.hidden){stopTimerTick();return}
            tick();
            const current=this.timerModel(this.entity(id));
            if(timerInterval===null&&current?.state==='active'&&current.live&&current.remaining>0)timerInterval=setInterval(tick,1000)
          };
          document.addEventListener('visibilitychange',timerVisibility);
          timerVisibility()
        }
      }else panel.append(make('p','velto-modal-meta','Brak poprawnego stanu timera. Sprawdź stan elementu w Home Assistant.'))
    }else if(domain==='light'){
      const initial=this.lightBrightnessPercent(state),hero=make('div','velto-light-hero'),glyph=make('div','velto-light-icon'),summary=make('div','velto-light-summary');
      glyph.append(this.icon('light'));
      const stateLabel=make('strong','',state.state==='on'?'Światło włączone':'Światło wyłączone');
      const stateHint=make('small','',state.state==='on'?'Ustaw poziom jasności lub wyłącz światło.':'Wybierz jasność — światło włączy się z wybranym poziomem.');
      summary.append(stateLabel,stateHint);hero.append(glyph,summary);panel.append(hero);
      const brightnessPanel=make('div','velto-light-brightness'),brightnessHead=make('div','velto-light-brightness-head'),brightnessLabel=make('label','velto-light-brightness-label','Jasność'),brightnessValue=make('output','velto-light-value',initial+'%');
      const slider=make('input','velto-light-slider');slider.type='range';slider.min='1';slider.max='100';slider.step='1';slider.value=String(initial);slider.setAttribute('aria-label','Jasność światła');slider.setAttribute('aria-valuetext',initial+'%');
      brightnessLabel.htmlFor='velto-light-level';slider.id='velto-light-level';
      const rangeHint=make('div','velto-light-range-hint');rangeHint.append(make('span','','1%'),make('span','','100%'));
      brightnessHead.append(brightnessLabel,brightnessValue);
      slider.addEventListener('input',()=>{const value=Math.max(1,Math.min(100,Number(slider.value)||1));brightnessValue.textContent=value+'%';slider.setAttribute('aria-valuetext',value+'%')});
      registerDetailControl(slider,true);
      slider.addEventListener('change',async()=>{
        const value=Math.max(1,Math.min(100,Number(slider.value)||1));
        status.textContent='Ustawianie jasności…';
        const ok=await this.runEntityService('light','turn_on',id,{brightness_pct:value});
        if(ok){status.textContent='Jasność ustawiona · '+value+'%';stateLabel.textContent='Światło włączone';stateHint.textContent='Poziom jasności został zastosowany.';toggle.textContent='Wyłącz światło';toggle.setAttribute('aria-label','Wyłącz światło')}
        else status.textContent='Nie udało się zmienić jasności'
      });
      brightnessPanel.append(brightnessHead,slider,rangeHint);panel.append(brightnessPanel);
      const finiteColorValue=value=>value!==undefined&&value!==null&&String(value).trim()!==''&&Number.isFinite(Number(value));
      const colorModes=Array.isArray(attrs.supported_color_modes)?[...new Set(attrs.supported_color_modes.filter(mode=>typeof mode==='string'))]:[];
      if(colorModes.includes('color_temp')){
        const hasKelvinBounds=finiteColorValue(attrs.min_color_temp_kelvin)&&finiteColorValue(attrs.max_color_temp_kelvin)&&Number(attrs.max_color_temp_kelvin)>Number(attrs.min_color_temp_kelvin);
        const hasMiredBounds=finiteColorValue(attrs.min_mireds)&&finiteColorValue(attrs.max_mireds)&&Number(attrs.min_mireds)>0&&Number(attrs.max_mireds)>Number(attrs.min_mireds);
        let minKelvin=hasKelvinBounds?Math.round(Number(attrs.min_color_temp_kelvin)):hasMiredBounds?Math.round(1000000/Number(attrs.max_mireds)):NaN;
        let maxKelvin=hasKelvinBounds?Math.round(Number(attrs.max_color_temp_kelvin)):hasMiredBounds?Math.round(1000000/Number(attrs.min_mireds)):NaN;
        if(Number.isFinite(minKelvin)&&Number.isFinite(maxKelvin)&&minKelvin>0&&maxKelvin>minKelvin){
          const currentRaw=finiteColorValue(attrs.color_temp_kelvin)?Number(attrs.color_temp_kelvin):finiteColorValue(attrs.color_temp)&&Number(attrs.color_temp)>0?1000000/Number(attrs.color_temp):(minKelvin+maxKelvin)/2;
          const current=Math.round(Math.max(minKelvin,Math.min(maxKelvin,currentRaw)));
          const legacyMireds=!hasKelvinBounds&&!finiteColorValue(attrs.color_temp_kelvin);
          const temperature=make('div','velto-light-brightness velto-light-temperature'),temperatureHead=make('div','velto-light-brightness-head'),temperatureLabel=make('label','velto-light-brightness-label','Temperatura barwowa'),temperatureValue=make('output','velto-light-value',current+' K');
          const temperatureSlider=make('input','velto-light-slider');temperatureSlider.type='range';temperatureSlider.min=String(minKelvin);temperatureSlider.max=String(maxKelvin);temperatureSlider.step='1';temperatureSlider.value=String(current);temperatureSlider.id='velto-light-temperature-kelvin';temperatureSlider.setAttribute('aria-label','Temperatura barwowa');temperatureSlider.setAttribute('aria-valuetext',current+' K');temperatureLabel.htmlFor=temperatureSlider.id;
          temperatureHead.append(temperatureLabel,temperatureValue);
          temperatureSlider.addEventListener('input',()=>{const value=Math.max(minKelvin,Math.min(maxKelvin,Number(temperatureSlider.value)||current));temperatureValue.textContent=value+' K';temperatureSlider.setAttribute('aria-valuetext',value+' K')});
          registerDetailControl(temperatureSlider,true);
          temperatureSlider.addEventListener('change',async()=>{
            const value=Math.max(minKelvin,Math.min(maxKelvin,Number(temperatureSlider.value)||current));
            status.textContent='Ustawianie temperatury barwowej…';
            const data=legacyMireds?{color_temp:Math.round(1000000/value)}:{color_temp_kelvin:value};
            const ok=await this.runEntityService('light','turn_on',id,data);
            if(ok){status.textContent='Temperatura barwowa ustawiona · '+value+' K';stateLabel.textContent='Światło włączone';stateHint.textContent='Jasność i barwę możesz zmieniać poniżej.';toggle.textContent='Wyłącz światło';toggle.setAttribute('aria-label','Wyłącz światło')}
            else status.textContent='Nie udało się zmienić temperatury barwowej'
          });
          temperature.append(temperatureHead,temperatureSlider);panel.append(temperature)
        }
      }
      const colorModesForPicker=['hs','rgb','rgbw','rgbww','xy'];
      const currentColorMode=typeof attrs.color_mode==='string'&&colorModesForPicker.includes(attrs.color_mode)&&colorModes.includes(attrs.color_mode)?attrs.color_mode:null;
      const activeColorMode=currentColorMode||colorModesForPicker.find(mode=>colorModes.includes(mode));
      if(activeColorMode){
        const clampChannel=value=>Math.max(0,Math.min(255,Math.round(Number(value)||0)));
        const validRgb=value=>Array.isArray(value)&&value.length>=3&&value.slice(0,3).every(channel=>Number.isFinite(Number(channel)));
        const rgbToHex=value=>'#'+value.slice(0,3).map(channel=>clampChannel(channel).toString(16).padStart(2,'0')).join('');
        const hsToRgb=value=>{
          const hue=((Number(value[0])%360)+360)%360/60,saturation=Math.max(0,Math.min(100,Number(value[1])))/100,chroma=saturation,x=chroma*(1-Math.abs(hue%2-1));
          let channels=[0,0,0];
          if(hue<1)channels=[chroma,x,0];else if(hue<2)channels=[x,chroma,0];else if(hue<3)channels=[0,chroma,x];else if(hue<4)channels=[0,x,chroma];else if(hue<5)channels=[x,0,chroma];else channels=[chroma,0,x];
          const match=1-chroma;return channels.map(channel=>Math.round((channel+match)*255))
        };
        const hexToRgb=value=>{const match=/^#?([0-9a-f]{6})$/i.exec(String(value));return match?[parseInt(match[1].slice(0,2),16),parseInt(match[1].slice(2,4),16),parseInt(match[1].slice(4,6),16)]:null};
        const rgbToHs=value=>{
          const [r,g,b]=value.map(channel=>channel/255),max=Math.max(r,g,b),min=Math.min(r,g,b),delta=max-min;
          let hue=0;if(delta){if(max===r)hue=60*(((g-b)/delta)%6);else if(max===g)hue=60*((b-r)/delta+2);else hue=60*((r-g)/delta+4)}
          if(hue<0)hue+=360;
          return [Number(hue.toFixed(2)),Number((max===0?0:delta/max*100).toFixed(2))]
        };
        const rgbToXy=value=>{
          const linear=channel=>{const c=channel/255;return c<=0.04045?c/12.92:Math.pow((c+0.055)/1.055,2.4)};
          const [r,g,b]=value.map(linear),x=r*0.664511+g*0.154324+b*0.162028,y=r*0.283881+g*0.668433+b*0.047685,z=r*0.000088+g*0.072310+b*0.986039,sum=x+y+z;
          return sum>0?[Number((x/sum).toFixed(4)),Number((y/sum).toFixed(4))]:[0.3127,0.329]
        };
        const initialRgb=validRgb(attrs.rgb_color)?attrs.rgb_color.slice(0,3).map(clampChannel):Array.isArray(attrs.hs_color)&&attrs.hs_color.length>=2&&attrs.hs_color.every(value=>Number.isFinite(Number(value)))?hsToRgb(attrs.hs_color):[255,255,255];
        const colorField=make('label','velto-light-color-field'),colorCaption=make('span','velto-light-color-caption','Kolor światła'),colorInput=make('input','velto-light-color-input'),colorValue=make('output','velto-light-color-value',rgbToHex(initialRgb).toUpperCase());
        colorInput.type='color';colorInput.id='velto-light-color';colorInput.value=rgbToHex(initialRgb);colorInput.setAttribute('aria-label','Kolor światła');
        registerDetailControl(colorInput,true);
        colorInput.addEventListener('input',()=>{colorValue.textContent=colorInput.value.toUpperCase()});
        colorInput.addEventListener('change',async()=>{
          const rgb=hexToRgb(colorInput.value);if(!rgb)return;
          const data=activeColorMode==='hs'?{hs_color:rgbToHs(rgb)}:activeColorMode==='xy'?{xy_color:rgbToXy(rgb)}:{rgb_color:rgb};
          status.textContent='Ustawianie koloru światła…';
          const ok=await this.runEntityService('light','turn_on',id,data);
          if(ok){status.textContent='Kolor światła ustawiony';stateLabel.textContent='Światło włączone';stateHint.textContent='Jasność i barwę możesz zmieniać poniżej.';toggle.textContent='Wyłącz światło';toggle.setAttribute('aria-label','Wyłącz światło')}
          else status.textContent='Nie udało się zmienić koloru światła'
        });
        colorField.append(colorCaption,colorInput,colorValue);panel.append(colorField)
      }
      const toggle=make('button','velto-modal-control',state.state==='on'?'Wyłącz światło':'Włącz światło');toggle.type='button';toggle.setAttribute('aria-label',toggle.textContent);
      const toggleLock=registerDetailControl(toggle,true);
      toggle.addEventListener('click',async()=>{
        if(toggle.disabled||toggleLock.pending)return;
        const turningOn=stateLabel.textContent!=='Światło włączone';
        status.textContent=turningOn?'Włączanie światła…':'Wyłączanie światła…';
        const ok=await this.runEntityService('light',turningOn?'turn_on':'turn_off',id,turningOn?{brightness_pct:Math.max(1,Math.min(100,Number(slider.value)||1))}:{});
        if(ok){
          stateLabel.textContent=turningOn?'Światło włączone':'Światło wyłączone';stateHint.textContent=turningOn?'Ustaw poziom jasności lub wyłącz światło.':'Wybierz jasność — światło włączy się z wybranym poziomem.';
          toggle.textContent=turningOn?'Wyłącz światło':'Włącz światło';toggle.setAttribute('aria-label',toggle.textContent);status.textContent=turningOn?'Światło włączone':'Światło wyłączone'
        }else status.textContent='Nie udało się zmienić stanu światła'
      });
      controls.append(toggle)
    }
    panel.append(controls);const native=make('button','velto-modal-native','Więcej w Home Assistant');native.type='button';
    native.addEventListener('click',()=>{close();this.dispatchEvent(new CustomEvent('hass-more-info',{detail:{entityId:id},bubbles:true,composed:true}))});
    panel.append(native);backdrop.append(panel);root.append(backdrop);x.focus()
  }
  serviceActionLock(domain,entityId){
    const key=String(domain)+':'+String(entityId);
    let lock=this._serviceActionLocks.get(key);
    if(!lock){lock={pending:false,controls:new Set()};this._serviceActionLocks.set(key,lock)}
    return {key,lock}
  }
  showUncertainServiceNotice(entries){
    if(!Array.isArray(entries)||!entries.length)return;
    if(!(this._serviceActionNoticeEntities instanceof Map))this._serviceActionNoticeEntities=new Map();
    for(const entry of entries){
      const entityId=String(entry?.entityId||'').trim();if(!entityId)continue;
      const label=String(entry?.label||entityId).trim().slice(0,100)||entityId;
      this._serviceActionNoticeEntities.set(entityId,label)
    }
    if(!this._serviceActionNoticeEntities.size)return;
    const labels=[...this._serviceActionNoticeEntities.values()],visible=labels.slice(0,3);
    const summary=visible.join(', ')+(labels.length>3?' i '+(labels.length-3)+' innych':'');
    const message='VELTO utraciło potwierdzenie polecenia dla: '+summary+'. Nie wiadomo, czy urządzenie je wykonało. Sprawdź jego stan przed ponowieniem.';
    let notice=this._serviceActionNotice;
    if(!notice){
      const doc=globalThis.document;if(typeof doc?.createElement!=='function')return;
      notice=doc.createElement('div');notice.className='velto-action-uncertain';
      notice.setAttribute('role','status');notice.setAttribute('aria-live','polite');notice.setAttribute('aria-atomic','true');notice.setAttribute('data-velto-service-uncertain','true');
      const copy=doc.createElement('p');copy.className='velto-action-uncertain-copy';
      const dismiss=doc.createElement('button');dismiss.type='button';dismiss.className='velto-action-uncertain-close';dismiss.textContent='×';dismiss.setAttribute('aria-label','Zamknij komunikat o nieznanym wyniku polecenia');
      dismiss.addEventListener('click',()=>{
        if(this._serviceActionNotice!==notice)return;
        this._serviceActionNotice=null;this._serviceActionNoticeMessage=null;this._serviceActionNoticeEntities.clear();this.scheduleRender()
      });
      notice.append(copy,dismiss);this._serviceActionNotice=notice;this._serviceActionNoticeMessage=copy
    }
    if(this._serviceActionNoticeMessage)this._serviceActionNoticeMessage.textContent=message;
    this.scheduleRender()
  }
  resetServiceActionLocks(){
    const interrupted=[];
    for(const [key,lock] of this._serviceActionLocks){
      if(lock.pending){
        const entityId=key.slice(key.indexOf(':')+1),state=this._hass?.states?.[entityId],friendlyName=state?.attributes?.friendly_name;
        interrupted.push({entityId,label:typeof friendlyName==='string'&&friendlyName.trim()?friendlyName.trim():entityId})
      }
      lock.pending=false;
      for(const control of lock.controls){
        control.removeAttribute?.('aria-busy');control.disabled=!control._veltoEnabled
      }
      lock.controls.clear()
    }
    this._serviceActionLocks.clear();
    for(const tile of this.shadowRoot?.querySelectorAll?.('.tile')||[])tile.removeAttribute?.('aria-busy');
    if(interrupted.length)this.showUncertainServiceNotice(interrupted)
  }
  setEntityActionBusy(domain,entityId,pending,lock=this.serviceActionLock(domain,entityId).lock){
    const key=String(domain)+':'+String(entityId);
    if(this._serviceActionLocks.get(key)!==lock)return;
    for(const control of lock.controls){
      if(pending){control.disabled=true;control.setAttribute('aria-busy','true')}
      else{control.removeAttribute('aria-busy');control.disabled=!control._veltoEnabled}
    }
    for(const tile of this.shadowRoot?.querySelectorAll?.('.tile')||[]){
      if(tile.dataset?.domain!==domain||tile.dataset?.entity!==entityId)continue;
      if(pending)tile.setAttribute('aria-busy','true');else tile.removeAttribute('aria-busy')
    }
  }
  async runEntityService(domain,service,entityId,serviceData={}){
    const hass=this._hass,connection=hass?.connection;
    if(typeof hass?.callService!=='function')return false;
    const {key,lock}=this.serviceActionLock(domain,entityId);
    if(lock.pending)return false;
    lock.pending=true;this.setEntityActionBusy(domain,entityId,true,lock);
    try{
      const payload=serviceData&&typeof serviceData==='object'&&!Array.isArray(serviceData)?serviceData:{};
      await hass.callService(domain,service,{...payload,entity_id:entityId});
      return this._hass?.connection===connection&&this._serviceActionLocks.get(key)===lock
    }catch(error){
      if(this._hass?.connection===connection&&this._serviceActionLocks.get(key)===lock){
        const message=domain==='media_player'?'VELTO media control failed':domain==='vacuum'?'VELTO vacuum control failed':domain==='cover'?'VELTO cover control failed':'VELTO '+domain+'.'+service+' failed';
        console.error(message,error)
      }
      return false
    }finally{
      if(this._serviceActionLocks.get(key)===lock){
        lock.pending=false;this.setEntityActionBusy(domain,entityId,false,lock);this.pruneServiceActionLocks()
      }
    }
  }
  pruneServiceActionLocks(){
    for(const [key,lock] of this._serviceActionLocks){
      lock.controls=new Set([...lock.controls].filter(control=>control.isConnected===true));
      if(!lock.pending&&!lock.controls.size)this._serviceActionLocks.delete(key)
    }
  }
  serviceActionButton(domain,service,iconName,label,entityId,enabled=true){
    const button=document.createElement('button'),{lock}=this.serviceActionLock(domain,entityId);
    button.type='button';button.className='velto-service-control';
    button._veltoEnabled=Boolean(enabled);
    button.setAttribute('aria-label',label);button.title=label;button.disabled=!button._veltoEnabled||lock.pending;
    if(lock.pending)button.setAttribute('aria-busy','true');
    lock.controls.add(button);
    button.append(this.phosphorRoomIcon(iconName));
    button.addEventListener('click',async event=>{
      event?.stopPropagation?.();
      if(button.disabled||!button.isConnected||typeof this._hass?.callService!=='function'||lock.pending)return;
      await this.runEntityService(domain,service,entityId)
    });
    return button
  }
  bindLightTileBrightness(slider,entityId,enabled){
    const {lock}=this.serviceActionLock('light',entityId);
    slider._veltoEnabled=Boolean(enabled);
    slider.disabled=!slider._veltoEnabled||lock.pending;
    if(lock.pending)slider.setAttribute('aria-busy','true');
    lock.controls.add(slider);
    slider.addEventListener('change',async event=>{
      event?.stopPropagation?.();
      if(slider.disabled||!slider.isConnected||typeof this._hass?.callService!=='function')return;
      const value=Number(slider.value);
      if(!Number.isFinite(value)||value<1||value>100)return;
      await this.runEntityService('light','turn_on',entityId,{brightness_pct:value})
    })
  }
  phosphorRoomIcon(name){
    // Official Phosphor regular SVGs, vendored inline to keep HACS fully offline.
    const svgByName=this.constructor._phosphorSvgAssets||(this.constructor._phosphorSvgAssets={"house":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M219.31,108.68l-80-80a16,16,0,0,0-22.62,0l-80,80A15.87,15.87,0,0,0,32,120v96a8,8,0,0,0,8,8h64a8,8,0,0,0,8-8V160h32v56a8,8,0,0,0,8,8h64a8,8,0,0,0,8-8V120A15.87,15.87,0,0,0,219.31,108.68ZM208,208H160V152a8,8,0,0,0-8-8H104a8,8,0,0,0-8,8v56H48V120l80-80,80,80Z\"/></svg>","door-open":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M232,216H208V40a16,16,0,0,0-16-16H64A16,16,0,0,0,48,40V216H24a8,8,0,0,0,0,16H232a8,8,0,0,0,0-16Zm-40,0H176V40h16ZM64,40h96V216H64Zm80,92a12,12,0,1,1-12-12A12,12,0,0,1,144,132Z\"/></svg>","flower":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M210.35,129.36c-.81-.47-1.7-.92-2.62-1.36.92-.44,1.81-.89,2.62-1.36a40,40,0,1,0-40-69.28c-.81.47-1.65,1-2.48,1.59.08-1,.13-2,.13-3a40,40,0,0,0-80,0c0,.94,0,1.94.13,3-.83-.57-1.67-1.12-2.48-1.59a40,40,0,1,0-40,69.28c.81.47,1.7.92,2.62,1.36-.92.44-1.81.89-2.62,1.36a40,40,0,1,0,40,69.28c.81-.47,1.65-1,2.48-1.59-.08,1-.13,2-.13,2.95a40,40,0,0,0,80,0c0-.94-.05-1.94-.13-2.95.83.57,1.67,1.12,2.48,1.59A39.79,39.79,0,0,0,190.29,204a40.43,40.43,0,0,0,10.42-1.38,40,40,0,0,0,9.64-73.28ZM104,128a24,24,0,1,1,24,24A24,24,0,0,1,104,128Zm74.35-56.79a24,24,0,1,1,24,41.57c-6.27,3.63-18.61,6.13-35.16,7.19A40,40,0,0,0,154.53,98.1C163.73,84.28,172.08,74.84,178.35,71.21ZM128,32a24,24,0,0,1,24,24c0,7.24-4,19.19-11.36,34.06a39.81,39.81,0,0,0-25.28,0C108,75.19,104,63.24,104,56A24,24,0,0,1,128,32ZM44.86,80a24,24,0,0,1,32.79-8.79c6.27,3.63,14.62,13.07,23.82,26.89A40,40,0,0,0,88.81,120c-16.55-1.06-28.89-3.56-35.16-7.18A24,24,0,0,1,44.86,80ZM77.65,184.79a24,24,0,1,1-24-41.57c6.27-3.63,18.61-6.13,35.16-7.19a40,40,0,0,0,12.66,21.87C92.27,171.72,83.92,181.16,77.65,184.79ZM128,224a24,24,0,0,1-24-24c0-7.24,4-19.19,11.36-34.06a39.81,39.81,0,0,0,25.28,0C148,180.81,152,192.76,152,200A24,24,0,0,1,128,224Zm83.14-48a24,24,0,0,1-32.79,8.79c-6.27-3.63-14.62-13.07-23.82-26.89A40,40,0,0,0,167.19,136c16.55,1.06,28.89,3.56,35.16,7.18A24,24,0,0,1,211.14,176Z\"/></svg>","lego":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M243.58,72.84,197.29,49.7C191.54,39.24,177.21,32,160,32c-22.43,0-40,12.3-40,28a20.77,20.77,0,0,0,1.06,6.53l-19.52,9.76A53.69,53.69,0,0,0,80,72c-22.43,0-40,12.3-40,28a20.77,20.77,0,0,0,1.06,6.53L12.42,120.84A8,8,0,0,0,8,128v64a8,8,0,0,0,4.42,7.16l64,32a8,8,0,0,0,7.16,0l160-80A8,8,0,0,0,248,144V80A8,8,0,0,0,243.58,72.84ZM80,151.06,33.89,128,51,119.45c7.24,5.29,17.48,8.55,29,8.55,22.43,0,40-12.3,40-28a21.77,21.77,0,0,0-4.35-12.88L131,79.45c7.24,5.29,17.48,8.55,29,8.55,18.38,0,33.49-8.26,38.35-19.88L222.11,80ZM160,48c13.74,0,24,6.34,24,12s-10.26,12-24,12-24-6.34-24-12S146.26,48,160,48ZM80,88c13.74,0,24,6.34,24,12s-10.26,12-24,12c-9.67,0-17.61-3.14-21.47-7a8.29,8.29,0,0,0-.84-.93A6.62,6.62,0,0,1,56,100C56,94.34,66.26,88,80,88ZM24,140.94l48,24v46.12l-48-24Zm64,70.12V164.94l144-72v46.12Z\"/></svg>","armchair":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M216,88.8V72a40,40,0,0,0-40-40H80A40,40,0,0,0,40,72V88.8a40,40,0,0,0,0,78.4V200a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V167.2a40,40,0,0,0,0-78.4ZM80,48h96a24,24,0,0,1,24,24V88.8A40.07,40.07,0,0,0,168,128H88A40.07,40.07,0,0,0,56,88.8V72A24,24,0,0,1,80,48ZM208.39,152H208a8,8,0,0,0-8,8v40H56V160a8,8,0,0,0-8-8h-.39A24,24,0,1,1,72,128v40a8,8,0,0,0,16,0V144h80v24a8,8,0,0,0,16,0V128a24,24,0,1,1,24.39,24Z\"/></svg>","office-chair":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M248,128a8,8,0,0,1-8,8H223.33A48.08,48.08,0,0,1,176,176H136v24h24a32,32,0,0,1,32,32,8,8,0,0,1-16,0,16,16,0,0,0-16-16H136v16a8,8,0,0,1-16,0V216H96a16,16,0,0,0-16,16,8,8,0,0,1-16,0,32,32,0,0,1,32-32h24V176H80a48.08,48.08,0,0,1-47.33-40H16a8,8,0,0,1,0-16H40a8,8,0,0,1,8,8,32,32,0,0,0,32,32h96a32,32,0,0,0,32-32,8,8,0,0,1,8-8h24A8,8,0,0,1,248,128ZM67.91,138.48a16,16,0,0,1-3.75-12.74l13.72-96A16.08,16.08,0,0,1,93.72,16h68.56a16.08,16.08,0,0,1,15.84,13.74l13.72,96A16,16,0,0,1,176,144H80A16,16,0,0,1,67.91,138.48ZM80,128h96L162.28,32H93.71Z\"/></svg>","hard-drives":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M208,136H48a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V152A16,16,0,0,0,208,136Zm0,64H48V152H208v48Zm0-160H48A16,16,0,0,0,32,56v48a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V56A16,16,0,0,0,208,40Zm0,64H48V56H208v48ZM192,80a12,12,0,1,1-12-12A12,12,0,0,1,192,80Zm0,96a12,12,0,1,1-12-12A12,12,0,0,1,192,176Z\"/></svg>","archive":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M224,48H32A16,16,0,0,0,16,64V88a16,16,0,0,0,16,16v88a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V104a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48ZM208,192H48V104H208ZM224,88H32V64H224V88ZM96,136a8,8,0,0,1,8-8h48a8,8,0,0,1,0,16H104A8,8,0,0,1,96,136Z\"/></svg>","cooking-pot":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M88,48V16a8,8,0,0,1,16,0V48a8,8,0,0,1-16,0Zm40,8a8,8,0,0,0,8-8V16a8,8,0,0,0-16,0V48A8,8,0,0,0,128,56Zm32,0a8,8,0,0,0,8-8V16a8,8,0,0,0-16,0V48A8,8,0,0,0,160,56Zm92.8,46.4L224,124v60a32,32,0,0,1-32,32H64a32,32,0,0,1-32-32V124L3.2,102.4a8,8,0,0,1,9.6-12.8L32,104V80a8,8,0,0,1,8-8H216a8,8,0,0,1,8,8v24l19.2-14.4a8,8,0,0,1,9.6,12.8ZM208,88H48v96a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16Z\"/></svg>","bathtub":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M240,96H208a8,8,0,0,0-8-8H136a8,8,0,0,0-8,8H64V52A12,12,0,0,1,76,40a12.44,12.44,0,0,1,12.16,9.59,8,8,0,0,0,15.68-3.18A28.32,28.32,0,0,0,76,24,28,28,0,0,0,48,52V96H16a8,8,0,0,0-8,8v40a56.06,56.06,0,0,0,56,56v16a8,8,0,0,0,16,0V200h96v16a8,8,0,0,0,16,0V200a56.06,56.06,0,0,0,56-56V104A8,8,0,0,0,240,96Zm-48,8v32H144V104Zm40,40a40,40,0,0,1-40,40H64a40,40,0,0,1-40-40V112H128v32a8,8,0,0,0,8,8h64a8,8,0,0,0,8-8V112h24Z\"/></svg>","bed":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M216,72H32V48a8,8,0,0,0-16,0V208a8,8,0,0,0,16,0V176H240v32a8,8,0,0,0,16,0V112A40,40,0,0,0,216,72ZM32,88h72v72H32Zm88,72V88h96a24,24,0,0,1,24,24v48Z\"/></svg>","garage":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M240,192h-8V98.67a16,16,0,0,0-7.12-13.31l-88-58.67a16,16,0,0,0-17.75,0l-88,58.67A16,16,0,0,0,24,98.67V192H16a8,8,0,0,0,0,16H240a8,8,0,0,0,0-16ZM40,98.67,128,40l88,58.66V192H192V136a8,8,0,0,0-8-8H72a8,8,0,0,0-8,8v56H40ZM176,144v16H136V144Zm-56,16H80V144h40ZM80,176h40v16H80Zm56,0h40v16H136Z\"/></svg>","thermometer":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M212,56a28,28,0,1,0,28,28A28,28,0,0,0,212,56Zm0,40a12,12,0,1,1,12-12A12,12,0,0,1,212,96Zm-84,57V88a8,8,0,0,0-16,0v65a32,32,0,1,0,16,0Zm-8,47a16,16,0,1,1,16-16A16,16,0,0,1,120,200Zm40-66V48a40,40,0,0,0-80,0v86a64,64,0,1,0,80,0Zm-40,98a48,48,0,0,1-27.42-87.4A8,8,0,0,0,96,138V48a24,24,0,0,1,48,0v90a8,8,0,0,0,3.42,6.56A48,48,0,0,1,120,232Z\"/></svg>","lightbulb":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M176,232a8,8,0,0,1-8,8H88a8,8,0,0,1,0-16h80A8,8,0,0,1,176,232Zm40-128a87.55,87.55,0,0,1-33.64,69.21A16.24,16.24,0,0,0,176,186v6a16,16,0,0,1-16,16H96a16,16,0,0,1-16-16v-6a16,16,0,0,0-6.23-12.66A87.59,87.59,0,0,1,40,104.49C39.74,56.83,78.26,17.14,125.88,16A88,88,0,0,1,216,104Zm-16,0a72,72,0,0,0-73.74-72c-39,.92-70.47,33.39-70.26,72.39a71.65,71.65,0,0,0,27.64,56.3A32,32,0,0,1,96,186v6h64v-6a32.15,32.15,0,0,1,12.47-25.35A71.65,71.65,0,0,0,200,104Zm-16.11-9.34a57.6,57.6,0,0,0-46.56-46.55,8,8,0,0,0-2.66,15.78c16.57,2.79,30.63,16.85,33.44,33.45A8,8,0,0,0,176,104a9,9,0,0,0,1.35-.11A8,8,0,0,0,183.89,94.66Z\"/></svg>","fan":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M233,135a60,60,0,0,0-89.62-35.45l16.39-65.44a8,8,0,0,0-3.45-8.68A60,60,0,1,0,95.69,128.91L30.82,147.44a8,8,0,0,0-5.8,7.32,60,60,0,0,0,44.42,60.66,60.52,60.52,0,0,0,15.62,2.07,60.07,60.07,0,0,0,59.88-62l48.48,46.92a8,8,0,0,0,9.25,1.35A60,60,0,0,0,233,135Zm-121-7a16,16,0,1,1,16,16A16,16,0,0,1,112,128ZM80,76a44,44,0,0,1,62.75-39.82L127.77,96A32,32,0,0,0,99.85,112.8,43.85,43.85,0,0,1,80,76Zm27,119.57a44,44,0,0,1-65.86-34.43l59.31-16.94A32,32,0,0,0,128,160l.91,0A43.82,43.82,0,0,1,107,195.57Zm106.17-23a43.92,43.92,0,0,1-13,14.14l-44.32-42.89a31.91,31.91,0,0,0-.59-32.57,44,44,0,0,1,57.91,61.32Z\"/></svg>","lock-key":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M128,112a28,28,0,0,0-8,54.83V184a8,8,0,0,0,16,0V166.83A28,28,0,0,0,128,112Zm0,40a12,12,0,1,1,12-12A12,12,0,0,1,128,152Zm80-72H176V56a48,48,0,0,0-96,0V80H48A16,16,0,0,0,32,96V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80ZM96,56a32,32,0,0,1,64,0V80H96ZM208,208H48V96H208V208Z\"/></svg>","drop":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M174,47.75a254.19,254.19,0,0,0-41.45-38.3,8,8,0,0,0-9.18,0A254.19,254.19,0,0,0,82,47.75C54.51,79.32,40,112.6,40,144a88,88,0,0,0,176,0C216,112.6,201.49,79.32,174,47.75ZM128,216a72.08,72.08,0,0,1-72-72c0-57.23,55.47-105,72-118,16.53,13,72,60.75,72,118A72.08,72.08,0,0,1,128,216Zm55.89-62.66a57.6,57.6,0,0,1-46.56,46.55A8.75,8.75,0,0,1,136,200a8,8,0,0,1-1.32-15.89c16.57-2.79,30.63-16.85,33.44-33.45a8,8,0,0,1,15.78,2.68Z\"/></svg>","footprints":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M208.06,184H152a8,8,0,0,0-8,8v12a36,36,0,0,0,72.05,0V192A8,8,0,0,0,208.06,184Zm-8,20a20,20,0,0,1-40,0v-4h40ZM104,160h-56a8,8,0,0,0-8,8v12A36,36,0,0,0,112,180V168A8,8,0,0,0,104,160Zm-8,20a20,20,0,0,1-40,0v-4H96ZM76,16C64.36,16,53.07,26.31,44.2,45c-13.93,29.38-18.56,73,.29,96a8,8,0,0,0,6.2,2.93h50.55a8,8,0,0,0,6.2-2.93c18.85-23,14.22-66.65.29-96C98.85,26.31,87.57,16,76,16ZM97.15,128H54.78c-11.4-18.1-7.21-52.7,3.89-76.11C65.14,38.22,72.17,32,76,32s10.82,6.22,17.3,19.89C104.36,75.3,108.55,109.9,97.15,128Zm57.61,40h50.55a8,8,0,0,0,6.2-2.93c18.85-23,14.22-66.65.29-96C202.93,50.31,191.64,40,180,40s-22.89,10.31-31.77,29c-13.93,29.38-18.56,73,.29,96A8.05,8.05,0,0,0,154.76,168Zm8-92.11C169.22,62.22,176.25,56,180,56s10.82,6.22,17.29,19.89c11.1,23.41,15.29,58,3.9,76.11H158.85C147.45,133.9,151.64,99.3,162.74,75.89Z\"/></svg>","app-window":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,160H40V56H216V200ZM80,84A12,12,0,1,1,68,72,12,12,0,0,1,80,84Zm40,0a12,12,0,1,1-12-12A12,12,0,0,1,120,84Z\"/></svg>","plug":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M237.66,66.34a8,8,0,0,0-11.32,0L192,100.69,155.31,64l34.35-34.34a8,8,0,1,0-11.32-11.32L144,52.69,117.66,26.34a8,8,0,0,0-11.32,11.32L112.69,44l-53,53a40,40,0,0,0,0,56.57l15.71,15.71L26.34,218.34a8,8,0,0,0,11.32,11.32l49.09-49.09,15.71,15.71a40,40,0,0,0,56.57,0l53-53,6.34,6.35a8,8,0,0,0,11.32-11.32L203.31,112l34.35-34.34A8,8,0,0,0,237.66,66.34ZM147.72,185a24,24,0,0,1-33.95,0L71,142.23a24,24,0,0,1,0-33.95l53-53L200.69,132Z\"/></svg>","leaf":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M223.45,40.07a8,8,0,0,0-7.52-7.52C139.8,28.08,78.82,51,52.82,94a87.09,87.09,0,0,0-12.76,49c.57,15.92,5.21,32,13.79,47.85l-19.51,19.5a8,8,0,0,0,11.32,11.32l19.5-19.51C81,210.73,97.09,215.37,113,215.94q1.67.06,3.33.06A86.93,86.93,0,0,0,162,203.18C205,177.18,227.93,116.21,223.45,40.07ZM153.75,189.5c-22.75,13.78-49.68,14-76.71.77l88.63-88.62a8,8,0,0,0-11.32-11.32L65.73,179c-13.19-27-13-54,.77-76.71,22.09-36.47,74.6-56.44,141.31-54.06C210.2,114.89,190.22,167.41,153.75,189.5Z\"/></svg>","play":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M232.4,114.49,88.32,26.35a16,16,0,0,0-16.2-.3A15.86,15.86,0,0,0,64,39.87V216.13A15.94,15.94,0,0,0,80,232a16.07,16.07,0,0,0,8.36-2.35L232.4,141.51a15.81,15.81,0,0,0,0-27ZM80,215.94V40l143.83,88Z\"/></svg>","pause":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M200,32H160a16,16,0,0,0-16,16V208a16,16,0,0,0,16,16h40a16,16,0,0,0,16-16V48A16,16,0,0,0,200,32Zm0,176H160V48h40ZM96,32H56A16,16,0,0,0,40,48V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V48A16,16,0,0,0,96,32Zm0,176H56V48H96Z\"/></svg>","skip-back":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M199.81,34a16,16,0,0,0-16.24.43L64,109.23V40a8,8,0,0,0-16,0V216a8,8,0,0,0,16,0V146.77l119.57,74.78A15.95,15.95,0,0,0,208,208.12V47.88A15.86,15.86,0,0,0,199.81,34ZM192,208,64.16,128,192,48.07Z\"/></svg>","skip-forward":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M200,32a8,8,0,0,0-8,8v69.23L72.43,34.45A15.95,15.95,0,0,0,48,47.88V208.12a16,16,0,0,0,24.43,13.43L192,146.77V216a8,8,0,0,0,16,0V40A8,8,0,0,0,200,32ZM64,207.93V48.05l127.84,80Z\"/></svg>","television":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M216,64H147.31l34.35-34.34a8,8,0,1,0-11.32-11.32L128,60.69,85.66,18.34A8,8,0,0,0,74.34,29.66L108.69,64H40A16,16,0,0,0,24,80V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V80A16,16,0,0,0,216,64ZM40,80H144V200H40ZM216,200H160V80h56V200Zm-16-84a12,12,0,1,1-12-12A12,12,0,0,1,200,116Zm0,48a12,12,0,1,1-12-12A12,12,0,0,1,200,164Z\"/></svg>","monitor-play":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M208,40H48A24,24,0,0,0,24,64V176a24,24,0,0,0,24,24H208a24,24,0,0,0,24-24V64A24,24,0,0,0,208,40Zm8,136a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V64a8,8,0,0,1,8-8H208a8,8,0,0,1,8,8Zm-48,48a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,224Zm-3.56-110.66-48-32A8,8,0,0,0,104,88v64a8,8,0,0,0,12.44,6.66l48-32a8,8,0,0,0,0-13.32ZM120,137.05V103l25.58,17Z\"/></svg>","arrow-up":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M128 32a8 8 0 0 1 5.66 2.34l56 56a8 8 0 0 1-11.32 11.32L136 59.31V216a8 8 0 0 1-16 0V59.31L77.66 101.66a8 8 0 0 1-11.32-11.32l56-56A8 8 0 0 1 128 32Z\"/></svg>","arrow-down":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M128 224a8 8 0 0 1-5.66-2.34l-56-56a8 8 0 0 1 11.32-11.32L120 196.69V40a8 8 0 0 1 16 0v156.69l42.34-42.35a8 8 0 0 1 11.32 11.32l-56 56A8 8 0 0 1 128 224Z\"/></svg>","stop":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M72 56h112a16 16 0 0 1 16 16v112a16 16 0 0 1-16 16H72a16 16 0 0 1-16-16V72a16 16 0 0 1 16-16Z\"/></svg>","hash":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M224,88H175.4l8.47-46.57a8,8,0,0,0-15.74-2.86l-9,49.43H111.4l8.47-46.57a8,8,0,0,0-15.74-2.86L95.14,88H48a8,8,0,0,0,0,16H92.23L83.5,152H32a8,8,0,0,0,0,16H80.6l-8.47,46.57a8,8,0,0,0,6.44,9.3A7.79,7.79,0,0,0,80,224a8,8,0,0,0,7.86-6.57l9-49.43H144.6l-8.47,46.57a8,8,0,0,0,6.44,9.3A7.79,7.79,0,0,0,144,224a8,8,0,0,0,7.86-6.57l9-49.43H208a8,8,0,0,0,0-16H163.77l8.73-48H224a8,8,0,0,0,0-16Zm-76.5,64H99.77l8.73-48h47.73Z\"/></svg>","timer":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M128,40a96,96,0,1,0,96,96A96.11,96.11,0,0,0,128,40Zm0,176a80,80,0,1,1,80-80A80.09,80.09,0,0,1,128,216ZM173.66,90.34a8,8,0,0,1,0,11.32l-40,40a8,8,0,0,1-11.32-11.32l40-40A8,8,0,0,1,173.66,90.34ZM96,16a8,8,0,0,1,8-8h48a8,8,0,0,1,0,16H104A8,8,0,0,1,96,16Z\"/></svg>"});
    const aliases={home:'house',sun:'door-open',door:'door-open',leaf:'flower',toy:'lego',sofa:'armchair',briefcase:'office-chair',server:'hard-drives',archive:'archive',plug:'cooking-pot',water:'bathtub',light:'bed',climate:'thermometer',garage:'garage',garden:'flower'};
    const asset=svgByName[aliases[name]||name]||(name==='text-t'?'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M208,56V88a8,8,0,0,1-16,0V64H136V192h24a8,8,0,0,1,0,16H96a8,8,0,0,1,0-16h24V64H64V88a8,8,0,0,1-16,0V56a8,8,0,0,1,8-8H200A8,8,0,0,1,208,56Z"/></svg>':null);
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
    const cached=this._iconTemplateCache.get(name);if(cached)return cached.cloneNode(true);
    const paths=this._iconPathDefinitions||(this._iconPathDefinitions={
      trash:['path|M3 6h18','path|M8 6V4h8v2','path|M19 6l-1 14H6L5 6','path|M10 11v5','path|M14 11v5'],
      recycle:['path|M12 3l3 5h-3','path|M15 8a7 7 0 0 1 5 5','path|M20 13l-1 4-4-1','path|M19 17a7 7 0 0 1-7 4','path|M12 21l-3-3 3-2','path|M9 18a7 7 0 0 1-4-7','path|M5 11l1-4 4 1','path|M6 7a7 7 0 0 1 6-4'],
      eye:['path|M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z','circle|12 12 3'],
      'eye-slash':['path|M3 3l18 18','path|M10.6 10.6a2 2 0 0 0 2.8 2.8','path|M9.9 5.2A10.9 10.9 0 0 1 12 5c6.4 0 10 7 10 7a15.7 15.7 0 0 1-3.1 3.8','path|M6.6 6.6C3.7 8.3 2 12 2 12s3.6 7 10 7c1.2 0 2.3-.2 3.3-.6'],
      'caret-down':['path|m6 9 6 6 6-6'],
      'caret-up':['path|m6 15 6-6 6 6'],
      'arrow-clockwise':['path|M20 7v5h-5','path|M20 12a8 8 0 1 0 1 4'],
      expand:['path|M3 8V3h5','path|M3 3l5 5','path|M16 3h5v5','path|M21 3l-5 5','path|M3 16v5h5','path|M3 21l5-5','path|M21 16v5h-5','path|M21 21l-5-5'],
      compress:['path|M8 3v5H3','path|M8 8 3 3','path|M16 3v5h5','path|M16 8l5-5','path|M8 21v-5H3','path|M8 16l-5 5','path|M16 21v-5h5','path|M16 16l5 5'],
      'grid-four':['rect|4 4 6 6 1','rect|14 4 6 6 1','rect|4 14 6 6 1','rect|14 14 6 6 1'],
      check:['path|M5 12l4 4L19 6'],
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
      calendar:['rect|4 4 16 17 2','path|M8 2v4','path|M16 2v4','path|M4 9h16','path|M8 13h2','path|M14 13h2','path|M8 17h2'],
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
    });
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
    this._iconTemplateCache.set(name,svg.cloneNode(true));return svg
  }
  phosphorTileIcon(name){return this.phosphorRoomIcon(VELTO_PHOSPHOR_TILE_ALIASES[name]||name)}
  tileIconOverride(item){return typeof item?.icon==='string'&&VELTO_TILE_ICON_NAMES.has(item.icon)?item.icon:null}
  iconFor(id,state){
    const domain=id.split('.')[0],cls=state?.attributes?.device_class;
    if(cls==='motion'||cls==='occupancy')return 'motion';
    if(cls==='door'||cls==='opening')return 'door';
    if(cls==='window')return 'window';
    if(cls==='moisture'||cls==='water')return 'water';
    if(cls==='smoke'||cls==='gas'||cls==='carbon_monoxide')return 'smoke';
    if(cls==='temperature')return 'climate';
    if(cls==='humidity'||cls==='pressure')return 'weather';
    if(cls==='power'||cls==='energy'||cls==='current'||cls==='voltage')return 'plug';
    return ({light:'light',switch:'switch',fan:'fan',cover:'cover',lock:'lock',climate:'climate',sensor:'sensor',binary_sensor:'binary_sensor',scene:'scene',camera:'camera',input_boolean:'input_boolean',media_player:'media_player',vacuum:'vacuum',script:'script',button:'button',input_button:'button',automation:'automation',humidifier:'humidifier',water_heater:'water_heater',valve:'valve',alarm_control_panel:'alarm_control_panel',remote:'remote',number:'number',input_number:'number',select:'select',input_select:'select',input_datetime:'calendar',input_text:'input_text',counter:'hash',timer:'timer',weather:'weather',sun:'sun'})[domain]||'generic'
  }
  captureScrollState(root=this.shadowRoot){
    const ancestors=[];
    for(let node=this;node;node=node.parentNode||node.host){
      if(node.scrollTop>0||node.scrollLeft>0)ancestors.push([node,node.scrollTop,node.scrollLeft])
    }
    const keyed=[];
    for(const node of root?.querySelectorAll?.('[data-velto-scroll-key]')||[]){
      const key=node.getAttribute?.('data-velto-scroll-key');
      if(key&&(node.scrollTop>0||node.scrollLeft>0))keyed.push([key,node.scrollTop,node.scrollLeft])
    }
    return {ancestors,keyed,pageX:globalThis.scrollX||0,pageY:globalThis.scrollY||0}
  }
  restoreScrollState(root,state){
    if(!state)return;
    for(const [node,top,left] of state.ancestors||[]){node.scrollTop=top;node.scrollLeft=left}
    const keyedNodes=new Map();
    for(const node of root?.querySelectorAll?.('[data-velto-scroll-key]')||[]){
      const key=node.getAttribute?.('data-velto-scroll-key');
      if(key&&!keyedNodes.has(key))keyedNodes.set(key,node)
    }
    for(const [key,top,left] of state.keyed||[]){
      const node=keyedNodes.get(key);
      if(node){node.scrollTop=top;node.scrollLeft=left}
    }
    if((globalThis.scrollY||0)!==state.pageY&&typeof globalThis.scrollTo==='function')globalThis.scrollTo(state.pageX,state.pageY)
  }
  reuseEqualKeyedNodes(previous,next){
    if(!previous||!next)return 0;
    const oldNodes=new Map();
    for(const node of previous.querySelectorAll?.('[data-velto-reuse-key]')||[]){
      const key=node.getAttribute?.('data-velto-reuse-key');
      if(key&&!oldNodes.has(key))oldNodes.set(key,node)
    }
    let reused=0;
    const freshNodes=[...(next.querySelectorAll?.('[data-velto-reuse-key]')||[])];
    for(const fresh of freshNodes){
      if(next.contains&&!next.contains(fresh))continue;
      const key=fresh.getAttribute?.('data-velto-reuse-key'),old=key?oldNodes.get(key):null;
      if(!old||typeof fresh.replaceWith!=='function')continue;
      const visible=old.getAttribute?.('data-velto-visible')??null;
      if(visible!==null)old.removeAttribute('data-velto-visible');
      const equal=old.isEqualNode?.(fresh)===true;
      if(visible!==null)old.setAttribute('data-velto-visible',visible);
      if(!equal)continue;
      fresh.replaceWith(old);reused++
    }
    return reused
  }
  syncRenderAttributes(previous,next){
    const nextNames=new Set(next?.getAttributeNames?.()||[]);
    for(const name of previous?.getAttributeNames?.()||[])if(!nextNames.has(name)&&name!=='data-velto-visible')previous.removeAttribute(name);
    for(const name of nextNames){const value=next.getAttribute(name);if(previous.getAttribute(name)!==value)previous.setAttribute(name,value)}
  }
  patchRenderElement(previous,next){
    if(!previous||!next)return next||previous;
    if(previous.isEqualNode?.(next))return previous;
    this.reuseEqualKeyedNodes(previous,next);
    this.syncRenderAttributes(previous,next);
    const desired=Array.from(next.childNodes||[]),current=Array.from(previous.childNodes||[]);
    if(current.length!==desired.length||current.some((node,index)=>node!==desired[index]))previous.replaceChildren(...desired);
    return previous
  }
  commitRenderTree(root,css,shell,openDialog){
    const previousShell=root.querySelector?.('.layout');
    if(previousShell){
      if(previousShell.isEqualNode?.(shell))shell=previousShell;
      else{
        const previousSidebar=previousShell.querySelector?.('.sidebar'),nextSidebar=shell.querySelector?.('.sidebar');
        const previousMain=previousShell.querySelector?.('.main'),nextMain=shell.querySelector?.('.main');
        const sidebar=this.patchRenderElement(previousSidebar,nextSidebar),main=this.patchRenderElement(previousMain,nextMain);
        this.syncRenderAttributes(previousShell,shell);
        const desired=[sidebar,main].filter(Boolean),current=Array.from(previousShell.childNodes||[]);
        if(current.length!==desired.length||current.some((node,index)=>node!==desired[index]))previousShell.replaceChildren(...desired);
        shell=previousShell
      }
    }
    const desired=[css,...(this._serviceActionNotice?[this._serviceActionNotice]:[]),shell,...(openDialog?[openDialog]:[]),...(this._layoutLiveRegion?[this._layoutLiveRegion]:[])],current=Array.from(root.childNodes||[]);
    if(current.length!==desired.length||current.some((node,index)=>node!==desired[index]))root.replaceChildren(...desired);
    return shell
  }
  render(){
    if(this.isConnected===true&&globalThis.document?.hidden===true){this._renderPending=true;return}
    const root=this.shadowRoot;if(!root)return;const openDialog=root.querySelector?.('.velto-modal-backdrop');const activeElement=root.activeElement;const dialogFocus=openDialog&&activeElement&&openDialog.contains?.(activeElement)?activeElement:null;const focusKey=activeElement?.getAttribute?.('data-velto-focus-key')||null;const scrollState=this.captureScrollState(root);
    let css=this._styleElement;if(!css){css=document.createElement('style');css.textContent=`

.velto-modal-backdrop{position:fixed;inset:0;z-index:9999;background:#17120dc4;display:grid;place-items:center;padding:18px}.velto-modal{width:min(440px,100%);max-height:85vh;overflow:auto;background:#eeeae2;color:#352f29;border-radius:26px;padding:24px;box-shadow:0 24px 70px #0007}.velto-modal-head{display:flex;justify-content:space-between;align-items:start;gap:16px}.velto-modal-heading small{font-size:11px;letter-spacing:.14em;color:#96774b}.velto-modal-heading h2{font-size:23px;margin:6px 0}.velto-modal-close{border:0;background:#fff9;border-radius:12px;font-size:28px;width:40px;height:40px;cursor:pointer}.velto-modal-status,.velto-modal-meta{color:#82776a;font-size:13px}.velto-modal-warning{color:#8a4f0f;background:linear-gradient(145deg,#fff4dc,#f9e8c3);border:1px solid #e8c88f;border-radius:12px;padding:10px 12px;line-height:1.45}.velto-action-uncertain{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin:0 0 12px;padding:12px 14px;border:1px solid #e8c88f;border-radius:16px;background:linear-gradient(145deg,#fff4dc,#f9e8c3);color:#74470f;font-size:12px;line-height:1.5;box-shadow:0 3px 10px #6f4c1820}.velto-action-uncertain-copy{margin:0;min-width:0;overflow-wrap:anywhere}.velto-action-uncertain-close{flex:none;min-width:36px;min-height:36px;padding:6px 10px;border:1px solid #d6b77e;border-radius:10px;background:#fff9;color:#76501d;font:inherit;font-size:20px;font-weight:700;line-height:1;cursor:pointer}.velto-action-uncertain-close:focus-visible{outline:2px solid #e99524;outline-offset:3px}.dark .velto-action-uncertain{background:linear-gradient(145deg,#493a25,#383027);border-color:#8d7044;color:#f0d6a7}.dark .velto-action-uncertain-close{background:#3b4149;color:#efc784;border-color:#8d7044}@media(max-width:600px){.velto-action-uncertain{margin-bottom:10px;padding:11px 12px}}.velto-modal-camera{display:block;width:100%;max-height:320px;object-fit:contain;border-radius:16px;background:#24211e;margin:16px auto}.velto-modal-art{display:block;width:100%;max-height:220px;object-fit:contain;border-radius:16px;margin:16px auto;background:#ded7cd}.velto-modal-title{font-weight:750;margin-top:20px;overflow-wrap:anywhere}.velto-button-hero{display:grid;gap:8px;padding:18px;margin:14px 0;border:1px solid #fff9;border-radius:18px;background:linear-gradient(145deg,#f8f5ee,#e9e2d6);box-shadow:inset 2px 2px 5px #c9c0b366,inset -3px -3px 7px #fff9}.velto-button-last-time{font-size:14px;font-weight:750;color:#795628;font-variant-numeric:tabular-nums}.velto-counter-hero{display:grid;justify-items:center;gap:8px;padding:22px;margin:14px 0;border:1px solid #fff9;border-radius:20px;background:linear-gradient(145deg,#f8f5ee,#e9e2d6);box-shadow:inset 2px 2px 5px #c9c0b366,inset -3px -3px 7px #fff9}.velto-counter-value{font-size:clamp(36px,11vw,52px);font-weight:800;line-height:1;letter-spacing:-.05em;color:#795628;font-variant-numeric:tabular-nums}.velto-counter-meta{font-size:12px;color:#82776a;text-align:center}.velto-modal-controls{display:flex;flex-wrap:wrap;gap:9px;margin:22px 0}.velto-modal-control,.velto-modal-native{border:1px solid #d4c5af;background:#faf5ec;border-radius:13px;padding:12px 15px;color:#795628;font-weight:700;cursor:pointer}.velto-modal-control:disabled{opacity:.4;cursor:not-allowed}.velto-modal-native{width:100%;background:transparent}.velto-modal-track{height:6px;background:#d4cab9;border-radius:9px;margin:14px 0;overflow:hidden}.velto-modal-track-fill{display:block;height:100%;background:#e99524}.velto-modal-slider{display:block;width:100%;min-height:32px;accent-color:#e99524;margin-top:10px;touch-action:pan-x}.velto-modal-field{display:grid;gap:7px;margin:14px 0;color:#82776a;font-size:12px;line-height:1.4}.velto-modal-select{display:block;width:100%;min-height:44px;padding:10px 12px;border:1px solid #d4c5af;border-radius:12px;background:#faf5ec;color:#795628;font:inherit}.velto-modal-date,.velto-modal-time,.velto-modal-text{display:block;width:100%;min-height:44px;padding:10px 12px;border:1px solid #d4c5af;border-radius:12px;background:#faf5ec;color:#795628;font:inherit}.velto-modal-select:focus-visible,.velto-modal-slider:focus-visible,.velto-modal-date:focus-visible,.velto-modal-time:focus-visible,.velto-modal-text:focus-visible{outline:2px solid #e99524;outline-offset:3px}.velto-modal-control{min-height:44px}.velto-light-modal{width:min(500px,100%);padding:26px;background:linear-gradient(145deg,#f4f0e8,#e7e1d7);border:1px solid #fff9}.velto-light-hero{display:flex;align-items:center;gap:15px;padding:17px;margin:8px 0 18px;border:1px solid #fff9;border-radius:20px;background:linear-gradient(145deg,#f8f5ee,#e9e2d6);box-shadow:inset 2px 2px 5px #c9c0b366,inset -3px -3px 7px #fff9}.velto-light-icon{width:58px;height:58px;flex:none;display:grid;place-items:center;border-radius:18px;background:linear-gradient(145deg,#fff1d3,#e8c88f);color:#9b671e;box-shadow:4px 5px 10px #b9a98a66,-3px -3px 8px #fff9}.velto-light-icon svg{width:31px;height:31px}.velto-light-summary{display:grid;gap:5px;min-width:0}.velto-light-summary strong{font-size:16px;letter-spacing:-.02em}.velto-light-summary small{font-size:12px;line-height:1.4;color:#82776a}.velto-light-brightness{padding:18px 18px 16px;border-radius:19px;background:#e9e4db;border:1px solid #fff9;box-shadow:inset 2px 2px 6px #c7beb166,inset -3px -3px 7px #fff9}.velto-light-brightness-head{display:flex;align-items:center;justify-content:space-between;gap:12px}.velto-light-brightness-label{font-size:12px;font-weight:750;color:#776b5b}.velto-light-value{font-size:27px;line-height:1;font-weight:800;letter-spacing:-.06em;font-variant-numeric:tabular-nums;color:#9a671f}.velto-light-slider{display:block;width:100%;height:9px;margin:19px 0 5px;accent-color:#e99524;cursor:pointer;touch-action:pan-x}.velto-light-slider:focus-visible{outline:2px solid #e99524;outline-offset:5px}.velto-light-range-hint{display:flex;justify-content:space-between;font-size:10px;color:#918679}.velto-light-modal .velto-modal-controls{margin:16px 0 12px}.velto-light-modal .velto-modal-control{flex:1;min-height:46px;background:linear-gradient(145deg,#fff1d3,#e8c88f);border:1px solid #e5c58d;color:#80551c;box-shadow:3px 4px 8px #b9a98a55,-2px -2px 7px #fff9}.velto-light-modal .velto-modal-native{border-color:#d4c9b9;color:#82776a}.velto-light-modal .velto-modal-status{min-height:18px;margin:0 0 8px;font-size:11px}.velto-light-temperature .velto-light-slider{background:linear-gradient(90deg,#f3a25e,#ffe6b2,#fff,#c8e3ff);border-radius:999px}.velto-light-color-field{display:flex;align-items:center;gap:12px;margin-top:12px;padding:12px 15px;border:1px solid #fff9;border-radius:16px;background:linear-gradient(145deg,#f8f5ee,#e9e2d6);box-shadow:inset 2px 2px 5px #c9c0b366,inset -3px -3px 7px #fff9}.velto-light-color-caption{font-size:12px;font-weight:750;color:#776b5b;flex:1}.velto-light-color-input{width:52px;height:44px;min-width:52px;padding:3px;border:1px solid #d6c7b0;border-radius:12px;background:#fff;cursor:pointer}.velto-light-color-input:focus-visible{outline:2px solid #e99524;outline-offset:3px}.velto-light-color-value{min-width:76px;text-align:right;font:700 11px ui-monospace,monospace;color:#81776b}.dark .velto-light-color-field{background:linear-gradient(145deg,#353a40,#292e34);border-color:#555b62;box-shadow:inset 2px 2px 5px #171a1e,inset -2px -2px 6px #4b5159}.dark .velto-light-color-caption,.dark .velto-light-color-value{color:#d2c8b8}.dark .velto-light-color-input{background:#24282e;border-color:#6c7077}

:host{display:block;container-type:inline-size;min-width:0;color:#342f29;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
*{box-sizing:border-box}.layout{display:grid;grid-template-columns:205px minmax(0,1fr);gap:22px;min-height:540px;padding:20px;border-radius:30px;background:#eae7e0;box-shadow:9px 12px 28px #0002}
.sidebar{display:flex;flex-direction:column;gap:16px;border-right:1px solid #d3cec5;padding:12px 18px 12px 0}.brand{font-weight:850;font-size:26px;letter-spacing:-.07em}.brand span{color:#e99524}.sidebar .home-state{font-size:12px;line-height:1.5;padding:10px;border-radius:12px}.sidebar .overview{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:5px}.sidebar .overview span{font-size:10px;padding:7px 5px;white-space:normal}.sidebar .room-context{padding:9px;min-width:0}.sidebar .room-context-row,.sidebar .room-filters,.sidebar .room-actions{display:flex;flex-wrap:wrap;gap:5px}.sidebar .room-filter,.sidebar .room-quick{font-size:11px;padding:7px 8px}.sidebar .active-filter{font-size:11px;text-align:left;white-space:normal}.sidebar-collapsed .home-state,.sidebar-collapsed .overview,.sidebar-collapsed .room-context,.sidebar-collapsed .active-filter{display:none}.brand-row{display:flex;align-items:center;justify-content:space-between;gap:6px}.sidebar-collapse{border:1px solid #d5b989;border-radius:11px;background:#fff8ed;color:#ad6a15;cursor:pointer;min-width:30px;min-height:32px;font-size:22px}.layout.sidebar-collapsed{grid-template-columns:78px minmax(0,1fr)}.sidebar-collapsed .brand{font-size:17px}.sidebar-collapsed .brand-row{flex-direction:column;align-items:center}.sidebar-collapsed .nav button{font-size:0;display:flex;justify-content:center;padding:12px 5px}.sidebar-collapsed .nav-count,.sidebar-collapsed .nav-active,.sidebar-collapsed .sidebar-note{display:none}.nav{display:flex;flex-direction:column;gap:7px}
.nav button{border:0;background:transparent;text-align:left;border-radius:14px;padding:12px 13px;font:600 13px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;cursor:pointer;color:#736a5e;transition:background .2s;display:flex;align-items:center;gap:10px;white-space:nowrap}.nav svg{width:18px;height:18px;flex:none}.nav ha-icon{--mdc-icon-size:18px;width:18px;height:18px;flex:none;display:inline-flex;align-items:center;justify-content:center}
.nav button.selected{background:#f7f2e9;color:#8c5c21;box-shadow:inset 2px 2px 5px #c9c0b3, inset -2px -2px 5px #fff}.nav-count{margin-left:auto;font-size:10px;font-variant-numeric:tabular-nums;color:#897b67;background:#ffffff70;padding:3px 6px;border-radius:8px;min-width:22px;text-align:center}.nav-active{width:6px;height:6px;border-radius:50%;background:#e99524;box-shadow:0 0 0 3px #e9952426;flex:none}.nav button.selected .nav-count{color:#85571f;background:#e9952420}
.nav button:focus-visible,.tile:focus-visible,.brightness:focus-visible{outline:2px solid #e99524;outline-offset:2px}.nav button:hover:not(.selected){background:#ffffff70}.nav button{min-height:42px}
.sidebar-note{margin-top:auto;font-size:11px;line-height:1.5;color:#908679}
:host(:fullscreen){display:block;width:100vw;height:100vh;height:100dvh;min-height:100vh;min-height:100dvh;overflow:auto;overscroll-behavior:contain;background:transparent}:host(:fullscreen) .layout{display:grid;width:100%;min-height:100vh;min-height:100dvh;height:auto;max-width:none;margin:0;border-radius:0;box-shadow:none}
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
.section-head{display:flex;justify-content:space-between;align-items:center;margin:22px 0 12px;gap:10px}.active-filter{display:inline-flex;align-items:center;border:1px solid #d5c5a8;background:#f7f2e9;color:#785c31;border-radius:12px;padding:9px 13px;margin:0 0 15px;font:650 12px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;cursor:pointer}.active-filter.selected{background:#e99524;color:#fff;border-color:#e99524}.active-filter:focus-visible{outline:2px solid #e99524;outline-offset:3px}.dark .active-filter{background:#39332b;color:#edc890;border-color:#6b563b}.dark .active-filter.selected{background:#e99524;color:#1e1913}.room-context{display:grid;gap:10px;margin:0 0 16px;padding:12px;border-radius:17px;background:#f5f1e9;border:1px solid #ffffffa0}.room-context-row,.room-filters,.room-actions{display:flex;gap:7px;flex-wrap:wrap;align-items:center}.room-chip{display:inline-flex;align-items:center;gap:5px;padding:7px 9px;border-radius:10px;background:#ffffff8c;color:#74695c;font-size:11px;font-weight:650}.room-chip.attention{background:#fff0d5;border:1px solid #ddb777;color:#865b20}.room-chip svg,.room-chip ha-icon{display:block;width:14px;height:14px;flex:none}.room-filter,.room-quick{border:1px solid #d6c8b2;background:#fffaf1;color:#76572f;border-radius:10px;min-height:34px;padding:7px 10px;font:700 11px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;cursor:pointer}.room-filter.selected{background:#e99524;color:#fff;border-color:#e99524}.room-quick.attention{background:#fff0d7;border-color:#ddb777;color:#80561f}.room-quick.confirm{background:#a65f53;border-color:#a65f53;color:#fff}.dark .room-context{background:#2d333b;border-color:#454c55}.dark .room-chip{background:#ffffff0c;color:#d0c8bd}.dark .room-chip.attention{background:#5a472d;border-color:#8a6b42;color:#ffd99a}.dark .room-filter,.dark .room-quick{background:#393f47;color:#edc890;border-color:#62676d}.dark .room-filter.selected{background:#e99524;color:#1e1913}
.overview{display:flex;gap:9px;flex-wrap:wrap;margin:0 0 16px}.overview span{display:inline-flex;align-items:center;gap:6px;padding:8px 11px;background:#f4f0e9;border-radius:13px;color:#746a5d;font-size:11px;font-weight:650}.overview b{color:#3a342d;font-size:12px}.overview .overview-warning{background:#fff0d5;color:#865b20}.overview .overview-bad{background:#f6dfdc;color:#8a493f}.dark .overview .overview-warning{background:#5a472d;color:#ffd99a}.dark .overview .overview-bad{background:#5b3936;color:#f2b2aa}
.home-state{display:flex;align-items:center;gap:10px;padding:12px 14px;margin:0 0 15px;border-radius:16px;background:#f5f1e9;color:#6d6255;font-size:12px;font-weight:650}.home-state:before{content:'';width:8px;height:8px;border-radius:50%;background:#6f9b72;box-shadow:0 0 0 4px #6f9b7222}.home-state.attention:before{background:#c18b3b;box-shadow:0 0 0 4px #c18b3b22}.home-state.problem:before{background:#a55c52;box-shadow:0 0 0 4px #a55c5222}.dark .home-state{background:#303640;color:#d8d0c5}.section-head h3{font-size:16px;margin:0;letter-spacing:-.035em}.section-head small{font-size:11px;color:#91887c}
.tiles{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;min-width:0}
.tile{touch-action:pan-y;min-width:0;min-height:136px;border:1px solid #fff9;border-radius:22px;background:linear-gradient(145deg,#f8f6f1,#e5e1d9);box-shadow:5px 6px 12px #b2aa9b66,-4px -4px 12px #fff8;padding:16px;display:flex;flex-direction:column;justify-content:space-between;text-align:left;cursor:pointer;color:#34302a;font:inherit}
.tile.on{background:linear-gradient(145deg,#fff2d9,#e9cb98);border-color:#f7d9a7}.tile.missing{opacity:.53}.tile{transition:transform .2s ease,box-shadow .2s ease,background .2s ease;position:relative;overflow:hidden}.tile:active{transform:translateY(1px)}.tile.on:before{content:'';position:absolute;right:13px;top:13px;width:6px;height:6px;background:#c18b3b;border-radius:50%;box-shadow:0 0 0 4px #e8ba6a38}.tile.missing:before{display:none}@media(hover:hover) and (pointer:fine){.tile:hover{transform:translateY(-2px);box-shadow:6px 10px 18px #9c938666,-3px -3px 12px #fff9}}.tile[aria-busy="true"]{cursor:progress}.tile .glyph{flex-shrink:0}.tile.small{grid-column:span 1}.tile.medium{grid-column:span 2}.tile.large{grid-column:span 4}.tile .glyph{color:#75624a}.tile.on .glyph{color:#ac772c}.tile .tile-wrap{margin-top:14px}.tile-status{display:inline-flex;align-items:center;align-self:flex-start;gap:6px;padding:4px 8px;border-radius:9px;font-size:10px;font-weight:750;line-height:1.2}.tile-status:before{content:'';width:6px;height:6px;border-radius:50%;background:currentColor;flex:none}.tile-status-on{color:#85591f;background:#dcae5a35}.tile-status-offline{color:#8c665c;background:#b59b9250}.dark .tile-status-on{color:#f2c77d;background:#c69a4e24}.dark .tile-status-offline{color:#d6aaa2;background:#caa49d24}
.tile .glyph{width:38px;height:38px;display:grid;place-items:center;transform-origin:center;border-radius:12px;background:#ffffff80;transition:background .2s,transform .2s}.tile .glyph svg{width:25px;height:25px;display:block}.tile.on .glyph{background:#f9e1b7}.tile.on .glyph{color:#ac772c;filter:drop-shadow(0 0 5px #eab04d66)}
.tile[data-domain=fan].on .glyph svg{animation:velto-spin 2.4s linear infinite}.tile[data-domain=vacuum].vacuum-moving .glyph{animation:velto-bob 1.4s ease-in-out infinite}.tile[data-domain=climate].on .glyph{animation:velto-pulse 2s ease-in-out infinite}.tile[data-domain=cover].moving .glyph svg{animation:velto-cover-move 1.35s ease-in-out infinite}.tile[data-domain=valve].valve-moving .glyph svg{animation:velto-cover-move 1.35s ease-in-out infinite}.tile[data-domain=light].on .glyph{animation:velto-light 3s ease-in-out infinite}.tile.motion-active .glyph svg{animation:velto-pulse 1.9s ease-in-out infinite}.tile.entry-open .glyph svg{animation:velto-door-ajar 2.8s ease-in-out infinite;transform-origin:28% 50%}.tile.water-alert .glyph{color:#287f9c;background:#dceff6;filter:drop-shadow(0 0 5px #4aa9ca55)}.dark .tile.water-alert .glyph{color:#91d9f0;background:#193c49;filter:drop-shadow(0 0 5px #4aa9ca55)}.tile.hazard-alert .glyph,.tile[data-domain=alarm_control_panel].alarm-triggered .glyph{color:#b3443b;background:#f9dfdc;filter:drop-shadow(0 0 5px #d85a4c55)}.dark .tile.hazard-alert .glyph,.dark .tile[data-domain=alarm_control_panel].alarm-triggered .glyph{color:#ffaaa0;background:#542b2e;filter:drop-shadow(0 0 5px #d85a4c55)}.tile.water-alert .glyph svg,.tile.hazard-alert .glyph svg,.tile[data-domain=alarm_control_panel].alarm-triggered .glyph svg{animation:velto-alert 1.7s ease-in-out infinite}:host([data-velto-visibility-managed]) .tile:not([data-velto-visible]) .glyph,:host([data-velto-visibility-managed]) .tile:not([data-velto-visible]) .glyph svg{animation-play-state:paused!important}@keyframes velto-spin{to{transform:rotate(360deg)}}@keyframes velto-bob{0%,100%{transform:translateX(-2px)}50%{transform:translateX(2px)}}@keyframes velto-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.65;transform:scale(1.08)}}@keyframes velto-rise{0%,100%{transform:translateY(1px)}50%{transform:translateY(-2px)}}@keyframes velto-light{0%,100%{box-shadow:0 0 0 0 #e9b45a00}50%{box-shadow:0 0 0 5px #e9b45a26}}@keyframes velto-cover-move{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}@keyframes velto-door-ajar{0%,100%{transform:rotate(0deg)}50%{transform:rotate(-3deg)}}@keyframes velto-alert{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.82;transform:scale(1.07)}}
.media-progress{width:100%;height:5px;background:#b9b0a180;border-radius:99px;overflow:hidden;margin-top:4px}.media-progress-fill{display:block;height:100%;background:#e99524;border-radius:99px}.media-times{display:flex;justify-content:space-between;gap:8px;color:#81776b;font-size:10px}.dark .media-progress{background:#5a5248}.dark .media-progress-fill{background:#e2b36b}.media-title{font-size:12px;font-weight:750;overflow-wrap:anywhere}.media-app,.media-volume{font-size:11px;color:#81776b}.tile-controls{display:flex;gap:6px;margin-top:10px;position:relative;z-index:2}.tile-controls button{border:1px solid #d4c5af;background:#fff9;color:#75552d;border-radius:10px;min-width:34px;min-height:32px;padding:6px 9px;font:700 12px inherit;cursor:pointer}.tile-controls button:disabled{opacity:.35;cursor:default}.tile-controls button{min-width:44px;min-height:44px;display:inline-flex;align-items:center;justify-content:center;touch-action:manipulation}.tile-controls button:focus-visible{outline:2px solid #b77c32;outline-offset:3px}.tile-controls button[aria-busy=true]{opacity:.55;cursor:progress}.tile-controls button svg{width:18px;height:18px;display:block;fill:currentColor}.tile[data-domain=media_player] .glyph svg{fill:currentColor}.tile[data-domain=media_player] .glyph.media-playing svg{animation:velto-media-breathe 2.6s ease-in-out infinite;transform-origin:center}@keyframes velto-media-breathe{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.08);opacity:.78}}@media(prefers-reduced-motion:reduce){.tile,.tile .glyph,.tile .glyph svg{animation:none!important;transition:none!important}.tile:hover,.tile:active{transform:none!important}}.dark .tile-controls button{background:#3b4149;color:#efc784;border-color:#626a73}.device-meta{display:flex;gap:8px;flex-wrap:wrap;margin-top:7px;font-size:10px;color:#84796d}.device-meta span{background:#ffffff70;padding:4px 7px;border-radius:8px}.dark .device-meta span{background:#ffffff10;color:#c9c1b6}
.camera-tile-art{display:block;width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:13px;margin-top:10px;background:#292724}.camera-tile-art[hidden]{display:none}.dark .camera-tile-art{background:#171a1e}
.media-art{width:100%;max-height:110px;object-fit:cover;border-radius:12px}.tile b{display:block;font-size:13px;overflow-wrap:break-word;word-break:normal;hyphens:auto;line-height:1.35}.tile small{display:block;font-size:11px;color:#81776b;margin-top:5px;overflow-wrap:break-word;word-break:normal}.tile-wrap{min-width:0;display:flex;flex-direction:column;gap:7px}.brightness{width:100%;appearance:none;-webkit-appearance:none;cursor:pointer;touch-action:pan-x;height:10px;margin:9px 0;border:1px solid #d5c5a8;border-radius:999px;background:linear-gradient(to right,#e99524 0%,#e99524 var(--brightness,0%),#d9d2c6 var(--brightness,0%),#d9d2c6 100%)}.brightness::-webkit-slider-thumb{appearance:none;-webkit-appearance:none;width:22px;height:22px;border-radius:50%;border:3px solid #fff9;background:#e99524;box-shadow:0 2px 6px #0003}.brightness::-moz-range-thumb{width:16px;height:16px;border-radius:50%;border:3px solid #fff9;background:#e99524;box-shadow:0 2px 6px #0003}.dark .brightness{border-color:#6a5a46;background:linear-gradient(to right,#e3b66d 0%,#e3b66d var(--brightness,0%),#4b4b4b var(--brightness,0%),#4b4b4b 100%)}.dark .brightness::-webkit-slider-thumb,.dark .brightness::-moz-range-thumb{background:#e3b66d}.brightness:focus-visible{outline:2px solid #e99524;outline-offset:3px}.brightness-label{font-size:10px;color:#846b49}.tile:has(.brightness){min-height:160px}
.weather{display:grid;grid-template-columns:minmax(120px,1fr) 2fr;gap:16px;padding:19px;border-radius:24px;background:linear-gradient(145deg,#f9f6f0,#e8e3da);box-shadow:inset 2px 2px 6px #c8c0b5,inset -2px -2px 8px #fff}
.weather .temperature{font-size:38px;font-weight:800;letter-spacing:-.06em;margin:8px 0}
.weather-lead{min-width:0;display:flex;flex-direction:column;align-items:flex-start;gap:0}.weather-lead .weather-clock{display:inline-flex;align-items:center;justify-content:center;margin-top:8px;padding:8px 12px;border:1px solid #ffffffa8;border-radius:13px;background:#eee9e0a8;box-shadow:inset 1px 1px 3px #c9c1b5,inset -1px -1px 3px #fff8;font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','Helvetica Neue',sans-serif;font-size:clamp(23px,2vw,29px);font-weight:500;letter-spacing:-.055em;line-height:1.05;color:#71695f;font-variant-numeric:tabular-nums;font-feature-settings:'tnum' 1,'ss01' 1;white-space:nowrap}.dark .weather-lead .weather-clock{background:#252c34;border-color:#48515b;color:#f0e5d5;box-shadow:inset 1px 1px 3px #151a20,inset -1px -1px 3px #48515b}
@media(max-width:780px){.weather-lead{display:grid;grid-template-columns:minmax(0,1fr) auto;grid-template-areas:'eyebrow eyebrow' 'temperature clock' 'air air';align-items:center;column-gap:12px;row-gap:3px}.weather-lead .eyebrow{grid-area:eyebrow}.weather-lead .temperature{grid-area:temperature;margin:5px 0;font-size:clamp(34px,9vw,44px)}.weather-lead .weather-clock{grid-area:clock;justify-self:end;align-self:center;margin:0;font-size:clamp(20px,5vw,24px);letter-spacing:-.06em}.weather-lead .air{grid-area:air}}.weather .air{font-size:12px;font-weight:650;color:#77736e}.weather .air-good{color:#317b50}.weather .air-moderate{color:#aa6800}.weather .air-bad{color:#b13f37}.dark .weather .air-good{color:#87d4a2}.dark .weather .air-moderate{color:#f3c477}.dark .weather .air-bad{color:#ff9d91}
.metrics{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.metric{border-radius:13px;background:#ebe6dd;padding:10px 12px;min-width:0}.metric small{display:block;font-size:10px;color:#81786d}.metric strong{font-size:15px;display:block;margin-top:6px;overflow-wrap:anywhere}.pm-metric{border:1px solid #e6ddcf;border-radius:16px}.pm-very-good{background:#dff4e6}.pm-good{background:#eaf4dc}.pm-moderate{background:#fff0c7}.pm-sufficient{background:#ffe0b8}.pm-bad{background:#ffdcd5}.pm-very-bad{background:#f4cbd3}.pm-unknown{background:#f0ede8}.pm-label{display:block;font-size:11px;font-weight:700;margin-top:5px;color:#51483f}.dark .pm-very-good{background:#1d4935}.dark .pm-good{background:#344a2d}.dark .pm-moderate{background:#514023}.dark .pm-sufficient{background:#5a3925}.dark .pm-bad{background:#58312e}.dark .pm-very-bad{background:#5a2635}.dark .pm-unknown{background:#303640}.dark .pm-label{color:#fff1dc}
.weather-forecast{grid-column:1/-1;margin-top:4px}.forecast-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:0 0 9px}.forecast-head strong{font-size:12px}.forecast-head small{font-size:10px;color:#8a8176}.forecast-strip{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:7px;overflow-x:auto;padding-bottom:2px;scroll-snap-type:x proximity;overscroll-behavior-x:contain}.forecast-strip:focus-visible{outline:2px solid #e99524;outline-offset:4px;border-radius:12px}.forecast-day{min-width:0;padding:10px 8px;border-radius:14px;background:#f2ede5;border:1px solid #ffffffb0;text-align:center;display:grid;gap:5px;scroll-snap-align:start}@container (max-width:780px){.forecast-strip{grid-template-columns:repeat(7,minmax(105px,1fr))}.forecast-day{min-width:105px}}.forecast-day .forecast-name{font-size:10px;font-weight:800;text-transform:capitalize;color:#766d62}.forecast-day .forecast-symbol{font-size:28px;line-height:1.2;color:#d8871a;display:inline-block;transform-origin:center}.forecast-day .forecast-symbol svg{width:28px;height:28px;display:block;margin:auto}.forecast-sunny .forecast-symbol{color:#f59e0b;animation:velto-weather-glow 3.5s ease-in-out infinite}.forecast-wet .forecast-symbol{color:#4b9bd3;animation:velto-weather-float 2.7s ease-in-out infinite}.forecast-cloudy .forecast-symbol{color:#8399ad;animation:velto-weather-float 4s ease-in-out infinite}.forecast-snowy .forecast-symbol{color:#63b5df;animation:velto-weather-float 3.4s ease-in-out infinite}@keyframes velto-weather-glow{50%{transform:scale(1.14);filter:drop-shadow(0 0 5px #fbbf24aa)}}@keyframes velto-weather-float{50%{transform:translateY(-3px)}}@media(prefers-reduced-motion:reduce){.forecast-day .forecast-symbol{animation:none!important}}.forecast-day .forecast-temp{font-size:13px;font-weight:800}.forecast-day .forecast-low{font-size:10px;color:#8c8378}.forecast-day .forecast-rain{font-size:9px;color:#6f7d89}.forecast-status{grid-column:1/-1;padding:9px 10px;border-radius:11px;background:#f4f0e9;font-size:11px;color:#80766a}.forecast-stale{grid-column:1/-1;margin-top:6px;font-size:10px;color:#8a8176}.dark .forecast-stale{color:#b9b1a7}.dark .forecast-day{background:#303640;border-color:#454c55}.dark .forecast-day .forecast-name,.dark .forecast-day .forecast-low,.dark .forecast-head small{color:#b9b1a7}.dark .forecast-day .forecast-symbol{color:#efc784}.dark .forecast-status{background:#303640;color:#c9c1b7}
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

.layout .sidebar{gap:10px;min-width:0}.layout .sidebar-tools{order:0;min-width:0;border:1px solid #ffffff25;border-radius:14px;padding:7px;background:#ffffff0b}.layout .nav{order:1}.layout .sidebar-note{order:2;margin-top:auto}.sidebar-tools summary{font-size:12px;font-weight:750;cursor:pointer;padding:8px 5px;list-style-position:inside;overflow-wrap:anywhere}.sidebar-tools[open]{max-height:min(62vh,560px);overflow:auto;overscroll-behavior:contain}.sidebar-tools .home-state{margin:8px 0}.sidebar-tools .overview{margin:8px 0;grid-template-columns:repeat(2,minmax(0,1fr))}.sidebar-tools .overview span{min-width:0;overflow-wrap:anywhere}.sidebar-tools .room-context{margin:8px 0;padding:7px}.sidebar-tools .room-filter,.sidebar-tools .room-quick,.sidebar-tools .active-filter{max-width:100%;white-space:normal;overflow-wrap:anywhere;line-height:1.3}.sidebar-tools .active-filter{width:100%;margin-top:6px;padding:9px}.sidebar-collapsed .sidebar-tools{display:none!important}.layout.sidebar-collapsed{grid-template-columns:90px minmax(0,1fr);gap:14px}.sidebar-collapsed .sidebar{padding-right:10px}.sidebar-collapsed .nav{width:100%;align-items:center}.sidebar-collapsed .nav button{position:relative;width:56px;height:56px;min-height:56px;padding:0!important;margin:0 auto;justify-content:center!important;align-items:center;gap:0;font-size:0!important}.sidebar-collapsed .nav button svg{display:block;width:23px;height:23px;margin:0!important;flex:none}.sidebar-collapsed .nav button ha-icon{--mdc-icon-size:23px;width:23px;height:23px;margin:0!important;flex:none}.sidebar-collapsed .nav-active{display:block!important;position:absolute;right:6px;top:7px;width:8px;height:8px;background:#f7a531;box-shadow:0 0 0 3px #f7a53144}.sidebar-collapsed .nav-count{display:none!important}.sidebar-collapsed .brand-row{width:100%}.sidebar-collapsed .brand{font-size:17px}.top .velto-fullscreen,.top .velto-edit,.top .velto-theme{width:38px;height:38px;min-width:38px;min-height:38px;display:grid;place-items:center;padding:0;border-radius:12px;font-size:21px;line-height:1;cursor:pointer}.velto-top-actions{display:flex;align-items:center;gap:6px;flex:none}.top{justify-content:flex-start;gap:10px;flex-wrap:wrap}.top h2{margin-right:auto}.top .velto-top-actions button{width:34px;height:34px;min-width:34px;min-height:34px;font-size:18px}.top .presence{flex:none}@media(max-width:520px){.top{gap:8px}.top h2{font-size:24px}.velto-top-actions{gap:4px}.top .velto-top-actions button{width:32px;height:32px;min-width:32px;min-height:32px}.top .presence{padding:6px 8px;gap:6px}.top .presence .avatar{width:27px;height:27px}}.top .velto-theme{border:1px solid #d2a35d;background:#fff4dd;color:#b16e12}.dark .top .velto-theme{background:#343941;color:#f7bd61;border-color:#706047}.top .velto-edit svg,.top .velto-theme svg{width:19px;height:19px;display:block}.top h2{margin-right:auto}.weather-forecast{min-width:0;width:100%;grid-column:1/-1;display:block;box-sizing:border-box}.weather{min-width:0;width:100%;box-sizing:border-box}.forecast-strip{width:100%;grid-template-columns:repeat(7,minmax(0,1fr))}.forecast-day{width:100%;min-width:0}.forecast-missing{opacity:.52}.pm-metric{border:1px solid #dcd5ca!important;border-left:1px solid #dcd5ca!important;position:relative}.pm-metric .pm-label{display:inline-block;border-radius:8px;padding:6px 9px;font-size:11px;line-height:1.35;font-weight:800;margin-top:9px;max-width:100%}.pm-metric .pm-explain{font-size:10px;margin-top:5px;opacity:.85}.pm-very-good .pm-label{background:#087647;color:white}.pm-good .pm-label{background:#467522;color:white}.pm-moderate .pm-label{background:#947000;color:white}.pm-sufficient .pm-label{background:#a94d0b;color:white}.pm-bad .pm-label{background:#b62c28;color:white}.pm-very-bad .pm-label{background:#8f1234;color:white}.pm-unknown .pm-label{background:#626872;color:white}@container (max-width:780px){.forecast-strip{grid-template-columns:repeat(7,minmax(105px,1fr))}.forecast-day{min-width:105px}}@media(prefers-reduced-motion:reduce){.sidebar-collapsed .nav button{transition:none}}

/* VELTO desktop density and consistent navigation */
.top{display:flex;align-items:center;flex-wrap:nowrap}.top>div:first-child{display:flex;align-items:baseline;gap:12px;min-width:0;margin-right:auto}.top h2{margin-right:0}.velto-clock{font-size:15px;font-weight:650;color:#8b7f70;font-variant-numeric:tabular-nums;white-space:nowrap}.top .velto-top-actions{margin-left:auto}.top .presence{margin-left:0}.sidebar .overview{grid-template-columns:1fr}.sidebar .overview span,.sidebar .room-context,.sidebar .room-filter,.sidebar .room-quick,.sidebar .active-filter,.sidebar .nav button{width:100%;max-width:100%;box-sizing:border-box}.sidebar .nav button{min-width:0}.sidebar .nav button .nav-name{min-width:0;overflow:hidden;text-overflow:ellipsis}.weather{grid-template-columns:minmax(145px,.9fr) minmax(190px,1.3fr) minmax(300px,2.6fr);gap:12px;align-items:start}.weather .metrics{grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}.weather .metric{padding:8px 10px}.weather .metric strong{font-size:13px}.weather .pm-label{font-size:10px;padding:5px 7px}.weather .weather-forecast{grid-column:3;grid-row:1;margin-top:0}.weather .forecast-strip{grid-template-columns:repeat(7,minmax(0,1fr))}.weather-condition-symbol{display:inline-flex;align-items:center;margin-right:7px;vertical-align:middle;color:#d89120}.weather-condition-symbol svg{display:block;width:18px;height:18px}.calendar-section .section-head{display:flex;align-items:center;gap:12px}.calendar-actions{display:flex;align-items:center;gap:12px;margin-left:auto;white-space:nowrap}.calendar-actions small{color:#8b8175}.calendar-list{grid-template-columns:repeat(auto-fit,minmax(205px,max-content));justify-content:start;align-items:stretch}.calendar-event{width:auto;max-width:340px;min-width:205px}.calendar-last-checked{display:block;margin-bottom:8px;color:#82786d}@container(max-width:1120px){.weather{grid-template-columns:minmax(130px,1fr) minmax(180px,2fr)}.weather .weather-forecast{grid-column:1/-1;grid-row:auto}.calendar-list{grid-template-columns:repeat(auto-fit,minmax(205px,1fr))}.calendar-event{max-width:none}}@container(max-width:620px){.top{flex-wrap:wrap}.top>div:first-child{width:100%;margin-right:0}.top .velto-top-actions{margin-left:auto}.weather{grid-template-columns:1fr}.weather .weather-forecast{grid-column:1}.calendar-list{grid-template-columns:1fr}.calendar-event{width:100%}.sidebar .overview{grid-template-columns:1fr}}

/* Sidebar labels and compact context chips */
.sidebar .room-context-row{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:5px}.sidebar .room-context-row .room-chip{min-width:0;width:100%;padding:6px 7px;font-size:10px;overflow-wrap:anywhere}.sidebar .room-context-row .room-chip:only-child{grid-column:1/-1}
/* Forecast fills the remaining row and shares a baseline with PM measurements */
@container(min-width:1121px){.weather{grid-template-columns:minmax(145px,.85fr) minmax(190px,1.2fr);align-items:start}.weather>.weather-forecast{grid-column:1/-1;grid-row:auto;display:block;min-width:0;width:100%}.weather .forecast-strip{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:8px;min-width:0;width:100%;align-items:stretch;overflow:visible}.weather .forecast-day{min-width:0;width:100%;height:100%;align-content:center}.weather .metrics{align-self:stretch}.weather .metric{display:flex;flex-direction:column;justify-content:center}.weather .pm-label{margin-top:auto}}
@container(min-width:621px) and (max-width:1120px){.weather .forecast-strip{grid-template-columns:repeat(7,minmax(0,1fr))}}

/* Mobile compact sidebar and fullscreen fallback for iOS WebKit */
.layout.fullscreen-fallback{position:fixed!important;inset:0!important;z-index:99999!important;display:grid!important;width:100vw!important;min-width:0!important;max-width:none!important;height:100vh!important;height:100dvh!important;min-height:100vh!important;min-height:100dvh!important;box-sizing:border-box!important;margin:0!important;overflow:auto!important;overscroll-behavior:contain;-webkit-overflow-scrolling:touch!important;border-radius:0!important;box-shadow:none!important;padding:calc(14px + env(safe-area-inset-top,0px)) calc(14px + env(safe-area-inset-right,0px)) calc(14px + env(safe-area-inset-bottom,0px)) calc(14px + env(safe-area-inset-left,0px))!important;background:var(--primary-background-color,#eeeae2)}
.layout.fullscreen-fallback .top{position:sticky;top:0;z-index:20;padding:8px 0;background:var(--card-background-color,#fff)}
.layout.fullscreen-fallback.dark .top{background:#252a31}
@media(max-width:600px){.brand-row,.sidebar-collapsed .brand-row{flex-direction:row!important;align-items:center!important;justify-content:space-between!important;width:100%}.layout.sidebar-collapsed{display:block!important}.sidebar-collapsed .sidebar{width:100%;padding:0 0 10px!important}.sidebar-collapsed .nav{display:flex;flex-direction:row;width:100%;overflow-x:auto;align-items:center;gap:6px}.sidebar-collapsed .nav button{flex:0 0 44px;width:44px;height:44px;min-height:44px;margin:0;padding:0!important}.sidebar-collapsed .brand{font-size:22px}}
@container (max-width:600px){.brand-row,.sidebar-collapsed .brand-row{flex-direction:row!important;align-items:center!important;justify-content:space-between!important;width:100%}.layout.sidebar-collapsed{display:block!important}.sidebar-collapsed .sidebar{width:100%;padding:0 0 10px!important}.sidebar-collapsed .nav{display:flex;flex-direction:row;width:100%;overflow-x:auto;align-items:center;gap:6px}.sidebar-collapsed .nav button{flex:0 0 44px;width:44px;height:44px;min-height:44px;margin:0;padding:0!important}.sidebar-collapsed .brand{font-size:22px}}
.weather-history-target{cursor:pointer;touch-action:pan-y}.weather-history-target:focus-visible{outline:2px solid #e99524;outline-offset:3px}
.velto-history-modal{max-width:min(640px,94vw)}.velto-history-ranges{display:flex;gap:8px;margin:12px 0}.velto-history-range{border:1px solid #d9c5a8;border-radius:10px;padding:9px 13px;background:transparent;color:inherit;cursor:pointer}.velto-history-range[aria-pressed=true]{background:#e99524;color:#241b0e}.velto-history-body{min-height:120px}.velto-history-chart{display:block;width:100%;height:auto;max-height:220px;background:#ffffff12;border-radius:12px}.velto-event-history{display:grid;gap:7px;list-style:none;margin:0;padding:0;max-height:42vh;overflow:auto;overscroll-behavior:contain}.velto-event-history-item{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 12px;border-radius:12px;background:#ffffff45}.velto-event-history-copy{display:flex;flex-direction:column;gap:2px;min-width:0}.velto-event-history-item strong{font-size:13px}.velto-event-history-duration{font-size:10px;line-height:1.35;color:#8a8176}.velto-event-history-item time{font-size:11px;color:#8a8176;text-align:right}.velto-event-history-item.is-on strong{color:#9a6321}.velto-event-history-item.is-off strong{color:#55745d}.dark .velto-event-history-item{background:#ffffff0b}.dark .velto-event-history-item time{color:#c0b6a8}.dark .velto-event-history-duration{color:#b6ab9c}.velto-history-summary,.velto-history-times{font-size:12px;line-height:1.6;overflow-wrap:anywhere}

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
.calendar-actions{display:flex;align-items:center;gap:6px;flex-wrap:wrap}.calendar-privacy,.calendar-compact-toggle{border:1px solid #d2a35d;border-radius:10px;background:transparent;color:inherit;padding:7px 9px;cursor:pointer;font:inherit;font-size:11px}.calendar-privacy:focus-visible,.calendar-compact-toggle:focus-visible{outline:2px solid #e99524;outline-offset:2px}.calendar-compact .calendar-list .calendar-event:nth-child(n+4){display:none!important}.calendar-private .calendar-event-title{filter:blur(5px);user-select:none;-webkit-user-select:none}.calendar-private .calendar-location{display:none!important}
@media(max-width:780px){.calendar-list{grid-template-columns:minmax(0,1fr)!important}.calendar-actions{justify-content:flex-end}.calendar-event{min-width:0}}


/* Final mobile overrides: keep room buttons compact, forecast cards isolated and calendar actions legible */
@media(max-width:780px){.layout .sidebar .nav button{max-width:140px!important}.layout.sidebar-collapsed .sidebar .nav button{width:44px!important;max-width:44px!important}.layout .forecast-strip{grid-auto-columns:112px!important;grid-auto-flow:column!important;grid-template-columns:none!important;justify-content:start!important}.layout .forecast-strip .forecast-day{margin:0!important;transform:none!important;position:relative!important;left:auto!important;right:auto!important}}
.calendar-privacy,.calendar-compact-toggle{color:#a96a17!important;background:#fff7e9!important;border-color:#dfb977!important;min-width:34px;min-height:34px;font-size:19px!important;font-weight:700!important}.calendar-privacy:disabled,.calendar-compact-toggle:disabled{opacity:.4;cursor:default}.calendar-private .calendar-event-title{filter:blur(8px)!important;opacity:.9!important;pointer-events:none!important;user-select:none!important;-webkit-user-select:none!important}.calendar-private .calendar-event-title::selection{background:transparent}.sr-only{position:absolute!important;width:1px!important;height:1px!important;padding:0!important;margin:-1px!important;overflow:hidden!important;clip:rect(0,0,0,0)!important;white-space:nowrap!important;border:0!important}
/* Unified accessible calendar toolbar, including dark mode */
.calendar-actions{gap:6px}.calendar-actions button.calendar-refresh,.calendar-actions button.calendar-privacy,.calendar-actions button.calendar-compact-toggle{display:inline-flex!important;align-items:center;justify-content:center;box-sizing:border-box;flex:0 0 32px;width:32px;height:32px;min-height:32px;padding:0!important;border:1px solid #bfa57c!important;border-radius:9px!important;background:#f5f0e7!important;color:#514333!important;font:700 19px/1 system-ui,sans-serif!important;box-shadow:none!important;opacity:1!important}.calendar-actions button.calendar-privacy[aria-pressed=true]{background:#f5deb9!important}.dark .calendar-actions button.calendar-refresh,.dark .calendar-actions button.calendar-privacy,.dark .calendar-actions button.calendar-compact-toggle{background:#343b45!important;border-color:#7e8997!important;color:#f4e9d8!important}.dark .calendar-actions button.calendar-privacy[aria-pressed=true]{background:#594a31!important;color:#ffe4a5!important}.calendar-actions button:focus-visible{outline:2px solid #e99524;outline-offset:2px}.calendar-actions button.calendar-refresh svg,.calendar-actions button.calendar-privacy svg,.calendar-actions button.calendar-compact-toggle svg{width:17px;height:17px;display:block;flex:none}

/* iPad landscape: use the complete row for all seven forecast days. */
@container (min-width:621px) and (max-width:1280px){
  .weather{grid-template-columns:minmax(0,1fr) minmax(0,1.35fr)!important;align-items:start}
  .weather>.weather-forecast{grid-column:1/-1!important;grid-row:auto!important;display:block!important;width:100%;min-width:0}
  .weather .forecast-strip{display:grid!important;grid-template-columns:repeat(7,minmax(0,1fr))!important;grid-auto-flow:row!important;grid-auto-columns:auto!important;gap:8px;overflow-x:hidden!important}
  .weather .forecast-day{width:100%;min-width:0!important;padding:10px 5px}
}
.weather .metric,.weather .pm-metric,.weather .pm-label,.forecast-day,.forecast-name,.forecast-temp,.forecast-low,.forecast-rain{min-width:0;max-width:100%;overflow-wrap:anywhere;word-break:normal}
.weather .pm-label{white-space:normal;line-height:1.3;hyphens:auto}
.forecast-day .forecast-name{line-height:1.2;white-space:normal;hyphens:auto}
.waste-actions{display:flex;align-items:center;gap:8px;margin-left:auto;flex:none}
.waste-type-summary{display:inline-flex;align-items:center;gap:6px;color:#8b6b3d;font-size:12px;font-weight:700;white-space:nowrap}.waste-type-summary svg{width:16px;height:16px;display:block;flex:none}.dark .waste-type-summary{color:#efc784}
.waste-compact-toggle{display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;min-width:32px;min-height:32px;padding:0;border:1px solid #bfa57c;border-radius:9px;background:#f5f0e7;color:#514333;cursor:pointer}
.waste-compact-toggle svg{width:17px;height:17px;display:block}
.waste-compact-toggle:focus-visible{outline:2px solid #e99524;outline-offset:2px}
.waste-compact .waste-content{display:none!important}
.dark .waste-compact-toggle{background:#343b45;border-color:#7e8997;color:#f4e9d8}
.layout.fullscreen-fallback{background:#eae7e0!important}.layout.fullscreen-fallback.dark{background:#1e232b!important}
.layout.fullscreen-fallback .top{position:static!important;top:auto!important;z-index:auto;padding:0;margin-bottom:22px;background:transparent!important}
.layout.fullscreen-fallback.dark .top{background:transparent!important}
@container(max-width:620px){.waste-actions{gap:5px}.waste-actions>small{font-size:10px}.waste-compact-toggle{width:30px;height:30px;min-width:30px;min-height:30px}}
/* iPad landscape and native Safari fullscreen: keep weather columns fluid; forecast density follows the card container, not device pixel width. */
@media (min-width:781px) and (max-width:1366px){
  .layout .weather{grid-template-columns:minmax(0,1fr) minmax(0,1.35fr)!important;align-items:start!important}
  .layout .weather>.weather-forecast{grid-column:1/-1!important;grid-row:auto!important;display:block!important;width:100%!important;min-width:0!important}
  .layout .weather .weather-forecast .forecast-day{display:grid!important;box-sizing:border-box!important;width:100%!important;min-width:0!important;max-width:none!important;overflow:hidden!important;padding:10px 5px!important}
  .layout .weather .weather-forecast .forecast-day>*{min-width:0!important;max-width:100%!important;overflow-wrap:anywhere!important;white-space:normal!important;text-overflow:clip!important}
}
/* Tablet forecast: give each day enough room instead of squeezing six cards into a narrow row. */
@container (min-width:621px) and (max-width:900px){
  .layout .weather .weather-forecast .forecast-strip{grid-template-columns:repeat(3,minmax(0,1fr))!important;grid-auto-flow:row!important;grid-auto-columns:minmax(0,1fr)!important;overflow:visible!important;gap:9px!important}
  .layout .weather .weather-forecast .forecast-day{min-width:0!important;max-width:none!important;padding:12px 8px!important}
  .layout .weather .weather-forecast .forecast-day .forecast-symbol{font-size:30px}
}
/* Let the available card width decide forecast and agenda density across desktop, tablet and embedded views. */
@container (min-width:621px) and (max-width:900px){
  .layout .weather .weather-forecast .forecast-strip{grid-template-columns:repeat(3,minmax(0,1fr))!important;grid-auto-flow:row!important;grid-auto-columns:minmax(0,1fr)!important;gap:9px!important;overflow:visible!important}
  .layout .weather .weather-forecast .forecast-day{padding:12px 8px!important}
}
@container (min-width:901px){
  .layout .weather .weather-forecast .forecast-strip{grid-template-columns:repeat(7,minmax(0,1fr))!important;grid-auto-flow:row!important;grid-auto-columns:minmax(0,1fr)!important;gap:8px!important;overflow:visible!important}
}
@container (min-width:621px){
  .layout .calendar-list{grid-template-columns:repeat(auto-fit,minmax(190px,1fr))!important;justify-content:stretch!important;align-items:stretch!important}
  .layout .calendar-event{width:100%!important;max-width:none!important;min-width:0!important}
}
:host(:fullscreen) .layout .top,.layout.fullscreen-fallback .top{position:static!important;inset:auto!important;z-index:auto!important;align-self:auto!important;background:transparent!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important}
:host(:fullscreen) .layout .weather,.layout.fullscreen-fallback .weather{min-width:0!important;max-width:100%!important}
:host(:fullscreen) .layout .weather .weather-forecast,.layout.fullscreen-fallback .weather .weather-forecast{min-width:0!important}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important;scroll-snap-type:none!important}}
/* Width-observer fallback for Safari/iPadOS versions without CSS container queries. */
:host([data-velto-width="tablet"]) .layout:not(.sidebar-collapsed){grid-template-columns:150px minmax(0,1fr);gap:14px;padding:15px}
:host([data-velto-width="tablet"]) .layout.sidebar-collapsed{grid-template-columns:78px minmax(0,1fr)}
:host([data-velto-width="tablet"]) .sidebar{padding-right:10px}
:host([data-velto-width="tablet"]) .tiles{grid-template-columns:repeat(2,minmax(0,1fr))}
:host([data-velto-width="tablet"]) .tile.large,:host([data-velto-width="tablet"]) .tile.medium{grid-column:span 2}
:host([data-velto-width="tablet"]) .layout .weather{grid-template-columns:minmax(0,1fr) minmax(0,1.35fr)!important;align-items:start!important}
:host([data-velto-width="tablet"]) .layout .weather>.weather-forecast{grid-column:1/-1!important;grid-row:auto!important;display:block!important;width:100%!important;min-width:0!important}
:host([data-velto-width="tablet"]) .layout .weather .forecast-strip{grid-template-columns:repeat(3,minmax(0,1fr))!important;grid-auto-flow:row!important;grid-auto-columns:minmax(0,1fr)!important;gap:9px!important;overflow:visible!important}
:host([data-velto-width="tablet"]) .layout .weather .forecast-day{min-width:0!important;max-width:none!important;padding:12px 8px!important}
:host([data-velto-width="tablet"]) .layout .calendar-list{grid-template-columns:repeat(auto-fit,minmax(190px,1fr))!important;justify-content:stretch!important}
:host([data-velto-width="tablet"]) .layout .calendar-event{width:100%!important;max-width:none!important;min-width:0!important}
:host([data-velto-width="wide"]) .layout .weather{grid-template-columns:minmax(0,1fr) minmax(0,1.35fr)!important;align-items:start!important}
:host([data-velto-width="wide"]) .layout .weather>.weather-forecast{grid-column:1/-1!important;grid-row:auto!important;display:block!important;width:100%!important;min-width:0!important}
:host([data-velto-width="wide"]) .layout .weather .forecast-strip{grid-template-columns:repeat(7,minmax(0,1fr))!important;grid-auto-flow:row!important;grid-auto-columns:minmax(0,1fr)!important;gap:8px!important;overflow:visible!important}
:host([data-velto-width="wide"]) .layout .weather .forecast-day{min-width:0!important;max-width:none!important;padding:10px 5px!important}
:host([data-velto-width="wide"]) .layout .calendar-list,:host([data-velto-width="desktop"]) .layout .calendar-list{grid-template-columns:repeat(auto-fit,minmax(190px,1fr))!important;justify-content:stretch!important}
:host([data-velto-width="wide"]) .layout .calendar-event,:host([data-velto-width="desktop"]) .layout .calendar-event{width:100%!important;max-width:none!important;min-width:0!important}
:host([data-velto-width="desktop"]) .layout .weather{grid-template-columns:minmax(145px,.85fr) minmax(190px,1.2fr)!important;align-items:start!important}
:host([data-velto-width="desktop"]) .layout .weather>.weather-forecast{grid-column:1/-1!important;grid-row:auto!important;display:block!important;min-width:0!important;width:100%!important}
:host([data-velto-width="desktop"]) .layout .weather .forecast-strip{flex:1;display:grid!important;grid-template-columns:repeat(7,minmax(0,1fr))!important;gap:8px!important;min-width:0;width:100%;align-items:stretch;overflow:visible!important}
:host([data-velto-width="desktop"]) .layout .weather .forecast-day{min-width:0!important;width:100%!important;height:100%;align-content:center}
:host([data-velto-width="desktop"]) .layout .weather .metrics{align-self:stretch}
:host([data-velto-width="desktop"]) .layout .weather .metric{display:flex;flex-direction:column;justify-content:center}
:host([data-velto-width="desktop"]) .layout .weather .pm-label{margin-top:auto}
:host([data-velto-width="mobile"]) .layout,:host([data-velto-width="compact"]) .layout,:host([data-velto-width="narrow"]) .layout{display:block;padding:14px;border-radius:23px}
:host([data-velto-width="mobile"]) .sidebar,:host([data-velto-width="compact"]) .sidebar,:host([data-velto-width="narrow"]) .sidebar{border-right:0;padding:0 0 12px;margin:0 0 12px}
:host([data-velto-width="mobile"]) .brand,:host([data-velto-width="compact"]) .brand,:host([data-velto-width="narrow"]) .brand{font-size:22px}
:host([data-velto-width="mobile"]) .nav,:host([data-velto-width="compact"]) .nav,:host([data-velto-width="narrow"]) .nav{flex-direction:row;overflow-x:auto;gap:6px;scroll-snap-type:x proximity;overscroll-behavior-x:contain}
:host([data-velto-width="mobile"]) .nav button,:host([data-velto-width="compact"]) .nav button,:host([data-velto-width="narrow"]) .nav button{white-space:nowrap;padding:10px;scroll-snap-align:start;flex:none}
:host([data-velto-width="mobile"]) .nav-count,:host([data-velto-width="compact"]) .nav-count,:host([data-velto-width="narrow"]) .nav-count{margin-left:4px}
:host([data-velto-width="mobile"]) .sidebar-note,:host([data-velto-width="compact"]) .sidebar-note,:host([data-velto-width="narrow"]) .sidebar-note{display:none}
:host([data-velto-width="mobile"]) .top h2,:host([data-velto-width="compact"]) .top h2,:host([data-velto-width="narrow"]) .top h2{font-size:23px}
:host([data-velto-width="mobile"]) .top,:host([data-velto-width="compact"]) .top,:host([data-velto-width="narrow"]) .top{flex-wrap:wrap}
:host([data-velto-width="mobile"]) .top>div:first-child,:host([data-velto-width="compact"]) .top>div:first-child,:host([data-velto-width="narrow"]) .top>div:first-child{width:100%;margin-right:0}
:host([data-velto-width="mobile"]) .top .velto-top-actions,:host([data-velto-width="compact"]) .top .velto-top-actions,:host([data-velto-width="narrow"]) .top .velto-top-actions{margin-left:auto}
:host([data-velto-width="mobile"]) .presence,:host([data-velto-width="compact"]) .presence,:host([data-velto-width="narrow"]) .presence{padding:7px}
:host([data-velto-width="mobile"]) .tiles,:host([data-velto-width="compact"]) .tiles,:host([data-velto-width="narrow"]) .tiles{grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}
:host([data-velto-width="mobile"]) .tile,:host([data-velto-width="compact"]) .tile,:host([data-velto-width="narrow"]) .tile{min-height:122px;padding:13px;border-radius:19px}
:host([data-velto-width="mobile"]) .tile.small,:host([data-velto-width="compact"]) .tile.small,:host([data-velto-width="narrow"]) .tile.small{grid-column:span 1}
:host([data-velto-width="mobile"]) .tile.medium,:host([data-velto-width="mobile"]) .tile.large,:host([data-velto-width="compact"]) .tile.medium,:host([data-velto-width="compact"]) .tile.large,:host([data-velto-width="narrow"]) .tile.medium,:host([data-velto-width="narrow"]) .tile.large{grid-column:span 2}
:host([data-velto-width="mobile"]) .weather,:host([data-velto-width="compact"]) .weather,:host([data-velto-width="narrow"]) .weather{grid-template-columns:1fr!important}
:host([data-velto-width="mobile"]) .weather>.weather-forecast,:host([data-velto-width="compact"]) .weather>.weather-forecast,:host([data-velto-width="narrow"]) .weather>.weather-forecast{grid-column:1!important}
:host([data-velto-width="mobile"]) .metrics,:host([data-velto-width="compact"]) .metrics,:host([data-velto-width="narrow"]) .metrics{grid-template-columns:repeat(2,minmax(0,1fr))}
:host([data-velto-width="mobile"]) .weather-lead,:host([data-velto-width="compact"]) .weather-lead,:host([data-velto-width="narrow"]) .weather-lead{display:grid;grid-template-columns:minmax(0,1fr) auto;grid-template-areas:'eyebrow eyebrow' 'temperature clock' 'air air';align-items:center;column-gap:12px;row-gap:3px}
:host([data-velto-width="mobile"]) .weather-lead .eyebrow,:host([data-velto-width="compact"]) .weather-lead .eyebrow,:host([data-velto-width="narrow"]) .weather-lead .eyebrow{grid-area:eyebrow}
:host([data-velto-width="mobile"]) .weather-lead .temperature,:host([data-velto-width="compact"]) .weather-lead .temperature,:host([data-velto-width="narrow"]) .weather-lead .temperature{grid-area:temperature;margin:5px 0;font-size:clamp(34px,9vw,44px)}
:host([data-velto-width="mobile"]) .weather-lead .weather-clock,:host([data-velto-width="compact"]) .weather-lead .weather-clock,:host([data-velto-width="narrow"]) .weather-lead .weather-clock{grid-area:clock;justify-self:end;align-self:center;margin:0;font-size:clamp(20px,5vw,24px);letter-spacing:-.06em}
:host([data-velto-width="mobile"]) .weather-lead .air,:host([data-velto-width="compact"]) .weather-lead .air,:host([data-velto-width="narrow"]) .weather-lead .air{grid-area:air}
:host([data-velto-width="mobile"]) .weather .forecast-strip,:host([data-velto-width="compact"]) .weather .forecast-strip,:host([data-velto-width="narrow"]) .weather .forecast-strip{grid-template-columns:repeat(7,minmax(105px,1fr))!important;overflow-x:auto!important}
:host([data-velto-width="mobile"]) .weather .forecast-day,:host([data-velto-width="compact"]) .weather .forecast-day,:host([data-velto-width="narrow"]) .weather .forecast-day{min-width:105px!important}
:host([data-velto-width="mobile"]) .layout .calendar-list,:host([data-velto-width="compact"]) .layout .calendar-list,:host([data-velto-width="narrow"]) .layout .calendar-list{grid-template-columns:1fr!important}
:host([data-velto-width="mobile"]) .layout .calendar-event,:host([data-velto-width="compact"]) .layout .calendar-event,:host([data-velto-width="narrow"]) .layout .calendar-event{width:100%!important;max-width:none!important;min-width:0!important}
:host([data-velto-width="mobile"]) .sidebar .overview,:host([data-velto-width="compact"]) .sidebar .overview,:host([data-velto-width="narrow"]) .sidebar .overview{grid-template-columns:1fr}
:host([data-velto-width="mobile"]) .brand-row,:host([data-velto-width="compact"]) .brand-row,:host([data-velto-width="narrow"]) .brand-row,:host([data-velto-width="mobile"]) .sidebar-collapsed .brand-row,:host([data-velto-width="compact"]) .sidebar-collapsed .brand-row,:host([data-velto-width="narrow"]) .sidebar-collapsed .brand-row{flex-direction:row!important;align-items:center!important;justify-content:space-between!important;width:100%}
:host([data-velto-width="mobile"]) .layout.sidebar-collapsed,:host([data-velto-width="compact"]) .layout.sidebar-collapsed,:host([data-velto-width="narrow"]) .layout.sidebar-collapsed{display:block!important}
:host([data-velto-width="mobile"]) .sidebar-collapsed .sidebar,:host([data-velto-width="compact"]) .sidebar-collapsed .sidebar,:host([data-velto-width="narrow"]) .sidebar-collapsed .sidebar{width:100%;padding:0 0 10px!important}
:host([data-velto-width="mobile"]) .sidebar-collapsed .nav,:host([data-velto-width="compact"]) .sidebar-collapsed .nav,:host([data-velto-width="narrow"]) .sidebar-collapsed .nav{display:flex;flex-direction:row;width:100%;overflow-x:auto;align-items:center;gap:6px}
:host([data-velto-width="mobile"]) .sidebar-collapsed .nav button,:host([data-velto-width="compact"]) .sidebar-collapsed .nav button,:host([data-velto-width="narrow"]) .sidebar-collapsed .nav button{flex:0 0 44px;width:44px;height:44px;min-height:44px;margin:0;padding:0!important}
:host([data-velto-width="mobile"]) .sidebar-collapsed .brand,:host([data-velto-width="compact"]) .sidebar-collapsed .brand,:host([data-velto-width="narrow"]) .sidebar-collapsed .brand{font-size:22px}
:host([data-velto-width="compact"]) .waste-card,:host([data-velto-width="narrow"]) .waste-card{gap:10px;padding:12px}
:host([data-velto-width="compact"]) .waste-bin,:host([data-velto-width="narrow"]) .waste-bin{width:42px;height:42px;font-size:25px}
:host([data-velto-width="compact"]) .waste-copy strong,:host([data-velto-width="narrow"]) .waste-copy strong{font-size:16px}
:host([data-velto-width="compact"]) .waste-countdown,:host([data-velto-width="narrow"]) .waste-countdown{padding:7px 8px;font-size:11px}
:host([data-velto-width="compact"]) .waste-actions,:host([data-velto-width="narrow"]) .waste-actions{gap:5px}
:host([data-velto-width="compact"]) .waste-actions>small,:host([data-velto-width="narrow"]) .waste-actions>small{font-size:10px}
:host([data-velto-width="compact"]) .waste-compact-toggle,:host([data-velto-width="narrow"]) .waste-compact-toggle{width:30px;height:30px;min-width:30px;min-height:30px}
:host([data-velto-width="narrow"]) .tiles{grid-template-columns:1fr}
:host([data-velto-width="narrow"]) .tile.small,:host([data-velto-width="narrow"]) .tile.medium,:host([data-velto-width="narrow"]) .tile.large{grid-column:span 1}
:host([data-velto-width="narrow"]) .tile{min-height:108px}
:host([data-velto-width="narrow"]) .top{flex-wrap:wrap}
:host([data-velto-width="narrow"]) .weather{padding:13px}
:host([data-velto-width="narrow"]) .metric{padding:9px}

@media (min-width:781px) and (max-width:1366px){
  :host([data-velto-width="desktop"]) .layout .weather{grid-template-columns:minmax(0,1fr) minmax(0,1.35fr)!important;align-items:start!important}
  :host([data-velto-width="desktop"]) .layout .weather>.weather-forecast{grid-column:1/-1!important;grid-row:auto!important;display:block!important;width:100%!important;min-width:0!important}
  :host([data-velto-width="desktop"]) .layout .weather .forecast-strip{grid-template-columns:repeat(7,minmax(0,1fr))!important;grid-auto-flow:row!important;grid-auto-columns:minmax(0,1fr)!important;gap:8px!important;overflow:visible!important}
}


/* Consistent keyboard focus for dashboard and visual-editor controls. */
button:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible,[role="button"]:focus-visible{outline:2px solid #e99524;outline-offset:3px}
.forecast-day:focus-visible{outline:2px solid #e99524;outline-offset:3px}
`;this._styleElement=css}if(css.parentNode!==root||root.firstChild!==css)root.prepend(css);
    const h=this._hass,c=this._config;
    const el=(tag,cls,txt)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(txt!==undefined)n.textContent=txt;return n};
    let shell=el('div','layout'+(((this._themeOverride||c.theme)==='dark'||!this._themeOverride&&c.theme==='auto'&&this._hass?.themes?.darkMode)?' dark':'')),side=el('aside','sidebar'),brand=el('div','brand');brand.append('VEL',el('span','', 'TO'));const collapse=el('button','sidebar-collapse',this._sidebarCollapsed?'›':'‹');collapse.type='button';collapse.title=this._sidebarCollapsed?'Rozwiń menu':'Zwiń menu';collapse.setAttribute('aria-label',collapse.title);collapse.setAttribute('aria-expanded',String(!this._sidebarCollapsed));collapse.setAttribute('data-velto-focus-key','sidebar-collapse');collapse.addEventListener('click',()=>{this._sidebarCollapsed=!this._sidebarCollapsed;try{globalThis.localStorage?.setItem?.('velto:sidebar:collapsed',this._sidebarCollapsed?'1':'0')}catch{}this.render()});const brandRow=el('div','brand-row');brandRow.append(brand,collapse);side.append(brandRow);if(this._sidebarCollapsed)shell.classList.add('sidebar-collapsed');if(this._fullscreenFallback)shell.classList.add('fullscreen-fallback');
    const nav=el('nav','nav');nav.setAttribute('aria-label','Pomieszczenia');nav.setAttribute('data-velto-scroll-key','room-navigation');nav.setAttribute('data-velto-reuse-key','room-navigation');const discoveredRooms=this.getRooms();const rooms=[{id:'all',name:'Wszystkie',icon:'home'},...discoveredRooms];
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
    for(const room of rooms){const b=el('button',room.id===this._room?'selected':'');const roomIcon=room.id==='all'?'house':this.roomIconFor(room);b.append(this.phosphorRoomIcon(roomIcon),document.createTextNode(room.name));if(room.id!=='all'){const stats=roomStats(room),count=el('span','nav-count',String(stats.total));count.setAttribute('aria-hidden','true');b.append(count);if(stats.active){const dot=el('span','nav-active');dot.setAttribute('aria-hidden','true');b.append(dot)}}b.type='button';b.title=room.name;b.setAttribute('aria-label',room.name);b.setAttribute('data-velto-focus-key','room:'+room.id);b.setAttribute('data-velto-reuse-key','room-nav:'+room.id);if(room.id===this._room)b.setAttribute('aria-current','page');b.addEventListener('click',()=>{this._room=room.id;this._categoryFilter='all';this.render()});nav.append(b)}
    side.append(nav);const sidebarTools=el('details','sidebar-tools');sidebarTools.setAttribute('data-velto-scroll-key','sidebar-tools');sidebarTools.setAttribute('data-velto-reuse-key','sidebar-tools');sidebarTools.open=this._sidebarToolsOpen;sidebarTools.addEventListener('toggle',()=>{this._sidebarToolsOpen=sidebarTools.open});const sidebarSummary=el('summary','','Sterowanie i status');sidebarSummary.setAttribute('data-velto-focus-key','sidebar-tools-summary');sidebarTools.append(sidebarSummary);side.insertBefore(sidebarTools,nav);side.append(el('div','sidebar-note','VELTO · Home Assistant'));shell.append(side);
    const main=el('main','main'),top=el('header','top'),heading=el('div');top.setAttribute('data-velto-reuse-key','top-bar');if(this._editLayout)shell.classList.add('editing');heading.append(el('h2','',this._room==='all'?(!c.title||c.title==='Mój dom'?'Księstwo':c.title):(rooms.find(r=>r.id===this._room)?.name||'Pokój')));top.append(heading);
    const fullscreen=el('button','velto-fullscreen');fullscreen.type='button';fullscreen.setAttribute('data-velto-focus-key','top-fullscreen');fullscreen.title='Pełny ekran';fullscreen.setAttribute('aria-label','Przełącz pełny ekran');fullscreen.addEventListener('click',()=>this.toggleFullscreen());
    const topActions=el('div','velto-top-actions');topActions.setAttribute('role','group');topActions.setAttribute('aria-label','Widok i wygląd dashboardu');topActions.append(fullscreen);
    const edit=el('button','velto-edit');edit.append(this.icon(this._editLayout?'check':'grid-four'));edit.title=this._editLayout?'Zakończ układanie':'Ułóż kafelki';edit.setAttribute('aria-label',edit.title);
    edit.type='button';edit.setAttribute('data-velto-focus-key','top-edit-layout');edit.setAttribute('aria-pressed',String(this._editLayout));
    edit.addEventListener('click',()=>{this._editLayout=!this._editLayout;this.render()});
    topActions.append(edit);
    const themeDark=shell.classList.contains('dark');const themeToggle=el('button','velto-theme');themeToggle.append(this.icon(themeDark?'weather-sun':'moon'));themeToggle.type='button';themeToggle.setAttribute('data-velto-focus-key','top-theme');themeToggle.title=themeDark?'Włącz jasny motyw':'Włącz ciemny motyw';themeToggle.setAttribute('aria-label',themeToggle.title);themeToggle.setAttribute('aria-pressed',String(themeDark));themeToggle.addEventListener('click',()=>{this._themeOverride=themeDark?'light':'dark';try{globalThis.localStorage?.setItem?.('velto:theme:override',this._themeOverride)}catch{}this.render()});topActions.append(themeToggle);
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
        panel.setAttribute('role','group');panel.setAttribute('aria-label','Podsumowanie pomieszczenia: '+contextRoom.name);
        const chips=el('div','room-context-row');chips.setAttribute('role','group');chips.setAttribute('aria-label','Warunki i aktywność');
        const addContextChip=(icon,label,accessibleLabel,variant='')=>{
          const chip=el('span','room-chip'+(variant?' '+variant:''));chip.setAttribute('aria-label',accessibleLabel);
          const glyph=this.phosphorRoomIcon(icon);glyph.setAttribute('aria-hidden','true');glyph.setAttribute('focusable','false');
          chip.append(glyph,document.createTextNode(label));chips.append(chip)
        };
        if(Number.isFinite(context.temperature)){
          const temperature=context.temperature.toLocaleString('pl-PL',{maximumFractionDigits:1});
          const temperatureUnit=context.temperatureUnit||'°C';
          addContextChip('thermometer',temperature+temperatureUnit,'Temperatura: '+temperature+temperatureUnit)
        }
        if(Number.isFinite(context.humidity)){
          const humidity=context.humidity.toLocaleString('pl-PL',{maximumFractionDigits:1});
          addContextChip('drop',humidity+'%','Wilgotność: '+humidity+'%')
        }
        if(context.lights.length)addContextChip('lightbulb',context.lightsOn.length+'/'+context.lights.length+' światła','Światła włączone: '+context.lightsOn.length+' z '+context.lights.length);
        if(context.media.length)addContextChip('television',context.mediaPlaying.length+'/'+context.media.length+' media','Media odtwarzające: '+context.mediaPlaying.length+' z '+context.media.length);
        if(context.covers.length)addContextChip('app-window',context.coversOpen.length+'/'+context.covers.length+' otwarte osłony','Otwarte osłony: '+context.coversOpen.length+' z '+context.covers.length);
        if(context.attention.length){const names=context.attention.map(id=>this.name(id)||id);addContextChip('lock-key',this.roomAttentionLabel(context.attention.length),'Urządzenia wymagające uwagi: '+names.join(', '),'attention')}
        if(chips.children.length)panel.append(chips);
        const filters=el('div','room-filters');filters.setAttribute('role','group');filters.setAttribute('aria-label','Filtry urządzeń w '+contextRoom.name);
        const filterDefs=[['all','Wszystko',context.ids.length],['lights','Światła',context.categories.lights],['media','Media',context.categories.media],['climate','Klimat',context.categories.climate],['covers','Osłony',context.categories.covers],['security','Bezpieczeństwo',context.categories.security],['offline','Offline',context.categories.offline]];
        for(const [key,label,count] of filterDefs){
          if(key!=='all'&&!count)continue;
          const b=el('button','room-filter'+(this._categoryFilter===key?' selected':''),label+(key==='all'?'':' · '+count));b.type='button';b.setAttribute('aria-pressed',String(this._categoryFilter===key));b.setAttribute('data-velto-focus-key','room-filter:'+key);
          b.addEventListener('click',()=>{this._categoryFilter=key;if(key==='offline')this._activeOnly=false;this.render()});filters.append(b)
        }
        panel.append(filters);
        const actions=el('div','room-actions');actions.setAttribute('role','group');actions.setAttribute('aria-label','Szybkie akcje w '+contextRoom.name);
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
    activeFilter.type='button';activeFilter.setAttribute('data-velto-focus-key','sidebar-active-filter');activeFilter.setAttribute('aria-pressed',String(this._activeOnly));activeFilter.addEventListener('click',()=>{this._activeOnly=!this._activeOnly;this.render()});
    sidebarTools.append(activeFilter);
    const technicalFilter=el('button','active-filter'+(this._hideTechnical?' selected':''),this._hideTechnical?'Pokaż elementy techniczne':'Ukryj elementy techniczne');
    technicalFilter.type='button';technicalFilter.setAttribute('data-velto-focus-key','sidebar-technical-filter');technicalFilter.setAttribute('aria-pressed',String(this._hideTechnical));
    technicalFilter.title='Wyświetl lub ukryj elementy techniczne i diagnostyczne. Nie usuwa ich z Home Assistant';
    technicalFilter.addEventListener('click',()=>{this._hideTechnical=!this._hideTechnical;this.render()});
    sidebarTools.append(technicalFilter);
    const isTechnicalEntity=id=>{
      const domain=id.split('.')[0],name=(this.name(id)||'').toLowerCase(),state=this.entity(id);
      if(['update','number','select','input_number','input_select','input_text','button','input_button'].includes(domain))return true;
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
      const orderedEntities=this.orderedRoomEntities(room,order);
      const visibleEntities=orderedEntities.filter(item=>{const id=typeof item==='string'?item:item?.entity,domain=id?.split('.')[0];return id&&(!this._activeOnly||isActiveEntity(id))&&(!this._hideTechnical||!isTechnicalEntity(id))&&this.categoryMatch(id)&&(this._editLayout||c.room_controls===false||c.scene_shortcuts===false||!['scene','script'].includes(domain))});if((this._activeOnly||this._hideTechnical||this._categoryFilter!=='all'||c.scene_shortcuts!==false)&&!visibleEntities.length)continue;const header=el('div','section-head'),stats=roomStats(room);
      header.append(el('h3','',room.name),el('small','',room._highlights?'Automatycznie dobrane do bieżącego stanu domu':stats.total+' urządzeń'+(stats.active?' · '+stats.active+' aktywne':'')));main.append(header);
      const grid=el('div','tiles');grid.setAttribute('data-velto-reuse-key','room-grid:'+room.id);for(const item of visibleEntities){const t=typeof item==='string'?{entity:item}:item;if(!t?.entity)continue;const s=this.entity(t.entity),domain=t.entity.split('.')[0],on=this.tileIsActive(t.entity,s),missing=!s||['unavailable','unknown'].includes(s.state),savedSize=c.tile_sizes?.[room.id]?.[t.entity],tileSize=['small','medium','large'].includes(savedSize)?savedSize:(['small','medium','large'].includes(t.size)?t.size:'small');
        const deviceClass=typeof s?.attributes?.device_class==='string'?s.attributes.device_class.trim().toLowerCase():'';const tile=el('div','tile '+tileSize+(on?' on':'')+(missing?' missing':''));tile.setAttribute('data-velto-reuse-key','tile:'+room.id+':'+t.entity);tile.setAttribute('role',this._editLayout?'group':'button');tile.tabIndex=this._editLayout?-1:0;tile.dataset.entity=t.entity;tile.dataset.domain=domain;if(deviceClass)tile.dataset.deviceClass=deviceClass;const spokenState=domain==='input_text'?(s?.attributes?.mode==='password'?'wartość chroniona':'wartość tekstowa'):this.entityStateLabel(t.entity,s);tile.setAttribute('aria-label',(t.name||this.name(t.entity))+': '+spokenState);const sensorHistory=this.hasNumericSensorHistory(t.entity,s),binarySensorHistory=this.hasBinarySensorHistory(t.entity,s),historyKind=sensorHistory?'numeric':binarySensorHistory?'binary':null;if(historyKind){const historyText=historyKind==='binary'?'historię zdarzeń':domain==='sensor'?'historię pomiarów':'historię wartości';tile.setAttribute('aria-description','Przytrzymaj kafelek lub naciśnij F2, aby otworzyć '+historyText);tile.setAttribute('aria-keyshortcuts','F2');tile.title='Przytrzymaj lub naciśnij F2, aby zobaczyć '+historyText}if(domain==='cover'&&['opening','closing'].includes(s?.state))tile.classList.add('moving');if(domain==='valve'&&['opening','closing'].includes(s?.state))tile.classList.add('valve-moving');if(domain==='vacuum'&&['cleaning','returning'].includes(s?.state))tile.classList.add('vacuum-moving');if(domain==='lock'&&s?.state==='unlocked')tile.classList.add('unlocked');if(domain==='binary_sensor'&&s?.state==='on'){if(['motion','occupancy'].includes(deviceClass))tile.classList.add('motion-active');if(['door','opening'].includes(deviceClass))tile.classList.add('entry-open');if(['moisture','water'].includes(deviceClass))tile.classList.add('water-alert');if(['smoke','gas','carbon_monoxide'].includes(deviceClass))tile.classList.add('hazard-alert')}if(domain==='alarm_control_panel'&&s?.state==='triggered')tile.classList.add('alarm-triggered');if(this._serviceActionLocks.get(domain+':'+t.entity)?.pending)tile.setAttribute('aria-busy','true');if(['light','switch','fan','input_boolean'].includes(domain)&&!missing)tile.setAttribute('aria-pressed',String(on));
        const glyph=el('span','glyph'),iconOverride=this.tileIconOverride(t);if(iconOverride)glyph.append(this.phosphorTileIcon(iconOverride));else if(domain==='media_player'){
          const mediaName=String(t.name||this.name(t.entity)||'').toLowerCase();
          const mediaIcon=/monitor|display|screen/.test(mediaName)?'monitor-play':'television';
          glyph.append(this.phosphorRoomIcon(mediaIcon))
        }else glyph.append(this.phosphorTileIcon(this.iconFor(t.entity,s)));if(domain==='media_player'&&s?.state==='playing')glyph.classList.add('media-playing');tile.append(glyph);const desc=el('div','tile-wrap');const labels=el('div');labels.append(el('b','',t.name||this.name(t.entity)),el('small','',missing?'Niedostępne':domain==='input_text'?(s?.attributes?.mode==='password'?'Wartość chroniona':'Wartość tekstowa'):this.entityStateLabel(t.entity,s)+(s?.attributes?.unit_of_measurement?' '+s.attributes.unit_of_measurement:'')));desc.append(labels);
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
            controls.append(
              this.serviceActionButton('media_player','media_previous_track','skip-back','Poprzedni utwór',t.entity,Boolean(features&16)),
              this.serviceActionButton('media_player',s.state==='playing'?'media_pause':'media_play',s.state==='playing'?'pause':'play',s.state==='playing'?'Pauza':'Odtwórz',t.entity,Boolean(features&(s.state==='playing'?1:16384))),
              this.serviceActionButton('media_player','media_next_track','skip-forward','Następny utwór',t.entity,Boolean(features&32))
            );
            if(controls.children.length)desc.append(controls)
          }
        }
        if(domain==='vacuum'&&!missing){
          const a=s.attributes||{},meta=el('div','device-meta'),battery=Number(a.battery_level);
          if(a.battery_level!==undefined&&a.battery_level!==null&&String(a.battery_level).trim()!==''&&Number.isFinite(battery))meta.append(el('span','',String(Math.round(Math.max(0,Math.min(100,battery))))+'% bateria'));
          if(typeof a.fan_speed==='string'&&a.fan_speed.trim())meta.append(el('span','','Moc · '+a.fan_speed.trim()));
          if(typeof a.status==='string'&&a.status.trim())meta.append(el('span','',a.status.trim().slice(0,48)));
          if(meta.children.length)desc.append(meta);
          if(!this._editLayout){
            const controls=el('div','tile-controls'),cleaning=s.state==='cleaning',paused=s.state==='paused',returning=s.state==='returning',docked=s.state==='docked';
            const startable=['idle','docked','paused'].includes(s.state),returnable=cleaning||paused||s.state==='idle'||s.state==='error';
            const actions=[];
            if(startable&&this.vacuumSupports(s,VELTO_VACUUM_FEATURES.START,true))actions.push(this.serviceActionButton('vacuum','start','play','Uruchom odkurzacz',t.entity,true));
            if(cleaning&&this.vacuumSupports(s,VELTO_VACUUM_FEATURES.PAUSE,true))actions.push(this.serviceActionButton('vacuum','pause','pause','Wstrzymaj odkurzacz',t.entity,true));
            if(returnable&&!docked&&!returning&&this.vacuumSupports(s,VELTO_VACUUM_FEATURES.RETURN_HOME,true))actions.push(this.serviceActionButton('vacuum','return_to_base','house','Wróć do stacji dokującej',t.entity,true));
            if(actions.length){controls.append(...actions);desc.append(controls)}
          }
        }
        if(domain==='climate'&&!missing){
          const a=s.attributes||{},meta=el('div','device-meta'),current=Number(a.current_temperature),target=Number(a.temperature);
          if(Number.isFinite(current))meta.append(el('span','','Teraz '+current.toLocaleString('pl-PL',{maximumFractionDigits:1})+'°'));
          if(Number.isFinite(target))meta.append(el('span','','Cel '+target.toLocaleString('pl-PL',{maximumFractionDigits:1})+'°'));
          if(a.hvac_action)meta.append(el('span','',String(a.hvac_action)));
          if(meta.children.length)desc.append(meta)
        }
        if(domain==='water_heater'&&!missing){
          const a=s.attributes||{},meta=el('div','device-meta'),currentRaw=a.current_temperature??a.native_current_temperature,targetRaw=a.temperature??a.target_temperature??a.native_target_temperature,unit=typeof a.temperature_unit==='string'?a.temperature_unit:typeof a.native_temperature_unit==='string'?a.native_temperature_unit:'';
          if(currentRaw!==undefined&&currentRaw!==null&&String(currentRaw).trim()!==''&&Number.isFinite(Number(currentRaw)))meta.append(el('span','','Woda '+Number(currentRaw).toLocaleString('pl-PL',{maximumFractionDigits:1})+(unit?' '+unit:'')));
          if(targetRaw!==undefined&&targetRaw!==null&&String(targetRaw).trim()!==''&&Number.isFinite(Number(targetRaw)))meta.append(el('span','','Cel '+Number(targetRaw).toLocaleString('pl-PL',{maximumFractionDigits:1})+(unit?' '+unit:'')));
          if(meta.children.length)desc.append(meta)
        }
        if(domain==='cover'&&!missing){
          const a=s.attributes||{},position=Number(a.current_position),meta=el('div','device-meta');
          if(Number.isFinite(position))meta.append(el('span','',Math.round(position)+'% otwarcia'));
          if(meta.children.length)desc.append(meta);
          if(!this._editLayout){const features=Number(a.supported_features)||0,controls=el('div','tile-controls');
            controls.append(
              this.serviceActionButton('cover','open_cover','arrow-up','Otwórz osłonę',t.entity,Boolean(features&1)||features===0),
              this.serviceActionButton('cover','stop_cover','stop','Zatrzymaj osłonę',t.entity,Boolean(features&8)),
              this.serviceActionButton('cover','close_cover','arrow-down','Zamknij osłonę',t.entity,Boolean(features&2)||features===0)
            );desc.append(controls)
          }
        }
        if(domain==='camera'&&!missing&&tileSize!=='small'){
          const a=s.attributes||{},art=this.mediaArtwork(a),src=art?.startsWith('/')?art:'/api/camera_proxy/'+encodeURIComponent(t.entity);
          const preview=document.createElement('img');preview.className='camera-tile-art';preview.alt='Podgląd '+(t.name||this.name(t.entity));preview.loading='lazy';preview.src=src;
          preview.addEventListener('error',()=>{preview.hidden=true});desc.append(preview)
        }
        if(missing){const status=el('span','tile-status tile-status-offline','Brak połączenia');status.setAttribute('aria-hidden','true');desc.append(status)}
        else if(on&&['light','switch','fan','input_boolean','cover','media_player','vacuum','humidifier'].includes(domain)){const status=el('span','tile-status tile-status-on',domain==='cover'?'Otwarta':domain==='media_player'?'Odtwarzanie':domain==='vacuum'?'Pracuje':'Aktywne');status.setAttribute('aria-hidden','true');desc.append(status)}
        if(domain==='light'&&!missing&&((Array.isArray(s.attributes?.supported_color_modes)&&s.attributes.supported_color_modes.some(mode=>mode!=='onoff'&&mode!=='unknown'))||s.attributes?.supported_features&1)){
          const brightness=Number(s.attributes?.brightness),pct=Number.isFinite(brightness)?Math.round(Math.max(0,Math.min(255,brightness))/255*100):0,slider=document.createElement('input'),brightnessValue=el('span','brightness-label');
          slider.type='range';slider.className='brightness';slider.min='0';slider.max='100';slider.value=String(on?Math.max(1,pct):0);slider.disabled=!on;slider.setAttribute('aria-label','Jasność '+(t.name||this.name(t.entity)));
          const updateBrightness=()=>{brightnessValue.textContent=on?'Jasność · '+slider.value+'%':'Jasność · wyłączone';slider.style.setProperty('--brightness',on?slider.value+'%':'0%')};
          updateBrightness();
          for(const event of ['pointerdown','pointerup','click','keydown','keyup'])slider.addEventListener(event,e=>e.stopPropagation());
          slider.addEventListener('input',e=>{e.stopPropagation();updateBrightness()});
          this.bindLightTileBrightness(slider,t.entity,on);
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
        let timer,held=false,dragged=false,origin=null,historyHoldReady=false;
        const openTileDetails=()=>sensorHistory?this.showWeatherHistory(t.entity,t.name||this.name(t.entity)):binarySensorHistory?this.showBinarySensorHistory(t.entity,t.name||this.name(t.entity)):this.action(t.entity,'more');
        const stopHold=()=>{clearTimeout(timer);timer=null};
        tile.addEventListener('pointerdown',e=>{
          if(this._editLayout||e.button!==0||e.target?.closest?.('input,button'))return;
          stopHold();held=false;dragged=false;origin={x:e.clientX,y:e.clientY};
          timer=setTimeout(()=>{timer=null;if(!dragged){if(historyKind)historyHoldReady=true;else{held=true;openTileDetails()}}},600)
        });
        tile.addEventListener('pointermove',e=>{
          if(origin&&Math.hypot(e.clientX-origin.x,e.clientY-origin.y)>10){dragged=true;stopHold()}
        });
        tile.addEventListener('pointerup',()=>{stopHold();if(historyHoldReady&&!dragged){historyHoldReady=false;held=true;openTileDetails()}});
        tile.addEventListener('pointercancel',()=>{dragged=true;historyHoldReady=false;stopHold()});
        tile.addEventListener('pointerleave',()=>{historyHoldReady=false;stopHold()});
        tile.addEventListener('click',e=>{
          if(this._editLayout||e.target?.closest?.('input,button'))return;
          if(held||dragged){e.preventDefault();e.stopPropagation();held=false;dragged=false;origin=null;return}
          origin=null;this.action(t.entity,missing||domain==='media_player'||domain==='vacuum'||domain==='camera'?'more':'toggle')
        });
        tile.addEventListener('keydown',e=>{if(e.target!==tile||this._editLayout)return;if(e.key==='Enter'||e.key===' '){e.preventDefault();this.action(t.entity,missing||domain==='media_player'||domain==='vacuum'||domain==='camera'?'more':'toggle')}else if(e.key==='F2'){e.preventDefault();openTileDetails()}});
        tile.addEventListener('contextmenu',e=>{if(this._editLayout)return;e.preventDefault();stopHold();if(!held){held=true;openTileDetails()}});
        grid.append(tile)}
      if(!grid.children.length)grid.append(el('div','empty','Brak urządzeń. Dodaj je w edytorze wizualnym lub przypisz do obszaru w Home Assistant.'));main.append(grid)}
    if((c.weather?.entities||this.weatherForecastEntity())&&(this._room==='all'||c.weather?.show_in_rooms)){
      const wh=c.weather?.entities||{},forecastEntity=this.weatherForecastEntity(),hasLocalSensors=Object.values(wh).some(Boolean),sec=el('div','section-head');sec.setAttribute('data-velto-reuse-key','weather-heading');sec.append(el('h3','',c.weather?.title||'Pogoda lokalna'),el('small','',c.weather?.source||(hasLocalSensors?'InPost':'Home Assistant')));main.append(sec);
      const w=el('section','weather'),lead=el('div','weather-lead'),weatherState=forecastEntity?this.entity(forecastEntity):null;w.setAttribute('data-velto-reuse-key','weather-section');
      const sensorTemp=this.weatherNumber(wh.temperature),nativeTemp=this.weatherNumber(weatherState?.attributes?.temperature),temp=sensorTemp!==null?sensorTemp:(nativeTemp!==null?nativeTemp:null);
      lead.append(el('div','eyebrow','Na zewnątrz'));const temperatureTile=el('div','temperature',temp!==null?temp.toLocaleString('pl-PL',{maximumFractionDigits:1})+'°C':'—°C');temperatureTile.setAttribute('data-velto-reuse-key','weather-temperature:'+(wh.temperature||forecastEntity||'none'));this.bindWeatherHistory(temperatureTile,wh.temperature||forecastEntity,'Temperatura');lead.append(temperatureTile);
      const a=this.text(wh.air_index),airKey=typeof a==='string'?a.trim().toUpperCase().replace(/[\s-]+/g,'_'):null,labels={VERY_GOOD:'Bardzo dobre powietrze',GOOD:'Dobre powietrze',MODERATE:'Umiarkowane powietrze',BAD:'Zła jakość powietrza',VERY_BAD:'Bardzo zła jakość powietrza'};const air=el('div','air '+(airKey==='BAD'||airKey==='VERY_BAD'?'air-bad':airKey==='MODERATE'?'air-moderate':airKey==='GOOD'||airKey==='VERY_GOOD'?'air-good':'air-unknown'),a?labels[airKey]||'Brak oceny':this.weatherConditionLabel(weatherState?.state));air.setAttribute('role','status');const condition=weatherState?.state;if(condition&&condition!=='unknown'&&condition!=='unavailable'){const icon=el('span','weather-condition-symbol');icon.append(this.weatherConditionIcon(condition));icon.setAttribute('aria-hidden','true');air.prepend(icon)}const weatherClock=el('time','weather-clock');const updateWeatherClock=()=>{const now=new Date();weatherClock.textContent=now.toLocaleTimeString('pl-PL',{hour:'2-digit',minute:'2-digit',hour12:false});weatherClock.dateTime=now.toISOString()};updateWeatherClock();lead.append(air,weatherClock);w.append(lead);
      const metrics=el('div','metrics');for(const [key,label,unit] of [['humidity','Wilgotność','%'],['pressure','Ciśnienie','hPa'],['pm25','PM2.5','µg/m³'],['pm10','PM10','µg/m³']]){let num=this.weatherNumber(wh[key]);if(num===null&&weatherState&&['humidity','pressure'].includes(key)){const raw=weatherState.attributes?.[key];const native=raw===null||raw===undefined||raw===''?NaN:Number(raw);if(Number.isFinite(native))num=native}const v=num!==null?num.toLocaleString('pl-PL',{maximumFractionDigits:1})+' '+unit:'—';const m=el('div','metric');m.setAttribute('data-velto-reuse-key','weather-metric:'+key+':'+(wh[key]||'native'));m.append(el('small','',label),el('strong','',v));if(key==='pm25'||key==='pm10'){const level=this.airQualityLevel(key,num);const labelText={'very-good':'● Bardzo dobra jakość powietrza',good:'● Dobra jakość powietrza',moderate:'● Umiarkowana jakość powietrza',sufficient:'● Dostateczna jakość powietrza',bad:'● Zła jakość powietrza','very-bad':'● Bardzo zła jakość powietrza',unknown:'● Brak pomiaru'}[level];m.classList.add('pm-metric','pm-'+level);m.append(el('span','pm-label',labelText),el('small','pm-explain','Skala GIOŚ · 1 h · pył '+(key==='pm25'?'drobny':'grubszy')));m.title=label+' · '+labelText+' · Progi odniesienia: Polski Indeks Jakości Powietrza GIOŚ dla stężeń 1-godzinnych; lokalny czujnik nie jest stacją GIOŚ.'}this.bindWeatherHistory(m,wh[key]||(['humidity','pressure'].includes(key)?forecastEntity:null),label);metrics.append(m)}w.append(metrics);
      if(forecastEntity&&c.weather?.show_forecast!==false){
        const forecast=el('div','weather-forecast'),head=el('div','forecast-head');head.append(el('strong','','Prognoza na '+Math.min(this._weatherForecast.length||7,7)+' dni'),el('small','',this.name(forecastEntity)));forecast.append(head);
        if(this._weatherForecast.length){
          const forecastItems=this._weatherForecast.slice(0,7),strip=el('div','forecast-strip');strip.setAttribute('role','region');strip.setAttribute('aria-label','Prognoza pogody. Użyj strzałek w lewo i prawo, aby przechodzić między dniami; Home i End wybierają pierwszy i ostatni dzień.');strip.setAttribute('aria-keyshortcuts','ArrowLeft ArrowRight Home End');strip.setAttribute('tabindex','0');strip.setAttribute('data-velto-scroll-key','weather-forecast');strip.setAttribute('data-velto-focus-key','weather-forecast');strip.addEventListener('keydown',e=>this.handleForecastKeydown(strip,e));const today=new Date(),todayKey=[today.getFullYear(),today.getMonth(),today.getDate()].join('-');
          for(const [index,item] of forecastItems.entries()){
            const date=new Date(item.datetime),key=[date.getFullYear(),date.getMonth(),date.getDate()].join('-'),day=el('div','forecast-day');day.setAttribute('data-velto-reuse-key','forecast-day:'+key);day.setAttribute('data-velto-focus-key','forecast-day:'+key);day.tabIndex=-1;day.setAttribute('aria-posinset',String(index+1));day.setAttribute('aria-setsize',String(forecastItems.length));
            const name=key===todayKey?'Dziś':date.toLocaleDateString('pl-PL',{weekday:'short'});
            day.title=this.weatherConditionLabel(item.condition);day.setAttribute('role','group');if(key===todayKey)day.setAttribute('aria-current','date');const condition=String(item.condition||'').toLowerCase();day.classList.add(/sun|clear/.test(condition)?'forecast-sunny':/rain|pour|shower/.test(condition)?'forecast-wet':/snow|snowy/.test(condition)?'forecast-snowy':/cloud|overcast/.test(condition)?'forecast-cloudy':'forecast-neutral');
            day.append(el('div','forecast-name',name));const symbol=el('div','forecast-symbol');symbol.append(this.weatherConditionIcon(item.condition));day.append(symbol);
            const high=item.temperature!==null?item.temperature.toLocaleString('pl-PL',{maximumFractionDigits:0})+'°':'—',low=item.templow!==null?item.templow.toLocaleString('pl-PL',{maximumFractionDigits:0})+'°':'';
            day.append(el('div','forecast-temp',high));
            if(low)day.append(el('div','forecast-low','min '+low));
            if(item.precipitation_probability!==null)day.append(el('div','forecast-rain','opady '+Math.round(item.precipitation_probability)+'%'));
            const accessible=[name,this.weatherConditionLabel(item.condition),high!=='—'?'maksymalna '+high:null,low?'minimalna '+low:null,item.precipitation_probability!==null?'opady '+Math.round(item.precipitation_probability)+'%':null].filter(Boolean).join(', ');
            day.setAttribute('aria-label',accessible);strip.append(day)
          }

          forecast.append(strip);
          if(this._weatherForecastError||this._weatherForecastAwaitingUpdate){const stale=el('div','forecast-stale',this.weatherForecastStaleLabel());stale.setAttribute('role','status');forecast.append(stale)}
        }else forecast.append(el('div','forecast-status',this._weatherForecastError?'Prognoza dzienna niedostępna dla tego źródła pogody.':'Ładowanie prognozy 7-dniowej…'));
        w.append(forecast)
      }
      main.insertBefore(sec,top.nextSibling);main.insertBefore(w,sec.nextSibling)}
    if(c.waste_collection?.enabled!==false&&(this._room==='all'||c.waste_collection.show_in_rooms)){
      const info=this.wasteCollectionInfo(),cfg=c.waste_collection||{};
      if(info){
        const section=el('section','waste-section'),head=el('div','section-head'),actions=el('div','waste-actions');section.setAttribute('data-velto-reuse-key','waste-section');
        head.append(el('h3','',cfg.title||'Odpady'));
        const wasteSummary=el('small','waste-type-summary');wasteSummary.append(this.icon(info.type==='mixed'?'trash':'recycle'),document.createTextNode(' '+info.label));actions.append(wasteSummary);
        const compact=el('button','waste-compact-toggle');compact.setAttribute('data-velto-reuse-key','waste-toggle');compact.append(this.icon(this._wasteCollapsed?'caret-down':'caret-up'));compact.type='button';compact.title=this._wasteCollapsed?'Rozwiń przypomnienie o odpadach':'Zwiń przypomnienie o odpadach';compact.setAttribute('aria-label',compact.title);compact.setAttribute('aria-expanded',String(!this._wasteCollapsed));compact.setAttribute('aria-controls','velto-waste-content');compact.setAttribute('data-velto-focus-key','waste:compact');compact.addEventListener('click',()=>this.toggleWasteSection());
        actions.append(compact);head.append(actions);section.append(head);
        const content=el('div','waste-content');content.id='velto-waste-content';
        const card=el('div','waste-card '+(info.type==='mixed'?'waste-mixed':'waste-recycling'));
        const icon=el('div','waste-bin');icon.append(this.icon(info.type==='mixed'?'trash':'recycle'));icon.setAttribute('aria-hidden','true');
        const copy=el('div','waste-copy'),date=info.date.toLocaleDateString('pl-PL',{day:'numeric',month:'long'});
        copy.append(el('small','',info.days===0?'Dzisiaj wystaw:':info.days===1?'Jutro wystaw:':'Najbliższy odbiór · '+date),el('strong','',info.label));
        const details=info.type==='mixed'?'Czarny pojemnik':'Kolorowe pojemniki';
        copy.append(el('span','',details));
        const countdown=el('div','waste-countdown',info.days===0?'Dziś':info.days===1?'1 dzień':'Za '+info.days+' dni');
        card.append(icon,copy,countdown);content.append(card);
        if(cfg.show_next!==false){
          const nextDate=new Date(info.date);nextDate.setDate(nextDate.getDate()+7);
          const nextType=info.type==='mixed'?'Segregowane':'Zmieszane';
          const next=el('div','waste-next','Następny piątek · '+nextDate.toLocaleDateString('pl-PL',{day:'numeric',month:'long'})+' · '+nextType);
          content.append(next)
        }
        if(this._wasteCollapsed)section.classList.add('waste-compact');section.append(content);
        main.insertBefore(section,top.nextSibling)
      }
    }
    if((c.calendar?.entity||c.calendar?.entities?.length)&&(this._room==='all'||c.calendar.show_in_rooms)){
      const cfg=c.calendar,section=el('section','calendar-section'),head=el('div','section-head');section.setAttribute('data-velto-reuse-key','calendar-section');
      head.append(el('h3','',cfg.title||'Najbliższe wydarzenia'));const calendarActions=el('div','calendar-actions');calendarActions.append(el('small','',cfg.days?cfg.days+' dni':'14 dni'));const refresh=el('button','calendar-refresh');refresh.setAttribute('data-velto-reuse-key','calendar-refresh');refresh.append(this.icon('arrow-clockwise'));refresh.title='Odśwież wydarzenia';refresh.type='button';refresh.disabled=!!this._calendarLoading;refresh.setAttribute('aria-label','Odśwież wydarzenia kalendarza');refresh.setAttribute('data-velto-focus-key','calendar:refresh');refresh.addEventListener('click',()=>{if(!this._calendarLoading)this.loadCalendar(true)});calendarActions.append(refresh);head.append(calendarActions);section.append(head);if(this._calendarLastChecked){const checked=el('small','calendar-last-checked','Pobrano z HA: '+this._calendarLastChecked.toLocaleTimeString('pl-PL',{hour:'2-digit',minute:'2-digit'})+' · sprawdzanie co 2 min · synchronizacja Google zależy od HA');section.append(checked)}
      const events=this._calendarEvents.slice(0,Math.max(1,Math.min(30,Number(cfg.limit)||6)));
      const privacy=el('button','calendar-privacy');privacy.setAttribute('data-velto-reuse-key','calendar-privacy');privacy.append(this.icon(this._calendarPrivate?'eye-slash':'eye'));privacy.title=this._calendarPrivate?'Odkryj tytuły wydarzeń':'Rozmyj tytuły wydarzeń';privacy.type='button';privacy.setAttribute('aria-pressed',String(this._calendarPrivate));privacy.setAttribute('aria-label',privacy.title);privacy.setAttribute('aria-description','Tryb prywatności tytułów kalendarza');privacy.setAttribute('data-velto-focus-key','calendar:privacy');privacy.addEventListener('click',()=>{this._calendarPrivate=!this._calendarPrivate;try{globalThis.localStorage?.setItem?.('velto:calendar:private',this._calendarPrivate?'1':'0')}catch{}this.render()});calendarActions.insertBefore(privacy,refresh);
      const compact=el('button','calendar-compact-toggle');compact.setAttribute('data-velto-reuse-key','calendar-compact');compact.append(this.icon(this._calendarCompact?'caret-down':'caret-up'));compact.title=this._calendarCompact?'Rozwiń listę wydarzeń':'Zwiń listę wydarzeń';compact.setAttribute('aria-label',compact.title);compact.setAttribute('data-velto-focus-key','calendar:compact');compact.type='button';compact.setAttribute('aria-expanded',String(!this._calendarCompact));compact.addEventListener('click',()=>this.toggleCalendarCompact());calendarActions.insertBefore(compact,refresh);
      if(this._calendarError){const staleCount=this._calendarStaleSourceIds?.length||0,staleLabel=this.polishCount(staleCount,'źródło kalendarza','źródła kalendarzy','źródeł kalendarzy'),warning=staleCount?'Nie udało się odświeżyć '+staleCount+' '+staleLabel+'. '+(events.length?'Wyświetlam ostatnio pobrane wydarzenia.':'Ostatnio pobrane dane nie zawierają nadchodzących wydarzeń.'):events.length?'Nie udało się pobrać części kalendarzy. Wyświetlam dostępne wydarzenia.':'Nie udało się pobrać kalendarza. Sprawdź integrację i uprawnienia w Home Assistant.';section.append(el('div','registry-warning',warning))}
      else if(!events.length)section.append(el('div','calendar-empty',this._calendarLoading?'Ładowanie wydarzeń…':'Brak nadchodzących wydarzeń.'));
      const list=el('div','calendar-list');list.id='velto-calendar-list';list.setAttribute('role','list');list.setAttribute('data-velto-scroll-key','calendar-events');compact.setAttribute('aria-controls',list.id);
      for(const [eventIndex,event] of events.entries()){
        const date=this.eventDate(event.start),allDay=this.eventAllDay(event.start),item=el('div','calendar-event');item.setAttribute('role','listitem');item.setAttribute('data-velto-reuse-key','calendar-event:'+(event.id||date.getTime()+':'+eventIndex));
        const dateBox=el('div','calendar-date');
        dateBox.append(el('b','',date.toLocaleDateString('pl-PL',{day:'2-digit'})),el('small','',date.toLocaleDateString('pl-PL',{month:'short'})));
        const content=el('div','calendar-copy');const eventTitle=el('strong','calendar-event-title',this.calendarTitleText(event.summary));if(this._calendarPrivate){eventTitle.setAttribute('aria-hidden','true');content.append(eventTitle,el('span','sr-only','Tytuł wydarzenia ukryty'))}else content.append(eventTitle);
        const when=allDay?'Cały dzień':date.toLocaleTimeString('pl-PL',{hour:'2-digit',minute:'2-digit'});
        const source='';
        content.append(el('small','',date.toLocaleDateString('pl-PL',{weekday:'short'})+' · '+when+(source?' · '+source:'')));
        if(event.location&&!this._calendarPrivate)content.append(el('small','calendar-location',event.location));
        item.append(dateBox,content);list.append(item)
      }
      if(this._calendarCompact)section.classList.add('calendar-compact');if(this._calendarPrivate)section.classList.add('calendar-private');section.append(list);const weatherPanel=main.querySelector('section.weather');const header=main.querySelector('.top');if(weatherPanel)weatherPanel.after(section);else if(header)header.after(section);else main.prepend(section)
    }
    main.append(el('div','hint','Przytrzymaj kafelek lub kliknij prawym przyciskiem, aby otworzyć szczegóły urządzenia.'));shell.append(main);shell=this.commitRenderTree(root,css,shell,openDialog);this.pruneServiceActionLocks();this.restoreScrollState(root,scrollState);this.syncTileAnimationVisibility();this.updateFullscreenButton();if(dialogFocus){try{dialogFocus.focus({preventScroll:true})}catch{dialogFocus.focus?.()}}else if(focusKey){const target=[...(root.querySelectorAll?.('[data-velto-focus-key]')||[])].find(item=>item.getAttribute?.('data-velto-focus-key')===focusKey);if(target){try{target.focus({preventScroll:true})}catch{target.focus?.()}}}
  }
}
if(!customElements.get('velto-dashboard'))customElements.define('velto-dashboard',VeltoDashboard);
window.customCards=window.customCards||[];
if(!window.customCards.some(c=>c.type==='velto-dashboard'))window.customCards.push({type:'velto-dashboard',name:'VELTO Dashboard',description:'Pokoje, urządzenia, obecność i lokalna pogoda w jednym panelu'});


/* Visual configuration editor: rooms, entities, presence. Weather YAML remains supported. */
class VeltoDashboardEditor extends HTMLElement {
  constructor(){super();this.attachShadow({mode:'open'});this._historyShortcutListener=event=>this.handleEditorHistoryShortcut(event);this.shadowRoot.addEventListener('keydown',this._historyShortcutListener);this._config={rooms:[]};this._hass=null;this._selectedRoom=0;this._advanced=false;this._setupRegistry=null;this._setupRegistryConnection=null;this._setupRegistryLoading=false;this._setupRegistryLoadingConnection=null;this._setupRegistryRequest=0;this._setupRegistryError=null;this._renderFrame=null;this._cancelRenderFrame=null;this._renderPending=false;this._visibilityListener=null;this._pickerSignature=null;this._pickerSequence=0;this._undoStack=[];this._redoStack=[];this._historyLimit=20;this._configSignature=null;this._previewDashboard=null;this._previewSignature=null;this._previewOpenEntities=new Set();this._entityPickerOptionsSignature=null;this._entityPickerOptionsCache=null;this._pendingRoomEntityPickerRoom=null;this._pendingRoomEntityIds=new Set();this._selectedRoomEntityIds=new Set();this._roomAppearanceNotice='';this._pendingRoomEntityQuery='';this._pendingRoomEntityDomain='';this._pendingRoomEntityPickerOpen=false;this._configBackupNotice='';this._pendingConfigImport=null;this._configBackupRequest=0;this._editorLiveRegion=null}
  editorConfigSignature(config){try{return JSON.stringify(config??{})}catch{return null}}
  cloneEditorConfig(config){const signature=this.editorConfigSignature(config);return signature===null?null:JSON.parse(signature)}
  createConfigBackup(){
    const config=this.cloneEditorConfig(this._config);
    if(!config)throw new Error('Nie można odczytać bieżącej konfiguracji.');
    return {format:'velto-dashboard-config',schema_version:1,exported_at:new Date().toISOString(),config}
  }
  parseConfigBackupText(text){
    const fail=error=>({ok:false,error});
    if(typeof text!=='string'||!text.trim())return fail('Plik kopii jest pusty.');
    if(text.length>1048576)return fail('Plik kopii przekracza limit 1 MB.');
    let payload;
    try{payload=JSON.parse(text)}catch{return fail('Plik nie zawiera poprawnego JSON.')};
    const plain=value=>!!value&&typeof value==='object'&&!Array.isArray(value)&&(Object.getPrototypeOf(value)===Object.prototype||Object.getPrototypeOf(value)===null);
    if(!plain(payload)||payload.format!=='velto-dashboard-config')return fail('To nie jest kopia konfiguracji VELTO.');
    if(payload.schema_version!==1)return fail('Wersja tej kopii nie jest obsługiwana.');
    const config=payload.config;
    if(!plain(config))return fail('Kopia nie zawiera prawidłowej konfiguracji karty.');
    let visited=0;
    const safe=(value,depth=0)=>{
      if(++visited>12000||depth>20)return false;
      if(Array.isArray(value)){
        if(value.length>3000)return false;
        return value.every(item=>safe(item,depth+1))
      }
      if(value&&typeof value==='object'){
        if(!plain(value))return false;
        for(const key of Object.keys(value)){
          if(key==='__proto__'||key==='prototype'||key==='constructor')return false;
          if(!safe(value[key],depth+1))return false
        }
      }
      return true
    };
    if(!safe(config))return fail('Kopia zawiera niedozwoloną lub zbyt złożoną strukturę.');
    if(config.title!==undefined&&typeof config.title!=='string')return fail('Nazwa dashboardu musi być tekstem.');
    if(config.auto_areas!==undefined&&typeof config.auto_areas!=='boolean')return fail('Ustawienie automatycznego wykrywania musi mieć wartość logiczną.');
    if(config.low_battery_threshold!==undefined&&!VELTO_LOW_BATTERY_THRESHOLDS.includes(Number(config.low_battery_threshold)))return fail('Próg ostrzeżenia o niskiej baterii musi wynosić 10, 15, 20, 25, 30, 40 lub 50%.');
    if(config.rooms!==undefined&&!Array.isArray(config.rooms))return fail('Lista pomieszczeń musi być tablicą.');
    const rooms=Array.isArray(config.rooms)?config.rooms:[];
    if(rooms.length>100)return fail('Kopia zawiera więcej niż 100 pomieszczeń.');
    let entityCount=0;
    for(let roomIndex=0;roomIndex<rooms.length;roomIndex++){
      const room=rooms[roomIndex];
      if(!plain(room))return fail('Pomieszczenie '+(roomIndex+1)+' ma nieprawidłowy format.');
      if(room.id!==undefined&&typeof room.id!=='string')return fail('ID pomieszczenia '+(roomIndex+1)+' musi być tekstem.');
      if(room.name!==undefined&&typeof room.name!=='string')return fail('Nazwa pomieszczenia '+(roomIndex+1)+' musi być tekstem.');
      if(room.entities!==undefined&&!Array.isArray(room.entities))return fail('Lista urządzeń w pomieszczeniu '+(roomIndex+1)+' musi być tablicą.');
      const entities=Array.isArray(room.entities)?room.entities:[];
      entityCount+=entities.length;
      if(entityCount>3000)return fail('Kopia zawiera więcej niż 3000 przypisań urządzeń.');
      for(const item of entities){
        if(typeof item==='string')continue;
        if(!plain(item)||typeof item.entity!=='string')return fail('Każdy wpis musi zawierać tekstowe ID Home Assistant.')
      }
    }
    for(const key of ['weather','calendar','waste_collection','presence']){
      if(config[key]!==undefined&&!plain(config[key]))return fail('Sekcja '+key+' ma nieprawidłowy format.')
    }
    const clone=this.cloneEditorConfig(config);
    if(!clone)return fail('Nie udało się bezpiecznie skopiować konfiguracji.');
    if(clone.low_battery_threshold!==undefined)clone.low_battery_threshold=Number(clone.low_battery_threshold);
    return {ok:true,config:clone,exportedAt:typeof payload.exported_at==='string'?payload.exported_at:''}
  }
  configBackupSummary(config){
    const rooms=Array.isArray(config?.rooms)?config.rooms:[];
    const calendar=config?.calendar&&typeof config.calendar==='object'&&!Array.isArray(config.calendar)?config.calendar:{};
    const calendarIds=Array.isArray(calendar.entities)&&calendar.entities.length?calendar.entities:[calendar.entity];
    const calendarCount=new Set(calendarIds.filter(value=>typeof value==='string'&&value.trim()).map(value=>value.trim())).size;
    const weather=config?.weather&&typeof config.weather==='object'&&!Array.isArray(config.weather)?config.weather:{};
    const weatherEntities=Array.isArray(weather.entities)?weather.entities:weather.entities&&typeof weather.entities==='object'?Object.values(weather.entities):[];
    const weatherSourceIds=[...new Set([...weatherEntities,weather.forecast_entity||weather.entity].filter(value=>typeof value==='string'&&value.trim()).map(value=>value.trim()))];
    const countOverrides=key=>rooms.reduce((total,room)=>total+(Array.isArray(room?.entities)?room.entities.reduce((count,item)=>count+(item&&typeof item==='object'&&!Array.isArray(item)&&typeof item[key]==='string'&&!!item[key].trim()?1:0),0):0),0);
    const roomIconOverrides=rooms.reduce((total,room)=>total+(typeof room?.icon==='string'&&!!room.icon.trim()?1:0),0);
    const tileOrder=config?.tile_order&&typeof config.tile_order==='object'&&!Array.isArray(config.tile_order)?config.tile_order:{};
    const tileOrderRooms=Object.values(tileOrder).filter(ids=>Array.isArray(ids)&&ids.length>0).length;
    const tileSizes=config?.tile_sizes&&typeof config.tile_sizes==='object'&&!Array.isArray(config.tile_sizes)?config.tile_sizes:{};
    const tileSizeOverrides=Object.values(tileSizes).reduce((total,sizes)=>total+(sizes&&typeof sizes==='object'&&!Array.isArray(sizes)?Object.values(sizes).filter(size=>['small','medium','large'].includes(size)).length:0),0);
    const themeLabels={light:'jasny',dark:'ciemny',auto:'automatyczny'};
    const persistenceLabels={hybrid:'Home Assistant + lokalny backup',config:'tylko Home Assistant',local:'tylko na tym urządzeniu'};
    const configuredBatteryThreshold=Number(config?.low_battery_threshold);
    const lowBatteryThreshold=VELTO_LOW_BATTERY_THRESHOLDS.includes(configuredBatteryThreshold)?configuredBatteryThreshold:VELTO_LOW_BATTERY_THRESHOLD;
    const waste=config?.waste_collection&&typeof config.waste_collection==='object'&&!Array.isArray(config.waste_collection)?config.waste_collection:{};
    const anchor=typeof waste.anchor_date==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(waste.anchor_date)?waste.anchor_date.split('-').reverse().join('.'): 'data nieznana';
    const wasteType=waste.anchor_type==='recycling'?'recykling':'zmieszane';
    return {
      rooms:rooms.length,
      entities:rooms.reduce((total,room)=>total+(Array.isArray(room?.entities)?room.entities.length:0),0),
      calendarCount,
      weatherSourceCount:weatherSourceIds.length,
      presenceConfigured:typeof config?.presence?.entity==='string'&&!!config.presence.entity.trim(),
      forecastState:Object.keys(weather).length===0?'brak ustawień':weather.show_forecast===false?'wyłączona':'włączona',
      wasteEnabled:waste.enabled!==false,
      titleConfigured:typeof config?.title==='string'&&!!config.title.trim(),
      discoveryMode:config?.auto_areas===false?'ręczne':'automatyczne',
      themeLabel:themeLabels[config?.theme]||'automatyczny',
      layoutPersistenceLabel:persistenceLabels[config?.layout_persistence]||'Home Assistant + lokalny backup',
      roomIconOverrides,
      tileNameOverrides:countOverrides('name'),
      tileIconOverrides:countOverrides('icon'),
      tileOrderRooms,
      tileSizeOverrides,
      calendarInRooms:calendar.show_in_rooms===true,
      weatherInRooms:weather.show_in_rooms===true,
      homeHighlightsEnabled:config?.show_home_highlights!==false,
      lowBatteryThreshold,
      roomControlsEnabled:config?.room_controls!==false,
      diagnosticsEnabled:config?.show_diagnostics===true,
      wasteScheduleLabel:waste.enabled===false?'wyłączone':wasteType+' · '+anchor
    }
  }
  configBackupExportLabel(value){
    const raw=typeof value==='string'?value.trim():'';
    if(!raw||raw.length>80)return 'Data kopii: nieznana';
    const date=new Date(raw);
    if(!Number.isFinite(date.getTime()))return 'Data kopii: nieznana';
    try{
      return 'Data kopii: '+date.toLocaleString('pl-PL',{year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'})
    }catch{
      return 'Data kopii: '+date.toISOString()
    }
  }
  configBackupExportDateTime(value){
    const raw=typeof value==='string'?value.trim():'';
    if(!raw||raw.length>80)return '';
    const date=new Date(raw);
    return Number.isFinite(date.getTime())?date.toISOString():''
  }
  normalizeImportedConfig(config){
    const source=this.cloneEditorConfig(config);
    if(!source)throw new Error('Nie można przygotować importowanej konfiguracji.');
    const waste=source.waste_collection&&typeof source.waste_collection==='object'&&!Array.isArray(source.waste_collection)?source.waste_collection:{};
    return {...source,title:!source.title||source.title==='Mój dom'?'Księstwo':source.title,waste_collection:{enabled:true,anchor_date:'2026-11-06',anchor_type:'mixed',show_next:true,...waste},rooms:Array.isArray(source.rooms)?source.rooms:[]}
  }
  readConfigBackupFile(file){
    if(file&&typeof file.text==='function')return file.text();
    return new Promise((resolve,reject)=>{
      const Reader=globalThis.FileReader;
      if(typeof Reader!=='function'){reject(new Error('Ta przeglądarka nie udostępnia odczytu plików.'));return}
      const reader=new Reader();
      reader.onload=()=>resolve(String(reader.result||''));
      reader.onerror=()=>reject(new Error('Nie udało się odczytać pliku kopii.'));
      reader.readAsText(file)
    })
  }
  async loadConfigBackupFile(file){
    if(!file)return false;
    const request=++this._configBackupRequest;
    this._pendingConfigImport=null;
    const size=Number(file.size);
    if(Number.isFinite(size)&&size>1048576){
      this._configBackupNotice='Nie zaimportowano kopii: plik przekracza limit 1 MB.';
      this.render();return false
    }
    this._configBackupNotice='Sprawdzam plik kopii…';
    this.render();
    try{
      const raw=await this.readConfigBackupFile(file);
      if(request!==this._configBackupRequest||this.isConnected===false)return false;
      const parsed=this.parseConfigBackupText(String(raw));
      if(!parsed.ok)throw new Error(parsed.error);
      const config=this.normalizeImportedConfig(parsed.config);
      this._pendingConfigImport={config,fileName:String(file.name||'kopia.json').slice(0,120),...this.configBackupSummary(config),exportedAt:parsed.exportedAt};
      this._configBackupNotice='Kopia została sprawdzona. Bieżąca konfiguracja nie została jeszcze zmieniona.'
    }catch(error){
      if(request!==this._configBackupRequest)return false;
      this._pendingConfigImport=null;
      this._configBackupNotice='Nie zaimportowano kopii: '+String(error?.message||'nieznany błąd')
    }
    if(request===this._configBackupRequest&&this.isConnected!==false)this.render();
    return !!this._pendingConfigImport
  }
  applyPendingConfigImport(){
    if(!this._pendingConfigImport)return false;
    let config;
    try{config=this.normalizeImportedConfig(this._pendingConfigImport.config)}catch(error){
      this._configBackupNotice='Nie udało się przygotować importu: '+String(error?.message||'błąd');
      this._pendingConfigImport=null;this.render();return false
    }
    this._pendingConfigImport=null;
    if(this.editorConfigSignature(config)===this._configSignature){
      this._configBackupNotice='Ta kopia zawiera już bieżącą konfigurację. Niczego nie zmieniono.';
      this.render();return false
    }
    this._configBackupNotice='Import zakończony. Całą zmianę możesz cofnąć przyciskiem Cofnij.';
    return this.commit(config)
  }
  cancelPendingConfigImport(){
    if(!this._pendingConfigImport)return;
    this._pendingConfigImport=null;
    this._configBackupNotice='Import anulowano. Bieżąca konfiguracja pozostała bez zmian.';
    this.render()
  }
  downloadConfigBackup(){
    try{
      const payload=this.createConfigBackup(),BlobType=globalThis.Blob,urlApi=globalThis.URL;
      if(typeof BlobType!=='function'||typeof urlApi?.createObjectURL!=='function')throw new Error('Pobieranie plików nie jest dostępne w tej przeglądarce.');
      const blob=new BlobType([JSON.stringify(payload,null,2)+'\n'],{type:'application/json;charset=utf-8'});
      const url=urlApi.createObjectURL(blob),anchor=document.createElement('a');
      anchor.href=url;anchor.download='velto-config-'+new Date().toISOString().slice(0,10)+'.json';
      anchor.style.position='fixed';anchor.style.left='-10000px';anchor.style.width='1px';anchor.style.height='1px';
      (document.body||this.shadowRoot).append(anchor);anchor.click();anchor.remove();
      setTimeout(()=>urlApi.revokeObjectURL?.(url),1500);
      this._configBackupNotice='Kopia została wyeksportowana. Zawiera nazwy pomieszczeń i identyfikatory Home Assistant — przechowuj ją prywatnie.';
      this.render();return true
    }catch(error){
      this._configBackupNotice='Nie udało się wyeksportować kopii: '+String(error?.message||'błąd');
      this.render();return false
    }
  }
  setConfig(c){
    const next={...c,title:!c.title||c.title==='Mój dom'?'Księstwo':c.title,waste_collection:{enabled:true,anchor_date:'2026-11-06',anchor_type:'mixed',show_next:true,...(c.waste_collection||{})},rooms:Array.isArray(c.rooms)?c.rooms:[]};
    const signature=this.editorConfigSignature(next);
    if(this._configSignature!==null&&signature!==this._configSignature){this._undoStack.length=0;this._redoStack.length=0;this._pendingRoomEntityIds.clear();this._pendingRoomEntityQuery='';this._pendingRoomEntityPickerOpen=false;this._selectedRoomEntityIds.clear();this._roomAppearanceNotice=''}
    this._config=next;this._configSignature=signature;this.scheduleRender()
  }
  scheduleRender(){
    this._renderPending=true;
    if(this.isConnected===false)return;
    if(globalThis.document?.hidden===true)return;
    if(this._renderFrame!==null)return;
    const flush=()=>{
      this._renderFrame=null;this._cancelRenderFrame=null;
      if(this.isConnected===false||globalThis.document?.hidden===true)return;
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
  connectedCallback(){
    if(this._renderPending)this.scheduleRender();
    if(!this._visibilityListener){
      this._visibilityListener=()=>{if(globalThis.document?.hidden!==true)this.scheduleRender()};
      document.addEventListener('visibilitychange',this._visibilityListener)
    }
    this.loadSetupRegistry()
  }
  disconnectedCallback(){
    this.cancelScheduledRender();
    this._setupRegistryRequest++;this._setupRegistryLoading=false;this._setupRegistryLoadingConnection=null;
    if(this._setupRegistryError){this._setupRegistry=null;this._setupRegistryConnection=null;this._setupRegistryError=null}
    this._configBackupRequest++;
    if(this._visibilityListener){document.removeEventListener('visibilitychange',this._visibilityListener);this._visibilityListener=null}
  }
  normalizeEditorSearchText(value){
    return String(value??'').trim().toLocaleLowerCase('pl-PL').replace(/ł/g,'l').normalize('NFD').replace(/[\u0300-\u036f]/g,'')
  }
  editorPickerWindow(indexedOptions,query,selectedOption,limit=80){
    const normalizedQuery=this.normalizeEditorSearchText(query),visible=[];
    let count=0;
    for(const option of indexedOptions){
      if(normalizedQuery&&!option.search.includes(normalizedQuery))continue;
      count++;
      if(visible.length<limit)visible.push(option)
    }
    if(selectedOption&&!visible.some(option=>option.value===selectedOption.value))visible.unshift(selectedOption);
    return {visible,count,truncated:count>limit}
  }
  editorEntityPickerOptions(){
    const signature=this._pickerSignature??this.editorPickerSignature(this._hass);
    if(this._entityPickerOptionsCache&&this._entityPickerOptionsSignature===signature)return this._entityPickerOptionsCache;
    const states=this._hass?.states||{},options=Object.keys(states).sort().map(id=>{
      const label=String(states[id]?.attributes?.friendly_name||id),domain=id.includes('.')?id.slice(0,id.indexOf('.')):'';
      return {value:id,label,domain,search:this.normalizeEditorSearchText(label+' '+id)}
    });
    this._entityPickerOptionsSignature=signature;this._entityPickerOptionsCache=options;return options
  }
  editorEntityPickerWindow(indexedOptions,query,selectedIds,existingIds,limit=60,domainFilter=''){
    const normalizedQuery=this.normalizeEditorSearchText(query),normalizedDomain=String(domainFilter||'').trim().toLocaleLowerCase(),visible=[];
    const toSet=value=>value&&typeof value[Symbol.iterator]==='function'?new Set(value):new Set();
    const selected=toSet(selectedIds),existing=toSet(existingIds),max=Number.isFinite(Number(limit))?Math.max(1,Math.min(200,Math.floor(Number(limit)))):60;
    let count=0,selectedCount=0;
    for(const id of selected)if(!existing.has(id))selectedCount++;
    for(const option of indexedOptions){
      if(existing.has(option.value)||(normalizedDomain&&option.domain!==normalizedDomain)||(normalizedQuery&&!option.search.includes(normalizedQuery)))continue;
      count++;if(visible.length<max)visible.push(option)
    }
    return {visible,count,truncated:count>max,selectedCount}
  }
  editorPickerSignature(hass){
    const states=hass?.states||{},parts=[];
    for(const id of Object.keys(states)){
      const state=states[id]||{},attrs=state.attributes||{};
      parts.push(id,typeof attrs.friendly_name==='string'?attrs.friendly_name:'',id.startsWith('weather.')&&!['unknown','unavailable'].includes(state.state)?'available':'');
    }
    return JSON.stringify(parts)
  }
  set hass(h){
    const pickerSignature=this.editorPickerSignature(h),pickerOptionsChanged=this._pickerSignature!==pickerSignature;
    const previewSignature=this.editorPreviewSignature(h),previewChanged=this._previewSignature!==previewSignature;
    const previousConnection=this._hass?.connection;
    this._hass=h;this._pickerSignature=pickerSignature;this._previewSignature=previewSignature;
    if(previousConnection!==h?.connection){this._setupRegistryRequest++;this._setupRegistry=null;this._setupRegistryConnection=null;this._setupRegistryLoading=false;this._setupRegistryLoadingConnection=null;this._setupRegistryError=null}
    if(this.isConnected!==false)this.loadSetupRegistry();
    if(!this.shadowRoot?.children.length||pickerOptionsChanged||previewChanged)this.scheduleRender()
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
      const labels=['pomieszczeń','elementów','urządzeń'],failed=[];
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
        if(this.isConnected)this.scheduleRender()
      }
    }
  }
  captureEditorFocus(root=this.shadowRoot){
    const active=root?.activeElement,key=active?.getAttribute?.('data-velto-focus-key');
    if(!active||!key)return null;
    return {key,value:typeof active.value==='string'?active.value:null,selectionStart:Number.isInteger(active.selectionStart)?active.selectionStart:null,selectionEnd:Number.isInteger(active.selectionEnd)?active.selectionEnd:null}
  }
  indexEditorFocusTargets(root=this.shadowRoot){
    const counts=new Map(),targets=root?.querySelectorAll?.('input,select,button,textarea')||[];
    for(const element of targets){
      const labelText=element.closest?.('label')?.querySelector?.('span')?.textContent?.trim()||'';
      const semantic=element.getAttribute?.('aria-label')||element.getAttribute?.('placeholder')||labelText||element.textContent?.trim()||'';
      const tag=String(element.tagName||'control').toLowerCase(),type=String(element.type||''),base=tag+'|'+type+'|'+String(semantic||tag);
      const index=counts.get(base)||0;counts.set(base,index+1);
      element.setAttribute?.('data-velto-focus-key',base+'|'+index)
    }
  }
  restoreEditorFocus(root,snapshot){
    if(!snapshot||!root?.querySelectorAll)return;
    let target=[...root.querySelectorAll('[data-velto-focus-key]')].find(element=>element.getAttribute('data-velto-focus-key')===snapshot.key);
    if(!target)return;
    // A reorder can move the focused arrow to a list boundary, disabling it.
    // Keep focus inside the same reorder group by choosing its opposite enabled arrow.
    if(target.disabled){
      const group=target.closest?.('.room-order,.room-device-order');
      const candidates=group?.querySelectorAll?.('button')||[];
      const fallback=[...candidates].find(element=>!element.disabled&&!element.hidden&&element.getAttribute('aria-hidden')!=='true');
      if(!fallback)return;
      target=fallback
    }
    if(target.hidden||target.getAttribute('aria-hidden')==='true')return;
    if(snapshot.value!==null&&String(target.tagName||'').toLowerCase()==='input'&&['text','search'].includes(String(target.type||'').toLowerCase())){target.value=snapshot.value;if(String(target.type||'').toLowerCase()==='search')target.dispatchEvent?.(new CustomEvent('input',{bubbles:true}))}
    try{target.focus?.({preventScroll:true})}catch{target.focus?.()}
    if(Number.isInteger(snapshot.selectionStart)&&Number.isInteger(snapshot.selectionEnd))try{target.setSelectionRange?.(snapshot.selectionStart,snapshot.selectionEnd)}catch{}
  }
  moveEditorItem(items,from,to){
    if(!Array.isArray(items)||!Number.isInteger(from)||!Number.isInteger(to)||from<0||to<0||from>=items.length||to>=items.length||from===to)return items;
    const next=items.slice(),[item]=next.splice(from,1);next.splice(to,0,item);return next
  }
  announceEditorChange(message){if(this._editorLiveRegion)this._editorLiveRegion.textContent=String(message||'')}
  updateRoomEntity(entities,index,patch){
    if(!Array.isArray(entities)||!Number.isInteger(index)||index<0||index>=entities.length||!patch||typeof patch!=='object'||Array.isArray(patch))return entities;
    const raw=entities[index],item=typeof raw==='string'?{entity:raw}:raw&&typeof raw==='object'&&!Array.isArray(raw)?{...raw}:null;
    if(!item)return entities;
    for(const [key,value] of Object.entries(patch)){if(value===undefined||value===null||value==='')delete item[key];else item[key]=value}
    const next=entities.slice();next[index]=item;return next
  }
  roomEntitySelectionIndexes(entities){
    if(!Array.isArray(entities)||!this._selectedRoomEntityIds)return [];
    const indexes=[],seen=new Set();
    for(let index=0;index<entities.length;index++){
      const raw=entities[index],id=typeof raw==='string'?raw:raw?.entity;
      if(typeof id!=='string'||!id||!this._selectedRoomEntityIds.has(id)||seen.has(id))continue;
      seen.add(id);indexes.push(index)
    }
    return indexes;
  }
  setRoomEntitySelection(entities,selected){
    if(!Array.isArray(entities)||!this._selectedRoomEntityIds)return 0;
    const ids=new Set();
    for(const raw of entities){const id=typeof raw==='string'?raw:raw?.entity;if(typeof id==='string'&&id)ids.add(id)}
    for(const id of ids){if(selected===true)this._selectedRoomEntityIds.add(id);else this._selectedRoomEntityIds.delete(id)}
    this._roomAppearanceNotice='';
    return ids.size;
  }
  copyRoomEntityAppearance(entities,sourceIndex,targetIndexes,fields){
    if(!Array.isArray(entities)||!Number.isInteger(sourceIndex)||sourceIndex<0||sourceIndex>=entities.length||!fields||typeof fields!=='object'||Array.isArray(fields))return {entities,changed:false,targetCount:0};
    const sourceRaw=entities[sourceIndex],source=typeof sourceRaw==='string'?{entity:sourceRaw}:sourceRaw&&typeof sourceRaw==='object'&&!Array.isArray(sourceRaw)?sourceRaw:null;
    if(!source||typeof source.entity!=='string'||!source.entity)return {entities,changed:false,targetCount:0};
    const copySize=fields.size===true,copyIcon=fields.icon===true,copyName=fields.name===true;
    if(!copySize&&!copyIcon&&!copyName)return {entities,changed:false,targetCount:0};
    const indexes=targetIndexes&&typeof targetIndexes[Symbol.iterator]==='function'?[...new Set(targetIndexes)]:[];
    const validSize=value=>['small','medium','large'].includes(value);
    const sourceSize=validSize(source.size)?source.size:'small';
    const sourceIcon=typeof source.icon==='string'&&VELTO_TILE_ICON_NAMES.has(source.icon)?source.icon:'';
    const sourceName=typeof source.name==='string'?source.name.trim():'';
    const next=entities.slice(),seen=new Set();
    let changed=false,targetCount=0;
    for(const index of indexes){
      if(!Number.isInteger(index)||index<0||index>=entities.length||index===sourceIndex)continue;
      const raw=entities[index],target=typeof raw==='string'?{entity:raw}:raw&&typeof raw==='object'&&!Array.isArray(raw)?{...raw}:null;
      if(!target||typeof target.entity!=='string'||!target.entity||target.entity===source.entity||seen.has(target.entity))continue;
      seen.add(target.entity);
      let targetChanged=false;
      if(copySize){const size=validSize(target.size)?target.size:'small';if(size!==sourceSize){target.size=sourceSize;targetChanged=true}}
      if(copyIcon){
        if(sourceIcon){if(target.icon!==sourceIcon){target.icon=sourceIcon;targetChanged=true}}
        else if(Object.prototype.hasOwnProperty.call(target,'icon')){delete target.icon;targetChanged=true}
      }
      if(copyName){
        if(sourceName){if(target.name!==sourceName){target.name=sourceName;targetChanged=true}}
        else if(Object.prototype.hasOwnProperty.call(target,'name')){delete target.name;targetChanged=true}
      }
      if(targetChanged){next[index]=target;changed=true;targetCount++}
    }
    return {entities:changed?next:entities,changed,targetCount};
  }
  tileIconOptions(){return VELTO_TILE_ICON_OPTIONS}
  roomIconOptions(){return VELTO_ROOM_ICON_OPTIONS}
  roomIconValue(room){
    const configured=typeof room?.icon==='string'?room.icon:'';
    if(VELTO_ROOM_ICON_NAMES.has(configured)||VELTO_ROOM_ICON_COMPAT_NAMES.has(configured))return configured;
    if(!configured||VELTO_ROOM_ICON_LEGACY_AUTO.has(configured))return '';
    return VELTO_ROOM_ICON_LEGACY_MAP[configured]||''
  }
  editorPreviewSignature(hass=this._hass){
    const room=(this._config?.rooms||[])[this._selectedRoom],entities=Array.isArray(room?.entities)?room.entities:[],parts=[];
    for(const raw of entities){
      const entity=typeof raw==='string'?raw:typeof raw?.entity==='string'?raw.entity:'';
      if(!entity||!this._previewOpenEntities?.has(entity))continue;
      const state=hass?.states?.[entity],attrs=state?.attributes||{};
      const textMode=entity.startsWith('input_text.')?(attrs.mode??''):'';
      parts.push([entity,entity.startsWith('input_text.')?'[wartość tekstowa]':state?.state??'',attrs.friendly_name??'',attrs.unit_of_measurement??'',attrs.device_class??'',textMode])
    }
    return JSON.stringify(parts)
  }
  previewDashboard(){
    if(!this._previewDashboard){
      const Dashboard=customElements.get('velto-dashboard');
      if(typeof Dashboard==='function')this._previewDashboard=new Dashboard()
    }
    return this._previewDashboard
  }
  editorTilePreviewModel(raw,room){
    const item=typeof raw==='string'?{entity:raw}:raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{};
    const entity=typeof item.entity==='string'?item.entity:'',state=entity?this._hass?.states?.[entity]:null,attrs=state?.attributes||{},domain=entity.split('.')[0]||'';
    const iconOverride=typeof item.icon==='string'&&VELTO_TILE_ICON_NAMES.has(item.icon)?item.icon:null,renderer=this.previewDashboard();
    const icon=iconOverride||(entity&&renderer?.iconFor?renderer.iconFor(entity,state):'generic');
    const missing=!state||['unknown','unavailable'].includes(state.state);
    const active=renderer?.tileIsActive?renderer.tileIsActive(entity,state):!missing&&domain!=='input_text'&&(['on','open','unlocked','heat','cool','heating','playing','cleaning'].includes(state.state)||domain==='valve'&&['opening','closing'].includes(state.state));
    const configuredSize=room?.id?this._config?.tile_sizes?.[room.id]?.[entity]:null;
    const size=['small','medium','large'].includes(configuredSize)?configuredSize:['small','medium','large'].includes(item.size)?item.size:'small';
    const unit=typeof attrs.unit_of_measurement==='string'?attrs.unit_of_measurement:'';
    const stateLabel=missing?'Niedostępne':domain==='input_text'?(attrs.mode==='password'?'Wartość chroniona':'Wartość tekstowa'):(renderer?.entityStateLabel?renderer.entityStateLabel(entity,state):state.state||'Brak danych');
    const label=typeof item.name==='string'&&item.name.trim()?item.name.trim():typeof attrs.friendly_name==='string'&&attrs.friendly_name.trim()?attrs.friendly_name.trim():entity||'Urządzenie';
    return {entity,domain,label,icon,iconOverride,size,sizeLabel:{small:'Mały',medium:'Średni',large:'Duży'}[size],stateLabel:stateLabel+(unit?' '+unit:''),missing,active,mediaPlaying:domain==='media_player'&&!missing&&state.state==='playing'}
  }
  editorPreviewIcon(model){
    const renderer=this.previewDashboard();if(!renderer||!model)return null;
    if(model.domain==='media_player'&&!model.iconOverride){
      try{return renderer.phosphorRoomIcon(/monitor|display|screen/i.test(model.label)?'monitor-play':'television')}catch{}
    }
    try{return renderer.phosphorTileIcon(model.icon)}catch{return null}
  }
  editorConfigDiagnostics(config,states){
    const rooms=Array.isArray(config?.rooms)?config.rooms:[],stateMap=states&&typeof states==='object'&&!Array.isArray(states)?states:null,issues=[],roomIds=new Map(),entityRooms=new Map();
    const add=(code,roomIndex,entityIndex,room,entity,message)=>issues.push({code,roomIndex,entityIndex,roomName:room?.name||room?.id||'Pokój '+(roomIndex+1),entity:entity||'',message});
    rooms.forEach((room,roomIndex)=>{
      const roomId=typeof room?.id==='string'?room.id.trim():'';
      if(!roomId)add('room-id-missing',roomIndex,null,room,'','Pomieszczenie „'+(room?.name||'Pokój '+(roomIndex+1))+'” nie ma identyfikatora.');
      else if(roomIds.has(roomId))add('room-id-duplicate',roomIndex,null,room,'','Identyfikator pokoju „'+roomId+'” jest użyty więcej niż raz.');
      else roomIds.set(roomId,roomIndex);
      const seenHere=new Set(),entities=Array.isArray(room?.entities)?room.entities:[];
      entities.forEach((raw,entityIndex)=>{
        const entity=typeof raw==='string'?raw:typeof raw?.entity==='string'?raw.entity:'';
        if(!entity){add('entity-id-missing',roomIndex,entityIndex,room,'','Wpis urządzenia w pokoju „'+(room?.name||roomId||'Pokój '+(roomIndex+1))+'” nie ma identyfikatora Home Assistant.');return}
        if(!/^[a-z0-9_]+\.[a-z0-9_]+$/.test(entity)){add('entity-id-invalid',roomIndex,entityIndex,room,entity,'„'+entity+'” nie wygląda jak prawidłowy identyfikator Home Assistant.');return}
        if(seenHere.has(entity))add('entity-duplicate-room',roomIndex,entityIndex,room,entity,'Element „'+entity+'” jest dodany więcej niż raz w pokoju „'+(room?.name||roomId||'Pokój '+(roomIndex+1))+'”.');
        else{
          seenHere.add(entity);
          const previousRoom=entityRooms.get(entity);
          if(previousRoom!==undefined&&previousRoom!==roomIndex)add('entity-duplicate-cross-room',roomIndex,entityIndex,room,entity,'Element „'+entity+'” jest przypisany także do innego pomieszczenia.');
          else if(previousRoom===undefined)entityRooms.set(entity,roomIndex)
        }
        if(stateMap&&!Object.prototype.hasOwnProperty.call(stateMap,entity))add('entity-missing',roomIndex,entityIndex,room,entity,'Nie znaleziono aktywnego stanu „'+entity+'” w Home Assistant. Sprawdź, czy element nie został wyłączony lub usunięty.');
        else if(stateMap?.[entity]?.state==='unavailable')add('entity-unavailable',roomIndex,entityIndex,room,entity,'Element „'+entity+'” jest niedostępny (unavailable).');
      })
    });
    return issues
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
    const supported=new Set(['light','switch','fan','cover','climate','sensor','binary_sensor','media_player','lock','vacuum','scene','script','button','input_boolean','automation','humidifier','water_heater','alarm_control_panel','remote','select','number','input_select','input_number','input_button','input_datetime','weather','camera']);
    const includeTechnical=!!this._config.show_diagnostics;
    const visible=e=>e?.entity_id&&!e.disabled_by&&!e.hidden_by&&(includeTechnical||!['diagnostic','config'].includes(e.entity_category))&&states[e.entity_id]&&supported.has(e.entity_id.split('.')[0]);
    const assigned=registry.entities.filter(e=>visible(e)&&(e.area_id||deviceArea.get(e.device_id))).length;
    const usedAreas=new Set(registry.entities.filter(visible).map(e=>e.area_id||deviceArea.get(e.device_id)).filter(Boolean));
    return {areas:usedAreas.size,registeredAreas:registry.areas.length,assigned,people,trackers,calendars,weathers,cameras,media,lights}
  }
  commit(c){
    const signature=this.editorConfigSignature(c);
    if(signature!==null&&signature===this._configSignature)return false;
    const snapshot=this.cloneEditorConfig(this._config);
    if(signature!==null&&snapshot!==null){
      this._undoStack.push(snapshot);
      if(this._undoStack.length>this._historyLimit)this._undoStack.shift();
      this._redoStack.length=0
    }else{
      this._undoStack.length=0;this._redoStack.length=0
    }
    this._config=c;this._configSignature=signature;
    this.dispatchEvent(new CustomEvent('config-changed',{detail:{config:c},bubbles:true,composed:true}));
    this.render();return true
  }
  applyEditorHistory(direction){
    const undo=direction==='undo';
    if(!undo&&direction!=='redo')return false;
    const source=undo?this._undoStack:this._redoStack,destination=undo?this._redoStack:this._undoStack;
    if(!source.length)return false;
    const current=this.cloneEditorConfig(this._config);
    if(current===null)return false;
    destination.push(current);
    if(destination.length>this._historyLimit)destination.shift();
    this._config=source.pop();this._configSignature=this.editorConfigSignature(this._config);
    this.dispatchEvent(new CustomEvent('config-changed',{detail:{config:this._config},bubbles:true,composed:true}));
    this.render();return true
  }
  handleEditorHistoryShortcut(event){
    if(!event||event.defaultPrevented||event.repeat||event.isComposing||event.altKey)return false;
    if(!event.ctrlKey&&!event.metaKey)return false;
    const key=String(event.key||'').toLowerCase();
    const direction=key==='z'?(event.shiftKey?'redo':'undo'):(key==='y'&&event.ctrlKey&&!event.metaKey?'redo':null);
    if(!direction)return false;
    const target=event.target,tag=String(target?.tagName||'').toUpperCase();
    const editable=['INPUT','TEXTAREA','SELECT'].includes(tag)||target?.isContentEditable===true||!!target?.closest?.('input,textarea,select,[contenteditable=""],[contenteditable="true"],[role="textbox"]');
    if(editable)return false;
    const source=direction==='undo'?this._undoStack:this._redoStack;
    if(!source?.length||!this.applyEditorHistory(direction))return false;
    event.preventDefault?.();event.stopPropagation?.();return true
  }
  render(){
    const root=this.shadowRoot;if(!root)return;this._previewSignature=this.editorPreviewSignature(this._hass);const focus=this.captureEditorFocus(root);root.replaceChildren();
    const style=document.createElement('style');style.textContent=`
:host{display:block;font:inherit;color:var(--primary-text-color,#333)}*{box-sizing:border-box}.editor-sr-only{position:absolute!important;width:1px!important;height:1px!important;padding:0!important;margin:-1px!important;overflow:hidden!important;clip:rect(0,0,0,0)!important;white-space:nowrap!important;border:0!important}
.wrap{display:grid;gap:14px;padding:8px 0}.field{display:grid;gap:5px;font-size:13px;font-weight:600}
input,select,button{font:inherit;min-height:44px;border-radius:10px;padding:9px 11px;border:1px solid var(--divider-color,#ccc);background:var(--card-background-color,#fff);color:inherit;max-width:100%}
input,select{width:100%}button{cursor:pointer}
input:focus-visible,select:focus-visible,button:focus-visible{outline:2px solid var(--primary-color,#c18c43);outline-offset:3px}.actions{display:flex;gap:8px;flex-wrap:wrap}.actions button{flex:1}.primary{background:var(--primary-color,#c18c43);color:#fff;border:0}
.room{border:1px solid var(--divider-color,#ddd);border-radius:15px;padding:12px;display:grid;gap:12px}.search-picker{display:grid;gap:6px;min-width:0}.search-picker input{min-height:40px}.search-picker-status{display:block;min-height:1em;font-size:11px;line-height:1.35;opacity:.68}.row{display:grid;grid-template-columns:minmax(0,1fr) 90px 42px;gap:7px;align-items:center}.row small{display:block;font-size:11px;opacity:.65;overflow-wrap:anywhere}
.muted{font-size:12px;opacity:.7}.section{font-weight:750;margin:5px 0 0}
.setup{padding:16px;border:1px solid var(--divider-color,#ddd);border-radius:18px;background:var(--card-background-color,#fff);display:grid;gap:13px}.setup h3{margin:0;font-size:19px}.setup p{margin:0;line-height:1.45}.setup-ok{font-size:12px;font-weight:700;color:var(--success-color,#4b8b54)}.advanced-toggle{background:transparent}
.discovery{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.discovery div{padding:10px;border-radius:12px;background:var(--secondary-background-color,#f5f5f5);background:color-mix(in srgb,var(--card-background-color,#fff) 80%,var(--primary-color,#c18c43) 8%);text-align:center}.discovery b{display:block;font-size:18px}.discovery small{font-size:10px;opacity:.7}.setup-status{font-size:12px;padding:9px 10px;border-radius:10px;background:var(--secondary-background-color,#f5f5f5)}@media(max-width:520px){.discovery{grid-template-columns:repeat(2,minmax(0,1fr))}}.editor-history{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:10px 12px;border:1px solid var(--divider-color,#ddd);border-radius:13px;background:var(--secondary-background-color,#f5f5f5)}.editor-history button{min-width:104px}.editor-history button:disabled{opacity:.42;cursor:not-allowed}.editor-history small{flex:1 1 180px;font-size:11px;line-height:1.4;opacity:.68}.editor-diagnostics{display:grid;gap:7px;padding:12px 14px;border:1px solid color-mix(in srgb,var(--warning-color,#c58a35) 45%,var(--divider-color,#ddd));border-radius:14px;background:color-mix(in srgb,var(--warning-color,#c58a35) 9%,var(--card-background-color,#fff))}.editor-diagnostics-head{font-size:12px;font-weight:800;color:var(--primary-text-color,#333)}.editor-diagnostics-list{display:grid;gap:6px}.editor-diagnostic{margin:0;padding-left:17px;position:relative;font-size:12px;line-height:1.45;overflow-wrap:anywhere}.editor-diagnostic:before{content:'!';position:absolute;left:0;top:0;font-weight:900;color:var(--warning-color,#b7791f)}.editor-diagnostics-more{font-size:11px;opacity:.7}.room-selector-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:end}.room-order,.room-device-order{display:flex;align-items:center;justify-content:flex-end;gap:6px}.room-order button,.room-device-order button{display:grid;place-items:center;min-width:44px;min-height:44px;padding:8px;font-weight:800}.room-order button:disabled,.room-device-order button:disabled{opacity:.35;cursor:not-allowed}.room-device-row{grid-template-columns:44px minmax(0,1fr) auto;align-items:start}.room-device-row>div:nth-child(2){grid-column:2/-1;min-width:0}.room-device-row>select{grid-column:2;width:auto;min-width:100px}.room-device-row>.room-device-order{grid-column:1/-1}.room-device-select-wrap{display:grid;place-items:center;min-width:44px;min-height:44px;cursor:pointer}.room-device-select{width:22px;min-width:22px;min-height:22px;padding:0;accent-color:var(--primary-color,#c18c43)}.room-device-select:focus-visible,.room-device-bulk-fields input:focus-visible{outline:2px solid var(--primary-color,#c18c43);outline-offset:2px}.room-device-order{flex-wrap:wrap}.room-device-bulk-appearance{display:grid;gap:8px;padding:10px;border:1px solid var(--divider-color,#ddd);border-radius:12px;background:var(--secondary-background-color,#f5f5f5)}.room-device-bulk-appearance[hidden]{display:none}.room-device-bulk-status{font-size:11px;line-height:1.4;opacity:.72}.room-device-bulk-fields{display:flex;gap:10px;flex-wrap:wrap}.room-device-bulk-fields label{display:flex;align-items:center;gap:6px;min-height:44px;font-size:12px}.room-device-bulk-fields input{width:20px;min-width:20px;min-height:20px;padding:0;accent-color:var(--primary-color,#c18c43)}.room-device-selection-actions{display:flex;gap:8px;flex-wrap:wrap}.room-device-selection-actions button{min-height:44px}.room-device-selection-actions[hidden]{display:none}.room-device-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.room-device-options .field{min-width:0}.room-device-options input,.room-device-options select{min-width:0}@media(max-width:520px){.room-device-options{grid-template-columns:minmax(0,1fr)}}@media(max-width:420px){.room-selector-row{grid-template-columns:minmax(0,1fr)}.room-order{justify-content:flex-end}}
.room-entity-bulk{display:grid;gap:9px;padding:10px;border:1px solid var(--divider-color,#ddd);border-radius:14px;background:var(--secondary-background-color,#f5f5f5)}.room-entity-bulk>summary{display:flex;align-items:center;min-height:44px;cursor:pointer;font-size:13px;font-weight:750;list-style:none}.room-entity-bulk>summary::-webkit-details-marker{display:none}.room-entity-bulk>summary:focus-visible{outline:2px solid var(--primary-color,#c18c43);outline-offset:3px}.room-entity-bulk-body{display:grid;gap:8px;min-width:0}.room-entity-search{width:100%;min-height:44px}.room-entity-results{display:grid;gap:5px;max-height:280px;overflow:auto;overscroll-behavior:contain;padding:2px}.room-entity-choice{display:flex;align-items:center;gap:10px;min-height:48px;padding:6px 9px;border:1px solid var(--divider-color,#ddd);border-radius:10px;background:var(--card-background-color,#fff);cursor:pointer}.room-entity-choice input{width:22px;min-width:22px;min-height:22px;accent-color:var(--primary-color,#c18c43)}.room-entity-choice-copy{display:grid;gap:2px;min-width:0}.room-entity-choice-copy strong{font-size:12px;overflow-wrap:anywhere}.room-entity-choice-copy small{font-size:10px;opacity:.65;overflow-wrap:anywhere}.room-entity-count,.room-entity-empty{font-size:11px;line-height:1.4;opacity:.72}.room-entity-bulk-actions{display:flex;gap:7px;flex-wrap:wrap}.room-entity-bulk-actions button{flex:1 1 140px}.room-entity-bulk-actions button:disabled{opacity:.42;cursor:not-allowed}
.tile-preview-details{border-top:1px solid var(--divider-color,#ddd);padding-top:3px}.tile-preview-details summary{display:flex;align-items:center;min-height:44px;cursor:pointer;font-size:12px;font-weight:750;color:var(--secondary-text-color,var(--primary-text-color,#555))}.tile-preview-card{display:flex;align-items:center;gap:11px;min-height:68px;padding:11px 12px;border:1px solid var(--divider-color,#ddd);border-radius:15px;background:var(--card-background-color,#fff);box-shadow:4px 4px 10px rgba(0,0,0,.07),-3px -3px 10px rgba(255,255,255,.42);transition:background .18s,border-color .18s,box-shadow .18s}.tile-preview-card[data-size=medium]{min-height:78px}.tile-preview-card[data-size=large]{min-height:88px}.tile-preview-card.is-active{border-color:var(--warning-color,#d69a3c);background:var(--card-background-color,#fff);background:color-mix(in srgb,var(--warning-color,#d69a3c) 7%,var(--card-background-color,#fff))}.tile-preview-card.is-missing{opacity:.58}.tile-preview-glyph{display:grid;place-items:center;flex:0 0 42px;width:42px;height:42px;border-radius:13px;background:var(--secondary-background-color,#f4f1ea);color:var(--secondary-text-color,#716653)}.tile-preview-card.is-active .tile-preview-glyph{color:var(--warning-color,#d69a3c)}.tile-preview-card.is-playing .tile-preview-glyph{animation:velto-preview-pulse 1.8s ease-in-out infinite}.tile-preview-glyph svg{display:block;width:24px;height:24px}.tile-preview-glyph ha-icon{--mdc-icon-size:24px;width:24px;height:24px}.tile-preview-copy{display:grid;gap:3px;min-width:0;flex:1}.tile-preview-copy strong{font-size:13px;overflow-wrap:anywhere}.tile-preview-copy small{font-size:11px;opacity:.72;overflow-wrap:anywhere}.tile-preview-copy .tile-preview-entity{font-size:10px;opacity:.55}.tile-preview-size{flex:0 0 auto;padding:5px 8px;border-radius:9px;background:var(--secondary-background-color,#f4f1ea);font-size:10px;font-weight:750}@keyframes velto-preview-pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.06);opacity:.82}}@media(prefers-reduced-motion:reduce){.tile-preview-card,.tile-preview-glyph{transition:none;animation:none!important}}
.editor-backup{display:grid;gap:9px;padding:12px;border:1px solid var(--divider-color,#ddd);border-radius:15px;background:var(--secondary-background-color,#f5f5f5)}.editor-backup-head{display:grid;gap:4px}.editor-backup-head strong{font-size:13px}.editor-backup-head small{font-size:11px;line-height:1.45;opacity:.72}.editor-backup-actions{display:flex;gap:8px;flex-wrap:wrap}.editor-backup-actions button{flex:1 1 140px}.editor-backup-preview{display:grid;gap:8px;padding:10px;border:1px solid var(--divider-color,#ddd);border-radius:12px;background:var(--card-background-color,#fff)}.editor-backup-preview strong{font-size:12px}.editor-backup-preview p,.editor-backup-preview time{margin:0;font-size:12px;line-height:1.45;overflow-wrap:anywhere}.editor-backup-details{border-top:1px solid var(--divider-color,#ddd);padding-top:6px}.editor-backup-details>summary{display:flex;align-items:center;min-height:44px;padding:4px 6px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:750}.editor-backup-details>summary:focus-visible{outline:2px solid var(--primary-color,#c18c43);outline-offset:3px}.editor-backup-summary{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:6px;margin:0}.editor-backup-summary-item{display:flex;justify-content:space-between;align-items:flex-start;gap:8px;min-width:0;padding:7px 8px;border-radius:8px;background:var(--secondary-background-color,#f5f5f5);font-size:11px;line-height:1.4}.editor-backup-summary-item dt{margin:0;opacity:.72}.editor-backup-summary-item dd{margin:0;font-weight:600;text-align:right;overflow-wrap:anywhere}.editor-backup-status{font-size:12px;line-height:1.45;opacity:.78}

`;root.append(style);
    const wrap=document.createElement('div');wrap.className='wrap';root.append(wrap);
    if(!this._editorLiveRegion){const region=document.createElement('div');region.className='editor-sr-only';region.setAttribute('role','status');region.setAttribute('aria-live','polite');region.setAttribute('aria-atomic','true');region.setAttribute('data-velto-editor-announcement','true');this._editorLiveRegion=region}
    root.append(this._editorLiveRegion);
    const node=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n};
    const field=(label,value,fn)=>{const l=node('label',undefined,'field');l.append(node('span',label));const i=document.createElement('input');i.value=value||'';i.addEventListener('change',()=>fn(i.value));l.append(i);return l};
    const button=(label,fn,cls)=>{const b=node('button',label,cls);b.type='button';b.addEventListener('click',fn);return b};
    const choose=(options,value,fn)=>{const s=document.createElement('select');for(const [v,label] of options){const o=document.createElement('option');o.value=v;o.textContent=label;s.append(o)}s.value=value||'';s.addEventListener('change',()=>fn(s.value));return s};
    const searchChoose=(options,value,fn,placeholder='Szukaj…')=>{
      const box=node('div',undefined,'search-picker'),search=document.createElement('input'),select=choose(options,value,fn),status=node('small',undefined,'search-picker-status');
      const indexedOptions=options.map(([value,label])=>{const optionValue=String(value),optionLabel=String(label);return {value:optionValue,label:optionLabel,search:this.normalizeEditorSearchText(optionLabel+' '+optionValue)}});
      const indexedByValue=new Map(indexedOptions.map(option=>[option.value,option]));
      const pickerId='velto-editor-picker-'+(++this._pickerSequence),statusId=pickerId+'-status',optionLimit=80;
      search.type='search';search.placeholder=placeholder;search.setAttribute('aria-label',placeholder);search.setAttribute('aria-controls',pickerId);search.setAttribute('aria-describedby',statusId);search.autocomplete='off';
      select.id=pickerId;select.setAttribute('aria-label',placeholder);select.setAttribute('aria-describedby',statusId);
      status.id=statusId;status.setAttribute('role','status');status.setAttribute('aria-live','polite');
      const updateOptions=()=>{
        const rawQuery=search.value.trim(),selected=select.value,selectedOption=indexedByValue.get(selected);
        const results=this.editorPickerWindow(indexedOptions,rawQuery,selectedOption,optionLimit);
        select.replaceChildren();
        for(const entry of results.visible){const option=document.createElement('option');option.value=entry.value;option.textContent=entry.label;select.append(option)}
        if(rawQuery&&!results.count){const empty=document.createElement('option');empty.value='__velto_no_match__';empty.disabled=true;empty.textContent='Brak pasujących pozycji';select.append(empty)}
        if(selectedOption)select.value=selected;
        else if(!results.visible.length)select.value='';
        const count=results.count,word=count===1?'wynik':count%10>=2&&count%10<=4&&Math.floor(count/10)%10!==1?'wyniki':'wyników';
        const limitHint=results.truncated?' · pokazuję maks. 80; doprecyzuj wyszukiwanie':'';
        status.textContent=rawQuery?(count?count+' '+word+limitHint:'Brak wyników dla „'+rawQuery+'”.'):count+' pozycji'+limitHint
      };
      search.addEventListener('input',updateOptions);updateOptions();
      box.append(search,select,status);Object.defineProperty(box,'value',{get:()=>select.value});box.focus=()=>search.focus();return box
    };
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
    setup.append(field('Nazwa domu / dashboardu',c.title||'Księstwo',v=>set({title:v||'Księstwo'})));
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
    const backup=node('section',undefined,'editor-backup');
    const backupHead=node('div',undefined,'editor-backup-head');
    backupHead.append(node('strong','Kopia konfiguracji VELTO'),node('small','Zapisz ustawienia karty do pliku JSON lub przywróć je z wcześniej utworzonej kopii. Plik zawiera nazwy pomieszczeń i identyfikatory Home Assistant — przechowuj go prywatnie. Lokalne preferencje interfejsu nie są częścią kopii.'));
    backup.append(backupHead);
    const backupActions=node('div',undefined,'editor-backup-actions');
    const exportBackup=button('Eksportuj JSON',()=>this.downloadConfigBackup());
    exportBackup.setAttribute('data-velto-backup-export','true');exportBackup.setAttribute('aria-label','Eksportuj kopię konfiguracji VELTO do pliku JSON');
    const importBackup=button('Importuj JSON',()=>backupFile.click());
    importBackup.setAttribute('data-velto-backup-import','true');importBackup.setAttribute('aria-label','Wybierz plik kopii konfiguracji VELTO');
    const backupFile=document.createElement('input');backupFile.type='file';backupFile.accept='.json,application/json';backupFile.hidden=true;backupFile.setAttribute('data-velto-backup-file','true');backupFile.setAttribute('aria-label','Plik kopii konfiguracji VELTO');
    backupFile.addEventListener('change',()=>{const file=backupFile.files?.[0];backupFile.value='';if(file)this.loadConfigBackupFile(file)});
    backupActions.append(exportBackup,importBackup);backup.append(backupActions,backupFile);
    if(this._pendingConfigImport){
      const preview=node('div',undefined,'editor-backup-preview');preview.setAttribute('data-velto-backup-preview','true');
      const backupDate=node('time',this.configBackupExportLabel(this._pendingConfigImport.exportedAt),'editor-backup-date');
      const backupDateTime=this.configBackupExportDateTime(this._pendingConfigImport.exportedAt);
      if(backupDateTime)backupDate.setAttribute('datetime',backupDateTime);
      backupDate.setAttribute('data-velto-backup-date','true');
      preview.append(node('strong','Kopia gotowa do przywrócenia'),node('p','Plik: '+this._pendingConfigImport.fileName),backupDate);
      const summary=node('dl',undefined,'editor-backup-summary');summary.setAttribute('data-velto-backup-summary','true');summary.setAttribute('aria-label','Zakres danych w kopii');
      for(const [label,value] of [
        ['Pomieszczenia',String(this._pendingConfigImport.rooms)],
        ['Przypisania urządzeń',String(this._pendingConfigImport.entities)],
        ['Kalendarze',String(this._pendingConfigImport.calendarCount)],
        ['Źródła pogody',String(this._pendingConfigImport.weatherSourceCount)],
        ['Prognoza 7 dni',this._pendingConfigImport.forecastState],
        ['Obecność',this._pendingConfigImport.presenceConfigured?'skonfigurowana':'brak'],
        ['Odpady',this._pendingConfigImport.wasteEnabled?'włączone':'wyłączone']
      ]){
        const item=node('div',undefined,'editor-backup-summary-item');
        item.append(node('dt',label),node('dd',value));summary.append(item)
      }
      const backupDetails=document.createElement('details');backupDetails.className='editor-backup-details';backupDetails.setAttribute('data-velto-backup-details','true');
      backupDetails.append(node('summary','Pozostałe ustawienia karty'));
      const extraSummary=node('dl',undefined,'editor-backup-summary');
      for(const [label,value] of [
        ['Tytuł dashboardu',this._pendingConfigImport.titleConfigured?'własny':'domyślny'],
        ['Wykrywanie pomieszczeń',this._pendingConfigImport.discoveryMode],
        ['Motyw',this._pendingConfigImport.themeLabel],
        ['Zapisywanie układu',this._pendingConfigImport.layoutPersistenceLabel],
        ['Ikony pomieszczeń',String(this._pendingConfigImport.roomIconOverrides)],
        ['Własne nazwy kafelków',String(this._pendingConfigImport.tileNameOverrides)],
        ['Własne ikony kafelków',String(this._pendingConfigImport.tileIconOverrides)],
        ['Pokoje z własną kolejnością',String(this._pendingConfigImport.tileOrderRooms)],
        ['Rozmiary kafelków',String(this._pendingConfigImport.tileSizeOverrides)],
        ['Kalendarz w pokojach',this._pendingConfigImport.calendarInRooms?'tak':'nie'],
        ['Pogoda w pokojach',this._pendingConfigImport.weatherInRooms?'tak':'nie'],
        ['Najważniejsze urządzenia',this._pendingConfigImport.homeHighlightsEnabled?'włączone':'wyłączone'],
        ['Próg niskiej baterii',this._pendingConfigImport.lowBatteryThreshold+'%'],
        ['Sterowanie pokojami',this._pendingConfigImport.roomControlsEnabled?'włączone':'wyłączone'],
        ['Diagnostyka',this._pendingConfigImport.diagnosticsEnabled?'włączona':'wyłączona'],
        ['Harmonogram odpadów',this._pendingConfigImport.wasteScheduleLabel]
      ]){
        const item=node('div',undefined,'editor-backup-summary-item');
        item.append(node('dt',label),node('dd',value));extraSummary.append(item)
      }
      backupDetails.append(extraSummary);
      preview.append(summary,backupDetails,node('p','Podsumowanie pokazuje zakres bez ujawniania nazw ani identyfikatorów z pliku.'),node('p','Lokalne preferencje przeglądarki, takie jak zwinięcie menu, prywatność kalendarza i nadpisanie motywu, pozostaną bez zmian i nie są częścią kopii.'),node('p','Import zastąpi bieżącą konfigurację karty. Zostanie zapisany jako jedna zmiana, którą można cofnąć.'));
      const previewActions=node('div',undefined,'editor-backup-actions'),applyBackup=button('Zastąp konfigurację',()=>this.applyPendingConfigImport(),'primary'),cancelBackup=button('Anuluj',()=>this.cancelPendingConfigImport());
      applyBackup.setAttribute('data-velto-backup-apply','true');cancelBackup.setAttribute('data-velto-backup-cancel','true');
      previewActions.append(applyBackup,cancelBackup);preview.append(previewActions);backup.append(preview)
    }
    if(this._configBackupNotice){
      const status=node('div',this._configBackupNotice,'editor-backup-status');status.setAttribute('data-velto-backup-status','true');status.setAttribute('role','status');status.setAttribute('aria-live','polite');backup.append(status)
    }
    wrap.append(backup);
    if(this._undoStack.length||this._redoStack.length){
      const history=node('div',undefined,'editor-history'),undo=button('↶ Cofnij',()=>this.applyEditorHistory('undo')),redo=button('↷ Ponów',()=>this.applyEditorHistory('redo'));
      history.setAttribute('role','group');history.setAttribute('aria-label','Historia zmian konfiguracji');
      undo.disabled=!this._undoStack.length;undo.setAttribute('aria-label','Cofnij ostatnią zmianę konfiguracji');undo.setAttribute('aria-keyshortcuts','Control+Z Meta+Z');undo.title='Cofnij ostatnią zmianę';
      redo.disabled=!this._redoStack.length;redo.setAttribute('aria-label','Ponów cofniętą zmianę konfiguracji');redo.setAttribute('aria-keyshortcuts','Control+Shift+Z Meta+Shift+Z Control+Y');redo.title='Ponów ostatnią cofniętą zmianę';
      history.append(undo,redo,node('small','Do 20 zmian w bieżącej sesji. Skróty: Ctrl/Cmd+Z — cofnij; Ctrl/Cmd+Shift+Z lub Ctrl+Y — ponów. W polach tekstowych skróty pozostają natywne.'));
      wrap.append(history)
    }
    if(!this._advanced){
      if(c.auto_areas===false&&!rooms.length){
        const manual=node('div',undefined,'actions');manual.append(button('＋ Dodaj pierwszy pokój',()=>{this._advanced=true;const next=[{id:'room_'+Date.now(),name:'Nowy pokój',entities:[]}];this._selectedRoom=0;set({rooms:next})},'primary'));wrap.append(manual)
      }
      return
    }
    wrap.append(field('Tytuł dashboardu',c.title||'Księstwo',v=>set({title:v})));
    const auto=node('label',undefined,'field');const autoLabel=node('span','Automatycznie wykrywaj pomieszczenia i urządzenia z Home Assistant');const autoCheck=document.createElement('input');autoCheck.type='checkbox';autoCheck.checked=!!c.auto_areas;autoCheck.style.width='auto';autoCheck.addEventListener('change',()=>set({auto_areas:autoCheck.checked}));auto.append(autoLabel,autoCheck);wrap.append(auto);
    const hide=node('label',undefined,'field');hide.append(node('span','Ukryj puste pokoje'));const hideCheck=document.createElement('input');hideCheck.type='checkbox';hideCheck.style.width='auto';hideCheck.checked=!!c.hide_empty_rooms;hideCheck.addEventListener('change',()=>set({hide_empty_rooms:hideCheck.checked}));hide.append(hideCheck);wrap.append(hide);
    const themeLabel=node('label',undefined,'field');themeLabel.append(node('span','Motyw VELTO'));
    themeLabel.append(choose([['light','Jasny'],['dark','Ciemny'],['auto','Automatyczny (motyw Home Assistant)']],c.theme||'light',v=>set({theme:v})));wrap.append(themeLabel);
    const smart=node('label',undefined,'field');smart.append(node('span','Inteligentny układ automatycznych kafelków'));
    const smartCheck=document.createElement('input');smartCheck.type='checkbox';smartCheck.style.width='auto';smartCheck.checked=c.smart_layout!==false;smartCheck.addEventListener('change',()=>set({smart_layout:smartCheck.checked}));smart.append(smartCheck);wrap.append(smart);
    const diag=node('label',undefined,'field');diag.append(node('span','Pokaż elementy diagnostyczne i konfiguracyjne'));
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
    wrap.append(node('div','Bezpieczeństwo','section'));
    const batteryThreshold=node('label',undefined,'field');batteryThreshold.append(node('span','Próg ostrzeżenia o niskiej baterii'));
    const configuredBatteryThreshold=Number(c.low_battery_threshold),batteryThresholdValue=VELTO_LOW_BATTERY_THRESHOLDS.includes(configuredBatteryThreshold)?configuredBatteryThreshold:VELTO_LOW_BATTERY_THRESHOLD;
    const batteryThresholdSelect=choose(VELTO_LOW_BATTERY_THRESHOLDS.map(value=>[String(value),value+'%']),String(batteryThresholdValue),value=>set({low_battery_threshold:Number(value)}));
    batteryThresholdSelect.setAttribute('data-velto-low-battery-threshold','true');
    batteryThreshold.append(batteryThresholdSelect);wrap.append(batteryThreshold);
    wrap.append(node('p','Dotyczy liczbowych czujników baterii w ostrzeżeniach pomieszczeń i sekcji „Najważniejsze”. Binarne czujniki baterii nadal korzystają ze stanu zgłaszanego przez Home Assistant.','muted'));
    wrap.append(node('div','Przypięte do „Najważniejsze”','section'));
    const pinned=Array.isArray(c.home_favorites)?c.home_favorites.filter(id=>typeof id==='string'):[];
    const favoriteDomains=new Set(['light','switch','fan','cover','climate','media_player','lock','vacuum','camera','input_boolean','alarm_control_panel','binary_sensor','sensor','weather']);
    const favoriteIds=Object.keys(this._hass?.states||{}).filter(id=>favoriteDomains.has(id.split('.')[0])).sort();
    const favoritePicker=searchChoose([['','Wybierz urządzenie…'],...favoriteIds.filter(id=>!pinned.includes(id)).map(id=>[id,(this._hass.states[id]?.attributes?.friendly_name||id)+' · '+id])],'',()=>{},'Szukaj urządzenia do przypięcia…');
    wrap.append(favoritePicker);
    wrap.append(button('＋ Przypnij urządzenie',()=>{if(favoritePicker.value)set({home_favorites:[...pinned,favoritePicker.value]})}));
    for(const id of pinned){
      const entry=node('div',undefined,'row'),label=node('div');
      label.append(node('strong',this._hass?.states?.[id]?.attributes?.friendly_name||id),node('small',id));entry.append(label);
      entry.append(node('span','Ulubione','muted'));
      const favoriteName=this._hass?.states?.[id]?.attributes?.friendly_name||id;
      const removeFavorite=button('×',()=>set({home_favorites:pinned.filter(item=>item!==id)}));
      removeFavorite.setAttribute('aria-label','Usuń z „Najważniejsze”: '+favoriteName);
      removeFavorite.setAttribute('data-velto-remove-favorite',id);
      removeFavorite.title='Usuń z „Najważniejsze”';
      entry.append(removeFavorite);
      wrap.append(entry)
    }
    wrap.append(node('div','Pomieszczenia','section'));
    const selectedRoomIndex=Math.max(0,Math.min(Number.isInteger(this._selectedRoom)?this._selectedRoom:0,Math.max(rooms.length-1,0)));
    const selector=choose(rooms.map((r,i)=>[String(i),r.name||r.id]),String(selectedRoomIndex),v=>{this._selectedRoom=Number(v);this.render()});
    if(rooms.length){
      const selectorRow=node('div',undefined,'room-selector-row'),order=node('div',undefined,'room-order'),roomName=rooms[selectedRoomIndex]?.name||rooms[selectedRoomIndex]?.id||'pomieszczenie';
      const moveRoom=target=>{const current=this._config.rooms||[],next=this.moveEditorItem(current,selectedRoomIndex,target);if(next===current)return;this._selectedRoom=target;if(set({rooms:next}))this.announceEditorChange('Pokój '+roomName+' przeniesiono na pozycję '+(target+1)+' z '+current.length+'.')};
      const roomUp=button('↑',()=>moveRoom(selectedRoomIndex-1)),roomDown=button('↓',()=>moveRoom(selectedRoomIndex+1));
      roomUp.disabled=selectedRoomIndex===0;roomDown.disabled=selectedRoomIndex>=rooms.length-1;
      roomUp.setAttribute('aria-label','Przesuń pokój '+roomName+' wyżej');roomDown.setAttribute('aria-label','Przesuń pokój '+roomName+' niżej');
      roomUp.title='Przesuń pokój wyżej';roomDown.title='Przesuń pokój niżej';
      order.append(roomUp,roomDown);selectorRow.append(selector,order);wrap.append(selectorRow)
    }
    const bar=node('div',undefined,'actions');
    bar.append(button('＋ Dodaj pokój',()=>{const next=[...rooms,{id:'room_'+Date.now(),name:'Nowy pokój',entities:[]}];this._selectedRoom=next.length-1;set({rooms:next})},'primary'));
    if(rooms.length)bar.append(button('Usuń pokój',()=>{const next=rooms.filter((_,i)=>i!==this._selectedRoom);this._selectedRoom=Math.max(0,this._selectedRoom-1);set({rooms:next})}));
    wrap.append(bar);
    const diagnostics=this.editorConfigDiagnostics(c,this._hass?.states);
    if(diagnostics.length){
      const box=node('section',undefined,'editor-diagnostics');box.setAttribute('role','status');box.setAttribute('aria-live','polite');box.setAttribute('aria-label','Kontrola konfiguracji');
      const count=diagnostics.length,heading=count===1?'1 uwaga w konfiguracji':count<5?count+' uwagi w konfiguracji':count+' uwag w konfiguracji';
      box.append(node('div',heading,'editor-diagnostics-head'));
      const list=node('div',undefined,'editor-diagnostics-list');
      for(const issue of diagnostics.slice(0,10))list.append(node('p',issue.message,'editor-diagnostic'));
      box.append(list);
      if(count>10)box.append(node('small','Pozostałe '+(count-10)+' uwag nie są wyświetlane.','editor-diagnostics-more'));
      wrap.append(box)
    }
    if(rooms.length){
      const idx=Math.min(this._selectedRoom,rooms.length-1),room=rooms[idx],panel=node('div',undefined,'room');
      const roomPickerKey=String(room.id||'room')+':'+idx;
      if(this._pendingRoomEntityPickerRoom!==roomPickerKey){this._pendingRoomEntityPickerRoom=roomPickerKey;this._pendingRoomEntityIds.clear();this._pendingRoomEntityQuery='';this._pendingRoomEntityDomain='';this._pendingRoomEntityPickerOpen=false;this._selectedRoomEntityIds.clear();this._roomAppearanceNotice=''}
      const updateRoom=patch=>set({rooms:(this._config.rooms||[]).map((r,i)=>{
        if(i!==idx)return r;
        const next={...r,...patch};
        if(Object.prototype.hasOwnProperty.call(patch,'icon')&&!patch.icon)delete next.icon;
        return next
      })});
      panel.append(field('Nazwa pokoju',room.name,v=>updateRoom({name:v})));
      const iconLabel=node('label',undefined,'field');iconLabel.append(node('span','Ikona pomieszczenia'));
      iconLabel.append(choose(this.roomIconOptions(),this.roomIconValue(room),v=>updateRoom({icon:v})));panel.append(iconLabel);
      panel.append(node('div','Urządzenia w pokoju','section'));
      const roomEntities=Array.isArray(room.entities)?room.entities:[];
      for(const id of [...this._selectedRoomEntityIds])if(!roomEntities.some(raw=>(typeof raw==='string'?raw:raw?.entity)===id))this._selectedRoomEntityIds.delete(id);
      let updateAppearanceToolbar=()=>{};
      for(let i=0;i<roomEntities.length;i++){
        const raw=roomEntities[i],item=typeof raw==='string'?{entity:raw}:raw,entityId=typeof item?.entity==='string'?item.entity:'',entry=node('div',undefined,'row room-device-row');
        const entityName=item.name||this._hass?.states?.[entityId]?.attributes?.friendly_name||entityId||'urządzenie '+(i+1),label=node('div'),selectWrap=node('label',undefined,'room-device-select-wrap'),selectDevice=document.createElement('input');
        selectDevice.type='checkbox';selectDevice.className='room-device-select';selectDevice.checked=!!entityId&&this._selectedRoomEntityIds.has(entityId);selectDevice.disabled=!entityId;selectDevice.setAttribute('data-velto-room-device-select',entityId);selectDevice.setAttribute('aria-label','Zaznacz '+entityName+' do kopiowania wyglądu');selectWrap.append(selectDevice);
        selectDevice.addEventListener('change',()=>{if(selectDevice.checked)this._selectedRoomEntityIds.add(entityId);else this._selectedRoomEntityIds.delete(entityId);this._roomAppearanceNotice='';updateAppearanceToolbar()});
        label.append(node('strong',entityName),node('small',entityId));entry.append(selectWrap,label);
        const sizeSelect=choose([['small','Mały'],['medium','Średni'],['large','Duży']],item.size||'small',v=>updateRoom({entities:this.updateRoomEntity(roomEntities,i,{size:v})}));
        sizeSelect.setAttribute('aria-label','Domyślny rozmiar kafelka '+entityName);sizeSelect.setAttribute('title','Ręcznie zapisany rozmiar układu może mieć pierwszeństwo.');
        const order=node('div',undefined,'room-device-order'),moveEntity=target=>{const next=this.moveEditorItem(roomEntities,i,target);if(next!==roomEntities&&updateRoom({entities:next}))this.announceEditorChange('Urządzenie '+entityName+' przeniesiono na pozycję '+(target+1)+' z '+roomEntities.length+' w pokoju '+(room.name||room.id||'wybranym')+'.')};
        const entityUp=button('↑',()=>moveEntity(i-1)),entityDown=button('↓',()=>moveEntity(i+1)),removeEntity=button('×',()=>updateRoom({entities:roomEntities.filter((_,j)=>i!==j)}));
        entityUp.disabled=i===0;entityDown.disabled=i===roomEntities.length-1;
        entityUp.setAttribute('aria-label','Przesuń '+entityName+' wyżej');entityDown.setAttribute('aria-label','Przesuń '+entityName+' niżej');removeEntity.setAttribute('aria-label','Usuń urządzenie '+entityName);
        entityUp.title='Przesuń urządzenie wyżej';entityDown.title='Przesuń urządzenie niżej';removeEntity.title='Usuń urządzenie';
        order.append(entityUp,entityDown,removeEntity);entry.append(order);panel.append(entry);
        const updateEntity=patch=>updateRoom({entities:this.updateRoomEntity(roomEntities,i,patch)}),options=node('div',undefined,'room-device-options');
        options.append(field('Nazwa kafelka (opcjonalnie)',item.name||'',v=>updateEntity({name:v.trim()})));
        const tileIconLabel=node('label',undefined,'field');tileIconLabel.append(node('span','Ikona kafelka'));
        tileIconLabel.append(choose(this.tileIconOptions(),item.icon||'',v=>updateEntity({icon:v})));options.append(tileIconLabel);panel.append(options);
        const previewKey=typeof item.entity==='string'&&item.entity?item.entity:'invalid:'+String(room.id||'room')+':'+i;
        const previewDetails=node('details',undefined,'tile-preview-details');previewDetails.open=this._previewOpenEntities.has(previewKey);
        previewDetails.append(node('summary','Podgląd kafelka'));
        const appendPreview=()=>{
          if(previewDetails.querySelector('.tile-preview-card'))return;
          const model=this.editorTilePreviewModel(item,room),previewCard=node('div',undefined,'tile-preview-card'+(model.active?' is-active':'')+(model.missing?' is-missing':'')+(model.mediaPlaying?' is-playing':''));
          previewCard.dataset.size=model.size;previewCard.setAttribute('role','group');previewCard.setAttribute('aria-label',model.label+': '+model.stateLabel);
          const glyph=node('span',undefined,'tile-preview-glyph'),previewIcon=this.editorPreviewIcon(model);if(previewIcon)glyph.append(previewIcon);
          const copy=node('div',undefined,'tile-preview-copy');copy.append(node('strong',model.label),node('small',model.stateLabel));
          if(model.entity)copy.append(node('small',model.entity,'tile-preview-entity'));
          previewCard.append(glyph,copy,node('span',model.sizeLabel,'tile-preview-size'));previewDetails.append(previewCard)
        };
        if(previewDetails.open)appendPreview();
        previewDetails.addEventListener('toggle',()=>{
          if(previewDetails.open){this._previewOpenEntities.add(previewKey);appendPreview()}
          else this._previewOpenEntities.delete(previewKey);
          this._previewSignature=this.editorPreviewSignature(this._hass)
        });
        panel.append(previewDetails);
      }
      const roomEntityIds=[...new Set(roomEntities.map(raw=>typeof raw==='string'?raw:raw?.entity).filter(id=>typeof id==='string'&&id))];
      const selectionActions=node('div',undefined,'room-device-selection-actions');selectionActions.hidden=roomEntityIds.length<2;
      const syncSelectionCheckboxes=()=>{for(const checkbox of panel.querySelectorAll('[data-velto-room-device-select]')){const id=checkbox.getAttribute('data-velto-room-device-select');checkbox.checked=this._selectedRoomEntityIds.has(id)}};
      const selectAllCurrentRoomTiles=button('Zaznacz wszystkie',()=>{this.setRoomEntitySelection(roomEntities,true);syncSelectionCheckboxes();updateAppearanceToolbar()});
      selectAllCurrentRoomTiles.setAttribute('data-velto-select-all-room-devices','true');selectAllCurrentRoomTiles.setAttribute('aria-label','Zaznacz wszystkie urządzenia w tym pomieszczeniu');
      const clearCurrentRoomTileSelection=button('Wyczyść zaznaczenie',()=>{this.setRoomEntitySelection(roomEntities,false);syncSelectionCheckboxes();updateAppearanceToolbar()});
      clearCurrentRoomTileSelection.setAttribute('data-velto-clear-room-device-selection','true');clearCurrentRoomTileSelection.setAttribute('aria-label','Wyczyść zaznaczenie urządzeń w tym pomieszczeniu');
      selectionActions.append(selectAllCurrentRoomTiles,clearCurrentRoomTileSelection);
      const appearanceToolbar=node('section',undefined,'room-device-bulk-appearance');appearanceToolbar.hidden=true;appearanceToolbar.setAttribute('data-velto-bulk-appearance','true');appearanceToolbar.setAttribute('role','group');appearanceToolbar.setAttribute('aria-label','Kopiowanie wyglądu kafelków');
      const appearanceStatus=node('small',undefined,'room-device-bulk-status');appearanceStatus.setAttribute('role','status');appearanceStatus.setAttribute('aria-live','polite');appearanceStatus.setAttribute('aria-atomic','true');
      const appearanceFields=node('div',undefined,'room-device-bulk-fields');
      const appearanceField=(key,labelText,checked)=>{const label=node('label'),input=document.createElement('input');input.type='checkbox';input.checked=checked;input.setAttribute('data-velto-bulk-appearance-field',key);input.setAttribute('aria-label','Kopiuj '+labelText.toLocaleLowerCase());label.append(input,node('span',labelText));appearanceFields.append(label);input.addEventListener('change',()=>{this._roomAppearanceNotice='';updateAppearanceToolbar()});return input};
      const copySize=appearanceField('size','Rozmiar',true),copyIcon=appearanceField('icon','Ikona',true),copyName=appearanceField('name','Nazwa kafelka',false);
      const copyAppearance=button('Kopiuj wygląd z pierwszego zaznaczonego',()=>{
        const selectedIndexes=this.roomEntitySelectionIndexes(roomEntities);
        if(selectedIndexes.length<2)return;
        const sourceIndex=selectedIndexes[0],targetIndexes=selectedIndexes.slice(1),result=this.copyRoomEntityAppearance(roomEntities,sourceIndex,targetIndexes,{size:copySize.checked,icon:copyIcon.checked,name:copyName.checked});
        if(!result.changed){this._roomAppearanceNotice='Nie wykryto zmian do zastosowania.';updateAppearanceToolbar();return}
        const nextRooms=(this._config.rooms||[]).map((entry,roomIndex)=>roomIndex===idx?{...entry,entities:result.entities}:entry),patch={rooms:nextRooms};
        const count=result.targetCount,word=count===1?'urządzenie':count%10>=2&&count%10<=4&&Math.floor(count/10)%10!==1?'urządzenia':'urządzeń';
        this._roomAppearanceNotice='Skopiowano wygląd na '+count+' '+word+'.';set(patch)
      },'primary');
      copyAppearance.setAttribute('data-velto-copy-appearance','true');
      updateAppearanceToolbar=()=>{
        const selectedIndexes=this.roomEntitySelectionIndexes(roomEntities);
        appearanceToolbar.hidden=selectedIndexes.length<2;
        appearanceStatus.textContent=this._roomAppearanceNotice||(selectedIndexes.length?('Zaznaczono '+selectedIndexes.length+' kafelki. Pierwszy na liście będzie źródłem.'):'Zaznacz co najmniej dwa kafelki.');
        copyAppearance.disabled=selectedIndexes.length<2||(!copySize.checked&&!copyIcon.checked&&!copyName.checked);
        selectAllCurrentRoomTiles.disabled=selectedIndexes.length===roomEntityIds.length;
        clearCurrentRoomTileSelection.disabled=selectedIndexes.length===0
      };
      appearanceToolbar.append(node('strong','Kopiuj wygląd kafelków'),appearanceStatus,appearanceFields,copyAppearance);updateAppearanceToolbar();panel.append(selectionActions,appearanceToolbar);
      const states=this._hass?.states||{},existing=new Set(roomEntities.map(item=>typeof item==='string'?item:item?.entity).filter(Boolean)),options=this.editorEntityPickerOptions();
      for(const id of [...this._pendingRoomEntityIds])if(existing.has(id)||!states[id])this._pendingRoomEntityIds.delete(id);
      const bulk=node('details',undefined,'room-entity-bulk');bulk.open=this._pendingRoomEntityPickerOpen;bulk.setAttribute('data-velto-room-entity-picker','true');
      bulk.append(node('summary','＋ Dodaj urządzenia do pokoju'));
      const bulkBody=node('div',undefined,'room-entity-bulk-body'),search=document.createElement('input');search.type='search';search.className='room-entity-search';search.placeholder='Szukaj po nazwie lub ID…';search.value=this._pendingRoomEntityQuery;search.autocomplete='off';search.setAttribute('aria-label','Szukaj urządzeń do dodania do pokoju');search.setAttribute('data-velto-room-entity-search','true');
      const domainLabels=Object.assign(Object.create(null),{light:'Światła',switch:'Przełączniki',sensor:'Czujniki',binary_sensor:'Czujniki binarne',climate:'Klimatyzacja',cover:'Osłony',media_player:'Media',fan:'Wentylatory',lock:'Zamki',camera:'Kamery',vacuum:'Odkurzacze',scene:'Sceny',script:'Skrypty',automation:'Automatyzacje',person:'Osoby',device_tracker:'Lokalizatory',input_boolean:'Przełączniki pomocnicze',input_number:'Liczby pomocnicze',input_select:'Listy pomocnicze',input_text:'Tekst pomocniczy',button:'Przyciski',input_button:'Przyciski pomocnicze',number:'Liczby',select:'Listy',timer:'Timery',weather:'Pogoda',valve:'Zawory'});
      const domainOptions=[...new Set(options.map(option=>option.domain).filter(Boolean))].sort();
      if(!domainOptions.includes(this._pendingRoomEntityDomain))this._pendingRoomEntityDomain='';
      const domainFilter=document.createElement('select');domainFilter.className='room-entity-domain-filter';domainFilter.setAttribute('aria-label','Filtruj elementy według typu');domainFilter.setAttribute('data-velto-room-entity-domain','true');
      const allDomains=document.createElement('option');allDomains.value='';allDomains.textContent='Wszystkie typy';domainFilter.append(allDomains);
      for(const domain of domainOptions){const option=document.createElement('option');option.value=domain;option.textContent=domainLabels[domain]||domain;domainFilter.append(option)}
      domainFilter.value=this._pendingRoomEntityDomain;
      const status=node('small',undefined,'room-entity-count');status.id='velto-room-entity-count';status.setAttribute('role','status');status.setAttribute('aria-live','polite');status.setAttribute('aria-atomic','true');
      const list=node('div',undefined,'room-entity-results');list.id='velto-room-entity-results';list.setAttribute('role','group');list.setAttribute('aria-label','Dostępne elementy Home Assistant');search.setAttribute('aria-controls',list.id);search.setAttribute('aria-describedby',status.id);domainFilter.setAttribute('aria-controls',list.id);domainFilter.setAttribute('aria-describedby',status.id);
      const actions=node('div',undefined,'room-entity-bulk-actions'),selectVisible=button('Zaznacz widoczne',()=>{for(const checkbox of list.querySelectorAll('input[type=checkbox]')){this._pendingRoomEntityIds.add(checkbox.value);checkbox.checked=true}updateSummary()}),clearSelection=button('Wyczyść wybór',()=>{this._pendingRoomEntityIds.clear();for(const checkbox of list.querySelectorAll('input[type=checkbox]'))checkbox.checked=false;updateSummary()}),addSelected=button('＋ Dodaj zaznaczone urządzenia (0)',()=>{
        const additions=[...new Set(this._pendingRoomEntityIds)].filter(id=>states[id]&&!existing.has(id));
        if(!additions.length)return;
        this._pendingRoomEntityIds.clear();this._pendingRoomEntityQuery='';this._pendingRoomEntityDomain='';this._pendingRoomEntityPickerOpen=false;
        updateRoom({entities:[...roomEntities,...additions.map(entity=>({entity,size:'small'}))]})
      },'primary');
      selectVisible.setAttribute('data-velto-bulk-select-visible','true');clearSelection.setAttribute('data-velto-bulk-clear','true');addSelected.setAttribute('data-velto-bulk-add','true');addSelected.disabled=true;clearSelection.disabled=true;
      actions.append(selectVisible,clearSelection,addSelected);
      let currentResults={visible:[],count:0,truncated:false};
      const updateSummary=()=>{
        const selectedCount=[...this._pendingRoomEntityIds].filter(id=>states[id]&&!existing.has(id)).length,word=currentResults.count===1?'urządzenie':currentResults.count%10>=2&&currentResults.count%10<=4&&Math.floor(currentResults.count/10)%10!==1?'urządzenia':'urządzeń';
        addSelected.textContent='＋ Dodaj zaznaczone urządzenia ('+selectedCount+')';addSelected.disabled=selectedCount===0;clearSelection.disabled=selectedCount===0;
        const activeDomainLabel=domainLabels[this._pendingRoomEntityDomain]||this._pendingRoomEntityDomain;status.textContent=currentResults.count+' '+word+(currentResults.truncated?' · pokazuję maks. 60; zawęź wyszukiwanie':'')+(activeDomainLabel?' · typ: '+activeDomainLabel:'')+' · zaznaczono '+selectedCount
      };
      const renderOptions=()=>{
        this._pendingRoomEntityQuery=search.value;
        currentResults=this.editorEntityPickerWindow(options,search.value,this._pendingRoomEntityIds,existing,60,this._pendingRoomEntityDomain);
        list.replaceChildren();
        for(const option of currentResults.visible){
          const row=node('label',undefined,'room-entity-choice'),checkbox=document.createElement('input');checkbox.type='checkbox';checkbox.value=option.value;checkbox.checked=this._pendingRoomEntityIds.has(option.value);
          checkbox.addEventListener('change',()=>{if(checkbox.checked)this._pendingRoomEntityIds.add(option.value);else this._pendingRoomEntityIds.delete(option.value);updateSummary()});
          const copy=node('span',undefined,'room-entity-choice-copy');copy.append(node('strong',option.label),node('small',option.value));row.append(checkbox,copy);list.append(row)
        }
        if(!currentResults.visible.length){const empty=search.value.trim()?'Brak pasujących urządzeń.':options.length?'Wszystkie dostępne urządzenia są już przypisane.':'Brak elementów w rejestrze Home Assistant.';list.append(node('p',empty,'room-entity-empty'))}
        selectVisible.disabled=currentResults.visible.length===0;updateSummary()
      };
      search.addEventListener('input',renderOptions);domainFilter.addEventListener('change',()=>{this._pendingRoomEntityDomain=domainFilter.value;renderOptions()});bulk.addEventListener('toggle',()=>{this._pendingRoomEntityPickerOpen=bulk.open});
      renderOptions();bulkBody.append(search,domainFilter,status,list,actions);bulk.append(bulkBody);panel.append(bulk);
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
    const calendarPicker=searchChoose([['','Wybierz kalendarz…'],...selectable],selectable.length===1?selectable[0][0]:'',()=>{},'Szukaj kalendarza…');
    calendarField.append(calendarPicker);wrap.append(calendarField);
    if(!calendars.length)wrap.append(node('p','Nie znaleziono kalendarzy calendar.*. Dodaj integrację kalendarza w Home Assistant i odśwież edytor.','muted'));
    else if(!selectable.length)wrap.append(node('p','Wszystkie dostępne kalendarze są już dodane.','muted'));
    wrap.append(button('＋ Dodaj kalendarz',()=>{
      const id=calendarPicker.value;if(!id||selected.includes(id)){calendarPicker.focus();return;}
      set({calendar:{...this._config.calendar,entity:'',entities:[...selected,id]}})
    }));
    for(const id of selected){
      const entry=node('div',undefined,'row'),label=node('div');
      label.append(node('strong',this._hass?.states?.[id]?.attributes?.friendly_name||id),node('small',id));entry.append(label);
      entry.append(node('span','Aktywny','muted'));
      const calendarName=this._hass?.states?.[id]?.attributes?.friendly_name||id;
      const removeCalendar=button('×',()=>set({calendar:{...this._config.calendar,entity:'',entities:selected.filter(item=>item!==id)}}));
      removeCalendar.setAttribute('aria-label','Usuń kalendarz: '+calendarName);
      removeCalendar.setAttribute('data-velto-remove-calendar',id);
      removeCalendar.title='Usuń kalendarz';
      entry.append(removeCalendar);
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
    forecastSource.append(searchChoose([['','Automatycznie (jeśli dostępne jest jedno źródło weather.*)'],...weatherEntities.map(id=>[id,(this._hass.states[id]?.attributes?.friendly_name||id)+' · '+id])],forecastCurrent,v=>set({weather:{...this._config.weather,forecast_entity:v}}),'Szukaj źródła prognozy…'));wrap.append(forecastSource);
    const showForecast=node('label',undefined,'field');showForecast.append(node('span','Pokazuj prognozę na kolejne 7 dni'));
    const showForecastCheck=document.createElement('input');showForecastCheck.type='checkbox';showForecastCheck.style.width='auto';showForecastCheck.checked=weather.show_forecast!==false;showForecastCheck.addEventListener('change',()=>set({weather:{...this._config.weather,show_forecast:showForecastCheck.checked}}));showForecast.append(showForecastCheck);wrap.append(showForecast);
    const weatherRooms=node('label',undefined,'field');weatherRooms.append(node('span','Pokazuj pogodę także w widokach pokoi'));const weatherRoomsCheck=document.createElement('input');weatherRoomsCheck.type='checkbox';weatherRoomsCheck.style.width='auto';weatherRoomsCheck.checked=!!weather.show_in_rooms;weatherRoomsCheck.addEventListener('change',()=>set({weather:{...this._config.weather,show_in_rooms:weatherRoomsCheck.checked}}));weatherRooms.append(weatherRoomsCheck);wrap.append(weatherRooms);
    const sensors=Object.keys(this._hass?.states||{}).filter(id=>id.startsWith('sensor.')).sort();
    for(const [key,label] of [['temperature','Temperatura'],['humidity','Wilgotność'],['pressure','Ciśnienie'],['pm25','PM2.5'],['pm10','PM10'],['air_index','Jakość powietrza']]){
      const currentId=current[key]||'',options=[['','Brak'],...sensors.map(id=>[id,(this._hass.states[id].attributes.friendly_name||id)+' · '+id])];
      if(currentId&&!sensors.includes(currentId))options.push([currentId,currentId]);
      const l=node('label',undefined,'field');l.append(node('span',label));
      l.append(searchChoose(options,currentId,v=>{
        const old=this._config.weather||{};set({weather:{...old,entities:{...(old.entities||{}),[key]:v}}})
      },'Szukaj czujnika: '+label+'…'));wrap.append(l)
    }
    wrap.append(node('p','Pola pogodowe można teraz konfigurować wizualnie. Zmiany zapisują się w YAML karty.','muted'));
    wrap.append(node('div','Odbiór odpadów','section'));
    const waste=c.waste_collection||{},wasteEnabled=node('label',undefined,'field');
    wasteEnabled.append(node('span','Włącz kafelek odbioru odpadów'));
    const wasteCheck=document.createElement('input');wasteCheck.type='checkbox';wasteCheck.style.width='auto';wasteCheck.checked=waste.enabled!==false;
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
    this.indexEditorFocusTargets(root);this.restoreEditorFocus(root,focus)
  }
}
if(!customElements.get('velto-dashboard-editor'))customElements.define('velto-dashboard-editor',VeltoDashboardEditor);
