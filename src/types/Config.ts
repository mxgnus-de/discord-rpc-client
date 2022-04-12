import { Presence } from './Presence';

export interface PresenceConfig extends Presence {
   name?: string;
   id: number;
}

export interface Config {
   presences: PresenceConfig[];
   clientId: string;
}
