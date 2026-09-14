export type SafeSmsCommand = {
  id: string;
  label: string;
  template: string;
  requires: Array<'APN' | 'SERVER' | 'PORT' | 'PASSWORD'>;
};

export type SafeSmsProfile = {
  id: string;
  label: string;
  protocol: string;
  modelPrefixes: string[];
  commands: SafeSmsCommand[];
  sourceLabel: string;
  sourceUrl: string;
  note: string;
};

export const SAFE_SMS_PROFILES: SafeSmsProfile[] = [
  {
    id: 'pictor-pt06-ev02',
    label: 'Pictor / EV02 PT06',
    protocol: 'EV02 / GT06 V02 binary TCP',
    modelPrefixes: ['PT06', 'EV02', 'PICTOR'],
    sourceLabel: 'Pictor Telematics PT06 SMS command manual',
    sourceUrl: 'https://pictortelematics.com/downloads/pt06-all-sms-command',
    note: 'If this PT06 is already online, do not change APN or server. Use STATUS#, GPRSSET# or PARAM# for diagnostics; provisioning is only for a planned migration.',
    commands: [
      { id: 'status', label: 'Safely check live status', template: 'STATUS#', requires: [] },
      { id: 'gprs-check', label: 'Safely check GPRS settings', template: 'GPRSSET#', requires: [] },
      { id: 'parameters', label: 'Safely check device parameters', template: 'PARAM#', requires: [] },
      { id: 'location', label: 'Safely request current location', template: 'WHERE#', requires: [] },
      { id: 'apn', label: '1. Set APN (migration only)', template: 'APN,{APN}#', requires: ['APN'] },
      { id: 'server-ip', label: '2. Set server by IP / TCP (migration only)', template: 'SERVER,0,{SERVER},{PORT},0#', requires: ['SERVER', 'PORT'] },
      { id: 'server-dns', label: '2. Set server by hostname / TCP (migration only)', template: 'SERVER,1,{SERVER},{PORT},0#', requires: ['SERVER', 'PORT'] },
      { id: 'interval', label: 'Set 10s moving / 30s parked', template: 'TIMER,10,30#', requires: [] },
    ],
  },
  {
    id: 'jimi-concox-gt06-current',
    label: 'Jimi / Concox GT06 current firmware',
    protocol: 'GT06 binary TCP',
    modelPrefixes: ['GT06', 'GT06N', 'CONCOX', 'JIMI'],
    sourceLabel: 'Jimi IoT GT06N manual',
    sourceUrl: 'https://www.jimiiot.us/news/the-latest-gt06n-manual-you-should-have.html',
    note: 'Send APN, then one server command, then enable GPRS. Confirm each OK reply before continuing.',
    commands: [
      { id: 'apn', label: '1. Set APN', template: 'APN,{APN}#', requires: ['APN'] },
      { id: 'server-ip', label: '2. Set server by IP (TCP)', template: 'SERVER,0,{SERVER},{PORT},0#', requires: ['SERVER', 'PORT'] },
      { id: 'server-dns', label: '2. Set server by hostname (TCP)', template: 'SERVER,1,{SERVER},{PORT},0#', requires: ['SERVER', 'PORT'] },
      { id: 'gprs-on', label: '3. Enable GPRS', template: 'GPRSON,1#', requires: [] },
      { id: 'verify', label: '4. Verify GPRS settings', template: 'GPRSSET#', requires: [] },
      { id: 'parameters', label: 'Check device parameters', template: 'PARAM#', requires: [] },
      { id: 'interval', label: 'Set 10s moving / 30s parked', template: 'TIMER,10,30#', requires: [] },
    ],
  },
  {
    id: 'concox-gt06-legacy-numeric',
    label: 'Concox / GT06 legacy numeric firmware',
    protocol: 'GT06 binary TCP (legacy SMS family)',
    modelPrefixes: ['GT06', 'GT06N', 'CONCOX'],
    sourceLabel: 'GT06N User Manual v2.1',
    sourceUrl: 'https://www.manualslib.com/manual/2611445/Concox-Gt06n.html',
    note: 'This is a different firmware family. Use it only when the device manual or an 886# reply confirms numeric commands.',
    commands: [
      { id: 'apn', label: '1. Set APN', template: '802#{APN}#', requires: ['APN'] },
      { id: 'server-ip', label: '2. Set server IP and port', template: '803#{SERVER}#{PORT}#', requires: ['SERVER', 'PORT'] },
      { id: 'interval', label: '3. Set moving interval to 20s', template: '730#20#', requires: [] },
      { id: 'verify', label: 'Check parameters', template: '886#', requires: [] },
    ],
  },
  {
    id: 'teltonika-fm',
    label: 'Teltonika FMB / FMC / FMM / FMT / FMU',
    protocol: 'Teltonika Codec 8 / 8E / 16',
    modelPrefixes: ['TELTONIKA', 'FMB', 'FMC', 'FMM', 'FMT', 'FMU'],
    sourceLabel: 'Teltonika FMB920 First Start',
    sourceUrl: 'https://wiki.teltonika-gps.com/view/FMB920_First_Start',
    note: 'The two leading spaces are intentional for devices whose SMS login and password are blank.',
    commands: [
      {
        id: 'configure',
        label: 'Set APN, server and TCP',
        template: '  setparam 2001:{APN};2002:;2003:;2004:{SERVER};2005:{PORT};2006:0',
        requires: ['APN', 'SERVER', 'PORT'],
      },
      {
        id: 'verify',
        label: 'Check APN, server and protocol',
        template: '  getparam 2001;2004;2005;2006',
        requires: [],
      },
    ],
  },
  {
    id: 'wanway-s20-4g',
    label: 'WanWay S20 4G',
    protocol: 'WanWay / Huabao-family binary TCP (firmware dependent)',
    modelPrefixes: ['S20'],
    sourceLabel: 'WanWay S20 4G SMS command list',
    sourceUrl: 'https://mundogps.org/wp-content/uploads/2022/12/S20%EF%BC%884G%EF%BC%89-SMS-COMMANDS%EF%BC%88%E5%8F%91%E5%AE%A2%E6%88%B7%EF%BC%89-2022.7.15-1.pdf',
    note: 'The SMS family is verified. Confirm receiver support for the exact S20 firmware before changing its server. Reset and factory commands are intentionally excluded.',
    commands: [
      { id: 'status', label: 'Safely check live status', template: 'STATUS#', requires: [] },
      { id: 'parameters', label: 'Safely check parameters', template: 'PARAM#', requires: [] },
      { id: 'gprs-check', label: 'Safely check GPRS settings', template: 'GPRSSET#', requires: [] },
      { id: 'location', label: 'Safely request current location', template: 'WHERE#', requires: [] },
      { id: 'apn', label: '1. Set APN (migration only)', template: 'APN,{APN}#', requires: ['APN'] },
      { id: 'server-ip', label: '2. Set server by IP / TCP (migration only)', template: 'SERVER,0,{SERVER},{PORT},0#', requires: ['SERVER', 'PORT'] },
      { id: 'server-dns', label: '2. Set server by hostname / TCP (migration only)', template: 'SERVER,1,{SERVER},{PORT},0#', requires: ['SERVER', 'PORT'] },
    ],
  },
  {
    id: 'wanway-gs900',
    label: 'WanWay GS900 4G',
    protocol: 'WanWay binary TCP',
    modelPrefixes: ['GS900'],
    sourceLabel: 'GS900 SMS command guide',
    sourceUrl: 'https://manuals.plus/m/86f29c63de8593899d385a87ac7c736671359e9197527d86001782709972567a',
    note: 'Use diagnostics first. Configure APN/server only for a planned migration and only after the NAVII receiver supports the WanWay protocol. Destructive commands are excluded.',
    commands: [
      { id: 'status', label: 'Safely check live status', template: 'STATUS#', requires: [] },
      { id: 'parameters', label: 'Safely check parameters', template: 'PARAM#', requires: [] },
      { id: 'gprs-check', label: 'Safely check GPRS settings', template: 'GPRSSET#', requires: [] },
      { id: 'location', label: 'Safely request current location', template: 'WHERE#', requires: [] },
      { id: 'apn', label: '1. Set APN (migration only)', template: 'APN,{APN}#', requires: ['APN'] },
      { id: 'server-ip', label: '2. Set server by IP / TCP (migration only)', template: 'SERVER,0,{SERVER},{PORT},0#', requires: ['SERVER', 'PORT'] },
      { id: 'server-dns', label: '2. Set server by hostname / TCP (migration only)', template: 'SERVER,1,{SERVER},{PORT},0#', requires: ['SERVER', 'PORT'] },
    ],
  },
  {
    id: 'meitrack-a21',
    label: 'Meitrack A21 command family',
    protocol: 'Meitrack proprietary GPRS',
    modelPrefixes: ['MEITRACK', 'T333', 'T355', 'T366', 'T622', 'MVT', 'MT90', 'P99'],
    sourceLabel: 'Meitrack General FAQ',
    sourceUrl: 'https://www.meitrack.com/general-faq/',
    note: 'Confirm that the model manual uses A21. The factory password is often 0000, but enter the device’s current password.',
    commands: [
      {
        id: 'configure',
        label: 'Set TCP server, APN and tracking',
        template: '{PASSWORD},A21,1,{SERVER},{PORT},{APN},,',
        requires: ['PASSWORD', 'APN', 'SERVER', 'PORT'],
      },
    ],
  },
];

