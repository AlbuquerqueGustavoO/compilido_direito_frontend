import { datadogRum } from '@datadog/browser-rum';

export function initializeDatadog(): void {

  datadogRum.init({
    applicationId: '2e3d63f8-81ca-4521-a4c5-b515bbf56dd7',
    clientToken: 'pub519f566289dd72615023f4df3eba9b82',
    site: 'datadoghq.com',

    service: 'portal-frontend',
    env: 'dev',
    version: '1.0.0',

    sessionSampleRate: 100,
    sessionReplaySampleRate: 20,

    trackResources: true,
    trackUserInteractions: true,
    trackLongTasks: true
  });

  datadogRum.startSessionReplayRecording();

  datadogRum.addAction('teste_datadog');
}