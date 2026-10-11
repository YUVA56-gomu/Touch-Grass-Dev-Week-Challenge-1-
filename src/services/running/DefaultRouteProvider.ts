import { IRouteProvider, RouteCandidate } from './types';
import { OsrmRouteProvider, defaultOsrmRouteProvider } from './OsrmRouteProvider';

export class DefaultRouteProvider implements IRouteProvider {
  private osrmProvider: OsrmRouteProvider;

  constructor(osrmProvider?: OsrmRouteProvider) {
    this.osrmProvider = osrmProvider || defaultOsrmRouteProvider;
  }

  public async getRouteCandidates(
    lat?: number,
    lng?: number,
    targetDistanceKm = 3.0
  ): Promise<RouteCandidate[]> {
    return this.osrmProvider.getRouteCandidates(lat, lng, targetDistanceKm);
  }
}

export const defaultRouteProvider = new DefaultRouteProvider();
export { OsrmRouteProvider, defaultOsrmRouteProvider };