export function supportsSmsProfile(profile: SafeSmsProfile, model: string) {
  const normalized = model.trim().toUpperCase();
  return !normalized || profile.modelPrefixes.some(prefix => normalized.includes(prefix));
}

export function findSmsProfile(profileId: string) {
  return SAFE_SMS_PROFILES.find(profile => profile.id === profileId);
}

export function findSmsCommand(profileId: string, commandId: string) {
  return findSmsProfile(profileId)?.commands.find(command => command.id === commandId);
}


export type DeviceCatalogCategory = 'Vehicle tracker' | 'Asset tracker' | 'Dashcam' | 'E-lock' | 'Fuel sensor' | 'OBD tracker' | 'Pet tracker';
export type DeviceCatalogStatus = 'VERIFIED_COMMANDS' | 'PROTOCOL_IDENTIFIED' | 'MANUAL_REQUIRED' | 'ACCESSORY_ONLY';
export type DeviceCatalogEntry = {
  model: string;
  aliases?: string[];
  category: DeviceCatalogCategory;
  manufacturer: string;
  network: string;
  protocol: string;
  status: DeviceCatalogStatus;
  profileId?: string;
  sourceUrl?: string;
  note?: string;
};

export const DEVICE_MODEL_CATALOG: DeviceCatalogEntry[] = [
  { model: 'PT06', aliases: ['Pictor PT06'], category: 'Vehicle tracker', manufacturer: 'Pictor / EV02 family', network: '2G', protocol: 'EV02 / GT06 V02 binary TCP', status: 'VERIFIED_COMMANDS', profileId: 'pictor-pt06-ev02', sourceUrl: 'https://pictortelematics.com/downloads/pt06-all-sms-command' },
  { model: 'EV02', category: 'Vehicle tracker', manufacturer: 'WanWay / Pictor OEM family', network: '2G/4G variant dependent', protocol: 'GT06-family binary TCP', status: 'VERIFIED_COMMANDS', profileId: 'pictor-pt06-ev02', sourceUrl: 'https://www.wanwaytech.net/' },
  { model: 'V5', aliases: ['Concox V5'], category: 'Vehicle tracker', manufacturer: 'Markon / Concox family', network: '2G', protocol: 'GT06 binary TCP', status: 'VERIFIED_COMMANDS', profileId: 'jimi-concox-gt06-current', sourceUrl: 'https://iconcox.in/' },
  { model: 'FMB920', category: 'Vehicle tracker', manufacturer: 'Teltonika', network: '2G', protocol: 'Teltonika Codec 8 / 8E / 16', status: 'VERIFIED_COMMANDS', profileId: 'teltonika-fm', sourceUrl: 'https://wiki.teltonika-gps.com/view/FMB920' },
  { model: 'FMB125', category: 'Vehicle tracker', manufacturer: 'Teltonika', network: '2G', protocol: 'Teltonika Codec 8 / 8E / 16', status: 'VERIFIED_COMMANDS', profileId: 'teltonika-fm', sourceUrl: 'https://wiki.teltonika-gps.com/view/FMB125' },
  { model: 'GS900', category: 'Vehicle tracker', manufacturer: 'WanWay', network: '4G', protocol: 'WanWay binary TCP', status: 'VERIFIED_COMMANDS', profileId: 'wanway-gs900', sourceUrl: 'https://www.wanwaytech.net/' },
  { model: 'S20', aliases: ['WanWay S20'], category: 'Asset tracker', manufacturer: 'WanWay', network: '2G/4G variant dependent', protocol: 'WanWay / Huabao-family, firmware dependent', status: 'VERIFIED_COMMANDS', profileId: 'wanway-s20-4g', sourceUrl: 'https://www.wanwaytech.net/' },
  { model: 'VL149', aliases: ['GS149'], category: 'Vehicle tracker', manufacturer: 'Markon Electronics', network: '4G', protocol: 'Supplier protocol document required', status: 'PROTOCOL_IDENTIFIED', sourceUrl: 'https://iconcox.in/', note: 'The supplied poster says GS149; the manufacturer lists VL149. Confirm the label on the physical unit.' },
  { model: 'GS10G', aliases: ['GS10'], category: 'Vehicle tracker', manufacturer: 'WanWay', network: '4G', protocol: 'WanWay binary TCP; exact firmware manual required', status: 'PROTOCOL_IDENTIFIED', sourceUrl: 'https://www.wanwaytech.net/', note: 'The supplied poster says GS10; WanWay lists GS10G. Confirm the physical label.' },
  { model: 'GS300', aliases: ['GS30'], category: 'Asset tracker', manufacturer: 'WanWay family', network: '4G', protocol: 'WanWay binary TCP; exact firmware manual required', status: 'PROTOCOL_IDENTIFIED', sourceUrl: 'https://www.wanwaytech.net/', note: 'The supplied poster says GS30; WanWay lists GS300. Confirm the physical label.' },
  { model: 'H20P', category: 'Dashcam', manufacturer: 'WanWay', network: '4G', protocol: 'Vendor video telematics protocol', status: 'PROTOCOL_IDENTIFIED', sourceUrl: 'https://www.wanwaytech.net/', note: 'Video upload is not a normal GT06 location stream and needs a dedicated receiver.' },

  ...['G17', 'BT50', 'M1', 'M1-SM', 'M1-AD', 'GS33', 'G175', 'XY71'].map(model => ({ model, category: 'Vehicle tracker' as const, manufacturer: 'Supplier confirmation required', network: 'Poster variant', protocol: 'Exact hardware/firmware manual required', status: 'MANUAL_REQUIRED' as const })),
  ...['S15', 'A50L', 'GS08', 'GS06'].map(model => ({ model, category: 'Asset tracker' as const, manufacturer: 'Supplier confirmation required', network: 'Poster variant', protocol: 'Exact hardware/firmware manual required', status: 'MANUAL_REQUIRED' as const })),
  ...['360 Dashcam', 'Black Box', 'GS55', 'GS 1+3', 'GS 1+2', 'GS 2+2', 'EC800', 'Non-AI'].map(model => ({ model, category: 'Dashcam' as const, manufacturer: 'Supplier confirmation required', network: 'Poster variant', protocol: 'Vendor video telematics protocol required', status: 'MANUAL_REQUIRED' as const })),
  ...['GL600', 'GL500', 'HHD'].map(model => ({ model, category: 'E-lock' as const, manufacturer: 'Supplier confirmation required', network: 'Poster variant', protocol: 'Exact lock protocol and authorization manual required', status: 'MANUAL_REQUIRED' as const, note: 'Lock/unlock commands are intentionally unavailable until the supplier and authorization flow are verified.' })),
  ...['GS25', 'GS50', 'GS500', 'GS100'].map(model => ({ model, category: 'OBD tracker' as const, manufacturer: 'Supplier confirmation required', network: 'Poster variant', protocol: 'Exact hardware/firmware manual required', status: 'MANUAL_REQUIRED' as const })),
  { model: 'G08', category: 'Pet tracker', manufacturer: 'Supplier confirmation required', network: '2G poster variant', protocol: 'Exact hardware/firmware manual required', status: 'MANUAL_REQUIRED' },
  ...['MERCETECH', 'ESCORT', 'MIELTA', 'CLS2', 'FANTOM 2G'].map(model => ({ model, category: 'Fuel sensor' as const, manufacturer: model, network: model === 'FANTOM 2G' ? '2G' : 'Sensor bus / BLE variant', protocol: 'Tracker accessory interface (RS232/RS485/BLE/analog), exact model required', status: 'ACCESSORY_ONLY' as const, note: 'This is a fuel sensor/accessory, not a standalone GPS SMS profile.' })),
];

export const DEVICE_CATALOG_CATEGORIES: DeviceCatalogCategory[] = ['Vehicle tracker', 'Asset tracker', 'Dashcam', 'E-lock', 'Fuel sensor', 'OBD tracker', 'Pet tracker'];

export function catalogModelNames() {
  return DEVICE_MODEL_CATALOG.flatMap(entry => [entry.model, ...(entry.aliases || [])]);
}

export function findCatalogEntry(model: string) {
  const normalized = model.trim().toUpperCase();
  return DEVICE_MODEL_CATALOG.find(entry => [entry.model, ...(entry.aliases || [])].some(value => value.toUpperCase() === normalized));
}
