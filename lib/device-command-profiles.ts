export type SafeSmsCommand = {
  id: string;
  label: string;
  template: string;
  requires: Array<'APN' | 'SERVER' | 'PORT'>;
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
