export interface Presence {
   details?: string;
   state?: string;
   largeImageKey?: string;
   largeImageText?: string;
   smallImageKey?: string;
   smallImageText?: string;
   buttons?: Button[];
}

export interface Button {
   label: string;
   url: string;
}
