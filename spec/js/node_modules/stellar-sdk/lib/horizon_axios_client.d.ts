export interface ServerTime {
    serverTime: number;
    localTimeRecorded: number;
}
export declare const SERVER_TIME_MAP: Record<string, ServerTime>;
declare const HorizonAxiosClient: import("axios").AxiosInstance;
export default HorizonAxiosClient;
export declare function getCurrentServerTime(hostname: string): number | null;
